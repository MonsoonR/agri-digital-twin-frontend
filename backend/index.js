// backend/index.js
// 读取 F:\数字孪生-智慧农业项目\东区地块 下的最新 Excel 数据，直接提供接口，无需数据库

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 数据目录，优先环境变量，可自动回退到默认路径
const DEFAULT_DATA_DIR = "F:\\数字孪生-智慧农业项目\\东区地块";
const DATA_DIR =
  process.env.DATA_DIR ||
  DEFAULT_DATA_DIR ||
  path.join(__dirname, "..", "data", "东区地块");

// 文件名前缀 -> 指标配置
const METRIC_META = {
  "11": { key: "growthIndex", name: "作物长势指数", weight: 0.25 },
  "16": { key: "maturity", name: "成熟期预测", weight: 0.2 },
  "43": { key: "chlorophyll", name: "叶绿素", weight: 0.12 },
  "434": { key: "lai", name: "叶面积指数", weight: 0.1 },
  "435": { key: "plantHeight", name: "株高", weight: 0.12 },
  "131": { key: "nitrogen", name: "氮素含量", weight: 0.06 },
  "132": { key: "phosphorus", name: "磷素含量", weight: 0.05 },
  "133": { key: "potassium", name: "钾素含量", weight: 0.05 },
  "134": { key: "soilPH", name: "土壤pH", weight: 0.03 },
  "135": { key: "organicMatter", name: "有机质", weight: 0.04 },
  "136": { key: "salinity", name: "可溶性总盐分", weight: 0.03 },
};

// ===== 工具函数 =====
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function normalizeMetric(key, value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  switch (key) {
    case "growthIndex":
      return clamp(value / 1.2, 0, 1);
    case "maturity":
      return clamp(value / 120, 0, 1);
    case "chlorophyll":
      return clamp(value / 35, 0, 1);
    case "lai":
      return clamp(value / 4, 0, 1);
    case "plantHeight":
      return clamp(value / 130, 0, 1);
    case "nitrogen":
      return clamp(value / 120, 0, 1);
    case "phosphorus":
      return clamp(value / 120, 0, 1);
    case "potassium":
      return clamp(value / 450, 0, 1);
    case "organicMatter":
      return clamp(value / 50, 0, 1);
    case "salinity":
      return clamp(1 - Math.max(0, value - 3) / 8, 0, 1);
    case "soilPH": {
      const diff = Math.abs(value - 6.5);
      return clamp(1 - diff / 2, 0, 1);
    }
    default:
      return 0;
  }
}

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function extractFieldValue(raw) {
  if (raw === null || raw === undefined) return null;
  const text = String(raw).replace(/[{}]/g, "").trim();
  const match = text.match(/([A-Za-z0-9-]+)\s*[:：]\s*"?([-+]?\d*\.?\d+)/);
  if (!match) return null;
  return { fieldId: match[1], value: Number(match[2]) };
}

function formatLabel(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

function inferGrowthStage({ maturity, growthIndex }) {
  const g = growthIndex ?? 0;
  const m = maturity ?? g * 100;
  if (m >= 95 || g >= 1.0) return "成熟期";
  if (m >= 80 || g >= 0.85) return "灌浆期";
  if (m >= 65 || g >= 0.7) return "抽穗期";
  if (m >= 50 || g >= 0.55) return "孕穗期";
  if (m >= 35 || g >= 0.4) return "拔节期";
  return "分蘖期";
}

// ===== 读取 Excel =====
function loadMetricFile(filePath) {
  const fileName = path.basename(filePath);
  const metricCode = fileName.split("-")[0];
  const meta = METRIC_META[metricCode];
  if (!meta) return null;

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const dataRows = rows.slice(1); // 跳过说明行

  const records = [];
  for (const row of dataRows) {
    const dateValue = parseDate(row[2]);
    if (!dateValue) continue;
    const timestamp = dateValue.toISOString();

    for (let i = 3; i < row.length; i += 1) {
      const extracted = extractFieldValue(row[i]);
      if (!extracted) continue;
      records.push({
        fieldId: extracted.fieldId,
        value: extracted.value,
        timestamp,
      });
    }
  }

  return { code: metricCode, key: meta.key, name: meta.name, records };
}

function loadAllData() {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error(`数据目录不存在: ${DATA_DIR}`);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.toLowerCase().endsWith(".xlsx"));

  const metricFiles = files
    .map((f) => path.join(DATA_DIR, f))
    .map(loadMetricFile)
    .filter(Boolean);

  const fieldMap = new Map();
  const historyMap = new Map();

  for (const metric of metricFiles) {
    for (const rec of metric.records) {
      const { fieldId, value, timestamp } = rec;

      // 最新值
      const prev = fieldMap.get(fieldId) || { latest: {}, lastUpdated: null };
      const prevDate = prev.lastUpdated ? new Date(prev.lastUpdated) : null;
      const tsDate = new Date(timestamp);
      if (!prevDate || tsDate > prevDate) {
        prev.lastUpdated = timestamp;
      }
      prev.latest[metric.key] = value;
      fieldMap.set(fieldId, prev);

      // 历史序列
      const arr = historyMap.get(fieldId) || [];
      arr.push({ timestamp, metric: metric.key, value });
      historyMap.set(fieldId, arr);
    }
  }

  // 构建田块状态
  const statuses = [];
  const fieldIds = Array.from(fieldMap.keys()).filter((id) => id !== "null");
  fieldIds.sort();

  fieldIds.forEach((id, idx) => {
    const info = fieldMap.get(id);
    const metrics = info.latest;
    const lastUpdated = info.lastUpdated || new Date().toISOString();

    let sum = 0;
    let weightSum = 0;
    for (const meta of Object.values(METRIC_META)) {
      const v = metrics[meta.key];
      if (v === undefined || v === null) continue;
      sum += normalizeMetric(meta.key, v) * meta.weight;
      weightSum += meta.weight;
    }
    const healthScore =
      weightSum > 0 ? clamp(sum / weightSum, 0.05, 1) : 0.5;

    const growthStage = inferGrowthStage({
      maturity: metrics.maturity,
      growthIndex: metrics.growthIndex,
    });

    statuses.push({
      id,
      name: id,
      row: Math.floor(idx / 8), // 简单网格排布
      col: idx % 8,
      healthScore,
      growthStage,
      lastUpdated,
      latestMetric: metrics,
    });
  });

  // 构建历史数据
  const history = {};
  for (const [fieldId, records] of historyMap.entries()) {
    const grouped = {};
    for (const r of records) {
      const key = r.timestamp;
      grouped[key] = grouped[key] || { timestamp: r.timestamp };
      grouped[key][r.metric] = r.value;
    }
    const points = Object.values(grouped)
      .map((p) => {
        const dt = new Date(p.timestamp);
        const growth =
          p.growthIndex !== undefined ? p.growthIndex : p.lai ?? 0.4;
        const maturity = p.maturity ?? growth * 100;
        const productivity = normalizeMetric("growthIndex", growth) * 100;
        return {
          timestamp: p.timestamp,
          label: formatLabel(dt),
          yield: Math.round(productivity),
          growthIndex: Math.round(growth * 100),
          maturity: Math.round(maturity),
          chlorophyll: p.chlorophyll,
          lai: p.lai,
          plantHeight: p.plantHeight,
          nitrogen: p.nitrogen,
          phosphorus: p.phosphorus,
          potassium: p.potassium,
          soilPH: p.soilPH,
          organicMatter: p.organicMatter,
          salinity: p.salinity,
        };
      })
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    history[fieldId] = points;
  }

  return {
    statuses,
    history,
    meta: {
      dataDir: DATA_DIR,
      metricFiles: metricFiles.length,
      fieldCount: statuses.length,
      loadedAt: new Date().toISOString(),
    },
  };
}

let DATA_CACHE = loadAllData();

// ===== 路由 =====
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), meta: DATA_CACHE.meta });
});

app.get("/api/reload", (_req, res) => {
  try {
    DATA_CACHE = loadAllData();
    res.json({ message: "数据已重新加载", meta: DATA_CACHE.meta });
  } catch (err) {
    console.error("重新加载失败", err);
    res.status(500).json({ message: "重新加载失败", error: String(err) });
  }
});

// 全部田块状态
app.get("/api/fields/status", (_req, res) => {
  res.json(DATA_CACHE.statuses);
});

// 单个田块详情
app.get("/api/fields/:fieldId", (req, res) => {
  const field = DATA_CACHE.statuses.find((f) => f.id === req.params.fieldId);
  if (!field) return res.status(404).json({ message: "未找到该田块" });
  res.json(field);
});

// 历史（用于产量趋势 & 生长进度）
app.get("/api/fields/:fieldId/history", (req, res) => {
  const data = DATA_CACHE.history[req.params.fieldId] || [];
  res.json(data);
});

// 关键指标时间序列（替代旧 vegetation 接口）
app.get("/api/fields/:fieldId/metrics", (req, res) => {
  const data = DATA_CACHE.history[req.params.fieldId] || [];
  res.json(data);
});

app.listen(PORT, () => {
  console.log(
    `智慧农业数字孪生后端启动成功: http://localhost:${PORT}/api/health`
  );
  console.log(`数据目录: ${DATA_DIR}`);
});
