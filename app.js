/**
 * DevQuiz — Main Application Logic
 * Zero-dependency SPA for browser-based Python coding challenges
 */

import { initPyodide, runCode, runWithTests, pyodideReady } from './runner.js';

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  questions: [],          // All loaded questions
  filteredQuestions: [], // After filter
  currentIndex: 0,       // Active question index in filteredQuestions
  currentLang: 'en',     // 'en' | 'zh'
  currentTab: 'all',     // 'all' | 'algorithms' | 'python' | 'datastructures' | 'web'
  currentFilter: 'all',   // 'all' | 'easy' | 'medium' | 'hard'
  theme: 'light',
  solvedSet: new Set(),  // Set of solved question IDs
  editor: null,          // CodeMirror instance
  pyodideStatus: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
  hintVisible: false,
  i18n: {},
};

// ── I18n ──────────────────────────────────────────────────────────────────────
async function loadI18n(lang) {
  try {
    const res = await fetch(`./i18n/${lang}.json`);
    state.i18n = await res.json();
    state.currentLang = lang;
  } catch {
    // Fallback to embedded
    state.i18n = state.currentLang === 'zh' ? zhCN : en;
  }
  t('app_name') && renderApp();
  updateUITexts();
}

function t(key, params = {}) {
  let text = state.i18n[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// ── Load Questions ────────────────────────────────────────────────────────────
async function loadQuestions() {
  const categories = ['algorithms', 'python', 'datastructures', 'web'];
  const files = {
    algorithms: './questions/algorithms.json',
    python: './questions/python.json',
    datastructures: './questions/datastructures.json',
    web: './questions/web.json',
  };

  for (const cat of categories) {
    try {
      const res = await fetch(files[cat]);
      if (res.ok) {
        const qs = await res.json();
        qs.forEach((q) => (q.category = cat));
        state.questions.push(...qs);
      }
    } catch (e) {
      console.warn(`Failed to load ${cat} questions:`, e);
    }
  }

  loadSolvedProgress();
  applyFilters();
  renderQuestionList();
  if (state.filteredQuestions.length > 0) {
    selectQuestion(0);
  }
}

function applyFilters() {
  state.filteredQuestions = state.questions.filter((q) => {
    const catMatch = state.currentTab === 'all' || q.category === state.currentTab;
    const diffMatch = state.currentFilter === 'all' || q.difficulty === state.currentFilter;
    return catMatch && diffMatch;
  });
  updateProgressBar();
}

// ── Theme ─────────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('dq_theme');
  if (saved) {
    state.theme = saved;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    state.theme = 'dark';
  }
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('dq_theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
}

// ── Progress ──────────────────────────────────────────────────────────────────
function loadSolvedProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem('dq_solved') || '[]');
    state.solvedSet = new Set(saved);
  } catch {}
}

function markSolved(qid) {
  state.solvedSet.add(qid);
  localStorage.setItem('dq_solved', JSON.stringify([...state.solvedSet]));
  updateProgressBar();
  renderQuestionList();
}

function updateProgressBar() {
  const total = state.questions.length;
  const solved = state.solvedSet.size;
  const fill = document.querySelector('.progress-bar-fill');
  const text = document.querySelector('.progress-text');
  if (fill) fill.style.width = total > 0 ? `${(solved / total) * 100}%` : '0%';
  if (text) text.textContent = `${solved} / ${total} ${t('label_questions')} ${t('label_progress').toLowerCase()}`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loading-overlay" style="display:none">
      <div class="loading-spinner"></div>
      <div class="loading-text" id="loading-text">${t('output_placeholder')}</div>
    </div>

    <!-- Pyodide Banner -->
    <div class="pyodide-banner" id="pyodide-banner">Loading Python engine (first load ~10s)...</div>

    <!-- Header -->
    <header class="header">
      <div class="header-brand">
        <span class="header-logo">🏋️</span>
        <div>
          <div class="header-title">${t('app_name')}</div>
          <div class="header-tagline">${t('tagline')}</div>
        </div>
      </div>
      <div class="header-actions">
        <button class="header-btn" id="btn-lang" title="Switch Language">
          <span>🌐</span>
          <span id="lang-label">${t('btn_lang')}</span>
        </button>
        <button class="header-btn" id="btn-theme" title="${t('btn_theme')}">
          <span id="theme-icon">🌙</span>
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="filter-bar">
            <button class="filter-btn active" data-filter="all">${t('filter_all')}</button>
            <button class="filter-btn" data-filter="easy">${t('filter_easy')}</button>
            <button class="filter-btn" data-filter="medium">${t('filter_medium')}</button>
            <button class="filter-btn" data-filter="hard">${t('filter_hard')}</button>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:0%"></div>
            </div>
            <div class="progress-text">0 / 0 ${t('label_questions')}</div>
          </div>
        </div>

        <div class="tab-bar">
          <button class="tab-btn active" data-tab="all">${t('tab_all')}</button>
          <button class="tab-btn" data-tab="algorithms">${t('tab_algorithms')}</button>
          <button class="tab-btn" data-tab="python">${t('tab_python')}</button>
          <button class="tab-btn" data-tab="datastructures">${t('tab_datastructures')}</button>
          <button class="tab-btn" data-tab="web">${t('tab_web')}</button>
        </div>

        <div class="question-list" id="question-list"></div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="workspace" id="workspace">
          <!-- Problem Panel -->
          <div class="problem-panel" id="problem-panel">
            <div class="empty-state" id="empty-state">
              <div class="empty-icon">🏋️</div>
              <div class="empty-title">${t('no_questions')}</div>
              <div class="empty-desc">Try changing the filter or category above.</div>
            </div>
          </div>

          <!-- Editor Panel -->
          <div class="editor-panel" id="editor-panel">
            <div class="editor-header">
              <div class="editor-tabs">
                <button class="editor-tab active" id="tab-code">Python</button>
              </div>
              <div class="editor-actions">
                <button class="editor-btn" id="btn-reset">${t('btn_reset')}</button>
                <button class="editor-btn" id="btn-hint">${t('btn_hint')}</button>
                <button class="editor-btn" id="btn-run">${t('btn_run')}</button>
                <button class="editor-btn primary" id="btn-tests">${t('btn_tests')}</button>
              </div>
            </div>

            <div id="editor-mount" style="flex:1;overflow:hidden;min-height:0;"></div>

            <!-- Output -->
            <div class="output-panel">
              <div class="output-header">
                <span class="output-title" id="output-title">${t('panel_output')}</span>
                <span id="result-badge"></span>
              </div>
              <div class="output-body" id="output-body">
                ${t('output_placeholder')}
              </div>
            </div>

            <!-- Navigation -->
            <div class="nav-buttons">
              <button class="nav-btn" id="btn-prev" disabled>
                <span>←</span> ${t('btn_prev')}
              </button>
              <button class="nav-btn" id="btn-next" disabled>
                ${t('btn_next')} <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  attachEventListeners();
  updateProgressBar();
}

function renderQuestionList() {
  const list = document.getElementById('question-list');
  if (!list) return;

  if (state.filteredQuestions.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding:40px"><div class="empty-icon">🔍</div><div class="empty-desc">${t('no_questions')}</div></div>`;
    return;
  }

  list.innerHTML = state.filteredQuestions
    .map((q, i) => {
      const title = state.currentLang === 'zh' ? q.title_zh : q.title;
      const solved = state.solvedSet.has(q.id);
      return `
      <div class="question-item${state.currentIndex === i ? ' active' : ''}" data-index="${i}">
        <div class="question-item-header">
          <span class="question-item-title">${title}</span>
          ${solved ? '<span class="question-item-solved">✅</span>' : ''}
        </div>
        <div class="question-item-meta">
          <span class="difficulty-badge ${q.difficulty}">${t('filter_' + q.difficulty)}</span>
          <span class="question-tag">${q.category}</span>
        </div>
      </div>
    `;
    })
    .join('');

  list.querySelectorAll('.question-item').forEach((el) => {
    el.addEventListener('click', () => {
      selectQuestion(parseInt(el.dataset.index));
    });
  });
}

function selectQuestion(index) {
  if (index < 0 || index >= state.filteredQuestions.length) return;

  state.currentIndex = index;
  state.hintVisible = false;

  // Update active state in list
  document.querySelectorAll('.question-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  const q = state.filteredQuestions[index];
  const title = state.currentLang === 'zh' ? q.title_zh : q.title;
  const description = state.currentLang === 'zh' ? q.description_zh : q.description;
  const hint = state.currentLang === 'zh' ? q.hint_zh : q.hint;

  // Render problem panel
  const panel = document.getElementById('problem-panel');
  panel.innerHTML = `
    <div class="problem-title">${title}</div>
    <div class="problem-meta">
      <span class="difficulty-badge ${q.difficulty}">${t('filter_' + q.difficulty)}</span>
      ${(q.tags || []).map((tag) => `<span class="question-tag">#${tag}</span>`).join(' ')}
    </div>
    <div class="problem-description">${description}</div>

    <div class="problem-section-title">${t('panel_code')} — Starter Code</div>
    <div class="starter-code-block">${escapeHtml(q.starter_code)}</div>

    <div class="hint-box${state.hintVisible ? ' visible' : ''}" id="hint-box">
      <div class="hint-title">${t('hint_title')}</div>
      <div class="hint-content">${hint || t('hint_unavailable')}</div>
    </div>
  `;

  // Set editor code
  if (state.editor) {
    state.editor.dispatch({
      changes: { from: 0, to: state.editor.state.doc.length, insert: q.starter_code },
    });
  }

  // Reset output
  const outputBody = document.getElementById('output-body');
  if (outputBody) outputBody.textContent = t('output_placeholder');
  const resultBadge = document.getElementById('result-badge');
  if (resultBadge) resultBadge.innerHTML = '';

  // Update nav buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) btnPrev.disabled = index === 0;
  if (btnNext) btnNext.disabled = index === state.filteredQuestions.length - 1;
}

function updateUITexts() {
  // Update all text elements that use data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  // Update lang label
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = t('btn_lang');

  // Update theme icon
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';

  // Update progress
  updateProgressBar();
}

// ── Editor ────────────────────────────────────────────────────────────────────
async function initEditor() {
  // Load CodeMirror from CDN
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/view@6/dist/index.mjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/state@6/dist/index.mjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/language@6/dist/index.mjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/commands@6/dist/index.mjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/lang-python@6/dist/index.mjs');
  await loadScript('https://cdn.jsdelivr.net/npm/@codemirror/theme-one-dark@6/dist/index.cjs');

  const { EditorState } = await import('https://cdn.jsdelivr.net/npm/@codemirror/state@6/dist/index.mjs');
  const { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, dropCursor } = await import('https://cdn.jsdelivr.net/npm/@codemirror/view@6/dist/index.mjs');
  const { defaultKeymap, historyKeymap, history, indentWithTab } = await import('https://cdn.jsdelivr.net/npm/@codemirror/commands@6/dist/index.mjs');
  const { python } = await import('https://cdn.jsdelivr.net/npm/@codemirror/lang-python@6/dist/index.mjs');
  const { oneDark } = await import('https://cdn.jsdelivr.net/npm/@codemirror/theme-one-dark@6/dist/index.cjs');

  const isDark = state.theme === 'dark';
  const extensions = [
    lineNumbers(),
    highlightActiveLine(),
    history(),
    drawSelection(),
    dropCursor(),
    python(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': { height: '100%', fontSize: '13px' },
      '.cm-scroller': { fontFamily: 'var(--font-mono)', overflow: 'auto' },
      '.cm-content': { padding: '12px 0' },
      '.cm-gutters': { background: 'var(--bg-tertiary)', borderRight: '1px solid var(--border-color)', color: 'var(--text-muted)' },
      '.cm-activeLine': { backgroundColor: 'rgba(99,102,241,0.05)' },
      '.cm-activeLineGutter': { backgroundColor: 'rgba(99,102,241,0.1)' },
    }),
  ];

  if (isDark) extensions.push(oneDark);

  const editorEl = document.getElementById('editor-mount');
  state.editor = new EditorView({
    state: EditorState.create({
      doc: '# Welcome to DevQuiz!\n# Select a question from the left panel\n',
      extensions,
    }),
    parent: editorEl,
  });
}

function updateEditorTheme() {
  // Re-create editor with new theme — simplest approach for theme toggle
  const code = state.editor ? state.editor.state.doc.toString() : '';
  state.editor.destroy();
  initEditor().then(() => {
    if (state.filteredQuestions[state.currentIndex]) {
      const q = state.filteredQuestions[state.currentIndex];
      state.editor.dispatch({
        changes: { from: 0, to: state.editor.state.doc.length, insert: q.starter_code },
      });
    }
  });
}

// ── Events ─────────────────────────────────────────────────────────────────────
function attachEventListeners() {
  // Language switch
  document.getElementById('btn-lang')?.addEventListener('click', async () => {
    const newLang = state.currentLang === 'en' ? 'zh' : 'en';
    await loadI18n(newLang);
    renderQuestionList();
    selectQuestion(state.currentIndex);
  });

  // Theme toggle
  document.getElementById('btn-theme')?.addEventListener('click', () => {
    toggleTheme();
    updateUITexts();
    updateEditorTheme();
  });

  // Difficulty filters
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
      renderQuestionList();
      if (state.filteredQuestions.length > 0) selectQuestion(0);
    });
  });

  // Category tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentTab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
      renderQuestionList();
      if (state.filteredQuestions.length > 0) selectQuestion(0);
    });
  });

  // Run code
  document.getElementById('btn-run')?.addEventListener('click', () => runUserCode(false));

  // Run tests
  document.getElementById('btn-tests')?.addEventListener('click', () => runUserCode(true));

  // Hint toggle
  document.getElementById('btn-hint')?.addEventListener('click', () => {
    state.hintVisible = !state.hintVisible;
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.classList.toggle('visible', state.hintVisible);
  });

  // Reset
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (!confirm(t('reset_confirm'))) return;
    const q = state.filteredQuestions[state.currentIndex];
    if (state.editor && q) {
      state.editor.dispatch({
        changes: { from: 0, to: state.editor.state.doc.length, insert: q.starter_code },
      });
    }
    const outputBody = document.getElementById('output-body');
    if (outputBody) outputBody.textContent = t('output_placeholder');
    document.getElementById('result-badge').innerHTML = '';
  });

  // Prev / Next
  document.getElementById('btn-prev')?.addEventListener('click', () => selectQuestion(state.currentIndex - 1));
  document.getElementById('btn-next')?.addEventListener('click', () => selectQuestion(state.currentIndex + 1));
}

// ── Code Execution ──────────────────────────────────────────────────────────────
async function runUserCode(runTests) {
  const code = state.editor ? state.editor.state.doc.toString() : '';
  const q = state.filteredQuestions[state.currentIndex];
  if (!q) return;

  const outputBody = document.getElementById('output-body');
  const resultBadge = document.getElementById('result-badge');
  const outputTitle = document.getElementById('output-title');

  outputTitle.textContent = runTests ? t('panel_result') : t('panel_output');
  outputBody.textContent = 'Running...\n';

  // Wait for Pyodide
  if (!state.pyodideStatus === 'ready') {
    await initPyodide((status, msg) => {
      document.getElementById('loading-overlay').style.display = 'flex';
      document.getElementById('loading-text').textContent = msg;
    });
    document.getElementById('loading-overlay').style.display = 'none';
  }

  let result;
  if (runTests) {
    result = await runWithTests(code, q.test_assertions, (out) => {
      outputBody.textContent = out;
    });
  } else {
    result = await runCode(code, (out) => {
      outputBody.textContent = out;
    });
  }

  // Update result badge
  if (runTests && result.testResults && result.testResults.length > 0) {
    const tr = result.testResults[0];
    if (tr.passed) {
      resultBadge.innerHTML = `<span class="result-badge correct">✅ ${t('status_correct')}</span>`;
      markSolved(q.id);
      renderQuestionList();
    } else {
      resultBadge.innerHTML = `<span class="result-badge error">❌ ${tr.error ? formatErrorShort(tr.error) : t('status_error')}</span>`;
    }
  } else if (!result.success) {
    resultBadge.innerHTML = `<span class="result-badge error">⚠️ ${t('status_error')}</span>`;
  } else {
    resultBadge.innerHTML = `<span class="result-badge correct">✅ ${t('status_partial')}</span>`;
  }
}

// ── Utilities ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatErrorShort(err) {
  const lines = String(err).split('\n');
  return lines[lines.length - 1] || 'Error';
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed: ${src}`));
    document.head.appendChild(script);
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap() {
  initTheme();
  await loadI18n('en');
  renderApp();
  await initEditor();
  await loadQuestions();

  // Init Pyodide in background
  initPyodide((status, msg) => {
    state.pyodideStatus = status;
    const banner = document.getElementById('pyodide-banner');
    if (banner) {
      if (status === 'loading') {
        banner.textContent = '⬇️ Loading Python engine...';
        banner.classList.add('visible');
      } else if (status === 'ready') {
        banner.textContent = '✅ Python engine ready!';
        setTimeout(() => banner.classList.remove('visible'), 3000);
      } else if (status === 'error') {
        banner.textContent = '⚠️ Python engine failed to load. Check your internet connection.';
        banner.style.background = '#f59e0b';
      }
    }
  });
}

bootstrap();
