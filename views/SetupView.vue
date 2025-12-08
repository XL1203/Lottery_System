<template>
  <div class="w-full h-full bg-slate-50 overflow-hidden flex flex-col relative">
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none"></div>

    <div class="flex-1 overflow-y-auto p-8 relative z-10">
      <div class="max-w-6xl mx-auto space-y-8">
        
        <header class="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">抽奖设置</h1>
            <p class="text-slate-500 mt-2 font-medium">Configure Participants & Rounds</p>
          </div>
          <button @click="confirmReset" class="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
            <i class="fas fa-trash-alt"></i> 清空数据
          </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Import -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-white">
              <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i class="fas fa-user-friends text-blue-500"></i> 人员管理
              </h2>
              
              <div 
                @click="fileInput?.click()"
                class="border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="onFileChange" />
                <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <i class="fas fa-cloud-upload-alt text-3xl"></i>
                </div>
                <p class="text-slate-900 font-bold">点击上传 Excel</p>
                <p class="text-slate-400 text-xs mt-2 text-center">支持 "姓名" 列自动识别</p>
              </div>

              <div class="mt-6 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span class="text-slate-500 text-sm font-medium">当前人数</span>
                <span class="text-3xl font-black text-blue-600">{{ store.participants.length }}</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Rounds -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-white h-full">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-trophy text-purple-500"></i> 奖项配置
                </h2>
                <button @click="store.addRound" class="bg-slate-900 text-white hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
                  <i class="fas fa-plus mr-1"></i> 添加轮次
                </button>
              </div>

              <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 min-h-[300px]">
                <div ref="sortableList" class="space-y-3">
                  <div 
                    v-for="(round, idx) in store.rounds" 
                    :key="round.id" 
                    class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow group select-none"
                  >
                    <!-- Drag Handle -->
                    <div class="drag-handle w-10 h-10 flex-shrink-0 flex items-center justify-center text-slate-300 hover:text-blue-500 cursor-grab active:cursor-grabbing rounded bg-slate-50 hover:bg-blue-50 transition-colors">
                      <i class="fas fa-grip-lines"></i>
                    </div>
                    
                    <!-- Index -->
                    <div class="w-8 h-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                      {{ idx + 1 }}
                    </div>

                    <!-- Name Input (High Contrast) -->
                    <div class="flex-1 min-w-0">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">奖项名称</label>
                      <input 
                        v-model="round.name" 
                        class="w-full bg-white border-2 border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 transition-all placeholder-slate-300" 
                        placeholder="输入名称" 
                      />
                    </div>

                    <!-- Count Input (High Contrast) -->
                    <div class="w-24 flex-shrink-0">
                       <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 text-center">人数</label>
                       <input 
                         type="number" 
                         v-model.number="round.count" 
                         min="1" 
                         class="w-full bg-white border-2 border-slate-200 focus:border-blue-500 rounded-lg px-2 py-2 text-center font-mono font-bold outline-none transition-all text-slate-800" 
                       />
                    </div>

                    <!-- Delete -->
                    <button @click="store.removeRound(idx)" class="w-10 h-10 flex-shrink-0 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div v-if="store.rounds.length === 0" class="flex flex-col items-center justify-center h-48 text-slate-400">
                   <i class="fas fa-inbox text-4xl mb-3 opacity-20"></i>
                   <p>暂无奖项，请点击右上角添加</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLotteryStore } from '../store/index.js';
import * as XLSX from 'xlsx';

export default {
  emits: ['notify', 'confirm'],
  setup(props, { emit }) {
    const store = useLotteryStore();
    const fileInput = ref(null);
    const sortableList = ref(null);

    const onFileChange = (e) => {
      const target = e.target;
      if (!target.files?.length) return;
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target.result;
          const wb = XLSX.read(data, { type: 'binary' });
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          if (jsonData.length === 0) {
            emit('notify', { type: 'error', message: 'Excel 内容为空' });
            return;
          }
          
          store.setParticipants(jsonData);
          emit('notify', { type: 'success', message: `成功导入 ${store.participants.length} 位人员` });
          target.value = '';
        } catch(err) {
          console.error(err);
          emit('notify', { type: 'error', message: '解析失败，请检查文件格式' });
        }
      };
      reader.readAsBinaryString(target.files[0]);
    };

    const confirmReset = () => {
      emit('confirm', {
        title: '确认清空？',
        message: '此操作将删除所有人员名单和中奖记录，无法撤销。',
        onConfirm: () => {
          store.fullReset();
          emit('notify', { type: 'success', message: '数据已清空' });
        }
      });
    };

    onMounted(() => {
      if (sortableList.value && window.Sortable) {
        // Use window.Sortable directly to bypass module loading issues
        window.Sortable.create(sortableList.value, {
          handle: '.drag-handle',
          animation: 200,
          ghostClass: 'sortable-ghost',
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;
            if (oldIndex === newIndex) return;
            
            const items = [...store.rounds];
            const [moved] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, moved);
            
            store.updateRoundsOrder(items);
          }
        });
      }
    });

    return { store, fileInput, onFileChange, sortableList, confirmReset };
  }
}
</script>