import { useState, useCallback } from 'react';
import { ChartInstance, GameEvent } from '../types';
import { createDefaultCharts, generateId } from '../constants';
import { getTotalDuration } from '../utils/curveData';

export interface ChartManager {
  charts: ChartInstance[];
  selectedChartId: string;
  selectChart: (id: string) => void;
  selectedChart: ChartInstance;
  clipboard: GameEvent[] | null;
  copyEvents: (chartId: string) => void;
  pasteEvents: (chartId: string) => void;
  eventClipboard: GameEvent | null;
  copyEvent: (chartId: string, eventId: string) => void;
  pasteEvent: (chartId: string, targetEventId?: string) => void;
  addEvent: (chartId: string) => void;
  updateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  removeEvent: (chartId: string, eventId: string) => void;
  updateChartMeta: (chartId: string, field: 'title' | 'yAxisName', value: string) => void;
  getDuration: (chartId: string) => number;
  isOverLimit: (chartId: string) => boolean;
}

export function useChartManager(): ChartManager {
  const [charts, setCharts] = useState<ChartInstance[]>(() => createDefaultCharts());
  const [selectedChartId, setSelectedChartId] = useState<string>(charts[0].id);
  const [clipboard, setClipboard] = useState<GameEvent[] | null>(null);
  const [eventClipboard, setEventClipboard] = useState<GameEvent | null>(null);

  const selectedChart = charts.find(c => c.id === selectedChartId) ?? charts[0];

  const selectChart = useCallback((id: string) => {
    setSelectedChartId(id);
  }, []);

  const copyEvents = useCallback((chartId: string) => {
    const chart = charts.find(c => c.id === chartId);
    if (chart) {
      setClipboard(chart.events.map(e => ({ ...e })));
    }
  }, [charts]);

  const pasteEvents = useCallback((chartId: string) => {
    if (!clipboard) return;
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: clipboard.map(e => ({ ...e, id: generateId() })),
      };
    }));
  }, [clipboard]);

  const copyEvent = useCallback((chartId: string, eventId: string) => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart) return;
    const event = chart.events.find(e => e.id === eventId);
    if (event) setEventClipboard({ ...event });
  }, [charts]);

  const pasteEvent = useCallback((chartId: string, targetEventId?: string) => {
    if (!eventClipboard) return;
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      if (targetEventId) {
        // 覆盖指定事件，保留原 ID
        return {
          ...chart,
          events: chart.events.map(evt =>
            evt.id === targetEventId
              ? { ...eventClipboard, id: targetEventId, name: eventClipboard.name }
              : evt
          ),
        };
      }
      // 粘贴为新事件
      return {
        ...chart,
        events: [...chart.events, { ...eventClipboard, id: generateId() }],
      };
    }));
  }, [eventClipboard]);

  const addEvent = (chartId: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: [
          ...chart.events,
          {
            id: generateId(),
            name: '新事件',
            durationMin: 1,
            durationSec: 0,
            startValue: 5,
          },
        ],
      };
    }));
  };

  const updateEvent = (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: chart.events.map(evt => {
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
          if (field === 'durationMin' || field === 'durationSec') {
            const num = typeof value === 'string' ? parseInt(value, 10) : value;
            return { ...evt, [field]: Math.max(0, Math.min(59, num || 0)) };
          }
          return { ...evt, [field]: value };
        }),
      };
    }));
  };

  const removeEvent = (chartId: string, eventId: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      if (chart.events.length <= 1) return chart;
      return {
        ...chart,
        events: chart.events.filter(evt => evt.id !== eventId),
      };
    }));
  };

  const updateChartMeta = (chartId: string, field: 'title' | 'yAxisName', value: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return { ...chart, [field]: value };
    }));
  };

  const getDuration = (chartId: string): number => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart) return 0;
    return getTotalDuration(chart.events);
  };

  const isOverLimit = (chartId: string): boolean => {
    return getDuration(chartId) > 30;
  };

  return {
    charts,
    selectedChartId,
    selectChart,
    selectedChart,
    clipboard,
    copyEvents,
    pasteEvents,
    eventClipboard,
    copyEvent,
    pasteEvent,
    addEvent,
    updateEvent,
    removeEvent,
    updateChartMeta,
    getDuration,
    isOverLimit,
  };
}
