/**
 * DevQuiz Runner — Pyodide code execution engine
 * Runs Python code in the browser using WebAssembly
 */

let pyodide = null;
let pyodideLoading = false;
let pyodideReady = false;

// CDN URL for Pyodide
const PYODIDE_VERSION = '0.26.4';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/**
 * Initialize Pyodide — called once when the app loads
 */
async function initPyodide(onProgress) {
  if (pyodideReady) return true;
  if (pyodideLoading) {
    // Wait for existing load
    while (pyodideLoading) await sleep(200);
    return pyodideReady;
  }

  pyodideLoading = true;

  try {
    if (onProgress) onProgress('loading', 'Loading Python runtime...');

    // Dynamically load Pyodide loader
    if (!window.loadPyodide) {
      await loadScript(PYODIDE_CDN + 'pyodide.js');
    }

    if (onProgress) onProgress('loading', 'Initializing Python...');

    pyodide = await window.loadPyodide({
      indexURL: PYODIDE_CDN,
    });

    // Pre-install a few packages users commonly need
    if (onProgress) onProgress('loading', 'Installing packages...');
    try {
      await pyodide.loadPackagesFromImports('collections');
    } catch (e) {
      // Some stdlib imports may fail silently, that's ok
    }

    pyodideReady = true;
    if (onProgress) onProgress('ready', 'Python ready!');
    return true;
  } catch (err) {
    console.error('Pyodide init failed:', err);
    pyodideLoading = false;
    throw err;
  }
}

/**
 * Execute user code and return the output
 * @param {string} code - Python source code
 * @param {function} onOutput - callback(output: string)
 * @returns {object} { success, output, error }
 */
async function runCode(code, onOutput) {
  if (!pyodideReady) {
    return { success: false, output: '', error: 'Python runtime not ready. Please wait.' };
  }

  let outputBuffer = '';
  const appendOutput = (text) => {
    outputBuffer += text + '\n';
    if (onOutput) onOutput(outputBuffer);
  };

  try {
    // Redirect stdout
    pyodide.setStdout({
      batched: (text) => appendOutput(text),
    });
    pyodide.setStderr({
      batched: (text) => appendOutput('[stderr] ' + text),
    });

    await pyodide.runPythonAsync(code);

    return { success: true, output: outputBuffer, error: null };
  } catch (err) {
    const errorMsg = formatPythonError(err);
    appendOutput('\n[Error] ' + errorMsg);
    return { success: false, output: outputBuffer, error: errorMsg };
  }
}

/**
 * Run code + test assertions in a sandboxed namespace
 * Returns { success, output, testResults }
 */
async function runWithTests(code, testCode, onOutput) {
  if (!pyodideReady) {
    return { success: false, output: '', testResults: [], error: 'Python runtime not ready.' };
  }

  let outputBuffer = '';
  const appendOutput = (text) => {
    outputBuffer += text + '\n';
    if (onOutput) onOutput(outputBuffer);
  };

  try {
    pyodide.setStdout({ batched: (t) => appendOutput(t) });
    pyodide.setStderr({ batched: (t) => appendOutput('[stderr] ' + t) });

    // Run user code first
    await pyodide.runPythonAsync(code);

    // Capture test results
    const testResults = [];
    if (testCode && testCode.trim()) {
      try {
        // Inject test execution helper
        const testRunner = `
_test_output = []
_test_failed = False
import sys
from io import StringIO as _StringIO

class _TestCapture:
    def __init__(self):
        self._old = sys.stdout
        self._buf = _StringIO()

    def __enter__(self):
        sys.stdout = self._buf
        return self

    def __exit__(self, *args):
        global _test_output, _test_failed
        sys.stdout = self._old
        captured = self._buf.getvalue()
        _test_output.append(captured)
        if _test_failed:
            _test_output.append('  ^ Test failed above')

_test_failed = False
def _assert(condition, msg=''):
    global _test_failed
    if not condition:
        _test_failed = True
        raise AssertionError(msg or 'Assertion failed')

# Re-export assert for convenience
assert = _assert
`;
        await pyodide.runPythonAsync(testRunner);
        await pyodide.runPythonAsync(testCode);
        testResults.push({ name: 'all', passed: !pyodide.globals.get('_test_failed'), output: pyodide.globals.get('_test_output').toJs().join('') });
      } catch (testErr) {
        testResults.push({ name: 'tests', passed: false, error: formatPythonError(testErr) });
      }
    }

    return { success: true, output: outputBuffer, testResults, error: null };
  } catch (err) {
    const errorMsg = formatPythonError(err);
    return { success: false, output: outputBuffer, testResults: [{ name: 'tests', passed: false, error: errorMsg }], error: errorMsg };
  }
}

/**
 * Format Python error traceback to be more readable
 */
function formatPythonError(err) {
  if (!err) return 'Unknown error';
  const msg = err.message || String(err);
  // Clean up Pyodide internal paths
  return msg
    .replace(/File "<exec>", /g, '  File "", ')
    .replace(/PYODIDE.*?\n/, '')
    .replace(/https:\/\/.*?\.js:\d+:\d+\n?/g, '')
    .trim();
}

// ── Utilities ──────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

export { initPyodide, runCode, runWithTests, pyodideReady, pyodideLoading };
