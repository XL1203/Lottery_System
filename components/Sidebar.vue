<template>
  <div class="h-full w-20 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 z-50 shadow-2xl">
    <!-- Logo / Brand -->
    <div class="mb-10 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
      <i class="fas fa-meteor text-white text-xl animate-pulse"></i>
    </div>
    
    <!-- Menu Items -->
    <div class="flex-1 w-full px-3 space-y-6">
      <div 
        v-for="item in menu" 
        :key="item.id"
        @click="store.currentView = item.id"
        :class="[
          'flex flex-col items-center justify-center py-3 rounded-xl cursor-pointer transition-all duration-300 group',
          store.currentView === item.id 
            ? 'bg-white/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-500/30' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        ]"
      >
        <i :class="['fas text-xl mb-1 transition-transform group-hover:-translate-y-1', item.icon]"></i>
        <span class="text-[10px] font-medium tracking-wide">{{ item.label }}</span>
      </div>
    </div>
    
    <!-- Bottom Info -->
    <div class="text-xs text-slate-600 font-mono mb-2">v3.0</div>
  </div>
</template>

<script>
import { useLotteryStore } from '../store/index.js';

export default {
  setup() {
    const store = useLotteryStore();
    const menu = [
      { id: 'lottery', icon: 'fa-globe-asia', label: '抽奖' },
      { id: 'setup', icon: 'fa-cogs', label: '设置' },
    ];
    return { store, menu };
  }
}
</script>