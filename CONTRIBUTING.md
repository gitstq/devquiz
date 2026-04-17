# Contributing to DevQuiz

Thank you for your interest in contributing to DevQuiz! This guide covers everything you need to know.

## Ways to Contribute

### 🐛 Bug Reports
Open an issue with:
- Clear description of the bug
- Browser version and OS
- Steps to reproduce
- Expected vs actual behavior

### ✨ New Problems
The easiest way to contribute! See the format below.

### 📖 Documentation
Improvements to README, translations, or this guide are always welcome.

### 💻 Code Improvements
- UI/UX enhancements
- Performance improvements
- New features (open an issue first to discuss)

## Problem Format

Add new problems to the appropriate JSON file in `questions/`:

```json
{
  "id": "your_category_001",
  "title": "Problem Title in English",
  "title_zh": "題目中文名稱",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2"],
  "description": "Full problem description in English.",
  "description_zh": "完整中文題目描述。",
  "starter_code": "def function_name():\n    # Your code here\n    pass",
  "solution": "Correct implementation",
  "hint": "Hint in English",
  "hint_zh": "中文提示",
  "test_assertions": "assert function_name() == expected"
}
```

## Quality Checklist

Before submitting a new problem:
- [ ] Problem description is clear and unambiguous
- [ ] Test cases cover normal + edge cases
- [ ] Starter code compiles without errors
- [ ] English and Chinese text are natural (not machine-translated)
- [ ] Difficulty rating is appropriate (Easy ≤ 15 lines, Medium ≤ 30, Hard ≤ 50)
- [ ] Problem does not use copyrighted material

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b problem/my-new-problem`
3. Add your problem(s)
4. Test locally: open `index.html` in your browser
5. Commit with conventional commit message (see below)
6. Push and open a Pull Request

## Commit Message Format

We follow [Angular Commit Convention](https://www.conventionalcommits.org/):

```
feat: add Two Sum problem
fix: resolve editor initialization on Firefox
docs: add troubleshooting section to README
refactor: improve test runner error handling
```

## Questions?

Open an issue — we're happy to help!
