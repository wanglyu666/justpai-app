export type ConstructionReportCategory = 'daily' | 'weekly' | 'ehs';

export type ConstructionReportItem = {
  id: string;
  category: ConstructionReportCategory;
  title: string;
  date: string;
  owner: string;
};

export type DailyReportSection = 'content' | 'trades' | 'plan' | 'photos';

export type DailyReportTradeStaff = {
  name: string;
  count: number;
};

export type DailyReportDetail = {
  area: string;
  progress: string;
  content: string;
  tradeStaff: DailyReportTradeStaff[];
  materials: string;
  issueResolution: string;
  nextDayContent: string;
  nextDayArea: string;
  nextDayStaff: string;
  photos: string[];
};

export const DAILY_REPORT_TABS: { id: DailyReportSection; label: string }[] = [
  { id: 'content', label: '施工内容' },
  { id: 'trades', label: '工种与材料' },
  { id: 'plan', label: '问题与次日计划' },
  { id: 'photos', label: '施工照片' },
];

export type WeeklyReportSection =
  | 'progress'
  | 'quality'
  | 'issues'
  | 'nextWeek'
  | 'others'
  | 'photos'
  | 'acceptance';

export type WeeklyReportDetail = {
  currentProgress: number;
  plannedProgress: number;
  laborArrangement: string;
  deviationAction: string;
  qualityAcceptance: string;
  qualityRectification: string;
  siteIssues: string;
  issueSolution: string;
  plannedContent: string;
  resourceDemand: string;
  ownerConfirmItems: string;
  otherOutstandingItems: string;
  photos: string[];
  acceptance: string[];
};

export const WEEKLY_REPORT_TABS: { id: WeeklyReportSection; label: string }[] = [
  { id: 'progress', label: '进度与内容' },
  { id: 'quality', label: '质量检查' },
  { id: 'issues', label: '问题与解决' },
  { id: 'nextWeek', label: '下周计划与内容' },
  { id: 'others', label: '其他事项' },
  { id: 'photos', label: '现场照片' },
  { id: 'acceptance', label: '验收记录' },
];

export type EhsReportSection =
  | 'summary'
  | 'nextPlan'
  | 'hazards'
  | 'trainingPhotos';

export type EhsReportDetail = {
  specialOperations: string;
  safetyEducationCount: number;
  trainingSummaryCount: number;
  educationTraining: string;
  nextPlan: string;
  hazardInspection: string;
  otherItems: string;
  trainingPhotos: string[];
};

export const EHS_REPORT_TABS: { id: EhsReportSection; label: string }[] = [
  { id: 'summary', label: '工作总结' },
  { id: 'nextPlan', label: '下周工作计划' },
  { id: 'hazards', label: '隐患排查和其他事项' },
  { id: 'trainingPhotos', label: '培训照片' },
];

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

const DAILY_DETAILS: Record<string, DailyReportDetail> = {
  'daily-1': {
    area: 'A 区地下室底板及侧墙施工段，含后浇带两侧各 8 米范围。',
    progress: '底板浇筑完成 85%，侧墙钢筋绑扎完成 60%，整体按计划推进。',
    content: '完成底板混凝土浇筑、侧墙竖向钢筋绑扎及止水钢板安装，并完成当日养护覆盖。',
    tradeStaff: [
      { name: '钢筋工', count: 18 },
      { name: '木工', count: 12 },
      { name: '混凝土工', count: 8 },
      { name: '电焊工', count: 4 },
    ],
    materials: 'C35 混凝土 220m³、HRB400 钢筋 16.5t、止水钢板 48m、木模板 320㎡。',
    issueResolution: '局部钢筋间距偏密，已现场调整；地泵管接头渗浆已处理。',
    nextDayContent: '继续侧墙钢筋绑扎，完成第一段模板支设，并安排下午混凝土浇筑。',
    nextDayArea: 'A 区地下室侧墙第一段及后浇带两侧作业面。',
    nextDayStaff: '钢筋工 18 人、木工 12 人、混凝土工 8 人，夜间值班 4 人。',
    photos: ['施工区域全景.jpg', '钢筋绑扎现场.jpg', '混凝土浇筑作业.jpg'],
  },
  'daily-2': {
    area: '现场临建区、钢筋加工棚及生活区通道。',
    progress: '当日应到 62 人，实到 59 人，出勤率 95%。',
    content: '完成人员进场登记、班前安全交底，并核对特种作业持证情况。',
    tradeStaff: [
      { name: '管理人员', count: 6 },
      { name: '作业人员', count: 53 },
    ],
    materials: '当日无大宗材料进场，劳保用品按班组补发。',
    issueResolution: '3 人因交通延误迟到，已补做交底。',
    nextDayContent: '按浇筑计划增派混凝土班组，并复核夜间值班安排。',
    nextDayArea: 'A 区底板浇筑段及临建通道。',
    nextDayStaff: '管理人员 6 人、作业人员 59 人，增派混凝土班组 8 人。',
    photos: ['人员进场登记.jpg', '班前安全交底.jpg'],
  },
  'daily-3': {
    area: '东侧材料堆场及搅拌站卸料区。',
    progress: '计划进场钢筋 18t，实收 17.6t；水泥 40t 已验收入库。',
    content: '完成钢筋、水泥进场验收、过磅及分区堆放，并更新材料台账。',
    tradeStaff: [
      { name: '材料员', count: 2 },
      { name: '司索工', count: 3 },
      { name: '叉车司机', count: 1 },
    ],
    materials: 'HRB400 钢筋 17.6t、P.O 42.5 水泥 40t、砂 28m³。',
    issueResolution: '一批钢筋质保书编号与炉批号暂未对应，已隔离待核。',
    nextDayContent: '待供应商补齐资料后放行，并安排模板进场验收。',
    nextDayArea: '东侧材料堆场及模板堆放区。',
    nextDayStaff: '材料员 2 人、司索工 3 人、叉车司机 1 人。',
    photos: ['钢筋进场验收.jpg', '材料分区堆放.jpg'],
  },
  'daily-4': {
    area: '塔吊覆盖范围及汽车吊作业区。',
    progress: '塔吊运行 7.5 小时，汽车吊配合钢筋吊运 4 小时。',
    content: '完成塔吊日常检查、吊运钢筋及模板，并记录台班油耗。',
    tradeStaff: [
      { name: '塔吊司机', count: 2 },
      { name: '信号工', count: 2 },
      { name: '汽车吊司机', count: 1 },
    ],
    materials: '柴油 86L，钢丝绳按点检更换备件 1 套。',
    issueResolution: '上午大风短暂停吊 40 分钟，风后已复检安全装置。',
    nextDayContent: '继续配合侧墙钢筋吊运，并安排月度保养。',
    nextDayArea: '塔吊覆盖范围及侧墙吊运作业区。',
    nextDayStaff: '塔吊司机 2 人、信号工 2 人、汽车吊司机 1 人。',
    photos: ['塔吊日常检查.jpg', '钢筋吊运作业.jpg'],
  },
  'daily-5': {
    area: 'A 区底板、后浇带及施工缝位置。',
    progress: '巡查 12 个点位，闭合整改 3 项一般问题。',
    content: '对钢筋保护层、施工缝清理及混凝土表观质量进行巡查记录。',
    tradeStaff: [
      { name: '质量员', count: 2 },
      { name: '施工员', count: 1 },
    ],
    materials: '无新增材料，使用垫块约 200 个。',
    issueResolution: '局部保护层垫块缺失，已当场补设。',
    nextDayContent: '复查昨日整改点，并旁站下次浇筑。',
    nextDayArea: 'A 区底板、后浇带及施工缝位置。',
    nextDayStaff: '质量员 2 人、施工员 1 人。',
    photos: ['保护层巡查.jpg', '施工缝清理.jpg'],
  },
  'daily-6': {
    area: '基坑临边、配电箱及钢筋加工棚。',
    progress: '安全巡检覆盖 9 个重点部位，隐患整改率 100%。',
    content: '检查临边防护、临时用电及动火作业票，完成班前喊话。',
    tradeStaff: [
      { name: '安全员', count: 2 },
      { name: '电工', count: 1 },
    ],
    materials: '安全网 20㎡、灭火器 2 具。',
    issueResolution: '一处临边栏杆扣件松动，已紧固并复查。',
    nextDayContent: '组织电焊作业专项交底，夜间巡查基坑照明。',
    nextDayArea: '基坑临边、配电箱及钢筋加工棚。',
    nextDayStaff: '安全员 2 人、电工 1 人，夜间巡查 2 人。',
    photos: ['临边防护检查.jpg', '临时用电巡查.jpg'],
  },
};

const DEFAULT_DAILY_DETAIL: DailyReportDetail = {
  area: '施工现场作业区域。',
  progress: '按当日计划推进。',
  content: '完成当日安排的施工作业内容。',
  tradeStaff: [{ name: '万能工', count: 1 }],
  materials: '材料按当日需用组织进场。',
  issueResolution: '暂无突出问题。',
  nextDayContent: '按施工进度计划继续组织作业。',
  nextDayArea: '按次日任务划分作业面。',
  nextDayStaff: '现场作业班组按计划投入。',
  photos: [],
};

const WEEKLY_DETAILS: Record<string, WeeklyReportDetail> = {
  'weekly-1': {
    currentProgress: 85,
    plannedProgress: 90,
    laborArrangement: '完成 A 区底板浇筑、侧墙竖向钢筋绑扎及止水钢板安装。钢筋工 18 人、木工 12 人、混凝土工 8 人。',
    deviationAction: '当前总进度落后原计划 5%，主要受钢筋到货延迟影响。已协调加急供货，并安排夜间绑扎追赶节点。',
    qualityAcceptance: '对保护层、施工缝及混凝土表观质量巡查 12 点，完成钢筋隐检及底板浇筑验收。',
    qualityRectification: '一般质量问题 3 项已闭合，复查合格；遗留点位列入下周跟踪。',
    siteIssues: '局部钢筋间距偏密；地泵管接头出现渗浆。',
    issueSolution: '已调整钢筋间距并复检；渗浆接头已处理，浇筑后复查无异常。',
    plannedContent: '完成侧墙第一段模板支设与浇筑，启动后浇带两侧防水节点施工；钢筋绑扎收口并旁站浇筑。',
    resourceDemand: '钢筋工 18 人、木工 12 人、混凝土工 8 人；侧墙模板一套、混凝土约 180 m³。',
    ownerConfirmItems: '夜间施工报审待甲方书面确认；材料到货计划需甲方确认供货窗口。',
    otherOutstandingItems: '周例会纪要待归档，后浇带防水节点做法需补充交底。',
    photos: ['周进度全景.jpg', '侧墙钢筋作业.jpg'],
    acceptance: ['底板浇筑验收记录.pdf', '钢筋隐检记录.pdf'],
  },
  'weekly-2': {
    currentProgress: 72,
    plannedProgress: 70,
    laborArrangement: '完成质量问题排查、整改旁站及闭合资料整理。质量员 2 人、施工员 1 人。',
    deviationAction: '当前总进度略超原计划 2%，整改闭合快于预期。下周重点复查遗留点位，避免反弹。',
    qualityAcceptance: '复查保护层垫块、施工缝清理及混凝土裂缝情况，整改点位已组织验收。',
    qualityRectification: '保护层不足处已补设垫块；细微裂缝按方案封闭，持续观察。',
    siteIssues: '局部保护层不足，混凝土表面存在细微裂缝。',
    issueSolution: '已补设垫块并完成复查；裂缝封闭后纳入观察台账，下周复检。',
    plannedContent: '对遗留点位进行闭合验收，开展浇筑前专项检查，旁站下次浇筑并复核整改效果。',
    resourceDemand: '质量员 2 人、施工员 1 人；检测工具及封闭材料按台账备齐。',
    ownerConfirmItems: '质量月报初稿待甲方审核确认后正式报送。',
    otherOutstandingItems: '裂缝观察点位需持续记录，闭合资料尚未全部归档。',
    photos: ['质量巡查现场.jpg', '整改闭合照片.jpg'],
    acceptance: ['质量整改验收单.pdf'],
  },
  'weekly-3': {
    currentProgress: 88,
    plannedProgress: 88,
    laborArrangement: '完成临边防护、临时用电及动火作业专项检查。安全员 2 人、电工 1 人。',
    deviationAction: '当前总进度与原计划一致。下周按计划组织专项交底，保持隐患闭环节奏。',
    qualityAcceptance: '安全设施按规范复核，防护网与配电箱标识完整，专项检查记录齐全。',
    qualityRectification: '临边栏杆扣件松动已紧固；电箱漏保已更换并复测合格。',
    siteIssues: '一处临边栏杆扣件松动；电箱漏保动作异常。',
    issueSolution: '扣件已紧固并复查；漏保已更换，临时用电恢复正常。',
    plannedContent: '组织电焊作业专项交底，开展高处作业专项检查，夜间巡查基坑照明。',
    resourceDemand: '安全员 2 人、电工 1 人；更新应急物资并补充临边防护扣件。',
    ownerConfirmItems: '应急演练时间与观摩安排待甲方确认。',
    otherOutstandingItems: '本周无事故事件，专项交底签到表待补齐。',
    photos: ['临边防护检查.jpg', '临时用电巡查.jpg'],
    acceptance: ['安全检查记录表.pdf'],
  },
  'weekly-4': {
    currentProgress: 80,
    plannedProgress: 84,
    laborArrangement: '完成机械日常保养、人员进场核验及特种作业持证复核。塔吊司机 2 人、信号工 2 人。',
    deviationAction: '当前总进度落后原计划 4%，大风停吊影响台班。已调整吊运窗口，增派信号工提高效率。',
    qualityAcceptance: '起重机械安全装置检查合格，司机交接班记录完整。',
    qualityRectification: '大风停吊后已复检塔吊，安全装置及钢丝绳状态正常。',
    siteIssues: '大风天气导致短暂停吊，吊运窗口压缩。',
    issueSolution: '已按预案停吊并复检，调整吊运窗口，增派信号工提高效率。',
    plannedContent: '安排塔吊月度保养，增派钢筋班配合侧墙吊运，核对本周台班油耗。',
    resourceDemand: '塔吊司机 2 人、信号工 2 人、钢筋班配合吊运；保养配件按维保清单准备。',
    ownerConfirmItems: '塔吊月度保养停机窗口待甲方确认，避免影响关键吊次。',
    otherOutstandingItems: '两名新进场信号工三级教育已完成，机械运转记录待归档。',
    photos: ['塔吊作业.jpg', '人员机械出勤.jpg'],
    acceptance: ['机械检查记录.pdf'],
  },
  'weekly-5': {
    currentProgress: 76,
    plannedProgress: 78,
    laborArrangement: '完成进场验收、过磅入库及周消耗盘点。材料员 2 人、司索工 3 人、叉车司机 1 人。',
    deviationAction: '当前总进度落后原计划 2%，待核钢筋暂未放行。资料补齐后即恢复使用，并插入模板进场。',
    qualityAcceptance: '质保资料与炉批号核对，进场材料验收及过磅记录齐全。',
    qualityRectification: '待核钢筋已隔离堆放，资料补齐后组织复验放行。',
    siteIssues: '一批钢筋质保书编号待补，暂未允许投入使用。',
    issueSolution: '已隔离并通知供应商补件，资料齐全后即复验放行。',
    plannedContent: '待资料齐全后放行钢筋，组织模板进场，盘点周转材并更新下周需用计划。',
    resourceDemand: '材料员 2 人、司索工 3 人、叉车司机 1 人；模板进场车次及堆场已预留。',
    ownerConfirmItems: '待核钢筋复验放行需甲方确认质保资料是否齐全。',
    otherOutstandingItems: '材料对账已同步商务部，周转材盘点差数待复核。',
    photos: ['材料进场验收.jpg', '堆场盘点.jpg'],
    acceptance: ['材料进场验收单.pdf'],
  },
  'weekly-6': {
    currentProgress: 92,
    plannedProgress: 95,
    laborArrangement: '梳理下周节点、资源投入及交叉作业安排。钢筋工 18 人、木工 12 人、混凝土工 8 人。',
    deviationAction: '当前总进度落后原计划 3%，模板周转偏紧。已增配一套支撑，下周追赶浇筑节点。',
    qualityAcceptance: '对下周浇筑段进行前置质量条件检查，钢筋与模板验收计划已排定。',
    qualityRectification: '模板周转偏紧已增配一套支撑，浇筑前条件复查安排在下周。',
    siteIssues: '模板周转偏紧，支撑数量不足影响浇筑节点。',
    issueSolution: '已协调增配一套支撑，下周按节点组织模板验收与浇筑。',
    plannedContent: '完成侧墙第一段浇筑并插入防水节点施工，含钢筋收口、模板验收、浇筑及养护。',
    resourceDemand: '钢筋工 18 人、木工 12 人、混凝土工 8 人；增配支撑一套、混凝土按浇筑方量备料。',
    ownerConfirmItems: '业主检查行程及现场开放范围待甲方确认。',
    otherOutstandingItems: '文明施工整治清单未全部销项，交叉作业时段需再协调。',
    photos: ['下周作业面.jpg', '现场准备情况.jpg'],
    acceptance: ['周计划确认单.pdf'],
  },
};

const DEFAULT_WEEKLY_DETAIL: WeeklyReportDetail = {
  currentProgress: 0,
  plannedProgress: 0,
  laborArrangement: '按计划组织主要施工内容及劳动力投入。',
  deviationAction: '进度与原计划基本一致，持续跟踪节点。',
  qualityAcceptance: '质量检查与验收按方案执行，未发现重大问题。',
  qualityRectification: '暂无待整改项，持续跟踪现场质量状态。',
  siteIssues: '本周暂无突出现场问题。',
  issueSolution: '按既有措施保持巡查与闭合，进展正常。',
  plannedContent: '按总进度计划组织下周施工内容。',
  resourceDemand: '劳动力与材料按周计划配置。',
  ownerConfirmItems: '暂无需要甲方确认的事项。',
  otherOutstandingItems: '暂无其他未尽事项。',
  photos: [],
  acceptance: [],
};

const EHS_DETAILS: Record<string, EhsReportDetail> = {
  'ehs-1': {
    specialOperations: '本周开展动火作业 3 次、有限空间作业 1 次，均完成作业许可及旁站监护。',
    safetyEducationCount: 4,
    trainingSummaryCount: 6,
    educationTraining: '组织扬尘防治、污水排放及夜间施工降噪专项培训，班组全员覆盖。',
    nextPlan: '开展雨季排水专项检查，复核沉淀池清淤及冲洗用水循环情况。',
    hazardInspection: '材料堆场裸土覆盖不严 1 处，已当场覆盖并复查合格。',
    otherItems: '环境监测周报已报送项目部，夜间噪声监测点位待增补。',
    trainingPhotos: ['环境巡查交底.jpg', '降尘措施培训.jpg'],
  },
  'ehs-2': {
    specialOperations: '本周开展高温作业防护检查，并完成电焊、切割等动火作业许可 2 次。',
    safetyEducationCount: 3,
    trainingSummaryCount: 5,
    educationTraining: '开展职业健康告知、防暑降温及一线体检注意事项培训。',
    nextPlan: '安排新进场人员职业健康告知，补充防暑药品与休息点。',
    hazardInspection: '两处作业面饮水点不足，已增设保温桶并明确责任人。',
    otherItems: '职业健康台账已更新，防暑专项交底签到待补 3 人。',
    trainingPhotos: ['职业健康交底.jpg', '高温防护培训.jpg'],
  },
  'ehs-3': {
    specialOperations: '本周开展高处作业 2 次、临时用电作业 1 次，作业前完成交底与防护验收。',
    safetyEducationCount: 5,
    trainingSummaryCount: 7,
    educationTraining: '组织临边防护、洞口作业及临时用电专项教育，隐患整改班组复训。',
    nextPlan: '组织高处作业专项检查，夜间复核基坑照明与临边防护。',
    hazardInspection: '配电箱漏保失效 1 处、临边栏杆缺失 1 处，均已整改并复测。',
    otherItems: '隐患台账已同步监理，下周安排复查抽查。',
    trainingPhotos: ['隐患排查交底.jpg', '整改复查现场.jpg'],
  },
  'ehs-4': {
    specialOperations: '本周组织消防应急演练 1 次，并完成动火作业许可 2 次。',
    safetyEducationCount: 2,
    trainingSummaryCount: 4,
    educationTraining: '开展灭火实操、疏散集合及应急物资使用培训，参演 28 人。',
    nextPlan: '针对演练暴露的集合点标识不清问题，组织复训并更新预案。',
    hazardInspection: '灭火器压力不足 2 具、应急通道堆物 1 处，已更换并清理。',
    otherItems: '演练评估报告待甲方确认，应急物资清单需补录。',
    trainingPhotos: ['应急演练现场.jpg', '灭火实操培训.jpg'],
  },
  'ehs-5': {
    specialOperations: '本周未安排高风险特殊作业，完成劳保用品进场验收及发放。',
    safetyEducationCount: 3,
    trainingSummaryCount: 4,
    educationTraining: '组织安全带、安全帽及护目镜正确佩戴培训，木工班现场复训。',
    nextPlan: '组织新批次防护用品验收，开展正确佩戴复训。',
    hazardInspection: '木工班 2 人未规范佩戴护目镜，已现场纠正并记录。',
    otherItems: '防护用品库存预警已报送物资部，破损安全帽待集中回收。',
    trainingPhotos: ['劳保发放现场.jpg', '防护用品佩戴培训.jpg'],
  },
  'ehs-6': {
    specialOperations: '本周开展临时用电作业许可 1 次，完成未遂事件分析及现场复盘。',
    safetyEducationCount: 2,
    trainingSummaryCount: 3,
    educationTraining: '组织事故案例学习与班前喊话强化培训，覆盖各作业班组。',
    nextPlan: '开展事故案例学习，强化班前喊话与危险作业许可。',
    hazardInspection: '未发现新增重大隐患，既有整改项已复查闭合。',
    otherItems: '未遂事件报告已归档，案例学习签到表待下周收齐。',
    trainingPhotos: ['案例学习现场.jpg', '班前安全讲话.jpg'],
  },
};

const DEFAULT_EHS_DETAIL: EhsReportDetail = {
  specialOperations: '本周暂无特殊作业。',
  safetyEducationCount: 0,
  trainingSummaryCount: 0,
  educationTraining: '本周暂无教育培训。',
  nextPlan: '按方案组织下周检查、交底与培训。',
  hazardInspection: '本周暂无新增重大隐患。',
  otherItems: '暂无其他事项。',
  trainingPhotos: [],
};

export function useConstructionReports() {
  const getByCategory = (category: ConstructionReportCategory) =>
    REPORTS.filter((item) => item.category === category);

  const getById = (id: string) =>
    REPORTS.find((item) => item.id === id) ?? null;

  const getDailyDetail = (id: string) =>
    DAILY_DETAILS[id] ?? DEFAULT_DAILY_DETAIL;

  const getWeeklyDetail = (id: string) =>
    WEEKLY_DETAILS[id] ?? DEFAULT_WEEKLY_DETAIL;

  const getEhsDetail = (id: string) =>
    EHS_DETAILS[id] ?? DEFAULT_EHS_DETAIL;

  return {
    tabs: CONSTRUCTION_REPORT_TABS,
    icons: CONSTRUCTION_REPORT_ICONS,
    reports: REPORTS,
    getByCategory,
    getById,
    getDailyDetail,
    getWeeklyDetail,
    getEhsDetail,
  };
}
