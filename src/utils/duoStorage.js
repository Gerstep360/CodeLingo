import { accountStorage } from '../account/accountStorage';
// Account-backed persistence for CodeLingo Persistence

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
      const saved = accountStorage.getItem(STORAGE_KEYS.COMPLETED_NODES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  saveCompletedNodes: (nodes) => {
    try {
      accountStorage.setItem(STORAGE_KEYS.COMPLETED_NODES, JSON.stringify(nodes));
    } catch (e) {
      console.warn('Error saving completed nodes', e);
    }
  },

  getStreak: () => {
    try {
      const s = accountStorage.getItem(STORAGE_KEYS.STREAK);
      return s ? Number(s) : 0;
    } catch {
      return 0;
    }
  },
  saveStreak: (streak) => {
    try {
      accountStorage.setItem(STORAGE_KEYS.STREAK, String(streak));
    } catch (e) {
      console.warn('Error saving streak', e);
    }
  },

  getTotalXp: () => {
    try {
      const s = accountStorage.getItem(STORAGE_KEYS.TOTAL_XP);
      return s ? Number(s) : 0;
    } catch {
      return 0;
    }
  },
  saveTotalXp: (xp) => {
    try {
      accountStorage.setItem(STORAGE_KEYS.TOTAL_XP, String(xp));
    } catch (e) {
      console.warn('Error saving total XP', e);
    }
  },

  getDailyXp: () => {
    try {
      const s = accountStorage.getItem(STORAGE_KEYS.DAILY_XP);
      return s ? Number(s) : 0;
    } catch {
      return 0;
    }
  },
  saveDailyXp: (xp) => {
    try {
      accountStorage.setItem(STORAGE_KEYS.DAILY_XP, String(xp));
    } catch (e) {
      console.warn('Error saving daily XP', e);
    }
  },

  // Active Lesson Session Persistence
  getActiveLesson: () => {
    try {
      const saved = accountStorage.getItem('vargas_active_lesson');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
  saveActiveLesson: (lessonInfo) => {
    try {
      accountStorage.setItem(
        'vargas_active_lesson',
        JSON.stringify({
          ...lessonInfo,
          savedAt: Date.now()
        })
      );
    } catch (e) {
      console.warn('Error saving active lesson', e);
    }
  },
  clearActiveLesson: () => {
    try {
      accountStorage.removeItem('vargas_active_lesson');
    } catch {}
  },

  // Code drafts for training stages
  getCodeDraft: (lessonId, stageId) => {
    try {
      return accountStorage.getItem(`vargas_code_draft_${lessonId}_${stageId}`) || '';
    } catch {
      return '';
    }
  },
  saveCodeDraft: (lessonId, stageId, code) => {
    try {
      if (code !== undefined && code !== null) {
        accountStorage.setItem(`vargas_code_draft_${lessonId}_${stageId}`, code);
      }
    } catch {}
  },
  clearCodeDraft: (lessonId, stageId) => {
    try {
      accountStorage.removeItem(`vargas_code_draft_${lessonId}_${stageId}`);
    } catch {}
  },
  clearLessonDrafts: (lessonId) => {
    try {
      const prefix = `vargas_code_draft_${lessonId}`;
      for (let i = accountStorage.length - 1; i >= 0; i--) {
        const key = accountStorage.key(i);
        if (key && key.startsWith(prefix)) {
          accountStorage.removeItem(key);
        }
      }
    } catch {}
  },

  // Editor drafts for IDE mode
  getEditorDraft: (snippetId, isExam) => {
    try {
      const key = `vargas_editor_draft_${snippetId}_${isExam ? 'exam' : 'guide'}`;
      const s = accountStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },
  saveEditorDraft: (snippetId, isExam, state) => {
    try {
      const key = `vargas_editor_draft_${snippetId}_${isExam ? 'exam' : 'guide'}`;
      accountStorage.setItem(key, JSON.stringify(state));
    } catch {}
  },
  clearEditorDraft: (snippetId, isExam) => {
    try {
      const key = `vargas_editor_draft_${snippetId}_${isExam ? 'exam' : 'guide'}`;
      accountStorage.removeItem(key);
    } catch {}
  }
};
