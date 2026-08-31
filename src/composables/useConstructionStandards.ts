export type ConstructionStandardCategory =
  | 'environment'
  | 'safety'
  | 'health'
  | 'finished'
  | 'quality'
  | 'hygiene'
  | 'risk';

export type ConstructionStandardItem = {
  id: string;
  category: ConstructionStandardCategory;
  title: string;
};

export const CONSTRUCTION_STANDARD_TABS: {
  id: ConstructionStandardCategory;
  label: string;
}[] = [
  { id: 'environment', label: '环境管控' },
  { id: 'safety', label: '安全管控' },
  { id: 'health', label: '健康管控' },
  { id: 'finished', label: '成品管控' },
  { id: 'quality', label: '质量管控' },
  { id: 'hygiene', label: '卫生保洁' },
  { id: 'risk', label: '风险管控' },
];

export const CONSTRUCTION_STANDARD_ICONS: Record<
  ConstructionStandardCategory,
  string
> = {
  environment: '/static/icons/leaf.svg',
  safety: '/static/icons/hard-hat.svg',
  health: '/static/icons/heart-pulse.svg',
  finished: '/static/icons/package.svg',
  quality: '/static/icons/badge-check.svg',
  hygiene: '/static/icons/sparkles.svg',
  risk: '/static/icons/octagon-alert.svg',
};

const STANDARDS: ConstructionStandardItem[] = [
  { id: 'env-1', category: 'environment', title: '噪音排放管理规定' },
  { id: 'env-2', category: 'environment', title: '扬尘污染控制要求' },
  { id: 'env-3', category: 'environment', title: '污水排放与沉淀' },
  { id: 'env-4', category: 'environment', title: '建筑垃圾分类清运' },
  { id: 'env-5', category: 'environment', title: '夜间施工管控' },
  { id: 'env-6', category: 'environment', title: '绿化与场地保护' },
  { id: 'safe-1', category: 'safety', title: '高处作业防护' },
  { id: 'safe-2', category: 'safety', title: '施工用电安全' },
  { id: 'safe-3', category: 'safety', title: '消防器材配置' },
  { id: 'safe-4', category: 'safety', title: '个人防护用品' },
  { id: 'safe-5', category: 'safety', title: '特种作业持证' },
  { id: 'safe-6', category: 'safety', title: '机械设备验收' },
  { id: 'health-1', category: 'health', title: '职业健康体检' },
  { id: 'health-2', category: 'health', title: '高温防暑降温' },
  { id: 'health-3', category: 'health', title: '有限空间作业' },
  { id: 'health-4', category: 'health', title: '粉尘防护措施' },
  { id: 'health-5', category: 'health', title: '应急医疗配置' },
  { id: 'health-6', category: 'health', title: '工间休息安排' },
  { id: 'fin-1', category: 'finished', title: '成品覆盖保护' },
  { id: 'fin-2', category: 'finished', title: '交叉作业隔离' },
  { id: 'fin-3', category: 'finished', title: '材料进场验收' },
  { id: 'fin-4', category: 'finished', title: '样板先行制度' },
  { id: 'fin-5', category: 'finished', title: '搬运防磕碰' },
  { id: 'fin-6', category: 'finished', title: '移交前成品检查' },
  { id: 'qua-1', category: 'quality', title: '隐蔽工程验收' },
  { id: 'qua-2', category: 'quality', title: '材料送检制度' },
  { id: 'qua-3', category: 'quality', title: '工序交接检查' },
  { id: 'qua-4', category: 'quality', title: '质量样板引路' },
  { id: 'qua-5', category: 'quality', title: '实测实量标准' },
  { id: 'qua-6', category: 'quality', title: '质量问题闭环' },
  { id: 'hyg-1', category: 'hygiene', title: '施工现场洒水' },
  { id: 'hyg-2', category: 'hygiene', title: '生活区卫生管理' },
  { id: 'hyg-3', category: 'hygiene', title: '厕所盥洗维护' },
  { id: 'hyg-4', category: 'hygiene', title: '材料堆放整齐' },
  { id: 'hyg-5', category: 'hygiene', title: '工完场清制度' },
  { id: 'hyg-6', category: 'hygiene', title: '病媒生物防治' },
  { id: 'risk-1', category: 'risk', title: '危险源辨识登记' },
  { id: 'risk-2', category: 'risk', title: '高风险作业审批' },
  { id: 'risk-3', category: 'risk', title: '应急预案演练' },
  { id: 'risk-4', category: 'risk', title: '风险分级管控' },
  { id: 'risk-5', category: 'risk', title: '隐患排查治理' },
  { id: 'risk-6', category: 'risk', title: '事故报告流程' },
];

export function useConstructionStandards() {
  const getByCategory = (category: ConstructionStandardCategory) =>
    STANDARDS.filter((item) => item.category === category);

  return {
    tabs: CONSTRUCTION_STANDARD_TABS,
    icons: CONSTRUCTION_STANDARD_ICONS,
    standards: STANDARDS,
    getByCategory,
  };
}
