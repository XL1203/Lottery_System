
<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden scene-container select-none bg-black">
    
    <!-- Background Layers -->
    <div class="galaxy-bg"></div>
    <div class="stars"></div>
    <div class="twinkling"></div>
    
    <!-- Top Info Bar (Compact on Mobile) -->
    <div class="absolute top-0 left-0 w-full p-4 md:p-8 z-30 flex justify-between items-start pointer-events-none">
      <div class="pointer-events-auto backdrop-blur-md bg-black/40 border border-white/10 p-3 md:p-6 rounded-2xl shadow-2xl transform transition hover:scale-105 group max-w-[60%]">
        <h2 class="text-blue-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2 group-hover:text-blue-300 transition-colors">Current Mission</h2>
        <div class="text-2xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] font-sans truncate">
          {{ store.currentRound?.name || '等待开始' }}
        </div>
        <div class="mt-2 md:mt-3 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-medium text-slate-300">
          <span class="bg-white/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/5"><i class="fas fa-users mr-1 text-blue-400"></i>{{ store.remainingParticipants.length }}</span>
          <span class="bg-white/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/5"><i class="fas fa-gift mr-1 text-purple-400"></i>{{ store.currentRound?.count }}</span>
        </div>
      </div>
    </div>

    <!-- 3D Tag Cloud Container -->
    <div class="absolute top-1/2 left-1/2 w-0 h-0 transform -translate-x-1/2 -translate-y-1/2 z-10 perspective-[1000px]" ref="cloudRef">
      <div 
        v-for="tag in tags" 
        :key="tag.id"
        class="absolute top-0 left-0 whitespace-nowrap font-bold font-mono transition-colors duration-200 flex items-center justify-center pointer-events-none will-change-transform"
        :style="{
          transform: `translate3d(${tag.x}px, ${tag.y}px, ${tag.z}px) translate(-50%, -50%) scale(${tag.scale})`,
          opacity: tag.opacity,
          zIndex: tag.zIndex,
          color: store.isDrawing ? '#ffffff' : (tag.active ? tag.color : '#475569'),
          fontSize: tag.fontSize,
          textShadow: tag.active ? `0 0 10px ${tag.color}, 0 0 20px ${tag.color}` : 'none',
          filter: tag.active ? 'blur(0px)' : 'blur(1.5px)'
        }"
      >
        {{ tag.text }}
      </div>
    </div>

    <!-- 3D Winners Overlay (Responsive & Scrollable) -->
    <div v-if="store.currentRoundWinners.length > 0 && !store.isDrawing" class="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl overflow-y-auto custom-scrollbar overscroll-contain">
      
      <div class="min-h-full w-full flex flex-col items-center pt-16 md:pt-20 pb-64 px-2 md:px-6">
        
        <!-- Round Title Header -->
        <div class="mb-8 md:mb-12 text-center animate-slide-down shrink-0">
           <div class="text-cyan-400 font-bold tracking-[0.5em] uppercase mb-2 text-[10px] md:text-sm font-mono shadow-cyan-500/50">Lottery Results</div>
           <h1 class="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">
              {{ store.currentRound?.name }}
           </h1>
        </div>

        <!-- Winners Grid (Tech Style) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full max-w-[1600px]">
          <div 
            v-for="(winner, idx) in store.currentRoundWinners" 
            :key="winner.id"
            class="group relative h-24 md:h-32 animate-card-entry perspective"
            :style="{ animationDelay: idx * 0.04 + 's' }"
          >
            <!-- Animated Glowing Border -->
            <div class="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-pulse"></div>
            
            <!-- Card Body -->
            <div class="absolute inset-[1px] bg-slate-950 rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/5">
                
                <!-- Grid Background -->
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#60a5fa 1px, transparent 1px); background-size: 8px 8px;"></div>
                
                <!-- Corner Accents -->
                <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-sm"></div>
                <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-sm"></div>
                <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500/80 rounded-bl-sm"></div>
                <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500/80 rounded-br-sm"></div>

                <!-- Rank Number -->
                <div class="absolute top-1.5 right-2 text-[8px] md:text-[10px] font-mono text-cyan-500/60 tracking-widest group-hover:text-cyan-400 transition-colors">
                    NO.{{ String(idx + 1).padStart(2, '0') }}
                </div>

                <!-- Name -->
                <div class="relative z-10 text-xl md:text-3xl font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] px-2 truncate w-full text-center group-hover:scale-110 transition-transform duration-300">
                    {{ winner.name }}
                </div>
                
                <!-- Shine Effect -->
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div class="absolute bottom-20 md:bottom-12 z-50 flex flex-col items-center gap-4 md:gap-6 w-full pointer-events-none">
       
       <div class="pointer-events-auto transform transition-transform hover:scale-105">
         
         <!-- STOP BUTTON -->
         <button 
            v-if="store.isDrawing"
            @click="stop"
            class="relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center cursor-pointer"
         >
             <div class="absolute inset-0 rounded-full bg-red-600 blur-xl opacity-50 animate-pulse"></div>
             <div class="relative w-full h-full rounded-full bg-gradient-to-b from-red-500 to-red-700 border-4 border-red-400/50 shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center">
                 <div class="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                 <span class="text-xl md:text-3xl font-black text-white tracking-widest drop-shadow-lg">STOP</span>
             </div>
         </button>

         <!-- START BUTTON -->
         <div 
            v-else-if="store.currentRoundWinners.length === 0"
            @click="start"
            class="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center cursor-pointer group"
         >
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-[spin_3s_linear_infinite] opacity-80 blur-md group-hover:blur-lg transition-all duration-500"></div>
            <div class="absolute inset-[3px] md:inset-[4px] rounded-full bg-black flex items-center justify-center z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                <div class="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
                <div class="flex flex-col items-center z-20">
                   <i class="fas fa-power-off text-blue-400 text-lg md:text-2xl mb-1 md:mb-2 opacity-80 group-hover:text-white transition-colors"></i>
                   <span class="text-2xl md:text-4xl font-black text-white italic tracking-[0.1em] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,1)] transition-all">START</span>
                </div>
            </div>
         </div>

         <!-- Result Actions -->
         <div v-else class="flex gap-3 animate-fade-in-up">
            <button @click="handleReset" class="px-5 py-3 md:px-8 md:py-4 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md font-bold border border-white/10 transition-all hover:border-white/30 cursor-pointer flex items-center shadow-lg text-sm md:text-base">
              <i class="fas fa-redo-alt mr-2 text-blue-400"></i> 重抽
            </button>
            <button 
              v-if="store.currentRoundIndex < store.rounds.length - 1"
              @click="store.nextRound"
              class="px-5 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all cursor-pointer flex items-center text-sm md:text-base"
            >
              下一轮 <i class="fas fa-arrow-right ml-2"></i>
            </button>
            
            <!-- EXPORT BUTTON -->
            <button 
              v-if="store.isAllFinished"
              @click="store.exportToExcel"
              class="px-5 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all cursor-pointer flex items-center text-sm md:text-base animate-pulse"
            >
              <i class="fas fa-file-excel mr-2"></i> 导出名单
            </button>
         </div>
       </div>

       <!-- Navigation Dots -->
       <div class="flex gap-2 pointer-events-auto bg-black/40 p-3 px-5 rounded-full backdrop-blur-md border border-white/5 items-center">
          <button 
            v-for="(r, i) in store.rounds" 
            :key="r.id"
            @click="store.currentRoundIndex = i"
            :class="['h-2 md:h-3 rounded-full transition-all duration-300', store.currentRoundIndex === i ? 'bg-blue-400 w-8 md:w-12 shadow-[0_0_10px_#60a5fa]' : 'bg-white/20 w-2 md:w-3 hover:bg-white/50 hover:w-5 cursor-pointer']"
            :title="r.name"
          ></button>
       </div>
    </div>

  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useLotteryStore } from '../store/index.js';

export default {
  emits: ['notify', 'confirm'],
  setup(props, { emit }) {
    const store = useLotteryStore();
    const tags = ref([]);
    let animationFrameId;
    let rotation = { x: 0, y: 0 };
    
    // Responsive configuration
    const isMobile = window.innerWidth < 768;
    const RADIUS = isMobile ? 180 : 380; 

    const neonColors = ['#0ea5e9', '#d946ef', '#8b5cf6', '#14b8a6', '#f43f5e', '#38bdf8', '#a78bfa'];

    const initTags = () => {
      const list = store.remainingParticipants.length > 0 ? store.remainingParticipants : store.participants;
      const count = list.length;
      if (count === 0) {
        tags.value = [];
        return;
      }
      
      const phi = Math.PI * (3 - Math.sqrt(5)); 

      tags.value = list.map((p, i) => {
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];

        return {
          id: p.id,
          text: p.name,
          color,
          x0: Math.cos(theta) * radiusAtY * RADIUS,
          y0: y * RADIUS,
          z0: Math.sin(theta) * radiusAtY * RADIUS,
          x: 0, y: 0, z: 0,
          scale: 1, opacity: 1, zIndex: 0, active: true,
          // Smaller font on mobile
          fontSize: isMobile ? '12px' : '24px',
        };
      });
    };

    const animate = () => {
      const speed = store.isDrawing ? 0.25 : 0.003; 
      rotation.y += speed;
      rotation.x = Math.sin(Date.now() * 0.0005) * 0.05; 

      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);

      tags.value.forEach(tag => {
        let x1 = tag.x0 * cosY - tag.z0 * sinY;
        let z1 = tag.z0 * cosY + tag.x0 * sinY;
        let y1 = tag.y0 * cosX - z1 * sinX;
        let z2 = z1 * cosX + tag.y0 * sinX;

        tag.x = x1;
        tag.y = y1;
        tag.z = z2;

        const scale = (z2 + RADIUS * 2) / (RADIUS * 2.5);
        tag.scale = Math.max(0.2, scale);
        tag.opacity = Math.max(0.15, (z2 + RADIUS) / (RADIUS * 2));
        tag.zIndex = Math.floor(z2);
        tag.active = z2 > 0;
        // Increase size when drawing
        const baseSize = isMobile ? 12 : 24;
        const drawSize = isMobile ? 10 : 18;
        tag.fontSize = (store.isDrawing ? drawSize : baseSize) + 'px';
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (store.remainingParticipants.length === 0) {
        emit('notify', { type: 'error', message: '无可抽奖人员' });
        return;
      }
      store.isDrawing = true;
    };

    const stop = () => {
      store.isDrawing = false;
      const count = Math.min(store.currentRound?.count || 1, store.remainingParticipants.length);
      const pool = [...store.remainingParticipants];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const winners = pool.slice(0, count);
      store.addWinners(store.currentRound.id, winners);
      fireConfetti();
    };

    const fireConfetti = () => {
      if (!window.confetti) return;
      const duration = 4000;
      const end = Date.now() + duration;
      const colors = ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#34d399'];
      (function frame() {
        window.confetti({ particleCount: 5, angle: 60, spread: 80, origin: { x: 0 }, colors });
        window.confetti({ particleCount: 5, angle: 120, spread: 80, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    };

    const handleReset = () => {
      emit('confirm', {
        title: '重置本轮？',
        message: '确认要重新抽取本轮奖项吗？当前中奖记录将被清除。',
        onConfirm: () => {
          store.resetCurrentRound();
          setTimeout(initTags, 100); 
          emit('notify', { type: 'success', message: '已重置，准备重新抽奖' });
        }
      });
    }

    watch(() => store.participants, initTags, { deep: true });
    watch(() => store.remainingParticipants.length, initTags);

    onMounted(() => {
      initTags();
      animate();
    });

    onUnmounted(() => cancelAnimationFrame(animationFrameId));

    return { store, tags, start, stop, handleReset };
  }
}
</script>

<style scoped>
.animate-slide-down { animation: slideDown 0.8s ease-out forwards; opacity: 0; transform: translateY(-20px); }
.animate-card-entry { animation: cardEntry 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: scale(0.8) translateY(50px); }
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
/* Custom Scrollbar for Overlay */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
@keyframes slideDown { to { opacity: 1; transform: translateY(0); } }
@keyframes cardEntry { to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
