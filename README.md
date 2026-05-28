# 服装加工记账

服务于服装加工行业的移动端记账工具。快速录入工序信息，自动计算总价，一键导出 Excel 报表。

## 功能

- **产品编号** — 支持纯数字 / 英文 / 英文+数字（如 A001、BX88）
- **件数 & 单价** — 录入后实时预览总价
- **记录管理** — 增删记录，自动合计总金额
- **Excel 导出** — 生成 .xlsx 文件并通过系统分享

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React Native + Expo |
| 平台 | Android |
| Excel | SpreadsheetML (Office XML) |
| 文件/分享 | expo-file-system + expo-sharing |

## 快速开始

### 1. 安装依赖

```bash
cd garment-accounting
npm install
```

### 2. 启动开发服务器

```bash
npx expo start
```

然后：
- 用 **Expo Go** 扫码 (Android 手机上安装 Expo Go)
- 或按 `a` 通过 USB 连接的 Android 设备/模拟器运行

### 3. 构建 APK (可选)

```bash
npx expo build:android
```

## 项目结构

```
garment-accounting/
├── App.js                 # 主入口，界面与逻辑
├── app.json               # Expo 配置
├── package.json           # 依赖清单
├── babel.config.js
├── assets/                # 图标等静态资源
└── src/
    └── utils/
        └── excel.js       # Excel 导出 (SpreadsheetML)
```

## 使用说明

1. 输入 **产品编号**（字母/数字组合，如 XH202）
2. 输入 **件数**（整数）
3. 输入 **单价**（元，支持小数）
4. 点击 **添加记录**
5. 重复录入多条记录
6. 点击底部 **导出 Excel**，通过微信/邮件等方式发送

## 环境要求

- Node.js >= 18
- Android SDK (已配置于 `C:\Users\lenovo\AppData\Local\Android\Sdk`)
- Expo Go 手机端 App (开发调试用)
