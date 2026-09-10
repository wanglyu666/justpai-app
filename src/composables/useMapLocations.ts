export type MapPoi = {
  id: string;
  name: string;
  address: string;
  distance: string;
  province: string;
  city: string;
  district: string;
  shiftX: number;
  shiftY: number;
};

export type MapCity = {
  name: string;
  province: string;
};

export const MAP_CITIES: MapCity[] = [
  { name: '鄂尔多斯市', province: '内蒙古自治区' },
  { name: '北京市', province: '北京市' },
  { name: '上海市', province: '上海市' },
];

const ORDOS_POIS: MapPoi[] = [
  {
    id: 'ordos-1',
    name: '纳林希里小学',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里邮政所附近',
    distance: '5m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: 0,
    shiftY: 0,
  },
  {
    id: 'ordos-2',
    name: '红庆河镇纳林希里村退役军人服务站',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里村',
    distance: '297m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: 8,
    shiftY: -6,
  },
  {
    id: 'ordos-3',
    name: '纳林希里邮电所',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里村',
    distance: '255m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: -10,
    shiftY: -12,
  },
  {
    id: 'ordos-4',
    name: '纳林希里一队',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里村',
    distance: '752m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: 14,
    shiftY: 8,
  },
  {
    id: 'ordos-5',
    name: '纳林希里村七社',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里村安线',
    distance: '718m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: -6,
    shiftY: 10,
  },
  {
    id: 'ordos-6',
    name: '纳林希里村村委会',
    address: '内蒙古自治区鄂尔多斯市伊金霍洛旗纳林希里小学附近',
    distance: '298m',
    province: '内蒙古自治区',
    city: '鄂尔多斯市',
    district: '伊金霍洛旗',
    shiftX: 4,
    shiftY: 12,
  },
];

const BEIJING_POIS: MapPoi[] = [
  {
    id: 'bj-1',
    name: '住邦2000商务中心',
    address: '北京市朝阳区西大望路甲12号',
    distance: '12m',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    shiftX: 0,
    shiftY: 0,
  },
  {
    id: 'bj-2',
    name: '国贸商城',
    address: '北京市朝阳区建国门外大街1号',
    distance: '640m',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    shiftX: 10,
    shiftY: -8,
  },
  {
    id: 'bj-3',
    name: '三里屯太古里',
    address: '北京市朝阳区三里屯路19号',
    distance: '1.2km',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    shiftX: -12,
    shiftY: 6,
  },
];

const SHANGHAI_POIS: MapPoi[] = [
  {
    id: 'sh-1',
    name: '恒生银行大厦',
    address: '上海市浦东新区陆家嘴环路1000号',
    distance: '18m',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    shiftX: 0,
    shiftY: 0,
  },
  {
    id: 'sh-2',
    name: '上海中心大厦',
    address: '上海市浦东新区银城中路501号',
    distance: '420m',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    shiftX: 8,
    shiftY: 4,
  },
  {
    id: 'sh-3',
    name: '东方明珠',
    address: '上海市浦东新区世纪大道1号',
    distance: '890m',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    shiftX: -10,
    shiftY: -6,
  },
];

const CITY_POIS: Record<string, MapPoi[]> = {
  鄂尔多斯市: ORDOS_POIS,
  北京市: BEIJING_POIS,
  上海市: SHANGHAI_POIS,
};

export const DEFAULT_MAP_CITY = '鄂尔多斯市';

export const resolveMapCity = (city?: string) => {
  const name = city?.trim() || '';
  if (name && CITY_POIS[name]) return name;
  return DEFAULT_MAP_CITY;
};

export const getPoisByCity = (city: string) => CITY_POIS[resolveMapCity(city)] ?? ORDOS_POIS;

export const findPoiByName = (name: string, city?: string) => {
  const keyword = name.trim();
  if (!keyword) return null;
  const list = city ? getPoisByCity(city) : Object.values(CITY_POIS).flat();
  return list.find((item) => item.name === keyword) ?? null;
};
