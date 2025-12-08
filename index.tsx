import * as Vue from 'vue';
import * as Pinia from 'pinia';
import * as XLSX from 'xlsx';
import * as Confetti from 'canvas-confetti';
import * as Sortable from 'sortablejs';
import { loadModule } from 'vue3-sfc-loader';

const { createApp } = Vue;
const { createPinia } = Pinia;

const options = {
  moduleCache: {
    vue: Vue,
    pinia: Pinia,
    xlsx: XLSX,
    'canvas-confetti': Confetti,
    sortablejs: Sortable,
    './store.js': { 
       type: '.mjs',
       getContentData: async (url) => {
         const res = await fetch(url);
         if (!res.ok) throw new Error(`File ${url} not found`);
         return res.text();
       }
    }
  },
  async getFile(url) {
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
    document.body.innerHTML = `<div style="color:red; padding:20px;">Failed to load app: ${err.message}</div>`;
  }
})();