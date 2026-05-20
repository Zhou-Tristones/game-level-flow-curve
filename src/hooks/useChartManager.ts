import { useState } from 'react';
import { ChartInstance, GameEvent } from '../types';
import { createDefaultChart, generateId } from '../constants';
import { getTotalDuration } from '../utils/curveData';

export interface ChartManager {
  chart: ChartInstance;
  totalDuration: number;
  isOverLimit: boolean;
  addEvent: () => void;
  updateEvent: (eventId: string, field: keyof GameEvent, value: string | number) => void;
  removeEvent: (eventId: string) => void;
  updateChartMeta: (field: 'title' | 'yAxisName', value: string) => void;
}

export function useChartManager(): ChartManager {
  const [chart, setChart] = useState<ChartInstance>(() => createDefaultChart());

  const totalDuration = getTotalDuration(chart.events);
  const isOverLimit = totalDuration > 30;

  const addEvent = () => {
    setChart(prev => ({
      ...prev,
      events: [
        ...prev.events,
        {
          id: generateId(),
          name: '新事件',
          duration: 3,
          durationUnit: 'm',
          startValue: 5,
        },
      ],
    }));
  };

  const updateEvent = (eventId: string, field: keyof GameEvent, value: string | number) => {
    setChart(prev => ({
      ...prev,
      events: prev.events.map(evt => {
        if (evt.id !== eventId) return evt;
        if (field === 'startValue' || field === 'endValue') {
          const num = typeof value === 'string' ? parseFloat(value) : value;
          if (isNaN(num)) return { ...evt, [field]: undefined };
          return { ...evt, [field]: Math.max(0, Math.min(10, num)) };
        }
        if (field === 'color') {
          const s = value as string;
          return { ...evt, color: s || undefined };
        }
        if (field === 'duration') {
          const num = typeof value === 'string' ? parseInt(value, 10) : value;
          return { ...evt, duration: Math.max(1, num || 1) };
        }
        if (field === 'durationUnit') {
          return { ...evt, durationUnit: value as 's' | 'm' };
        }
        return { ...evt, [field]: value };
      }),
    }));
  };

  const removeEvent = (eventId: string) => {
    setChart(prev => {
      if (prev.events.length <= 1) return prev;
      return {
        ...prev,
        events: prev.events.filter(evt => evt.id !== eventId),
      };
    });
  };

  const updateChartMeta = (field: 'title' | 'yAxisName', value: string) => {
    setChart(prev => ({ ...prev, [field]: value }));
  };

  return {
    chart,
    totalDuration,
    isOverLimit,
    addEvent,
    updateEvent,
    removeEvent,
    updateChartMeta,
  };
}
