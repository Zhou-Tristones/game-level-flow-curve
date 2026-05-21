import { ChartInstance } from '../types';

export const CHART_COUNT = 3;

export const MOMENT_ICON_PRESETS = ['★', '◈', '▲', '●', '■', '◆', '⬆', '✦'];

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

export function createDefaultCharts(): ChartInstance[] {
  return [
    {
      id: generateId(),
      title: '第一关',
      yAxisName: '紧张感',
      events: [
        { id: generateId(), name: '开场探索', durationMin: 5, durationSec: 0, startValue: 5, endValue: 7 },
        { id: generateId(), name: '首次战斗', durationMin: 8, durationSec: 0, startValue: 7, endValue: 8 },
        { id: generateId(), name: '喘息时间', durationMin: 0, durationSec: 45, startValue: 3, endValue: 3 },
      ],
    },
    {
      id: generateId(),
      title: '第二关',
      yAxisName: '刺激感',
      events: [
        { id: generateId(), name: '剧情引入', durationMin: 3, durationSec: 0, startValue: 4, endValue: 6 },
        { id: generateId(), name: '追逐战', durationMin: 1, durationSec: 30, startValue: 6, endValue: 9 },
        { id: generateId(), name: '安全屋', durationMin: 4, durationSec: 0, startValue: 2, endValue: 2 },
      ],
    },
    {
      id: generateId(),
      title: '第三关',
      yAxisName: '好奇心',
      events: [
        { id: generateId(), name: '谜题引入', durationMin: 6, durationSec: 0, startValue: 5, endValue: 5 },
        { id: generateId(), name: '解谜高峰', durationMin: 10, durationSec: 0, startValue: 5, endValue: 9 },
        { id: generateId(), name: '真相揭示', durationMin: 4, durationSec: 0, startValue: 9, endValue: 6 },
      ],
    },
  ];
}
