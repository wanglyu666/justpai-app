export type ConstructionReportCategory = 'daily' | 'weekly' | 'ehs';

export type ConstructionReportItem = {
  id: string;
  category: ConstructionReportCategory;
  title: string;
  date: string;
  owner: string;
};

export const CONSTRUCTION_REPORT_TABS: {
  id: ConstructionReportCategory;
  label: string;
}[] = [
  { id: 'daily', label: '日报' },
  { id: 'weekly', label: '周报' },
  { id: 'ehs', label: 'EHS周报' },
];

export const CONSTRUCTION_REPORT_ICONS: Record<
  ConstructionReportCategory,
  string
> = {
  daily: '/static/icons/file-text.svg',
  weekly: '/static/icons/calendar-orange.svg',
  ehs: '/static/icons/shield-check.svg',
};

const REPORTS: ConstructionReportItem[] = [
  { id: 'daily-1', category: 'daily', title: '施工进度日报', date: '2025-05-22', owner: '项目主管' },
  { id: 'daily-2', category: 'daily', title: '人员出勤日报', date: '2025-05-22', owner: '李志强' },
  { id: 'daily-3', category: 'daily', title: '材料进场日报', date: '2025-05-21', owner: '刘洋' },
  { id: 'daily-4', category: 'daily', title: '机械台班日报', date: '2025-05-21', owner: '张伟' },
  { id: 'daily-5', category: 'daily', title: '质量巡查日报', date: '2025-05-20', owner: '项目主管' },
  { id: 'daily-6', category: 'daily', title: '安全巡检日报', date: '2025-05-20', owner: '李志强' },
  { id: 'weekly-1', category: 'weekly', title: '施工进度周报', date: '2025-05-18', owner: '项目主管' },
  { id: 'weekly-2', category: 'weekly', title: '质量问题周报', date: '2025-05-18', owner: '刘洋' },
  { id: 'weekly-3', category: 'weekly', title: '安全检查周报', date: '2025-05-18', owner: '李志强' },
  { id: 'weekly-4', category: 'weekly', title: '人员机械周报', date: '2025-05-11', owner: '张伟' },
  { id: 'weekly-5', category: 'weekly', title: '材料消耗周报', date: '2025-05-11', owner: '刘洋' },
  { id: 'weekly-6', category: 'weekly', title: '下周计划周报', date: '2025-05-11', owner: '项目主管' },
  { id: 'ehs-1', category: 'ehs', title: '环境检查周报', date: '2025-05-18', owner: '项目主管' },
  { id: 'ehs-2', category: 'ehs', title: '职业健康周报', date: '2025-05-18', owner: '李志强' },
  { id: 'ehs-3', category: 'ehs', title: '安全隐患周报', date: '2025-05-18', owner: '张伟' },
  { id: 'ehs-4', category: 'ehs', title: '应急演练周报', date: '2025-05-11', owner: '刘洋' },
  { id: 'ehs-5', category: 'ehs', title: '防护用品周报', date: '2025-05-11', owner: '项目主管' },
  { id: 'ehs-6', category: 'ehs', title: '事故事件周报', date: '2025-05-11', owner: '李志强' },
];

export function useConstructionReports() {
  const getByCategory = (category: ConstructionReportCategory) =>
    REPORTS.filter((item) => item.category === category);

  return {
    tabs: CONSTRUCTION_REPORT_TABS,
    icons: CONSTRUCTION_REPORT_ICONS,
    reports: REPORTS,
    getByCategory,
  };
}
