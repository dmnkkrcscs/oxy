const disposables = [];

export function registerDisposable(disposeFn) {
  disposables.push(disposeFn);
}

export function disposeAll() {
  while (disposables.length > 0) {
    const fn = disposables.pop();
    try { fn(); } catch { /* ignore cleanup errors */ }
  }
}
