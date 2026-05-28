<p align="center">
  <img src="assets/icon.png" width="180" alt="记账星 Logo" />
</p>

<h1 align="center">记账星</h1>

<p align="center">
  服装加工行业的轻量移动端记账工具
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Android-3DDC84?style=for-the-badge" />
  <img alt="Expo" src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react" />
  <img alt="Excel" src="https://img.shields.io/badge/Excel-.xlsx-217346?style=for-the-badge&logo=microsoftexcel" />
</p>

<p align="center">
  <a href="#功能亮点">功能亮点</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#构建-apk">构建 APK</a> ·
  <a href="#项目结构">项目结构</a>
</p>

---

**记账星** 是一个面向服装加工场景的 Android 记账应用。它可以按账单分组记录加工收入，自动计算单条总价、当前账单合计和全部账单总计，并导出真正可被 Excel/WPS 正常打开的 `.xlsx` 文件。

适合用于日常加工单、临时批次、多人/多客户分账等场景。

## 功能亮点

| 功能 | 说明 |
|---|---|
| 多账单管理 | 新建、切换、删除账单，至少保留一个账单 |
| 加工记录录入 | 输入产品编号、件数、单价，实时计算单条总价 |
| 明细查看 | 每个账单下的记录独立展示，页面支持上下滑动 |
| 金额统计 | 自动统计当前账单合计和全部账单总计 |
| Excel 导出 | 生成标准 `.xlsx`，包含明细和合计行 |
| 系统分享 | 导出后可通过微信、QQ、文件管理器等方式发送 |

## 技术栈

| 模块 | 技术 |
|---|---|
| App 框架 | React Native + Expo |
| 目标平台 | Android |
| Excel 生成 | xlsx |
| 文件写入 | expo-file-system/legacy |
| 系统分享 | expo-sharing |

## 快速开始

```bash
npm install
npx expo start
```

使用 Expo Go 扫码调试，或通过 USB 连接 Android 设备后运行：

```bash
npx expo run:android
```

## 构建 APK

项目已经生成 Android 原生工程，可直接构建 release APK：

```bash
cd android
.\gradlew.bat assembleRelease
```

APK 输出位置：

```text
android/app/build/outputs/apk/release/app-release.apk
```

## 使用流程

1. 选择当前账单，或点击 `+ 新账单` 创建新账单。
2. 输入产品编号、件数、单价。
3. 点击 `添加记录`。
4. 在账单明细区查看每一笔记录。
5. 在底部查看当前账单合计和全部账单总计。
6. 点击 `导出 Excel` 分享当前账单的 `.xlsx` 明细。

## 项目结构

```text
garment-accounting/
├── App.js                 # 主入口，界面与记账逻辑
├── app.json               # Expo 配置
├── package.json           # 依赖清单
├── assets/
│   └── icon.png           # 应用图标
├── android/               # Android 原生工程
└── src/
    └── utils/
        └── excel.js       # Excel 导出逻辑
```

## 环境要求

- Node.js >= 18
- Android SDK
- JDK 21 或兼容 Android Gradle 构建的 JDK

