import { useState, useCallback } from 'react';
import { ChartInstance, GameEvent, SpecialMoment } from '../types';
import { createDefaultCharts, generateId } from '../constants';
import { getTotalDuration, getOverLimitEventIds } from '../utils/curveData';

export interface ChartManager {
  charts: ChartInstance[];
  selectedChartId: string;
  selectChart: (id: string) => void;
  selectedChart: ChartInstance;
  clipboard: GameEvent[] | null;
  clipboardInfo: { title: string; count: number } | null;
  copyEvents: (chartId: string) => void;
  pasteEvents: (chartId: string) => void;
  eventClipboard: GameEvent | null;
  eventClipboardInfo: { name: string; duration: string } | null;
  copyEvent: (chartId: string, eventId: string) => void;
  pasteEvent: (chartId: string, targetEventId?: string) => void;
  addEvent: (chartId: string) => void;
  updateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  removeEvent: (chartId: string, eventId: string) => void;
  updateChartMeta: (chartId: string, field: 'title' | 'yAxisName', value: string) => void;
  setTotalDurationLimit: (chartId: string, limit: number | undefined) => void;
  setTotalDurationToCurrent: (chartId: string) => void;
  getDuration: (chartId: string) => number;
  isOverLimit: (chartId: string) => boolean;
  getOverLimitEventIds: (chartId: string) => Set<string>;
  addMoment: (chartId: string, eventId: string) => void;
  updateMoment: (chartId: string, eventId: string, momentId: string, field: keyof SpecialMoment, value: string | number) => void;
  removeMoment: (chartId: string, eventId: string, momentId: string) => void;
}

export function useChartManager(): ChartManager {
  const [charts, setCharts] = useState<ChartInstance[]>(() => createDefaultCharts());
  const [selectedChartId, setSelectedChartId] = useState<string>(charts[0].id);
  const [clipboard, setClipboard] = useState<GameEvent[] | null>(null);
  const [clipboardInfo, setClipboardInfo] = useState<{ title: string; count: number } | null>(null);
  const [eventClipboard, setEventClipboard] = useState<GameEvent | null>(null);
  const [eventClipboardInfo, setEventClipboardInfo] = useState<{ name: string; duration: string } | null>(null);

  const selectedChart = charts.find(c => c.id === selectedChartId) ?? charts[0];

  const selectChart = useCallback((id: string) => {
    setSelectedChartId(id);
  }, []);

  const copyEvents = useCallback((chartId: string) => {
    const chart = charts.find(c => c.id === chartId);
    if (chart) {
      setClipboard(chart.events.map(e => ({ ...e })));
      setClipboardInfo({ title: chart.title, count: chart.events.length });
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
    if (event) {
      setEventClipboard({ ...event });
      const m = event.durationMin;
      const s = event.durationSec;
      const dur = s > 0 ? `${m}m${s}s` : `${m}m`;
      setEventClipboardInfo({ name: event.name, duration: dur });
    }
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
            moments: [],
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

  const setTotalDurationLimit = (chartId: string, limit: number | undefined) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return { ...chart, totalDurationLimit: limit };
    }));
  };

  const setTotalDurationToCurrent = (chartId: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      const total = getTotalDuration(chart.events);
      return { ...chart, totalDurationLimit: total };
    }));
  };

  const isOverLimit = (chartId: string): boolean => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart || chart.totalDurationLimit === undefined) return false;
    return getDuration(chartId) > chart.totalDurationLimit;
  };

  const getOverLimitIds = (chartId: string): Set<string> => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart || chart.totalDurationLimit === undefined) return new Set();
    return getOverLimitEventIds(chart.events, chart.totalDurationLimit);
  };

  const addMoment = (chartId: string, eventId: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: chart.events.map(evt => {
          if (evt.id !== eventId) return evt;
          return {
            ...evt,
            moments: [...(evt.moments || []), {
              id: generateId(),
              name: '特殊时刻',
              icon: '★',
              color: '#f59e0b',
              offsetMin: 0,
              offsetSec: 0,
            }],
          };
        }),
      };
    }));
  };

  const updateMoment = (chartId: string, eventId: string, momentId: string, field: keyof SpecialMoment, value: string | number) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: chart.events.map(evt => {
          if (evt.id !== eventId) return evt;
          return {
            ...evt,
            moments: (evt.moments || []).map(m => {
              if (m.id !== momentId) return m;
              if (field === 'offsetMin' || field === 'offsetSec') {
                const num = typeof value === 'string' ? parseInt(value, 10) : value;
                return { ...m, [field]: Math.max(0, Math.min(59, num || 0)) };
              }
              return { ...m, [field]: value };
            }),
          };
        }),
      };
    }));
  };

  const removeMoment = (chartId: string, eventId: string, momentId: string) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id !== chartId) return chart;
      return {
        ...chart,
        events: chart.events.map(evt => {
          if (evt.id !== eventId) return evt;
          return {
            ...evt,
            moments: (evt.moments || []).filter(m => m.id !== momentId),
          };
        }),
      };
    }));
  };

  return {
    charts,
    selectedChartId,
    selectChart,
    selectedChart,
    clipboard,
    clipboardInfo,
    copyEvents,
    pasteEvents,
    eventClipboard,
    eventClipboardInfo,
    copyEvent,
    pasteEvent,
    addEvent,
    updateEvent,
    removeEvent,
    updateChartMeta,
    setTotalDurationLimit,
    setTotalDurationToCurrent,
    getDuration,
    isOverLimit,
    getOverLimitEventIds: getOverLimitIds,
    addMoment,
    updateMoment,
    removeMoment,
  };
}
