# 智慧农业数字孪生系统 - 后端使用说明（Excel 直读版）

后端已改为**直接读取 Excel 数据**，无需 MySQL。默认读取路径：`F:\数字孪生-智慧农业项目\东区地块`，也可通过环境变量 `DATA_DIR` 指定。

## 1. 准备环境

```bash
cd backend
npm install
```

> 如果数据目录有变化，启动前设置 `DATA_DIR`：
> `set DATA_DIR=D:\your\path\to\东区地块`

## 2. 启动服务

```bash
npm start      # 正常启动
# 或
npm run dev    # nodemon 热重载
```

服务地址：`http://localhost:4000`

## 3. 主要接口

- 健康检查：`GET /api/health`
- 重新加载 Excel：`GET /api/reload`
- 田块状态列表：`GET /api/fields/status` → `FieldStatus[]`
- 田块详情：`GET /api/fields/:fieldId`
- 田块历史趋势：`GET /api/fields/:fieldId/history` → 产量/长势时间序列
- 关键指标序列：`GET /api/fields/:fieldId/metrics` → 长势/叶绿素/LAI/株高等

## 4. 数据来源

默认读取目录下的 11 个 Excel 文件（按文件名前缀匹配指标）：
- 11：作物长势指数（growthIndex）
- 16：成熟期预测（maturity）
- 43：叶绿素（chlorophyll）
- 434：叶面积指数（lai）
- 435：株高（plantHeight）
- 131：氮素
- 132：磷素
- 133：钾素
- 134：土壤 pH
- 135：有机质
- 136：可溶性总盐分

系统自动解析最新时间的每个田块指标、计算健康度，并生成历史序列用于前端图表。

## 5. 其他

- 若更新了 Excel，调用 `GET /api/reload` 即可重新加载。
- 数据目录中文件名需保持前缀编码（如 `11-...xlsx`），否则无法匹配指标。
