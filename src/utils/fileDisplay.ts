export type FileKind = 'image' | 'video' | 'pdf' | 'sheet' | 'doc' | 'file';

export const fileDisplayName = (path: string) => {
  const trimmed = path.replace(/\\/g, '/');
  const index = trimmed.lastIndexOf('/');
  return index >= 0 ? trimmed.slice(index + 1) : trimmed;
};

export const fileExt = (path: string) => {
  const name = fileDisplayName(path);
  const index = name.lastIndexOf('.');
  if (index < 0) return 'FILE';
  return name.slice(index + 1).toUpperCase();
};

export const fileKind = (path: string): FileKind => {
  const ext = fileExt(path).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'file';
};
