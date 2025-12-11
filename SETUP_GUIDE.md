# 智慧农业数字孪生系统 - 快速启动指南

## 📋 前置要求

1. **Node.js** (推荐 v18+)
2. **MySQL** (推荐 8.0+)
3. **npm** 或 **yarn**

## 🚀 快速开始

### 1. 安装依赖

#### 后端依赖
```bash
cd backend
npm install
```

#### 前端依赖
```bash
# 在项目根目录
npm install
```

### 2. 配置 MySQL 数据库

#### 方式一：使用环境变量（推荐）

在 `backend` 目录创建 `.env` 文件：

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agriculture_digital_twin
PORT=4000
```

#### 方式二：使用默认配置

如果不创建 `.env` 文件，将使用以下默认值：
- 数据库：`localhost:3306`
- 用户：`root`
- 密码：空
- 数据库名：`agriculture_digital_twin`

### 3. 导入 Excel 数据到 MySQL

确保 `data/` 目录下有这两个 Excel 文件：
- `气象--中科院长春光机所.xlsx`
- `光谱数据--中科院长春光机所.xlsx`

运行迁移脚本：

```bash
cd backend
node migrate_to_mysql.js
```

脚本会自动：
- ✅ 创建数据库（如果不存在）
- ✅ 创建数据表
- ✅ 导入 Excel 数据

### 4. 启动后端服务

```bash
cd backend
npm start
```

后端将在 `http://localhost:4000` 启动

### 5. 配置前端 API 地址

在项目根目录创建 `.env.local` 文件（或修改现有 `.env`）：

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

### 6. 启动前端开发服务器

```bash
# 在项目根目录
npm run dev
```

前端将在 `http://localhost:5173`（或类似端口）启动

## 📊 数据说明

### 气象数据字段
- 数据时间
- 温度（℃）
- 湿度（%）
- 大气压（Kpa）
- 风速（m/s）
- 风向
- CO2（ppm）
- 总辐射（W/m²）
- 昨日降水（mm）
- 今日降水（mm）

### 植被指数数据字段
- 数据时间
- RVI氮素植被指数
- NDVI叶绿素植被指数
- MSR生物量植被指数
- VOG1植株水分植被指数
- OSAVI叶面积植被指数
- 光谱数据

## 🎨 界面功能

### 左侧面板
- **当前监测田块**：显示选中田块名称和长势指数
- **四个关键指标卡片**：气温、湿度、总辐射、土壤pH
- **详细环境指标列表**：包含所有气象数据（大气压、风速、风向、CO2、降水等）

### 中间面板
- **3D 场景可视化**：田块3D模型和实时状态

### 右侧面板
- **光照控制面板**：自动/手动补光控制
- **植被指数监测图表**：展示所有植被指数的对比趋势
- **产量趋势图**：基于MSR/OSAVI指数的产量预测
- **作物生长周期图**：基于NDVI的生长进度（0-100%）

### 底部状态条
- **作物生长全周期监控**：实时显示6个关键状态指标

## 🔧 常见问题

### Q: 迁移脚本报错"无法连接数据库"
A: 检查 MySQL 服务是否启动，以及 `.env` 中的数据库配置是否正确

### Q: 前端显示"暂无数据"
A: 确保：
1. 后端服务已启动
2. 已运行迁移脚本导入数据
3. 前端 `.env.local` 中的 `VITE_API_BASE_URL` 配置正确

### Q: 如何更新数据？
A: 重新运行迁移脚本即可（会清空旧数据并重新导入）

### Q: 如何添加更多田块？
A: 修改后端 `index.js` 中的 `DEFAULT_FIELD_ID` 和相关逻辑，或扩展数据库表结构支持多田块

## 📝 开发说明

### 后端 API 端点
- `GET /api/health` - 健康检查
- `GET /api/fields/status` - 获取田块状态列表
- `GET /api/fields/:fieldId/history` - 获取历史数据
- `GET /api/fields/:fieldId/vegetation` - 获取植被指数数据
- `GET /api/fields/:fieldId/weather` - 获取最新气象数据

### 前端主要组件
- `DashboardPage` - 主仪表盘页面
- `VegetationIndexChart` - 植被指数图表组件
- `YieldTrendChart` - 产量趋势图表
- `GrowthCycleChart` - 生长周期图表
- `LightingControlPanel` - 光照控制面板

## 🎯 下一步优化建议

1. **实时数据更新**：添加 WebSocket 或轮询机制，实时更新数据
2. **多田块支持**：扩展数据库和前端，支持多个田块切换
3. **数据导出**：添加数据导出功能（Excel/PDF）
4. **告警系统**：基于阈值设置告警规则
5. **历史数据分析**：添加更详细的数据分析和预测功能

