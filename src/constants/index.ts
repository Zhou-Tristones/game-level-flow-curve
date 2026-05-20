import { ChartInstance, GameEvent } from '../types';

export const MAX_DURATION = 30;

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

function createDefaultEvents(): GameEvent[] {
  return [
    { id: generateId(), name: '开场探索', duration: 5, durationUnit: 'm', startValue: 5, endValue: 7 },
    { id: generateId(), name: '首次战斗', duration: 8, durationUnit: 'm', startValue: 7, endValue: 8 },
    { id: generateId(), name: '喘息时间', duration: 45, durationUnit: 's', startValue: 3, endValue: 3 },
  ];
}

export function createDefaultChart(): ChartInstance {
  return {
    id: generateId(),
    title: '第一关',
    yAxisName: '紧张感',
    events: createDefaultEvents(),
  };
}

let idCounter = 0;
export function generateId(): string {
  return `evt_${Date.now()}_${++idCounter}`;
}
