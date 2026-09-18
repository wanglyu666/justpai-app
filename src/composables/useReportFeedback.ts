import { ref } from 'vue';

const notes = ref<Record<string, string>>({});

export function useReportFeedback() {
  const getNote = (reportId: string) => notes.value[reportId] ?? '';

  const hasNote = (reportId: string) => Boolean(notes.value[reportId]?.trim());

  const saveNote = (reportId: string, content: string) => {
    notes.value = {
      ...notes.value,
      [reportId]: content.trim(),
    };
  };

  return {
    getNote,
    hasNote,
    saveNote,
  };
}
