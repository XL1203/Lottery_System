<template>
  <div class="relative w-full h-full flex flex-col items-center overflow-hidden">
    
    <!-- Universe Background -->
    <div class="galaxy-bg">
      <div class="stars"></div>
      <div class="twinkling"></div>
      <div class="clouds"></div>
      <div v-if="store.isDrawing" class="warp-speed">
         <div v-for="n in 20" :key="n" class="warp-star" :style="{ '--angle': n * 18 + 'deg', 'animation-delay': Math.random() + 's' }"></div>
      </div>
    </div>

    <!-- Top Info Bar -->
    <div class="relative z-20 w-full p-6 flex justify-between items-start pointer-events-none">
       <div class="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left pointer-events-auto">
          <div class="text-blue-400 text-sm font-bold tracking-widest uppercase mb-1">Current Round</div>
          <div class="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
            {{ store.currentRound?.name || '准备就绪' }}
          </div>
          <div class="mt-2 text-white/60 text-sm flex gap-4">
            <span><i class="fas fa-users mr-1"></i> 参与: {{ store.remainingParticipants.length }}</span>
            <span><i class="fas fa-gift mr-1"></i> 名额: {{ store.currentRound?.count }}</span>
          </div>
       </div>

       <div class="flex gap-2 pointer-events-auto">
          <button @click="store.prevRound" :disabled="store.currentRoundIndex === 0" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-all">
             <i class="fas fa-chevron-left"></i>
          </button>
          <div class="h-10 px-4 bg-white/10 rounded-full flex items-center text-white/80 font-mono">
             {{ store.currentRoundIndex + 1 }} / {{ store.rounds.length }}
          </div>
          <button @click="store.nextRound" :disabled="store.currentRoundIndex === store.rounds.length - 1" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-all">
             <i class="fas fa-chevron-right"></i>
          </button>
       </div>
    </div>

    <!-- 3D SPHERE CENTERPIECE -->
    <div class="flex-1 w-full relative perspective-container flex items-center justify-center z-10">
      
      <!-- If Winners exist for this round, show them in 3D Cards instead of sphere -->
      <div v-if="store.currentRoundWinners.length > 0 && !store.isDrawing" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 max-w-6xl z-30 animate-zoom-in">
         <div 
           v-for="(winner, idx) in store.currentRoundWinners" 
           :key="winner.id"
           class="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 p-8 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(139,92,246,0.3)] transform hover:scale-105 transition-transform duration-500 group relative overflow-hidden"
           :style="{ animationDelay: idx * 0.1 + 's' }"
         >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
            <div class="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg mb-4 text-white font-bold">
               {{ idx + 1 }}
            </div>
            <div class="text-3xl md:text-4xl font-bold text-white truncate max-w-full tracking-wide">{{ winner.name }}</div>
            <div class="mt-2 text-purple-200 text-sm font-medium">{{ store.currentRound.name }} 获奖者</div>
         </div>
      </div>

      <!-- Otherwise Show The Sphere -->
      <div v-else class="scene-3d w-full h-full flex items-center justify-center">
        <div class="tag-cloud-container">
          <div 
            v-for="tag in tags" 
            :key="tag.id"
            class="tag-element font-bold transition-colors duration-300"
            :style="{
              transform: `translate3d(${tag.x}px, ${tag.y}px, ${tag.z}px) translate(-50%, -50%) scale(${tag.scale})`,
              opacity: tag.opacity,
              zIndex: tag.zIndex,
              color: store.isDrawing ? '#60a5fa' : (tag.z > 0 ? '#fff' : '#94a3b8'),
              fontSize: store.isDrawing ? '14px' : '18px',
              textShadow: tag.z > 0 ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
            }"
          >
            <span v-if="tag.z > -100">{{ tag.text }}</span>
            <span v-else class="w-2 h-2 bg-blue-500/50 rounded-full block"></span> <!-- Optimize distant dots -->
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Controls -->
    <div class="relative z-20 pb-12 pt-4">
      
      <!-- Start Button -->
      <button 
        v-if="!store.isDrawing && store.currentRoundWinners.length === 0"
        @click="startLottery"
        class="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105"
      >
        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 group-hover:opacity-100 blur-md transition-opacity"></div>
        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 border border-white/30 rounded-full"></div>
        <span class="relative text-2xl font-black text-white tracking-[0.2em] uppercase flex items-center gap-3">
           <i class="fas fa-rocket"></i> 启动抽奖
        </span>
      </button>

      <!-- Stop Button -->
      <button 
        v-if="store.isDrawing"
        @click="stopLottery"
        class="px-12 py-4 bg-red-600 rounded-full text-2xl font-black text-white tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:bg-red-500 hover:scale-105 transition-all animate-pulse"
      >
        停止
      </button>

      <!-- Result Controls -->
      <div v-if="store.currentRoundWinners.length > 0" class="flex gap-4">
         <button @click="handleReset" class="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold backdrop-blur">
           <i class="fas fa-undo mr-2"></i> 重抽
         </button>
         <button 
           v-if="store.currentRoundIndex < store.rounds.length - 1" 
           @click="store.nextRound" 
           class="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:scale-105 transition-transform"
         >
           下一轮 <i class="fas fa-arrow-right ml-2"></i>
         </button>
      </div>

    </div>
    
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useLotteryStore } from './store.js';
import confetti from 'canvas-confetti';

export default {
  setup() {
    const store = useLotteryStore();
    const containerRef = ref(null);
    const tags = ref([]);
    let animationFrameId;
    let rotationAxis = { x: 0, y: 0 };
    
    // Config
    const SPHERE_RADIUS = 300; 
    const BASE_SPEED = 0.002;
    const DRAW_SPEED = 0.15;
    
    // --- 3D MATH HELPERS ---
    
    const initSphere = () => {
      const list = store.remainingParticipants.length > 0 ? store.remainingParticipants : store.participants;
      const count = list.length;
      if (count === 0) return;

      const phi = Math.PI * (3 - Math.sqrt(5)); 

      tags.value = list.map((p, i) => {
        const y = 1 - (i / (count - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y); 
        const theta = phi * i; 

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        return {
          id: p.id,
          text: p.name,
          x: x * SPHERE_RADIUS,
          y: y * SPHERE_RADIUS,
          z: z * SPHERE_RADIUS,
          opacity: 1,
          scale: 1,
          visible: true
        };
      });
    };

    const rotatePoint = (x, y, z, angleX, angleY) => {
      let cos = Math.cos(angleY);
      let sin = Math.sin(angleY);
      let x1 = x * cos - z * sin;
      let z1 = z * cos + x * sin;

      cos = Math.cos(angleX);
      sin = Math.sin(angleX);
      let y1 = y * cos - z1 * sin;
      let z2 = z1 * cos + y * sin;

      return { x: x1, y: y1, z: z2 };
    };

    const animate = () => {
      const targetSpeed = store.isDrawing ? DRAW_SPEED : BASE_SPEED;
      
      if (rotationAxis.y < targetSpeed) rotationAxis.y += 0.001;
      else if (rotationAxis.y > targetSpeed) rotationAxis.y -= 0.005;

      rotationAxis.x = Math.sin(Date.now() * 0.001) * 0.001;

      tags.value.forEach(tag => {
        const r = rotatePoint(tag.x, tag.y, tag.z, rotationAxis.x, rotationAxis.y);
        tag.x = r.x;
        tag.y = r.y;
        tag.z = r.z;

        const scale = (tag.z + SPHERE_RADIUS * 2) / (SPHERE_RADIUS * 3) + 0.5;
        tag.scale = Math.max(0.1, scale);
        tag.opacity = (tag.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
        tag.zIndex = Math.floor(tag.z);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const startLottery = () => {
      if (store.remainingParticipants.length === 0) {
        alert("人员不足或已全部中奖！");
        return;
      }
      store.isDrawing = true;
    };

    const stopLottery = () => {
      store.isDrawing = false;
      pickWinners();
    };

    const pickWinners = () => {
      const count = Math.min(store.currentRound?.count || 1, store.remainingParticipants.length);
      const candidates = [...store.remainingParticipants];
      
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      
      const winners = candidates.slice(0, count);
      store.addWinners(store.currentRound.id, winners);
      
      const end = Date.now() + 3000;
      const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    };

    const handleReset = () => {
      if(confirm('重置本轮？')) {
        store.resetCurrentRound();
        nextTick(() => {
            initSphere(); 
        });
      }
    }

    watch(() => store.participants, initSphere, { deep: true });
    watch(() => store.remainingParticipants.length, initSphere);

    onMounted(() => {
      initSphere();
      animate();
    });

    onUnmounted(() => {
      cancelAnimationFrame(animationFrameId);
    });

    return { 
      store, tags, containerRef, 
      startLottery, stopLottery, handleReset,
      SPHERE_RADIUS 
    };
  }
}
</script>