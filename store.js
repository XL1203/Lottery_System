import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLotteryStore = defineStore('lottery', () => {
  // State
  const participants = ref([]);
  const rounds = ref([
    { id: '1', name: '幸运三等奖', count: 5 },
    { id: '2', name: '超级二等奖', count: 3 },
    { id: '3', name: '终极一等奖', count: 1 },
  ]);
  const winners = ref([]);
  const currentRoundIndex = ref(0);
  const isDrawing = ref(false);
  const currentView = ref('lottery'); 

  // Getters
  const currentRound = computed(() => rounds.value[currentRoundIndex.value]);
  
  const remainingParticipants = computed(() => {
    const allWinnerIds = new Set(winners.value.flatMap(w => w.winners.map(p => p.id)));
    return participants.value.filter(p => !allWinnerIds.has(p.id));
  });

  const currentRoundWinners = computed(() => {
    if (!currentRound.value) return [];
    return winners.value.find(w => w.roundId === currentRound.value.id)?.winners || [];
  });

  const isConfigured = computed(() => participants.value.length > 0 && rounds.value.length > 0);

  // Actions
  function setParticipants(data) {
    participants.value = data.map((row, idx) => {
      // Robust name finding
      const name = row['Name'] || row['name'] || row['姓名'] || row['Employee'] || row['员工'] || Object.values(row)[0] || `用户 ${idx}`;
      return {
        id: `u-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        name: String(name).trim()
      };
    }).filter(p => p.name && p.name !== 'undefined');
  }

  function addRound() {
    rounds.value.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `第 ${rounds.value.length + 1} 轮`,
      count: 1
    });
  }

  function removeRound(index) {
    if (rounds.value.length > 1) {
      rounds.value.splice(index, 1);
    }
  }
  
  function updateRoundsOrder(newRounds) {
    rounds.value = newRounds;
    // Ensure index stays valid
    if (currentRoundIndex.value >= rounds.value.length) {
      currentRoundIndex.value = rounds.value.length - 1;
    }
  }

  function nextRound() {
    if (currentRoundIndex.value < rounds.value.length - 1) {
      currentRoundIndex.value++;
    }
  }

  function prevRound() {
    if (currentRoundIndex.value > 0) {
      currentRoundIndex.value--;
    }
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
    if (idx !== -1) {
      winners.value.splice(idx, 1);
    }
    isDrawing.value = false;
  }

  function fullReset() {
    winners.value = [];
    currentRoundIndex.value = 0;
    isDrawing.value = false;
    participants.value = [];
  }

  return {
    participants, rounds, winners, currentRoundIndex, currentRound,
    isDrawing, currentView, remainingParticipants, currentRoundWinners, isConfigured,
    setParticipants, addRound, removeRound, updateRoundsOrder, nextRound, prevRound, addWinners,
    resetCurrentRound, fullReset
  };
});