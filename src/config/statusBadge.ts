/** 彩色状态胶囊：语义色 + 业务状态调度，供 StatusBadge 复用 */

export type StatusBadgeTone = 'waiting' | 'progress' | 'done' | 'failed';

export type StatusBadgeSize = 'default' | 'compact';

export type StatusBadgeColors = {
  background: string;
  color: string;
};

export const STATUS_BADGE_TONES: Record<StatusBadgeTone, StatusBadgeColors> = {
  waiting: { background: '#dbeafe', color: '#2563eb' },
  progress: { background: '#dcfce7', color: '#15803d' },
  done: { background: '#f3f4f6', color: '#6b7280' },
  failed: { background: '#fee2e2', color: '#dc2626' },
};

export const STATUS_BADGE_SIZE = {
  default: { height: 52, paddingX: 24, fontSize: 24 },
  compact: { height: 44, paddingX: 20, fontSize: 22 },
} as const;

/**
 * 业务状态码 → 语义色。
 * 等待 waiting / 进行中 progress / 完成 done / 失败 failed
 * 新增状态只改这一处。
 */
export const STATUS_BADGE_TONE_BY_KEY: Record<string, StatusBadgeTone> = {
  pending_reply: 'waiting',
  pending: 'waiting',
  pending_pay: 'waiting',
  pending_confirm: 'waiting',
  pending_start: 'waiting',
  pending_acceptance: 'waiting',
  pending_confirm_time: 'waiting',
  pending_confirm_change: 'waiting',
  pending_visit: 'waiting',
  normal: 'waiting',

  in_progress: 'progress',
  in_maintenance: 'progress',
  service: 'progress',

  closed: 'done',
  completed: 'done',
  signed: 'done',
  paid: 'done',
  reviewed: 'done',

  cancelled: 'failed',
  urgent: 'failed',
  order_suspended: 'done',
  appointment_abnormal: 'failed',
};

export function resolveStatusBadgeTone(
  status?: string,
  tone?: StatusBadgeTone,
): StatusBadgeTone {
  if (tone) return tone;
  if (status && STATUS_BADGE_TONE_BY_KEY[status]) {
    return STATUS_BADGE_TONE_BY_KEY[status];
  }
  return 'done';
}

export function getStatusBadgeColors(
  status?: string,
  tone?: StatusBadgeTone,
): StatusBadgeColors {
  return STATUS_BADGE_TONES[resolveStatusBadgeTone(status, tone)];
}
