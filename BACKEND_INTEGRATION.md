# 后端数据接入指南

本文档说明如何将项目从假数据模式切换到真实后端API。

## 已完成的工作

### 1. ✅ 宽屏适配优化
- 改进了响应式布局，添加了 `2xl` 断点支持
- 确保右侧图表区域在超宽屏设备上也能正常显示
- 优化了光照控制面板和图表区域的高度分配

### 2. ✅ API 基础设施
- 创建了 `src/config/api.ts` - 统一的API请求工具
- 支持环境变量配置API基础URL
- 包含错误处理和超时控制
- 提供了 GET、POST、PUT、DELETE 等常用HTTP方法

### 3. ✅ 数据接口重构
- 重构了 `src/api/field.ts`，移除了假数据
- 改为调用真实后端API
- 保留了假数据代码作为注释，便于开发测试

### 4. ✅ 类型定义
- 更新了 `FieldMetric` 类型，添加了可选字段注释（co2, windSpeed）

## 接入步骤

### 步骤 1: 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

或者使用：

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

**注意**: 环境变量必须以 `VITE_` 开头才能在Vite项目中使用。

### 步骤 2: 确认后端API端点

项目期望的后端API端点格式：

#### 获取所有田块状态
```
GET /fields/status
```

**响应格式**:
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

#### 获取田块历史数据
```
GET /fields/{fieldId}/history
```

**响应格式**:
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

#### 获取单个田块详情（可选）
```
GET /fields/{fieldId}
```

### 步骤 3: 处理CORS问题

如果后端和前端运行在不同端口，需要配置CORS：

**后端需要设置响应头**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

**或者使用Vite代理**（推荐用于开发环境）:

在 `vite.config.ts` 中添加：

```typescript
export default defineConfig({
  // ... 其他配置
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

然后设置环境变量：
```env
VITE_API_BASE_URL=/api
```

### 步骤 4: 测试API连接

1. 启动后端服务
2. 启动前端开发服务器：`npm run dev`
3. 打开浏览器控制台，查看网络请求
4. 确认API请求是否成功

### 步骤 5: 处理错误情况

项目已经包含了基本的错误处理：
- API请求失败会显示错误信息
- 超时设置为10秒（可在 `src/config/api.ts` 中修改）
- 网络错误会被捕获并显示友好提示

## 待接入的数据

以下数据目前仍使用假数据，需要后续接入：

### 1. 实时告警数据
**位置**: `src/features/dashboard/DashboardPage.tsx` (第183行)

**建议API端点**:
```
GET /alerts?fieldId={fieldId}&limit=10
```

**响应格式**:
```json
[
  {
    "id": 1,
    "time": "10:05",
    "msg": "A1 区光照不足，已触发自动补光逻辑。",
    "type": "光照 / 环境"
  }
]
```

### 2. 作物生长全周期监控数据
**位置**: `src/features/dashboard/DashboardPage.tsx` (BottomStatusBar组件)

**建议API端点**:
```
GET /fields/{fieldId}/status/overview
```

**响应格式**:
```json
{
  "growthStatus": { "value": "良好", "progress": 0.72 },
  "soilQuality": { "value": "偏酸", "progress": 0.45 },
  "fertilization": { "value": "适中", "progress": 0.6 },
  "irrigation": { "value": "正常", "progress": 0.8 },
  "pestControl": { "value": "安全", "progress": 0.9 },
  "harvestForecast": { "value": "+320kg", "progress": 0.65 }
}
```

### 3. 扩展传感器数据（可选）
如果后端提供以下数据，可以取消 `src/types/field.ts` 中 `FieldMetric` 类型的注释：
- `co2`: 二氧化碳浓度
- `windSpeed`: 风速

## 开发模式（使用假数据）

如果需要临时使用假数据进行开发，可以：

1. 修改 `src/api/field.ts`，取消注释假数据代码
2. 修改 `fetchFieldStatuses` 和 `fetchFieldHistory` 函数返回假数据
3. 或者创建一个开发模式标志

**不推荐在生产环境使用假数据**

## 故障排查

### 问题：API请求失败，显示CORS错误
**解决**: 配置后端CORS或使用Vite代理

### 问题：API返回404
**解决**: 检查环境变量中的API基础URL是否正确

### 问题：数据格式不匹配
**解决**: 检查后端返回的数据格式是否与类型定义一致

### 问题：请求超时
**解决**: 增加 `API_TIMEOUT` 值（在 `src/config/api.ts` 中）

## 相关文件

- `src/config/api.ts` - API配置和请求工具
- `src/api/field.ts` - 田块数据API接口
- `src/types/field.ts` - 数据类型定义
- `src/store/fieldStore.ts` - 全局状态管理
- `src/config/README.md` - API配置详细说明

