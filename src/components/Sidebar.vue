<template>
  <div class="h-full w-20 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-6 z-50">
    <div class="mb-8 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
      <i class="fas fa-gem text-white"></i>
    </div>
    
    <div class="flex-1 space-y-4 w-full px-2">
      <div 
        v-for="item in menu" 
        :key="item.id"
        @click="store.currentView = item.id"
        :class="[
          'flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-300',
          store.currentView === item.id 
            ? 'bg-blue-600/80 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
            : 'text-white/40 hover:text-white hover:bg-white/10'
        ]"
      >
        <i :class="['fas text-xl mb-1', item.icon]"></i>
        <span class="text-[10px] scale-90">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useLotteryStore } from '../../store/index';

export default {
  setup() {
    const store = useLotteryStore();
    const menu = [
      { id: 'lottery', icon: 'fa-globe', label: '抽奖' },
      { id: 'setup', icon: 'fa-sliders-h', label: '设置' },
    ];
    return { store, menu };
  }
}
</script>
