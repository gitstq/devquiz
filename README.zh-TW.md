# 🏋️ DevQuiz — 全端開發者程式解題平台

[English](README.en.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.md)

---

## 🎉 專案介紹

**DevQuiz** 是一個無需帳號、開箱即用、完全可自託管的開發者程式解題平台。

在瀏覽器中直接編寫與執行 Python 程式碼，即時獲得回饋 —— 無需安裝任何軟體、無需設定任何環境、無需登入任何帳號。

### 🔥 核心價值

- ⚡ **零等待**：開啟瀏覽器即可開始寫程式
- 🔒 **完全離線**：Pyodide WebAssembly 引擎首次載入後可在離線環境執行
- 🌍 **雙語無縫切換**：繁體中文 / English 介面一鍵切換
- 📊 **進度本地儲存**：使用 localStorage 自動儲存解題進度
- 🎨 **現代化介面**：雙欄佈局、語法高亮、即時回饋、主題切換

---

## ✨ 核心功能

- 📚 **40+ 精選題目**：演算法（10題）、Python 進階（10題）、資料結構（5題）、網頁開發（5題）
- ⚡ **瀏覽器端即時執行**：使用 Pyodide WebAssembly 技術
- 🎯 **智慧測試用例**：完整斷言，即時回饋對錯
- 💡 **提示系統**：卡關時提供解題思路
- 🌙 **暗色/亮色主題**：保護視力，適應不同環境
- 🌍 **中英雙語**：介面與題目內容均支援 EN/ZH 切換
- 📊 **本地進度追蹤**：localStorage 自動記錄已解題目

---

## 🚀 快速開始

```bash
git clone https://github.com/gitstq/devquiz.git
cd devquiz
# 直接用瀏覽器開啟 index.html
```

### 環境需求

- 現代瀏覽器（Chrome 89+、Firefox 88+、Edge 89+、Safari 15+）
- 首次載入需網路連線（約下載 8MB 的 Pyodide Python 引擎）
- 無需安裝 Python、Node.js 或任何其他執行環境

---

## 📖 使用方式

1. **選擇題目**：在左側面板依分類或難度篩選，點擊題目卡進入
2. **撰寫程式**：在右側編輯器中補完函式實作
3. **執行測試**：點擊「執行測試」驗證程式是否正確
4. **查看提示**：點擊「提示」取得解題思路
5. **切換語言**：點擊右上角 🌐 按鈕切換 EN/ZH

---

## 💡 設計理念與路線圖

### 設計理念

**極簡主義 + 零門檻**：DevQuiz 相信好的學習工具應該零門檻。開啟瀏覽器就能寫程式 —— 不需要設定 conda、不需要理解虛擬環境、不需要註冊任何帳號。Pyodide 將完整的 CPython 執行環境編譯為 WebAssembly，讓瀏覽器成為最好的 Python IDE。

**在地優先**：所有資料都儲存在瀏覽器 localStorage 中，完全離線可用，無需後端服務。使用者資料永不離開設備。

### 路線圖

- [ ] **v1.1**：增加 JavaScript/TypeScript 執行支援
- [ ] **v1.2**：增加題目收藏與筆記功能
- [ ] **v2.0**：增加多人對戰模式（基於 WebRTC）
- [ ] **v2.1**：增加自訂題目匯入/匯出

---

## 🤝 貢獻指南

### 貢獻題目

題庫檔案位於 `questions/` 目錄。每道題目結構如下：

```json
{
  "id": "algo_001",
  "title": "Two Sum",
  "title_zh": "兩數之和",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "description": "英文題目描述",
  "description_zh": "繁體中文題目描述",
  "starter_code": "def two_sum(nums, target):\n    # Your code here\n    pass",
  "solution": "標準解答",
  "hint": "英文提示",
  "hint_zh": "繁體中文提示",
  "test_assertions": "assert two_sum([2,7,11,15], 9) == [0,1]"
}
```

### 提交流程

1. Fork 本倉庫
2. 在對應分類 JSON 檔案中新增題目
3. 本地測試：在瀏覽器中開啟 `index.html` 並驗證題目
4. 建立 Pull Request

---

## 📄 開源協議

本專案基於 [MIT License](LICENSE) 開源。
