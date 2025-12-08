import * as Vue from 'vue';
import * as Pinia from 'pinia';
import * as XLSX from 'xlsx';
import { loadModule } from 'vue3-sfc-loader';

const { createApp } = Vue;
const { createPinia } = Pinia;

const options = {
  moduleCache: {
    vue: Vue,
    pinia: Pinia,
    xlsx: XLSX,
  },
  async getFile(url) {
    // --- Standard File Loading ---
    const res = await fetch(url);
    if (!res.ok) throw new Error(`File ${url} not found`);
    return {
      type: url.endsWith('.vue') ? '.vue' : '.mjs',
      getContentData: (asBinary) => asBinary ? res.arrayBuffer() : res.text(),
    };
  },
  addStyle(textContent) {
    const style = document.createElement('style');
    style.textContent = textContent;
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
};

(async () => {
  try {
    const App = await loadModule('./App.vue', options);
    const app = createApp(App);
    app.use(createPinia());
    app.mount('#app');
  } catch (err) {
    console.error('Failed to load Vue app:', err);
    document.body.innerHTML = `
      <div style="color: #ff6b6b; padding: 20px; font-family: monospace; background: #1a1a1a; height: 100vh;">
        <h3>Application Error</h3>
        <pre>${err.message}</pre>
        <p>Check console for details.</p>
      </div>
    `;
  }
})();