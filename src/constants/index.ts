import { ChartInstance, GameEvent } from '../types';

export const MAX_DURATION = 30;
export const CHART_COUNT = 3;

export const COLOR_PRESETS = [
  '#8b5cf6', // 紫
  '#3b82f6', // 蓝
  '#ef4444', // 红
  '#22c55e', // 绿
  '#eab308', // 黄
  '#a855f7', // 紫红
  '#f97316', // 橙
  '#06b6d4', // 青
];

export const EVENT_COLORS = [
  'rgba(139, 92, 246, 0.15)',
  'rgba(59, 130, 246, 0.15)',
  'rgba(239, 68, 68, 0.15)',
  'rgba(34, 197, 94, 0.15)',
  'rgba(234, 179, 8, 0.15)',
  'rgba(168, 85, 247, 0.15)',
];

export const EVENT_LABEL_COLORS = [
  'rgba(139, 92, 246, 0.85)',
  'rgba(59, 130, 246, 0.85)',
  'rgba(239, 68, 68, 0.85)',
  'rgba(34, 197, 94, 0.85)',
  'rgba(234, 179, 8, 0.85)',
  'rgba(168, 85, 247, 0.85)',
];

let idCounter = 0;
export function generateId(): string {
  return `evt_${Date.now()}_${++idCounter}`;
}

function makeEvents(events: Omit<GameEvent, 'id'>[]): GameEvent[] {
  return events.map(e => ({ ...e, id: generateId() }));
}

export function createDefaultCharts(): ChartInstance[] {
  return [
    {
      id: generateId(),
      title: '第一关',
      yAxisName: '紧张感',
      events: makeEvents([
        { name: '开场探索', duration: 5, durationUnit: 'm', startValue: 5, endValue: 7 },
        { name: '首次战斗', duration: 8, durationUnit: 'm', startValue: 7, endValue: 8 },
        { name: '喘息时间', duration: 45, durationUnit: 's', startValue: 3, endValue: 3 },
      ]),
    },
    {
      id: generateId(),
      title: '第二关',
      yAxisName: '刺激感',
      events: makeEvents([
        { name: '剧情引入', duration: 3, durationUnit: 'm', startValue: 4, endValue: 6 },
        { name: '追逐战', duration: 90, durationUnit: 's', startValue: 6, endValue: 9 },
        { name: '安全屋', duration: 4, durationUnit: 'm', startValue: 2, endValue: 2 },
      ]),
    },
    {
      id: generateId(),
      title: '第三关',
      yAxisName: '好奇心',
      events: makeEvents([
        { name: '谜题引入', duration: 6, durationUnit: 'm', startValue: 5, endValue: 5 },
        { name: '解谜高峰', duration: 10, durationUnit: 'm', startValue: 5, endValue: 9 },
        { name: '真相揭示', duration: 4, durationUnit: 'm', startValue: 9, endValue: 6 },
      ]),
    },
  ];
}
