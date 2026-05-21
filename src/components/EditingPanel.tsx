import { ChartInstance, GameEvent, SpecialMoment } from '../types';
import EventTable from './EventTable';

interface EditingPanelProps {
  chart: ChartInstance;
  isOverLimit: boolean;
  durationDisplay: string;
  hasEventClipboard: boolean;
  overLimitEventIds: Set<string>;
  onUpdateChartMeta: (chartId: string, field: 'title' | 'yAxisName', value: string) => void;
  onUpdateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (chartId: string, eventId: string) => void;
  onAddEvent: (chartId: string) => void;
  onCopyEvent: (chartId: string, eventId: string) => void;
  onPasteEvent: (chartId: string, targetEventId?: string) => void;
  onSetTotalDurationLimit: (chartId: string, limit: number | undefined) => void;
  onSetTotalDurationToCurrent: (chartId: string) => void;
  onAddMoment: (chartId: string, eventId: string, type: 'variation' | 'climax') => void;
  onUpdateMoment: (chartId: string, eventId: string, momentId: string, field: keyof SpecialMoment, value: string | number) => void;
  onRemoveMoment: (chartId: string, eventId: string, momentId: string) => void;
}

export default function EditingPanel({
  chart,
  isOverLimit,
  durationDisplay,
  hasEventClipboard,
  overLimitEventIds,
  onUpdateChartMeta,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
  onCopyEvent,
  onPasteEvent,
  onSetTotalDurationLimit,
  onSetTotalDurationToCurrent,
  onAddMoment,
  onUpdateMoment,
  onRemoveMoment,
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

      {/* 总时长限制 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0">关卡总时长限制</span>
          <div className="flex gap-0.5 items-center text-xs">
            <input
              type="number"
              min={0}
              value={chart.totalDurationLimit !== undefined ? Math.floor(chart.totalDurationLimit) : ''}
              placeholder="—"
              onChange={(e) => {
                const v = e.target.value;
                const m = v === '' ? 0 : (parseInt(v, 10) || 0);
                const prev = chart.totalDurationLimit ?? 0;
                const s = Math.round((prev - Math.floor(prev)) * 60);
                onSetTotalDurationLimit(chart.id, m + s / 60);
              }}
              className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors"
            />
            <span className="text-slate-500">m</span>
            <input
              type="number"
              min={0}
              max={59}
              value={chart.totalDurationLimit !== undefined ? Math.round((chart.totalDurationLimit - Math.floor(chart.totalDurationLimit)) * 60) : ''}
              placeholder="—"
              onChange={(e) => {
                const v = e.target.value;
                const s = v === '' ? 0 : (parseInt(v, 10) || 0);
                const prev = chart.totalDurationLimit ?? 0;
                const m = Math.floor(prev);
                onSetTotalDurationLimit(chart.id, m + s / 60);
              }}
              className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors"
            />
            <span className="text-slate-500">s</span>
          </div>
          <button
            onClick={() => onSetTotalDurationToCurrent(chart.id)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors ml-auto"
          >
            设为当前总时长
          </button>
          {chart.totalDurationLimit !== undefined && (
            <button
              onClick={() => onSetTotalDurationLimit(chart.id, undefined)}
              className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
            >
              清除
            </button>
          )}
        </div>
      </div>

      <EventTable
        chartId={chart.id}
        events={chart.events}
        isOverLimit={isOverLimit}
        durationDisplay={durationDisplay}
        hasEventClipboard={hasEventClipboard}
        totalDurationLimit={chart.totalDurationLimit}
        overLimitEventIds={overLimitEventIds}
        onUpdateEvent={onUpdateEvent}
        onRemoveEvent={onRemoveEvent}
        onAddEvent={onAddEvent}
        onCopyEvent={onCopyEvent}
        onPasteEvent={onPasteEvent}
        onAddMoment={onAddMoment}
        onUpdateMoment={onUpdateMoment}
        onRemoveMoment={onRemoveMoment}
      />
    </div>
  );
}
