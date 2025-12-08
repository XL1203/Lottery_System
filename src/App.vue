<template>
  <div class="flex h-full w-full bg-black relative">
    <Sidebar />
    <main class="flex-1 relative overflow-hidden bg-slate-900 shadow-inner">
      <keep-alive>
        <component 
          :is="currentComponent" 
          @notify="showNotification"
          @confirm="showConfirmDialog"
        />
      </keep-alive>
    </main>

    <!-- Global Toast Notification -->
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast">
        <div 
          v-for="note in notifications" 
          :key="note.id" 
          :class="[
            'pointer-events-auto px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-3 font-bold text-white transform transition-all duration-300',
            note.type === 'error' ? 'bg-red-500/80' : 'bg-green-500/80'
          ]"
        >
          <i :class="['fas', note.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle']"></i>
          <span>{{ note.message }}</span>
        </div>
      </transition-group>
    </div>

    <!-- Global Confirmation Modal -->
    <div v-if="dialog.visible" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-zoom-in">
        <h3 class="text-xl font-black text-slate-800 mb-2">{{ dialog.title }}</h3>
        <p class="text-slate-600 mb-6 font-medium">{{ dialog.message }}</p>
        <div class="flex gap-3 justify-end">
          <button @click="dialog.visible = false" class="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">取消</button>
          <button @click="handleConfirm" class="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">确认</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, defineAsyncComponent, ref } from 'vue';
import { useLotteryStore } from '../store/index';
import Sidebar from './components/Sidebar.vue';

const SetupView = defineAsyncComponent(() => import('./views/SetupView.vue'));
const LotteryView = defineAsyncComponent(() => import('./views/LotteryView.vue'));

export default {
  components: { Sidebar, SetupView, LotteryView },
  setup() {
    const store = useLotteryStore();
    const currentComponent = computed(() => {
      return store.currentView === 'setup' ? 'SetupView' : 'LotteryView';
    });

    const notifications = ref([]);
    const showNotification = ({ type = 'success', message }) => {
      const id = Date.now();
      notifications.value.push({ id, type, message });
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
      }, 3000);
    };

    const dialog = ref({ visible: false, title: '', message: '', onConfirm: null });
    const showConfirmDialog = ({ title, message, onConfirm }) => {
      dialog.value = { visible: true, title, message, onConfirm };
    };
    const handleConfirm = () => {
      if (dialog.value.onConfirm) dialog.value.onConfirm();
      dialog.value.visible = false;
    };

    return { store, currentComponent, notifications, showNotification, dialog, showConfirmDialog, handleConfirm };
  }
}
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>
