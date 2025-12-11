// backend/migrate_to_mysql.js
// MySQL 数据库迁移脚本：从 Excel 导入数据到 MySQL

const mysql = require("mysql2/promise");
const XLSX = require("xlsx");
const path = require("path");

// MySQL 连接配置（请根据实际情况修改）
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "TAc5EEGhJx",
  database: process.env.DB_NAME || "agriculture_digital_twin",
  charset: "utf8mb4",
};

// Excel 文件路径
const WEATHER_EXCEL_PATH = path.join(
  __dirname,
  "../data/气象--中科院长春光机所.xlsx"
);
const SPECTRUM_EXCEL_PATH = path.join(
  __dirname,
  "../data/光谱数据--中科院长春光机所.xlsx"
);

// 工具函数
function toDateTime(value) {
  if (!value) return null;
  
  // 如果已经是 Date 对象
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  
  // Excel 日期可能是数字（从1900-01-01开始的天数）
  if (typeof value === 'number') {
    // Excel 日期从 1900-01-01 开始，但 Excel 错误地认为 1900 是闰年
    // 所以需要减去 1 天（如果日期 >= 60）
    const excelEpoch = new Date(1899, 11, 30); // 1899-12-30
    const days = value >= 60 ? value - 1 : value;
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  
  // 字符串日期解析
  const s = String(value).trim();
  if (!s) return null;
  
  // 尝试多种日期格式
  // 格式1: "2025-05-24 12:14:22"
  // 格式2: "2025/05/24 12:14:22"
  // 格式3: "2025-5-24 12:14:22"
  let d = new Date(s.replace(/\./g, "-").replace(/\//g, "-"));
  
  // 如果解析失败，尝试其他格式
  if (Number.isNaN(d.getTime())) {
    // 尝试 "YYYY-MM-DD HH:mm:ss" 格式
    const match = s.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      d = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour || 0),
        parseInt(minute || 0),
        parseInt(second || 0)
      );
    }
  }
  
  return Number.isNaN(d.getTime()) ? null : d;
}
  

function toNumber(value, fallback = null) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  // 处理 NaN、Infinity、-Infinity
  if (Number.isNaN(n) || !Number.isFinite(n)) {
    return fallback;
  }
  return n;
}

// 读取 Excel
function loadSheetRows(filePath, sheetIndex = 0) {
  const wb = XLSX.readFile(filePath);
  const sheetName = wb.SheetNames[sheetIndex];
  const sheet = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null });
}

// 创建数据库和表
async function initDatabase(connection) {
  // 创建数据库（如果不存在）
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
  await connection.query(`USE \`${DB_CONFIG.database}\``);

  // 创建气象数据表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS weather_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data_time DATETIME NOT NULL,
      temperature DECIMAL(5,2) COMMENT '温度℃',
      humidity DECIMAL(5,2) COMMENT '湿度%',
      atmospheric_pressure DECIMAL(7,2) COMMENT '大气压(Kpa)',
      wind_speed DECIMAL(5,2) COMMENT '风速(m/s)',
      wind_direction VARCHAR(20) COMMENT '风向',
      co2 DECIMAL(6,2) COMMENT 'CO2(ppm)',
      total_radiation DECIMAL(8,2) COMMENT '总辐射(W/m2)',
      precipitation_yesterday DECIMAL(5,2) COMMENT '昨日降水mm',
      precipitation_today DECIMAL(5,2) COMMENT '今日降水mm',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_data_time (data_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='气象监测数据表'
  `);

  // 创建光谱/植被指数数据表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS vegetation_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      data_time DATETIME NOT NULL,
      rvi DECIMAL(10,6) COMMENT 'RVI氮素植被指数',
      ndvi DECIMAL(10,6) COMMENT 'NDVI叶绿素植被指数',
      msr DECIMAL(10,6) COMMENT 'MSR生物量植被指数',
      vog1 DECIMAL(10,6) COMMENT 'VOG1植株水分植被指数',
      osavi DECIMAL(10,6) COMMENT 'OSAVI叶面积植被指数',
      spectrum_data TEXT COMMENT '光谱数据（JSON格式）',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_data_time (data_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='植被指数数据表'
  `);

  console.log("✓ 数据库和表创建完成");
}

// 导入气象数据
async function importWeatherData(connection) {
  console.log("开始导入气象数据...");
  try {
    const rows = loadSheetRows(WEATHER_EXCEL_PATH);
    console.log(`读取到 ${rows.length} 条气象数据`);

    // 清空旧数据（可选）
    await connection.query("TRUNCATE TABLE weather_data");

    let imported = 0;
    let skipped = 0;
    
    // 批量插入，提高性能
    const batchSize = 100;
    let batch = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dataTime = toDateTime(
        row["数据时间"] || row["时间"] || row["采集时间"] || row["日期时间"]
      );
      
      if (!dataTime) {
        skipped++;
        continue;
      }
      
      const temperature = toNumber(row["温度℃"] || row["温度(℃)"] || row["温度"]);
      const humidity = toNumber(row["湿度%"] || row["湿度(%)"] || row["湿度"]);
      const atmosphericPressure = toNumber(
        row["大气压(Kpa)"] || row["大气压"] || row["气压"]
      );
      const windSpeed = toNumber(
        row["风速(m/s)"] || row["风速"] || row["风速m/s"]
      );
      const windDirection = row["风向"] || null;
      const co2 = toNumber(row["CO2(ppm)"] || row["CO2"] || row["二氧化碳"]);
      const totalRadiation = toNumber(
        row["总辐射(W/m2)"] ||
          row["总辐射"] ||
          row["光照"] ||
          row["辐射"] ||
          row["总辐射W/m2"]
      );
      const precipitationYesterday = toNumber(
        row["昨日降水mm"] || row["昨日降水"] || row["昨日降雨"]
      );
      const precipitationToday = toNumber(
        row["今日降水mm"] || row["今日降水"] || row["今日降雨"]
      );

      // 确保所有数值都是有效的（不是 Infinity 或 NaN）
      // toNumber 已经处理了这些情况，但为了安全起见，再次验证
      batch.push([
        dataTime,
        toNumber(temperature),
        toNumber(humidity),
        toNumber(atmosphericPressure),
        toNumber(windSpeed),
        windDirection,
        toNumber(co2),
        toNumber(totalRadiation),
        toNumber(precipitationYesterday),
        toNumber(precipitationToday),
      ]);

      // 批量插入
      if (batch.length >= batchSize || i === rows.length - 1) {
        await connection.query(
          `INSERT INTO weather_data (
            data_time, temperature, humidity, atmospheric_pressure,
            wind_speed, wind_direction, co2, total_radiation,
            precipitation_yesterday, precipitation_today
          ) VALUES ?`,
          [batch]
        );
        imported += batch.length;
        batch = [];
      }
    }
    
    console.log(`✓ 成功导入 ${imported} 条气象数据`);
    if (skipped > 0) {
      console.log(`⚠ 跳过 ${skipped} 条无效数据（缺少时间字段）`);
    }
  } catch (error) {
    console.error("导入气象数据失败:", error);
    throw error;
  }
}

// 导入光谱/植被指数数据
async function importVegetationData(connection) {
  console.log("开始导入光谱/植被指数数据...");
  try {
    const rows = loadSheetRows(SPECTRUM_EXCEL_PATH);
    console.log(`读取到 ${rows.length} 条光谱数据`);

    // 清空旧数据（可选）
    await connection.query("TRUNCATE TABLE vegetation_data");

    let imported = 0;
    let skipped = 0;
    
    // 批量插入
    const batchSize = 100;
    let batch = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dataTime = toDateTime(
        row["数据时间"] || row["时间"] || row["采集时间"] || row["日期时间"]
      );
      
      if (!dataTime) {
        skipped++;
        continue;
      }
      
      const rvi = toNumber(
        row["RVI氮素植被指数"] || row["RVI"] || row["RVI指数"]
      );
      const ndvi = toNumber(
        row["NDVI叶绿素植被指数"] || row["NDVI"] || row["NDVI指数"]
      );
      const msr = toNumber(
        row["MSR生物量植被指数"] || row["MSR"] || row["MSR指数"]
      );
      const vog1 = toNumber(
        row["VOG1植株水分植被指数"] || row["VOG1"] || row["VOG1指数"]
      );
      const osavi = toNumber(
        row["OSAVI叶面积植被指数"] || row["OSAVI"] || row["OSAVI指数"]
      );

      // 处理光谱数据（如果是字符串，转为JSON）
      let spectrumData = null;
      const spectrumRaw =
        row["光谱数据"] ||
        row["光谱"] ||
        row["spectrum"] ||
        row["spectrum_data"];
      if (spectrumRaw) {
        if (typeof spectrumRaw === "string") {
          const spectrumArray = spectrumRaw
            .split(/[,，\s]+/)
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n) && Number.isFinite(n)); // 过滤掉 NaN 和 Infinity
          if (spectrumArray.length > 0) {
            spectrumData = JSON.stringify(spectrumArray);
          }
        } else if (Array.isArray(spectrumRaw)) {
          // 过滤数组中的无效值
          const validArray = spectrumRaw
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n) && Number.isFinite(n));
          if (validArray.length > 0) {
            spectrumData = JSON.stringify(validArray);
          }
        }
      }

      // 确保所有数值都是有效的（不是 Infinity 或 NaN）
      const safeRvi = toNumber(rvi, null);
      const safeNdvi = toNumber(ndvi, null);
      const safeMsr = toNumber(msr, null);
      const safeVog1 = toNumber(vog1, null);
      const safeOsavi = toNumber(osavi, null);

      batch.push([dataTime, safeRvi, safeNdvi, safeMsr, safeVog1, safeOsavi, spectrumData]);

      // 批量插入
      if (batch.length >= batchSize || i === rows.length - 1) {
        await connection.query(
          `INSERT INTO vegetation_data (
            data_time, rvi, ndvi, msr, vog1, osavi, spectrum_data
          ) VALUES ?`,
          [batch]
        );
        imported += batch.length;
        batch = [];
      }
    }
    
    console.log(`✓ 成功导入 ${imported} 条植被指数数据`);
    if (skipped > 0) {
      console.log(`⚠ 跳过 ${skipped} 条无效数据（缺少时间字段）`);
    }
  } catch (error) {
    console.error("导入植被指数数据失败:", error);
    throw error;
  }
}

// 主函数
async function main() {
  let connection;
  try {
    console.log("正在连接 MySQL...");
    console.log(`数据库配置: ${DB_CONFIG.host}:${DB_CONFIG.port}, 用户: ${DB_CONFIG.user}`);
    
    // 连接 MySQL（不指定数据库，先创建数据库）
    const tempConfig = { ...DB_CONFIG };
    delete tempConfig.database;
    connection = await mysql.createConnection(tempConfig);

    console.log("✓ MySQL 连接成功\n");
    console.log("正在初始化数据库...");
    await initDatabase(connection);

    console.log("\n开始导入数据...");
    await importWeatherData(connection);
    await importVegetationData(connection);

    console.log("\n✓ 数据迁移完成！");
  } catch (error) {
    console.error("\n❌ 迁移失败:");
    if (error.code === 'ECONNREFUSED') {
      console.error("  无法连接到 MySQL 服务器，请检查：");
      console.error("  1. MySQL 服务是否已启动");
      console.error("  2. 数据库配置是否正确（host, port, user, password）");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("  数据库访问被拒绝，请检查用户名和密码");
    } else if (error.code === 'ENOENT') {
      console.error("  Excel 文件未找到，请检查文件路径");
      console.error(`  气象文件: ${WEATHER_EXCEL_PATH}`);
      console.error(`  光谱文件: ${SPECTRUM_EXCEL_PATH}`);
    } else {
      console.error("  错误详情:", error.message);
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n数据库连接已关闭");
    }
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { initDatabase, importWeatherData, importVegetationData };

