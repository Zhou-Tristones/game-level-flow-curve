import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GameEvent, DurationUnit } from '../types';
import { COLOR_PRESETS } from '../constants';

function ColorSelect({ value, onChange }: { value: string | undefined; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-5 h-5 rounded-full border transition-all ${
          value ? 'border-white/60' : 'border-slate-600 border-dashed'
        }`}
        style={{ backgroundColor: value || 'transparent' }}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-7 right-0 z-20 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl">
            <div className="flex gap-1.5">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => { onChange(value === c ? '' : c); setOpen(false); }}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    value === c ? 'border-white scale-110 ring-1 ring-white/30' : 'border-slate-600 hover:scale-110 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            {value && (
              <button
                onClick={() => { onChange(''); setOpen(false); }}
                className="mt-2 w-full text-[10px] text-slate-400 hover:text-white text-center"
              >
                清除
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface EventTableProps {
  chartId: string;
  events: GameEvent[];
  isOverLimit: boolean;
  totalDuration: number;
  onUpdateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (chartId: string, eventId: string) => void;
  onAddEvent: (chartId: string) => void;
}

const UNIT_OPTIONS: { value: DurationUnit; label: string }[] = [
  { value: 's', label: '秒' },
  { value: 'm', label: '分' },
];

export default function EventTable({
  chartId,
  events,
  isOverLimit,
  totalDuration,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
}: EventTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-300">事件列表</h3>
        <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
          总时长: {totalDuration} / 30
        </span>
      </div>

      <div className="space-y-2">
        {events.map((event, index) => {
          const defaultEnd = event.endValue === undefined;
          return (
            <div key={event.id} className="bg-slate-800/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-4">{index + 1}</span>
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) => onUpdateEvent(chartId, event.id, 'name', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="事件名"
                />
                <button
                  onClick={() => onRemoveEvent(chartId, event.id)}
                  disabled={events.length <= 1}
                  className={`p-1 rounded transition-colors ${
                    events.length <= 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    min={1}
                    value={event.duration}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'duration', e.target.value)}
                    className={`w-12 bg-slate-800 border rounded px-1.5 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors ${
                      isOverLimit ? 'border-red-500 text-red-300' : 'border-slate-700'
                    }`}
                  />
                  <select
                    value={event.durationUnit}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'durationUnit', e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-0.5 py-0.5 text-white text-[10px] focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                  >
                    {UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>始</span>
                  <input
                    type="number"
                    min={0} max={10} step={0.1}
                    value={event.startValue}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'startValue', e.target.value)}
                    className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <span>→</span>
                  <input
                    type="number"
                    min={0} max={10} step={0.1}
                    value={defaultEnd ? '' : event.endValue}
                    placeholder={`${event.startValue}`}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'endValue', e.target.value === '' ? '' : e.target.value)}
                    className={`w-10 border rounded px-1 py-0.5 text-xs text-center focus:outline-none focus:border-purple-500 transition-colors ${
                      defaultEnd
                        ? 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                        : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                  <span>终</span>
                </div>

                <div className="flex-1" />
                <ColorSelect
                  value={event.color}
                  onChange={(c) => onUpdateEvent(chartId, event.id, 'color', c)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onAddEvent(chartId)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors py-2 border border-dashed border-slate-700 rounded-lg hover:border-purple-500/50"
      >
        <Plus className="w-3.5 h-3.5" />
        添加事件
      </button>
    </div>
  );
}
