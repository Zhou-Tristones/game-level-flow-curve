import { ChartInstance, GameEvent } from '../types';
import EmotionAreaChart from './EmotionAreaChart';
import EditingPanel from './EditingPanel';

interface ChartCardProps {
  chart: ChartInstance;
  isOverLimit: boolean;
  totalDuration: number;
  onUpdateChartMeta: (field: 'title' | 'yAxisName', value: string) => void;
  onUpdateEvent: (eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (eventId: string) => void;
  onAddEvent: () => void;
}

export default function ChartCard({
  chart,
  isOverLimit,
  totalDuration,
  onUpdateChartMeta,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
}: ChartCardProps) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg shadow-black/20">
      <div className="px-5 py-3 border-b border-slate-800/50">
        <h2 className="text-sm font-semibold text-white">{chart.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{chart.yAxisName} · {chart.events.length} 个事件 · 总时长 {totalDuration} 分钟</p>
      </div>

      <EmotionAreaChart chart={chart} />

      <EditingPanel
        chart={chart}
        isOverLimit={isOverLimit}
        totalDuration={totalDuration}
        onUpdateChartMeta={onUpdateChartMeta}
        onUpdateEvent={onUpdateEvent}
        onRemoveEvent={onRemoveEvent}
        onAddEvent={onAddEvent}
      />
    </div>
  );
}
