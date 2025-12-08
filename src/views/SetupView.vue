<template>
    <div class="flex-1 bg-slate-50 text-slate-800 p-8 overflow-y-auto h-full relative">
        <div class="max-w-5xl mx-auto space-y-8">

            <header class="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900">抽奖配置中心</h1>
                    <p class="text-slate-500 mt-1">设置名单与奖项规则</p>
                </div>
                <button @click="store.fullReset()" class="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <i class="fas fa-trash-alt mr-2"></i>清空所有数据
                </button>
            </header>

            <!-- 1. Import List -->
            <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold flex items-center">
                        <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                        人员名单
                    </h2>
                    <span class="text-sm font-mono bg-slate-100 px-3 py-1 rounded-full">当前: {{ store.participants.length }} 人</span>
                </div>

                <div
                        @click="fileInput?.click()"
                        class="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                >
                    <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="onFileChange" />
                    <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i class="fas fa-cloud-upload-alt text-2xl text-blue-500"></i>
                    </div>
                    <p class="text-slate-600 font-medium">点击上传 Excel 文件</p>
                    <p class="text-slate-400 text-xs mt-1">支持姓名、工号等列自动识别</p>
                </div>
            </section>

            <!-- 2. Round Settings -->
            <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold flex items-center">
                        <span class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-sm">2</span>
                        奖项设置 (支持拖拽排序)
                    </h2>
                    <button @click="store.addRound" class="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                        + 新增奖项
                    </button>
                </div>

                <div ref="sortableList" class="space-y-3">
                    <div
                            v-for="(round, idx) in store.rounds"
                            :key="round.id"
                            class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors group"
                    >
                        <!-- Drag Handle -->
                        <div class="drag-handle text-slate-300 hover:text-blue-500 cursor-move p-2">
                            <i class="fas fa-grip-vertical"></i>
                        </div>

                        <span class="text-slate-300 font-bold text-lg w-6 text-center">{{ idx + 1 }}</span>
                        <div class="flex-1">
                            <label class="text-xs font-bold text-slate-400 uppercase">奖项名称</label>
                            <input v-model="round.name" class="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none text-slate-800 font-bold" />
                        </div>
                        <div class="w-32 text-center">
                            <label class="text-xs font-bold text-slate-400 uppercase">抽取人数</label>
                            <input type="number" v-model.number="round.count" min="1" class="w-full text-center bg-white border border-slate-200 rounded-lg py-1 mt-1 font-mono font-bold" />
                        </div>
                        <button @click="store.removeRound(idx)" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLotteryStore } from '../../store/index';
import * as XLSX from 'xlsx';
import Sortable from 'sortablejs';

export default {
    setup() {
        const store = useLotteryStore();
        const fileInput = ref(null);
        const sortableList = ref(null);

        const onFileChange = (e) => {
            const target = e.target;
            if (!target.files?.length) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const wb = XLSX.read(evt.target?.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                store.setParticipants(XLSX.utils.sheet_to_json(ws));
            };
            reader.readAsBinaryString(target.files[0]);
        };

        onMounted(() => {
            if (sortableList.value) {
                new Sortable(sortableList.value, {
                    handle: '.drag-handle',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: (evt) => {
                        const { oldIndex, newIndex } = evt;
                        if (oldIndex === newIndex) return;

                        // Clone and move
                        const items = [...store.rounds];
                        const [movedItem] = items.splice(oldIndex, 1);
                        items.splice(newIndex, 0, movedItem);

                        store.updateRoundsOrder(items);
                    }
                });
            }
        });

        return { store, fileInput, onFileChange, sortableList };
    }
}
</script>