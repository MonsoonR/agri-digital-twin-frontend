# API 配置说明

## 环境变量配置

项目使用 Vite 的环境变量系统。要配置后端API地址，请创建 `.env` 文件（或 `.env.local` 用于本地开发）。

### 配置步骤

1. 在项目根目录创建 `.env` 文件
2. 添加以下配置：

```env
# 后端API基础URL
VITE_API_BASE_URL=http://localhost:3000/api
```

或者使用：

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

### API端点说明

项目期望的后端API端点：

- `GET /fields/status` - 获取所有田块状态
- `GET /fields/:fieldId` - 获取单个田块详情
- `GET /fields/:fieldId/history` - 获取田块历史数据

### 响应格式

#### 田块状态列表 (`/fields/status`)
```json
[
  {
    "id": "A1",
    "name": "A1 区",
    "row": 0,
    "col": 0,
    "healthScore": 0.9,
    "growthStage": "孕穗期",
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "latestMetric": {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "temperature": 26.1,
      "humidity": 78,
      "light": 880,
      "soilPH": 6.2
    }
  }
]
```

#### 历史数据 (`/fields/:fieldId/history`)
```json
[
  {
    "label": "4月",
    "yield": 2200,
    "growthIndex": 20
  },
  {
    "label": "5月",
    "yield": 2600,
    "growthIndex": 40
  }
]
```

### 开发模式

如果后端API尚未准备好，可以：
1. 使用代理服务器（配置在 `vite.config.ts` 中）
2. 临时使用假数据（需要修改 `src/api/field.ts`）

