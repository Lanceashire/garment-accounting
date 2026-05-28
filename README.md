# 记账星

面向服装加工场景的 Android 移动端记账工具。支持按账单分组记录加工收入，自动计算每条记录总价、当前账单合计和全部账单总计，并可导出真正的 `.xlsx` Excel 文件。

## 功能

- **多账单管理**：可新建、切换、删除账单，至少保留一个账单。
- **加工记录录入**：输入产品编号、件数、单价，实时预览单条总价。
- **明细查看**：当前账单下的每一笔记录都会显示在明细区，页面支持上下滑动查看。
- **金额统计**：自动统计当前账单合计和全部账单总计。
- **Excel 导出**：导出标准 `.xlsx` 文件，包含序号、产品编号、件数、单价、总价、记录时间和合计行。
- **系统分享**：导出后可通过微信、QQ、文件管理器等方式发送。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React Native + Expo |
| 平台 | Android |
| Excel | xlsx |
| 文件/分享 | expo-file-system/legacy + expo-sharing |

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npx expo start
```

可使用 Expo Go 扫码调试，或通过 USB 连接 Android 设备后运行：

```bash
npx expo run:android
```

## 构建 APK

本项目已生成 Android 原生工程，可在本机执行：

```bash
cd android
.\gradlew.bat assembleRelease
```

当前 APK 输出位置：

```text
android/app/build/outputs/apk/release/app-release.apk
```

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

## 使用说明

1. 选择或新建一个账单。
2. 输入产品编号、件数、单价。
3. 点击 **添加记录**。
4. 在账单明细中查看每一笔记录。
5. 需要分组时点击 **+ 新账单**。
6. 点击 **导出 Excel** 生成并分享当前账单的 Excel 明细。

## 环境要求

- Node.js >= 18
- Android SDK
- JDK 21 或兼容 Android Gradle 构建的 JDK

