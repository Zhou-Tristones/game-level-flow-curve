import { ChartInstance, GameEvent } from '../types';
import EventTable from './EventTable';

interface EditingPanelProps {
  chart: ChartInstance;
  isOverLimit: boolean;
  totalDuration: number;
  onUpdateChartMeta: (chartId: string, field: 'title' | 'yAxisName', value: string) => void;
  onUpdateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (chartId: string, eventId: string) => void;
  onAddEvent: (chartId: string) => void;
}

export default function EditingPanel({
  chart,
  isOverLimit,
  totalDuration,
  onUpdateChartMeta,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
}: EditingPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label>
          <span className="block text-xs text-slate-400 mb-1">图表标题</span>
          <input
            type="text"
            value={chart.title}
            onChange={(e) => onUpdateChartMeta(chart.id, 'title', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </label>
        <label>
          <span className="block text-xs text-slate-400 mb-1">Y轴名称</span>
          <input
            type="text"
            value={chart.yAxisName}
            onChange={(e) => onUpdateChartMeta(chart.id, 'yAxisName', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </label>
      </div>

      <EventTable
        chartId={chart.id}
        events={chart.events}
        isOverLimit={isOverLimit}
        totalDuration={totalDuration}
        onUpdateEvent={onUpdateEvent}
        onRemoveEvent={onRemoveEvent}
        onAddEvent={onAddEvent}
      />
    </div>
  );
}
