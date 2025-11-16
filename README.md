# 智慧农田数字孪生大屏（Digital Twin Rice Field Dashboard）

> 卫星遥感 × 物联网传感器 × 光照控制的 **水稻大田数字孪生可视化系统**
> 使用 Web 技术在 PC 和手机端实时展示农田状态与模拟控制效果。

本项目目前主要面向**前端可视化与交互**，通过一块 3D 场景 + 多个数据面板，演示未来可与真实传感器/平台接入的「智慧农田」数字孪生能力。

---

## 功能概览 Features

### 🌾 3D 水稻大田场景（Three.js / @react-three/fiber）

* 基于 **FieldGrid** 的网格化田块布局（A1 ~ B4 等多块田）。
* 每块田：

  * 有明显厚度的「田块台子」；
  * 顶部稻田表面颜色根据 **长势指数（healthScore）** 动态变化；
  * 成簇水稻模型（秆 + 叶片），高度和颜色联动：

    * 生育阶段（分蘖期、拔节期、孕穗期、抽穗期、灌浆期、成熟期）；
    * 环境状态：光照不足、干旱、土壤酸/碱异常、健康。
  * 补光灯开启时，田面与叶色偏暖、更明亮，清晰反映补光状态。
* 场景光照：

  * 天空光（HemisphereLight）+ 主「太阳」方向光 + 冷色补光；
  * 轻微雾效，营造真实的田间俯视环境；
  * OrbitControls 限制视角范围，便于在大屏上稳定展示。

### 📊 实时监测与趋势图

* 左侧监测区：

  * 当前选中田块的 **温度 / 湿度 / 光照 / 土壤 pH** 核心指标；
  * 环境指标列表（CO₂ 浓度、风速等示例数据）。
* 右侧趋势图：

  * **产量趋势图**（LineChart，按月份变化）；
  * **作物生长周期图**（AreaChart，展示 0–100% 生长进度）；
  * 图表数据与当前选中田块的历史数据联动（mock 数据）。

### 💡 光照控制与补光联动

* 光照控制面板（LightingControlPanel）：

  * 自动模式：

    * 当监测光照低于设定阈值（例如 800 lx）时自动判定「补光开启」；
  * 手动模式：

    * 支持手动开关补光灯（开关对选中田块生效）。
* 3D 场景中：

  * 补光开启 → 对应田块颜色偏暖、稻丛更亮；
  * 光照不足 + 补光开启 → 叶色从暗绿逐渐趋向亮绿，直观表达“补光改善了光照”。

### 🧩 数字孪生架构雏形

* 使用 **Zustand** 管理全局状态：

  * 田块列表、选中/悬停状态；
  * 光照控制模式 & 补光开关；
  * 历史数据（产量 & 生长进度）。
* 将真实环境变量抽象成：

  * `FieldStatus`：田块当前状态；
  * `FieldHistoryPoint`：历史序列数据；
  * 便于后续替换为后端 API / MQTT / WebSocket 等真实数据源。

### 📱 响应式大屏设计

* PC 大屏：三列布局（左监测区 + 中 3D 场景 + 右控制面板 & 图表）+ 底部全周期状态条。
* 移动端：纵向折叠布局，保证主要信息可读，背景色与整体 UI 统一。

---

## 技术栈 Tech Stack

* **框架**：React 18 + TypeScript
* **构建工具**：Vite
* **样式**：Tailwind CSS
* **状态管理**：Zustand
* **3D 可视化**：

  * Three.js（通过 @react-three/fiber / @react-three/drei）
* **图表**：Recharts
* **包管理**：npm（也可按需改用 yarn / pnpm）

Node 环境建议：**Node.js ≥ 18**

---

## 快速开始 Quick Start

### 1. 克隆仓库

```bash
git clone <你的-github-repo-url>.git
cd digital-twin-dashboard
```

### 2. 安装依赖

```bash
npm install
# or
# yarn
# pnpm install
```

### 3. 启动开发环境

```bash
npm run dev
```

在浏览器打开提示的地址（默认 `http://localhost:5173`），即可看到数字孪生大屏。

### 4. 构建生产版本

```bash
npm run build
npm run preview   # 本地预览打包结果
```

---

## 项目结构 Project Structure（核心部分）

```text
digital-twin-dashboard/
├─ src/
│  ├─ api/
│  │   └─ field.ts           # 假数据：田块当前状态 & 历史数据
│  ├─ components/
│  │   ├─ charts/
│  │   │   ├─ YieldTrendChart.tsx
│  │   │   └─ GrowthCycleChart.tsx
│  │   ├─ devices/
│  │   │   └─ LightingControlPanel.tsx  # 光照控制面板
│  │   └─ stats/
│  │       └─ StatCard.tsx              # 左侧指标卡片
│  ├─ features/
│  │   ├─ dashboard/
│  │   │   └─ DashboardPage.tsx         # 整个大屏布局
│  │   └─ scene/
│  │       ├─ SceneCanvas.tsx           # Three.js 场景容器
│  │       └─ FieldGrid.tsx             # 3D 田块 + 水稻可视化
│  ├─ store/
│  │   └─ fieldStore.ts                 # Zustand 全局状态（田块 & 光照）
│  ├─ types/
│  │   └─ field.ts                      # 类型定义（FieldStatus 等）
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
└─ README.md
```

---

## 核心模块说明

### 1. 田块数据 & 生育阶段（`src/types/field.ts`, `src/api/field.ts`）

* `FieldStatus` 描述每块田的当前状态：

  * `healthScore`：长势指数（0–1）；
  * `growthStage`：生育阶段（分蘖期/拔节期/孕穗期/抽穗期/灌浆期/成熟期）；
  * `latestMetric`：温度、湿度、光照、土壤 pH。
* `src/api/field.ts` 中提供一组 **对比明显的假数据**：

  * 部分田块光照不足；
  * 部分田块干旱；
  * 部分田块土壤偏酸/偏碱；
  * 对应在 3D 场景中表现为不同的叶色 & 高度。

后续接入真实数据时，只需将 `fetchFieldStatuses` / `fetchFieldHistory` 改为调用后端接口即可。

### 2. 全局状态管理（`src/store/fieldStore.ts`）

Zustand store 统一管理：

* 田块列表 `fields`、选中田块 `selectedFieldId`、悬停 `hoveredFieldId`；
* 光照控制模式 `lightingMode`（auto/manual）；
* 手动补光开关 `manualLightOn`；
* 补光阈值 `lightThreshold`；
* 历史数据 `history`（用于图表）。

3D 场景、右侧控制面板、折线图组件都直接从 store 读取状态，保证联动。

### 3. 3D 场景（`SceneCanvas.tsx` + `FieldGrid.tsx`）

`SceneCanvas`：

* 配置相机视角、OrbitControls；
* 添加太阳方向光 + 天空光 + 冷色补光 + 雾效。

`FieldGrid`：

* 将 `fields` 布局为网格；
* 每块田：

  * 使用 `boxGeometry` 生成有厚度的田块台子；
  * 稻田表面 `planeGeometry` + 网格线 `wireframe`；
  * 根据 `healthScore` & `growthStage` 计算水稻高度；
  * 根据环境指标（光照 / 湿度 / 土壤 pH）计算叶片颜色；
  * 根据补光开启状态调整颜色 & 发光强度；
  * 使用 `Html` 在田块上方显示标签（“A1 区 · 90%”）。

---

## 如何接入真实数据 / 扩展方向

后续可以在此基础上继续扩展：

1. **接入后端 API / MQTT / WebSocket：**

   * 在 `src/api/field.ts` 中替换为真实接口；
   * 保持 `FieldStatus` / `FieldHistoryPoint` 类型不变即可。
2. **接入真实的光照控制设备：**

   * 将 `lightingMode`、`manualLightOn` 的变化通过 API / WebSocket 下发给边缘网关；
   * 接收设备状态回写到 store。
3. **使用自建 3D 模型替换当前水稻簇：**

   * 将水稻导出为 glTF / GLB 模型；
   * 使用 `useGLTF` 加载并在 `RicePatch` 内替换当前几何。
4. **添加更多监测维度：**

   * 病虫害指数、氮/磷/钾养分、风速风向等；
   * 对应增加图标和 3D 场景中的视觉编码（颜色/高度/贴图）。

---

## 开发协作建议（团队用）

* 使用 GitHub Private 仓库统一管理代码；
* 推荐简单的分支模型：

  * `main`：稳定可演示版本；
  * `feat/xxx`：新功能分支；
* Commit message 尽量说明改动模块，例如：

  * `feat: add growth stage based rice visualization`
  * `refactor: extract lighting control store`
* 可以在飞书里为本项目建独立分组：

  * 需求规划 / 任务拆分；
  * 对应 GitHub issue 链接；
  * 定期贴上最新的截图动图方便讨论 UI/交互。

---