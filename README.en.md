# 🏋️ DevQuiz — Full-Stack Developer Code Challenges

[English](README.en.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.md)

---

## 🎉 Introduction

**DevQuiz** is a self-hostable, zero-configuration coding challenge platform for developers — running entirely in your browser.

Write and run Python code instantly, get real-time feedback. No installation, no accounts, no server needed.

### 🔥 Core Value

- ⚡ **Zero setup**: Open your browser and start coding immediately
- 🔒 **Works offline**: Pyodide WebAssembly engine runs after first load
- 🌍 **Bilingual**: Seamless switch between English and Chinese
- 📊 **Local progress**: Automatically saved to localStorage
- 🎨 **Modern UI**: Split-panel layout, syntax highlighting, instant feedback
- 🧩 **40+ curated problems**: Algorithms, Python, Data Structures, Web Dev

### 💡 Inspiration

Inspired by [pyre-code](https://github.com/whwangovo/pyre-code), DevQuiz extends the concept beyond ML/AI to cover full-stack developer skills, adds bilingual support, and improves the UI/UX.

---

## ✨ Features

- 📚 **40+ curated problems**: Algorithms (10), Python (10), Data Structures (5), Web Dev (5)
- ⚡ **Instant browser execution**: Powered by Pyodide WebAssembly
- 🎯 **Smart test cases**: Complete assertions for each problem, real-time feedback
- 🏷️ **Multi-filter**: Filter by category / difficulty
- 💡 **Hint system**: Get hints when stuck
- 🌙 **Dark/Light theme**: Eye-friendly in any environment
- 🌍 **Bilingual UI**: Both interface and problem content available in EN/ZH
- 📊 **Local progress tracking**: Never lose your solved problems
- 🎨 **Modern editor**: CodeMirror 6 with syntax highlighting, line numbers, auto-indent

---

## 🚀 Quick Start

### Requirements

- Modern browser (Chrome 89+, Firefox 88+, Edge 89+, Safari 15+)
- Internet required for first load (~8MB Pyodide engine)
- No Python, Node.js, or any runtime needed

### Installation

**Option A: Clone & Open (Recommended)**

```bash
git clone https://github.com/gitstq/devquiz.git
cd devquiz
# Open index.html in your browser
```

**Option B: GitHub Pages**

Push to GitHub and enable GitHub Pages in Settings.

**Option C: Any static server**

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# Visit http://localhost:8080
```

---

## 📖 Usage Guide

### Basic Workflow

1. **Select a problem**: Filter by category or difficulty in the left panel, click a card
2. **Write code**: Complete the function in the right editor
3. **Run tests**: Click "Run Tests" to verify correctness
4. **Run code**: Click "Run Code" to see custom output
5. **Get hints**: Click "Hint" for a nudge in the right direction
6. **Switch language**: Click 🌐 to toggle EN/ZH

---

## 💡 Design & Roadmap

### Philosophy

**Zero-barrier learning**: Good learning tools should require zero setup. Open browser → start coding. Pyodide compiles the full CPython runtime to WebAssembly, turning your browser into the best Python IDE.

**Local-first**: All data is stored in localStorage. No backend, no data ever leaves your device.

### Roadmap

- [ ] **v1.1**: Add JavaScript/TypeScript execution support
- [ ] **v1.2**: Add problem bookmarking and notes
- [ ] **v1.3**: Add self-assessment vs actual score comparison
- [ ] **v2.0**: Add multi-player challenge mode (WebRTC)
- [ ] **v2.1**: Add custom problem import/export
- [ ] **v2.2**: Add AI-powered analysis (local LLM API)

---

## 🤝 Contributing

### Adding Problems

Problems are JSON files in `questions/`. Each problem follows this structure:

```json
{
  "id": "algo_001",
  "title": "Two Sum",
  "title_zh": "两数之和",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "description": "Problem description in English",
  "description_zh": "中文题目描述",
  "starter_code": "def two_sum(nums, target):\n    pass",
  "solution": "Correct solution",
  "hint": "English hint",
  "hint_zh": "中文提示",
  "test_assertions": "assert two_sum([2,7,11,15], 9) == [0,1]"
}
```

### Pull Request Workflow

1. Fork this repo
2. Add your problem to the appropriate category JSON file
3. Test locally by opening `index.html`
4. Open a PR with problem description

### Quality Standards

- ✅ Clear, unambiguous problem descriptions
- ✅ Complete test cases covering edge cases
- ✅ Natural, non-machine-translated EN/ZH text
- ✅ Reasonable difficulty (Easy ≤ 15 lines, Medium ≤ 30, Hard ≤ 50)

---

## 📦 Deployment

DevQuiz is a fully static app — no build step required.

| Platform | How |
|----------|-----|
| GitHub Pages | Push → Settings → Pages → Save |
| Vercel | `vercel --prod` |
| Netlify | Drag folder to netlify.com/drop |
| Any HTTP server | `python -m http.server` |

### Browser Support

- ✅ Chrome 89+, Firefox 88+, Safari 15+, Edge 89+
- ✅ Mobile browsers (tablet/phone)

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
