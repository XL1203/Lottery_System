<template>
    <div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black">

        <!-- Universe Background -->
        <div class="galaxy-bg">
            <div class="stars"></div>
            <div class="twinkling"></div>
            <div class="clouds"></div>
            <div v-if="store.isDrawing" class="warp-speed">
                <div v-for="n in 20" :key="n" class="warp-star"
                     :style="{ '--angle': n * 18 + 'deg', 'animation-delay': Math.random() + 's' }"></div>
            </div>
        </div>

        <!-- Top Info Bar - Always visible -->
        <div class="absolute top-6 left-6 z-20 pointer-events-auto">
            <div class="bg-black/60 backdrop-blur-md border-2 border-cyan-500/30 rounded-xl p-4 min-w-[200px]">
                <div class="text-xs text-cyan-400 tracking-widest uppercase mb-1 font-bold">Current Mission</div>
                <div class="text-2xl font-black text-white mb-2">{{ store.currentRound?.name || '准备就绪' }}</div>
                <div class="flex gap-4 text-sm">
                    <div class="flex items-center gap-1">
                        <i class="fas fa-users text-cyan-400"></i>
                        <span class="text-white/80">{{ store.remainingParticipants.length }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="fas fa-gift text-cyan-400"></i>
                        <span class="text-white/80">{{ store.currentRound?.count || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3D SPHERE CENTERPIECE -->
        <div class="flex-1 w-full relative perspective-container flex items-start justify-center z-10 pt-4 pb-32">

            <!-- If Winners exist for this round, show them in 3D Cards instead of sphere -->
            <div v-if="store.currentRoundWinners.length > 0 && !store.isDrawing" class="w-full max-w-7xl px-8">
                <!-- Title -->
                <div class="text-center mb-8">
                    <div class="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Lottery Results</div>
                    <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 mb-3">
                        {{ store.currentRound.name }}
                    </h2>
                </div>

                <!-- Winner Cards Grid -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div
                            v-for="(winner, idx) in store.currentRoundWinners"
                            :key="winner.id"
                            class="relative group"
                            :style="{ animationDelay: idx * 0.05 + 's' }"
                    >
                        <!-- Card -->
                        <div class="relative bg-slate-900/80 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-4 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 animate-zoom-in">
                            <!-- Number Badge -->
                            <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg">
                                {{ idx + 1 }}
                            </div>

                            <!-- Winner Name -->
                            <div class="text-center">
                                <div class="text-xl font-bold text-white mb-1">{{ winner.name }}</div>
                                <div class="text-xs text-cyan-400/60">NO.{{ String(idx + 1).padStart(2, '0') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Otherwise Show The Sphere -->
            <div v-else class="scene-3d w-full h-full flex items-center justify-center">
                <!-- Orbit Rings -->
                <div class="orbit-ring"
                     style="width: 500px; height: 500px; left: 50%; top: 50%; margin-left: -250px; margin-top: -250px; animation-duration: 30s;"></div>
                <div class="orbit-ring"
                     style="width: 650px; height: 650px; left: 50%; top: 50%; margin-left: -325px; margin-top: -325px; animation-duration: 45s; animation-direction: reverse;"></div>
                <div class="orbit-ring"
                     style="width: 800px; height: 800px; left: 50%; top: 50%; margin-left: -400px; margin-top: -400px; animation-duration: 60s;"></div>

                <!-- Floating Particles -->
                <div v-for="n in 30" :key="`particle-${n}`"
                     class="particle"
                     :style="{
                         left: `${Math.random() * 100}%`,
                         top: `${Math.random() * 100}%`,
                         width: `${2 + Math.random() * 4}px`,
                         height: `${2 + Math.random() * 4}px`,
                         background: `radial-gradient(circle, ${['#06ffa5', '#00d4ff', '#8338ec', '#ff006e'][Math.floor(Math.random() * 4)]}, transparent)`,
                         '--tx': `${(Math.random() - 0.5) * 200}px`,
                         '--ty': `${(Math.random() - 0.5) * 200}px`,
                         animationDuration: `${10 + Math.random() * 20}s`,
                         animationDelay: `${Math.random() * 5}s`
                     }"
                ></div>

                <div class="tag-cloud-container">
                    <div
                            v-for="tag in tags"
                            :key="tag.id"
                            :class="['tag-element font-bold', tag.scale > 0.65 ? 'tag-front' : 'tag-middle']"
                            :style="{
                                '--tx': tag.x + 'px',
                                '--ty': tag.y + 'px',
                                '--tz': tag.z + 'px',
                                '--scale': tag.scale,
                                '--opacity': tag.opacity,
                                zIndex: tag.zIndex,
                                '--gradient': tag.gradient,
                                '--solid-color': tag.glowColor,
                                '--glow-color': tag.glowColor,
                                '--glow-intensity': tag.glowIntensity + 'px',
                                '--font-size': tag.fontSize + 'px'
                            }"
                    >
                        <span v-if="tag.z > -100">{{ tag.text }}</span>
                        <span v-else class="w-2 h-2 bg-blue-500/50 rounded-full block"></span>
                    </div>
                </div>
            </div>

        </div>

        <!-- Bottom Controls -->
        <div class="fixed bottom-0 left-0 right-0 z-50 pb-16 pt-8 flex flex-col items-center gap-6">

            <!-- Start Button -->
            <button
                    v-if="!store.isDrawing && store.currentRoundWinners.length === 0"
                    @click="startLottery"
                    class="group relative w-36 h-36 rounded-full transition-all hover:scale-110 flex items-center justify-center animate-pulse-fast"
            >
                <!-- Outer Glow with pulsing -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-cyan-500/40 to-purple-500/40 rounded-full blur-2xl group-hover:blur-3xl transition-all animate-pulse"></div>

                <!-- Rotating ring -->
                <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400/50 border-r-cyan-400/30 animate-spin-slow"></div>

                <!-- Button Body -->
                <div class="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-full border-4 border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] group-hover:border-cyan-300 transition-all flex flex-col items-center justify-center gap-1">
                    <i class="fas fa-power-off text-cyan-400 text-2xl group-hover:text-cyan-300 transition-colors animate-pulse"></i>
                    <span class="text-white text-xl font-black tracking-[0.3em] italic">START</span>
                </div>
            </button>

            <!-- Page Indicators -->
            <div class="flex gap-3">
                <button
                        v-for="i in store.rounds.length"
                        :key="i"
                        @click="store.currentRoundIndex = i - 1"
                        :class="[
                        'h-3 rounded-full transition-all duration-300 cursor-pointer',
                        i === store.currentRoundIndex + 1 
                            ? 'bg-cyan-400 w-12 shadow-[0_0_10px_rgba(34,211,238,0.6)]' 
                            : 'bg-slate-600/60 w-3 hover:bg-slate-500 hover:w-6'
                    ]"
                        :title="`查看 ${store.rounds[i - 1]?.name}`"
                >
                </button>
            </div>

            <!-- Stop Button -->
            <button
                    v-if="store.isDrawing"
                    @click="stopLottery"
                    class="relative w-36 h-36 bg-gradient-to-br from-red-500 to-red-700 rounded-full text-white font-black text-2xl tracking-wider shadow-[0_0_50px_rgba(239,68,68,0.8)] hover:shadow-[0_0_70px_rgba(239,68,68,1)] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            >
                <!-- Multiple pulsing rings -->
                <div class="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
                <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-10"
                     style="animation-delay: 0.5s;"></div>

                <!-- Rotating danger ring -->
                <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-red-300/60 border-r-red-300/40 animate-spin"></div>

                <span class="relative z-10 animate-pulse">STOP</span>
            </button>

            <!-- Result Controls -->
            <div v-if="store.currentRoundWinners.length > 0" class="flex gap-4">
                <!-- 重抽按钮 -->
                <button
                        @click="handleReset"
                        class="px-8 py-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border-2 border-white/20 hover:border-white/40 text-white font-bold backdrop-blur transition-all flex items-center gap-2"
                >
                    <i class="fas fa-redo"></i>
                    <span>重抽</span>
                </button>

                <!-- 下一轮按钮 -->
                <button
                        v-if="store.currentRoundIndex < store.rounds.length - 1"
                        @click="store.nextRound"
                        class="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                    <span>下一轮</span>
                    <i class="fas fa-arrow-right"></i>
                </button>

                <!-- 导出名单按钮 (所有奖项抽完后显示) -->
                <button
                        v-if="store.isAllFinished"
                        @click="handleExport"
                        class="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                    <i class="fas fa-download"></i>
                    <span>导出名单</span>
                </button>
            </div>

        </div>

    </div>
</template>

<script>
import {ref, watch, onMounted, onUnmounted, nextTick} from 'vue';
import {useLotteryStore} from '../../store/index';
import confetti from 'canvas-confetti';

export default {
    setup() {
        const store = useLotteryStore();
        const containerRef = ref(null);
        const tags = ref([]);
        let animationFrameId;
        let rotationAxis = {x: 0, y: 0};

        // Config
        const SPHERE_RADIUS = 350;
        const BASE_SPEED = 0.012;  // 待机时的滚动速度
        const DRAW_SPEED = 0.18;  // 抽奖时的速度 - 适中流畅

        // Color palette for neon effect
        const colorPalette = [
            ['#ff006e', '#8338ec'], // Pink to Purple
            ['#06ffa5', '#00d4ff'], // Cyan to Blue
            ['#ffbe0b', '#fb5607'], // Yellow to Orange
            ['#ff006e', '#3a86ff'], // Pink to Blue
            ['#8338ec', '#3a86ff'], // Purple to Blue
            ['#06ffa5', '#8338ec'], // Cyan to Purple
            ['#fb5607', '#ff006e'], // Orange to Pink
        ];

        const getRandomColor = (id) => {
            const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const colors = colorPalette[hash % colorPalette.length];
            return `${colors[0]}, ${colors[1]}`;
        };

        const getRandomGlow = (id) => {
            const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const colors = colorPalette[hash % colorPalette.length];
            return colors[0];
        };

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

                // Pre-calculate color gradient
                const gradient = `linear-gradient(135deg, ${getRandomColor(p.id)})`;
                const glowColor = getRandomGlow(p.id);

                return {
                    id: p.id,
                    text: p.name,
                    x: x * SPHERE_RADIUS,
                    y: y * SPHERE_RADIUS,
                    z: z * SPHERE_RADIUS,
                    opacity: 1,
                    scale: 1,
                    visible: true,
                    gradient: gradient,
                    glowColor: glowColor,
                    glowIntensity: 0,
                    fontSize: 34
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

            return {x: x1, y: y1, z: z2};
        };

        let lastTime = 0;
        const animate = (currentTime = 0) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            const targetSpeed = store.isDrawing ? DRAW_SPEED : BASE_SPEED;
            const isDrawing = store.isDrawing;
            const time = currentTime * 0.001;

            // Smooth speed transition with easing
            const speedDiff = targetSpeed - rotationAxis.y;
            rotationAxis.y += speedDiff * (isDrawing ? 0.1 : 0.05);

            // 减小X轴摆动，保持稳定流畅
            rotationAxis.x = Math.sin(time * 0.5) * 0.002;

            const len = tags.value.length;
            const radiusDouble = SPHERE_RADIUS * 2;
            const radiusTriple = SPHERE_RADIUS * 3;
            const radius12 = SPHERE_RADIUS * 1.2;
            
            // 预计算三角函数
            const cosX = Math.cos(rotationAxis.x);
            const sinX = Math.sin(rotationAxis.x);
            const cosY = Math.cos(rotationAxis.y);
            const sinY = Math.sin(rotationAxis.y);
            
            for (let i = 0; i < len; i++) {
                const tag = tags.value[i];
                
                // Inline rotation for better performance
                const x1 = tag.x * cosY - tag.z * sinY;
                const z1 = tag.z * cosY + tag.x * sinY;
                const y1 = tag.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + tag.y * sinX;
                
                tag.x = x1;
                tag.y = y1;
                tag.z = z2;

                // Optimized depth calculations
                const zOffset = z2 + radiusDouble;
                const depthFactor = zOffset / radiusTriple;
                tag.scale = 0.35 + depthFactor * 0.65;
                
                // Smoother opacity with better visibility
                tag.opacity = Math.max(0.2, Math.min(1, (z2 + radius12) / radiusDouble));
                
                tag.zIndex = Math.floor(z2);
                
                // 优化发光效果 - 更稳定清晰
                if (isDrawing) {
                    const pulse = Math.sin(time * 3 + i * 0.15) * 0.3 + 0.7;
                    tag.glowIntensity = z2 > 0 ? (z2 / SPHERE_RADIUS) * (10 + pulse * 3) : 0;
                    tag.fontSize = 34 + pulse * 1.5;
                } else {
                    tag.glowIntensity = z2 > 0 ? (z2 / SPHERE_RADIUS) * 8 : 0;
                    tag.fontSize = 34;
                }
            }

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
                confetti({particleCount: 5, angle: 60, spread: 55, origin: {x: 0}, colors});
                confetti({particleCount: 5, angle: 120, spread: 55, origin: {x: 1}, colors});
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        };

        const handleReset = () => {
            if (confirm('重置本轮？')) {
                store.resetCurrentRound();
                nextTick(() => {
                    initSphere();
                });
            }
        }

        const handleExport = () => {
            try {
                store.exportToExcel();
            } catch (error) {
                alert('导出失败：' + error.message);
            }
        }

        watch(() => store.participants, initSphere, {deep: true});
        watch(() => store.remainingParticipants.length, initSphere);
        watch(() => store.currentRoundIndex, initSphere);

        onMounted(() => {
            initSphere();
            animate();
        });

        onUnmounted(() => {
            cancelAnimationFrame(animationFrameId);
        });

        return {
            store, tags, containerRef,
            startLottery, stopLottery, handleReset, handleExport,
            SPHERE_RADIUS, getRandomColor, getRandomGlow
        };
    }
}
</script>