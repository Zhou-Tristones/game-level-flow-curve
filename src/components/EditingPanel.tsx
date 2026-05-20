import { ChartInstance, GameEvent } from '../types';
import EventTable from './EventTable';

interface EditingPanelProps {
  chart: ChartInstance;
  isOverLimit: boolean;
  totalDuration: number;
  onUpdateChartMeta: (field: 'title' | 'yAxisName', value: string) => void;
  onUpdateEvent: (eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (eventId: string) => void;
  onAddEvent: () => void;
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
    <div className="p-5 border-t border-slate-800 bg-slate-900/50 space-y-5">
      <div className="flex gap-4">
        <label className="flex-1">
          <span className="block text-xs text-slate-400 mb-1">图表标题</span>
          <input
            type="text"
            value={chart.title}
            onChange={(e) => onUpdateChartMeta('title', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </label>
        <label className="flex-1">
          <span className="block text-xs text-slate-400 mb-1">Y轴名称</span>
          <input
            type="text"
            value={chart.yAxisName}
            onChange={(e) => onUpdateChartMeta('yAxisName', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </label>
      </div>

      <EventTable
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
