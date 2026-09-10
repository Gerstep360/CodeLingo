// LocalStorage and Export/Import Helper for CodeLingo Persistence

const STORAGE_KEYS = {
  COMPLETED_NODES: 'vargas_duo_completed',
  STREAK: 'vargas_duo_streak',
  TOTAL_XP: 'vargas_duo_xp',
  DAILY_XP: 'vargas_duo_daily_xp',
  LAST_LOGIN: 'vargas_duo_last_date',
  CUSTOM_SNIPPETS: 'vargas_duo_custom_snippets',
};

export const duoStorage = {
  getCompletedNodes: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_NODES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  saveCompletedNodes: (nodes) => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_NODES, JSON.stringify(nodes));
    } catch (e) {
      console.warn('Error saving completed nodes', e);
    }
  },

  getStreak: () => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.STREAK);
      return s ? Number(s) : 4;
    } catch {
      return 4;
    }
  },
  saveStreak: (streak) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, String(streak));
    } catch (e) {
      console.warn('Error saving streak', e);
    }
  },

  getTotalXp: () => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.TOTAL_XP);
      return s ? Number(s) : 120;
    } catch {
      return 120;
    }
  },
  saveTotalXp: (xp) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_XP, String(xp));
    } catch (e) {
      console.warn('Error saving total XP', e);
    }
  },

  getDailyXp: () => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.DAILY_XP);
      return s ? Number(s) : 35;
    } catch {
      return 35;
    }
  },
  saveDailyXp: (xp) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_XP, String(xp));
    } catch (e) {
      console.warn('Error saving daily XP', e);
    }
  },

  // Export all user data as a JSON file
  exportBackup: () => {
    const data = {
      completedNodes: duoStorage.getCompletedNodes(),
      streak: duoStorage.getStreak(),
      totalXp: duoStorage.getTotalXp(),
      dailyXp: duoStorage.getDailyXp(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codelingo_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import user data from JSON
  importBackup: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.completedNodes) duoStorage.saveCompletedNodes(parsed.completedNodes);
      if (parsed.streak !== undefined) duoStorage.saveStreak(parsed.streak);
      if (parsed.totalXp !== undefined) duoStorage.saveTotalXp(parsed.totalXp);
      if (parsed.dailyXp !== undefined) duoStorage.saveDailyXp(parsed.dailyXp);
      return true;
    } catch {
      return false;
    }
  }
};
