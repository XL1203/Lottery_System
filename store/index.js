import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';

export const useLotteryStore = defineStore('lottery', () => {
  // --- State ---
  const participants = ref([]);
  const rounds = ref([
    { id: '1', name: '阳关普照奖', count: 30 },
    { id: '2', name: '幸运三等奖', count: 25 },
    { id: '3', name: '超级二等奖', count: 20 },
    { id: '4', name: '差一点一等奖', count: 15 },
    { id: '5', name: '终极一等奖', count: 7 },
  ]);
  const winners = ref([]);
  const currentRoundIndex = ref(0);
  const isDrawing = ref(false);
  const currentView = ref('setup');

  // --- Getters ---
  const currentRound = computed(() => rounds.value[currentRoundIndex.value]);
  
  const remainingParticipants = computed(() => {
    const allWinnerIds = new Set(winners.value.flatMap(w => w.winners.map(p => p.id)));
    return participants.value.filter(p => !allWinnerIds.has(p.id));
  });

  const currentRoundWinners = computed(() => {
    if (!currentRound.value) return [];
    return winners.value.find(w => w.roundId === currentRound.value.id)?.winners || [];
  });

  const isAllFinished = computed(() => {
    if (rounds.value.length === 0) return false;
    // Check if every round has a corresponding entry in winners with the correct count
    // Or simpler: just check if we have results for all rounds. 
    // Note: User might not draw full count, so we check if "winners" array has entry for every roundId.
    const roundIdsWithWinners = new Set(winners.value.map(w => w.roundId));
    return rounds.value.every(r => roundIdsWithWinners.has(r.id));
  });

  // --- Actions ---
  function setParticipants(data) {
    if (!Array.isArray(data)) return;
    
    // Fuzzy match for name column
    const cleanList = data.map((row, idx) => {
      const keys = Object.keys(row);
      const nameKey = keys.find(k => {
        const cleanKey = k.trim().toLowerCase();
        return ['name', '姓名', '员工', '人员', 'employee'].includes(cleanKey);
      });
      
      let nameValue;
      if (nameKey) {
        nameValue = row[nameKey];
      } else if (keys.length > 0) {
        // Fallback to first column
        nameValue = Object.values(row)[0];
      }

      return {
        id: `user-${idx}-${Math.random().toString(36).substr(2, 6)}`,
        name: String(nameValue || `Unknown ${idx}`).trim()
      };
    }).filter(p => p.name && p.name !== 'undefined' && p.name !== '');

    participants.value = cleanList;
  }

  function addRound() {
    rounds.value.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `第 ${rounds.value.length + 1} 轮`,
      count: 1
    });
  }

  function removeRound(index) {
    if (rounds.value.length > 1) rounds.value.splice(index, 1);
  }
  
  function updateRoundsOrder(newRounds) {
    rounds.value = newRounds;
    if (currentRoundIndex.value >= rounds.value.length) {
      currentRoundIndex.value = Math.max(0, rounds.value.length - 1);
    }
  }

  function nextRound() {
    if (currentRoundIndex.value < rounds.value.length - 1) currentRoundIndex.value++;
  }

  function prevRound() {
    if (currentRoundIndex.value > 0) currentRoundIndex.value--;
  }

  function addWinners(roundId, newWinners) {
    const existing = winners.value.find(w => w.roundId === roundId);
    if (existing) {
      existing.winners.push(...newWinners);
    } else {
      winners.value.push({ roundId, winners: newWinners });
    }
  }
  
  function resetCurrentRound() {
    const idx = winners.value.findIndex(w => w.roundId === currentRound.value.id);
    if (idx !== -1) winners.value.splice(idx, 1);
    isDrawing.value = false;
  }

  function fullReset() {
    winners.value = [];
    currentRoundIndex.value = 0;
    isDrawing.value = false;
    participants.value = [];
  }

  function exportToExcel() {
    // Flatten data grouped by Round
    const exportData = [];
    
    // Sort rounds to match the UI order
    rounds.value.forEach(round => {
      const roundData = winners.value.find(w => w.roundId === round.id);
      if (roundData && roundData.winners.length > 0) {
        roundData.winners.forEach((p, idx) => {
          exportData.push({
            '奖项名称': round.name,
            '中奖排名': idx + 1,
            '中奖人姓名': p.name,
            '抽奖时间': new Date().toLocaleString()
          });
        });
      }
    });

    if (exportData.length === 0) {
      alert('暂无中奖数据可导出');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-width columns
    const wscols = [
      {wch: 20},
      {wch: 10},
      {wch: 20},
      {wch: 25}
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "中奖名单");
    
    XLSX.writeFile(wb, `年会中奖名单_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  return {
    participants, rounds, winners, currentRoundIndex, currentRound,
    isDrawing, currentView, remainingParticipants, currentRoundWinners, isAllFinished,
    setParticipants, addRound, removeRound, updateRoundsOrder,
    nextRound, prevRound, addWinners, resetCurrentRound, fullReset, exportToExcel
  };
});