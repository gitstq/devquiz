# 🏋️ DevQuiz — 全栈开发者代码挑战平台

[English](README.en.md) | [繁體中文](README.zh-TW.md) | 简体中文

---

## 🎉 项目介绍

**DevQuiz** 是一个无需账号、开箱即用、完全可自托管的开发者编程挑战平台。

在浏览器中直接编写和运行 Python 代码，即时获得反馈 —— 无需安装任何软件，无需配置任何环境，无需登录任何账号。

### 🔥 核心价值

- ⚡ **零等待**：打开浏览器即可开始编程，无需安装任何依赖
- 🔒 **完全离线**：Pyodide WebAssembly 引擎在首次加载后可在离线环境运行
- 🌍 **双语无缝切换**：简体中文 / English 界面一键切换
- 📊 **进度本地保存**：使用 localStorage 自动保存答题进度
- 🎨 **现代化界面**：双栏布局、代码高亮、即时反馈、主题切换
- 🧩 **40+ 精选题目**：涵盖算法、Python 进阶、数据结构、Web 开发

### 💡 灵感来源

项目受 [pyre-code](https://github.com/whwangovo/pyre-code) 启发 —— 这是一个专注于 ML/AI 领域的自托管编程练习平台。DevQuiz 在其基础上做了以下差异化扩展：

| 维度 | pyre-code | DevQuiz |
|------|-----------|---------|
| 题目范围 | 仅 ML/AI | 全栈（算法 + Python + 数据结构 + Web） |
| 语言界面 | 仅英文 | 中英双语 |
| 主题 | 基础 | 现代化 UI + 暗色模式 |
| 部署方式 | 需后端 | 纯静态，打开即用 |

---

## ✨ 核心特性

- 📚 **40+ 精选题目**：算法（10题）、Python 进阶（10题）、数据结构（5题）、Web 开发（5题）
- ⚡ **浏览器端即时执行**：使用 Pyodide WebAssembly 技术，代码在浏览器中直接运行
- 🎯 **智能测试用例**：每道题配备完整的测试断言，实时反馈正误
- 🏷️ **多维度过滤**：按分类 / 难度快速筛选题目
- 💡 **提示系统**：遇到困难时获取解题思路
- 🌙 **暗色/亮色主题**：保护视力，适应不同环境
- 🌍 **中英双语**：界面与题目内容均支持中英切换
- 📊 **本地进度追踪**：自动记录已解决题目，不丢失进度
- 🎨 **现代化编辑器**：CodeMirror 6 提供语法高亮、行号、自动缩进

---

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome 89+、Firefox 88+、Edge 89+、Safari 15+）
- 首次加载需联网（下载约 8MB 的 Pyodide Python 引擎）
- 无需安装 Python、Node.js 或任何其他运行时

### 安装步骤

**方式一：直接下载（推荐）**

```bash
# 克隆仓库
git clone https://github.com/gitstq/devquiz.git
cd devquiz

# 直接用浏览器打开 index.html 即可
# Windows:
start index.html
# macOS:
open index.html
# Linux:
xdg-open index.html
```

**方式二：GitHub Pages 部署**

将仓库内容推送到 GitHub，启用 GitHub Pages 即可在线访问。

**方式三：任意静态服务器**

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# 然后访问 http://localhost:8080
```

### 🇨🇳 中国大陆网络说明

Pyodide 引擎 CDN（jsDelivr）在国内访问可能较慢。可使用以下替代方案：

**方案 A：使用国内 CDN 镜像**

修改 `runner.js` 中的 `PYODIDE_CDN` 为：

```javascript
// 使用 unpkg 镜像
const PYODIDE_CDN = 'https://unpkg.com/pyodide@0.26.4/full/';
```

**方案 B：离线预加载**

首次在联网环境下加载后，浏览器会缓存 Pyodide，后续可在离线环境正常使用。

---

## 📖 详细使用指南

### 基本操作

1. **选择题目**：在左侧栏按分类或难度筛选，点击任意题目卡片进入
2. **编写代码**：在右侧代码编辑器中补全函数实现
3. **运行测试**：点击「运行测试」验证代码是否正确
4. **运行代码**：点击「运行代码」查看自定义输出
5. **获取提示**：点击「提示」查看解题思路
6. **切换语言**：点击右上角 🌐 按钮切换中英文

### 难度说明

| 难度 | 含义 |
|------|------|
| 🟢 简单（Easy） | 基础语法、简单逻辑，适合入门 |
| 🟡 中等（Medium） | 需要一定思考，涉及常用算法模式 |
| 🔴 困难（Hard） | 综合性强，需要深入理解与优化 |

### 示例题目

```python
# 例：两数之和
def two_sum(nums, target):
    # 你的代码
    pass

two_sum([2, 7, 11, 15], 9)  # 期望返回 [0, 1]
```

---

## 💡 设计思路与迭代规划

### 设计理念

**极简主义 + 零门槛**：DevQuiz 坚信好的学习工具应该零门槛。打开浏览器就能编程 —— 不需要配置 conda 环境、不需要理解虚拟环境、不需要注册任何账号。Pyodide 将完整的 CPython 运行时编译为 WebAssembly，让浏览器成为最好的 Python IDE。

**本地优先**：所有数据均存储在浏览器 localStorage 中，完全离线可用，不依赖任何后端服务。用户数据永不离开用户设备。

### 技术选型

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| 代码执行 | Pyodide (WebAssembly) | 在浏览器中运行 CPython，无需服务器 |
| 代码编辑器 | CodeMirror 6 (CDN) | 成熟、轻量、功能完善、主题支持 |
| 前端框架 | 原生 HTML + CSS + JS | 零依赖，构建快速 |
| 状态持久化 | localStorage | 无后端也能持久化进度 |
| 题库格式 | JSON | 易于维护、扩展和贡献 |

### 路线图

- [ ] **v1.1**：增加 JavaScript/TypeScript 执行支持（浏览器原生）
- [ ] **v1.2**：增加题目收藏与笔记功能
- [ ] **v1.3**：增加题目难度自评（自我评估 vs 实际评分对比）
- [ ] **v2.0**：增加多人对战模式（基于 WebRTC）
- [ ] **v2.1**：增加自定义题目导入/导出
- [ ] **v2.2**：增加 AI 辅助分析（接入本地 LLM API）

---

## 📦 打包与部署

### 构建

DevQuiz 是纯静态应用，无需构建步骤。

如需压缩/打包：

```bash
# 安装 rollup（可选）
npm install -g rollup

# 打包（将所有模块打包为单个 JS 文件）
rollup app.js --file bundle.js --format es
```

### 部署方式

| 方式 | 步骤 | 适用场景 |
|------|------|----------|
| GitHub Pages | push → Settings → Pages → Save | 公开免费托管 |
| Vercel | `vercel --prod` | 自动 HTTPS + CDN |
| Netlify | 拖拽文件夹 | 零配置部署 |
| 任意 HTTP 服务器 | `python -m http.server` | 内网/本地 |

### 支持环境

- ✅ Chrome 89+
- ✅ Firefox 88+
- ✅ Safari 15+
- ✅ Edge 89+
- ✅ 移动浏览器（平板/手机）
- ⚠️ Pyodide 暂不支持 iOS Safari 的某些 WebAssembly 特性

---

## 🤝 贡献指南

### 贡献题目

题库文件位于 `questions/` 目录，支持 JSON 格式。每道题目结构如下：

```json
{
  "id": "algo_001",
  "title": "Two Sum",
  "title_zh": "两数之和",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "description": "题目描述（英文）",
  "description_zh": "题目描述（中文）",
  "starter_code": "def two_sum(nums, target):\n    # Your code here\n    pass",
  "solution": "标准解答代码",
  "hint": "英文提示",
  "hint_zh": "中文提示",
  "test_assertions": "assert two_sum([2,7,11,15], 9) == [0,1]"
}
```

### 提交流程

1. Fork 本仓库
2. 在对应分类 JSON 文件中添加题目（确保格式正确）
3. 本地测试：在浏览器中打开 `index.html` 并验证题目
4. 创建 Pull Request，描述新增题目内容

### 题目质量标准

- ✅ 题目描述清晰、无歧义
- ✅ 测试用例完整，覆盖边界情况
- ✅ 中英文翻译准确，无生硬机翻
- ✅ 难度分级合理（Easy ≤ 15行解答，Medium ≤ 30行，Hard ≤ 50行）
- ✅ 不使用任何版权材料

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Pyodide](https://pyodide.org/) — 在浏览器中运行 Python 的强大工具
- [CodeMirror](https://codemirror.net/) — 久经考验的浏览器代码编辑器
- [pyre-code](https://github.com/whwangovo/pyre-code) — 项目灵感来源
- 所有提交 PR 和 issue 的贡献者
