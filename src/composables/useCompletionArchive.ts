export type CompletionArchiveCategory =
  | 'photos'
  | 'records'
  | 'documents'
  | 'materials'
  | 'handover';

export type CompletionArchiveItem = {
  id: string;
  category: CompletionArchiveCategory;
  title: string;
  date: string;
  owner: string;
};

export const COMPLETION_ARCHIVE_TABS: {
  id: CompletionArchiveCategory;
  label: string;
}[] = [
  { id: 'photos', label: '完工照片' },
  { id: 'records', label: '验收记录' },
  { id: 'documents', label: '文件资料' },
  { id: 'materials', label: '材料设备' },
  { id: 'handover', label: '交接记录' },
];

export const COMPLETION_ARCHIVE_ICONS: Record<
  CompletionArchiveCategory,
  string
> = {
  photos: '/static/icons/image-plus.svg',
  records: '/static/icons/clipboard-check.svg',
  documents: '/static/icons/file-text.svg',
  materials: '/static/icons/package.svg',
  handover: '/static/icons/clipboard-list.svg',
};

const ITEMS: CompletionArchiveItem[] = [
  { id: 'photo-1', category: 'photos', title: '大厅完工全景', date: '2026-08-20', owner: '项目主管' },
  { id: 'photo-2', category: 'photos', title: '卫生间完工照片', date: '2026-08-18', owner: '李志强' },
  { id: 'photo-3', category: 'photos', title: '天花灯具完工', date: '2026-08-16', owner: '刘洋' },
  { id: 'photo-4', category: 'photos', title: '地面铺装完工', date: '2026-08-14', owner: '张伟' },
  { id: 'photo-5', category: 'photos', title: '门头招牌完工', date: '2026-08-12', owner: '项目主管' },
  { id: 'photo-6', category: 'photos', title: '设备机房完工', date: '2026-08-10', owner: '李志强' },
  { id: 'record-1', category: 'records', title: '竣工验收记录', date: '2026-08-22', owner: '项目主管' },
  { id: 'record-2', category: 'records', title: '隐蔽工程验收记录', date: '2026-08-08', owner: '刘洋' },
  { id: 'record-3', category: 'records', title: '分部分项验收记录', date: '2026-08-06', owner: '李志强' },
  { id: 'record-4', category: 'records', title: '消防专项验收记录', date: '2026-08-04', owner: '张伟' },
  { id: 'record-5', category: 'records', title: '设备专项验收记录', date: '2026-08-02', owner: '刘洋' },
  { id: 'record-6', category: 'records', title: '环保验收记录', date: '2026-07-30', owner: '项目主管' },
  { id: 'doc-1', category: 'documents', title: '竣工图纸', date: '2026-08-22', owner: '项目主管' },
  { id: 'doc-2', category: 'documents', title: '竣工报告', date: '2026-08-21', owner: '李志强' },
  { id: 'doc-3', category: 'documents', title: '质量保证书', date: '2026-08-20', owner: '刘洋' },
  { id: 'doc-4', category: 'documents', title: '设计变更汇总', date: '2026-08-15', owner: '张伟' },
  { id: 'doc-5', category: 'documents', title: '施工组织设计', date: '2026-07-12', owner: '项目主管' },
  { id: 'doc-6', category: 'documents', title: '竣工结算资料', date: '2026-08-22', owner: '李志强' },
  { id: 'mat-1', category: 'materials', title: '材料合格证汇总', date: '2026-08-18', owner: '刘洋' },
  { id: 'mat-2', category: 'materials', title: '主要设备清单', date: '2026-08-16', owner: '张伟' },
  { id: 'mat-3', category: 'materials', title: '材料进场报验', date: '2026-08-10', owner: '李志强' },
  { id: 'mat-4', category: 'materials', title: '灯具设备台账', date: '2026-08-08', owner: '项目主管' },
  { id: 'mat-5', category: 'materials', title: '空调设备资料', date: '2026-08-06', owner: '刘洋' },
  { id: 'mat-6', category: 'materials', title: '卫浴洁具清单', date: '2026-08-04', owner: '张伟' },
  { id: 'hand-1', category: 'handover', title: '工程交接单', date: '2026-08-24', owner: '项目主管' },
  { id: 'hand-2', category: 'handover', title: '钥匙交接记录', date: '2026-08-24', owner: '李志强' },
  { id: 'hand-3', category: 'handover', title: '维保交接清单', date: '2026-08-23', owner: '刘洋' },
  { id: 'hand-4', category: 'handover', title: '竣工资料移交', date: '2026-08-23', owner: '张伟' },
  { id: 'hand-5', category: 'handover', title: '培训交接记录', date: '2026-08-22', owner: '项目主管' },
  { id: 'hand-6', category: 'handover', title: '保修责任书', date: '2026-08-22', owner: '李志强' },
];

export function useCompletionArchive() {
  const getByCategory = (category: CompletionArchiveCategory) =>
    ITEMS.filter((item) => item.category === category);

  return {
    tabs: COMPLETION_ARCHIVE_TABS,
    icons: COMPLETION_ARCHIVE_ICONS,
    items: ITEMS,
    getByCategory,
  };
}
