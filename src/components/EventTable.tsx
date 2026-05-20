import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GameEvent, DurationUnit } from '../types';
import { COLOR_PRESETS } from '../constants';

interface ColorSelectProps {
  value: string | undefined;
  onChange: (color: string) => void;
}

function ColorSelect({ value, onChange }: ColorSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-5 h-5 rounded-full border transition-all ${
          value ? 'border-white/60' : 'border-slate-600 border-dashed'
        }`}
        style={{ backgroundColor: value || 'transparent' }}
        title={value ? '点击更换颜色' : '点击选择背景色'}
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
                    value === c
                      ? 'border-white scale-110 ring-1 ring-white/30'
                      : 'border-slate-600 hover:scale-110 hover:border-slate-400'
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
  events: GameEvent[];
  isOverLimit: boolean;
  totalDuration: number;
  onUpdateEvent: (eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (eventId: string) => void;
  onAddEvent: () => void;
}

const UNIT_OPTIONS: { value: DurationUnit; label: string }[] = [
  { value: 's', label: '秒' },
  { value: 'm', label: '分' },
];

export default function EventTable({
  events,
  isOverLimit,
  totalDuration,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
}: EventTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">事件列表</h3>
        <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
          总时长: {totalDuration} / 30 分钟
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs">
              <th className="text-left py-2 pr-2 w-8">#</th>
              <th className="text-left py-2 px-2">事件名</th>
              <th className="text-left py-2 px-2 w-24">时长</th>
              <th className="text-left py-2 px-2 w-20">起始值</th>
              <th className="text-left py-2 px-2 w-20">结束值</th>
              <th className="text-left py-2 px-2 w-12">背景色</th>
              <th className="text-left py-2 pl-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const defaultEnd = event.endValue === undefined;
              return (
                <tr key={event.id} className="border-b border-slate-800/50">
                  <td className="py-2 pr-2 text-slate-500">{index + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={event.name}
                      onChange={(e) => onUpdateEvent(event.id, 'name', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={event.duration}
                        onChange={(e) => onUpdateEvent(event.id, 'duration', e.target.value)}
                        className={`flex-1 w-14 bg-slate-800 border rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                          isOverLimit ? 'border-red-500 text-red-300' : 'border-slate-700'
                        }`}
                      />
                      <select
                        value={event.durationUnit}
                        onChange={(e) => onUpdateEvent(event.id, 'durationUnit', e.target.value)}
                        className="w-12 bg-slate-800 border border-slate-700 rounded px-1 py-1 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer text-center"
                      >
                        {UNIT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={event.startValue}
                      onChange={(e) => onUpdateEvent(event.id, 'startValue', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={defaultEnd ? '' : event.endValue}
                      placeholder={`${event.startValue}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateEvent(event.id, 'endValue', val === '' ? '' : val);
                      }}
                      className={`w-full bg-slate-800 border rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                        defaultEnd
                          ? 'border-slate-700/50 text-slate-500 placeholder-slate-600'
                          : 'border-slate-700 text-white'
                      }`}
                    />
                  </td>
                  <td className="py-2 px-2 relative">
                    <ColorSelect
                      value={event.color}
                      onChange={(c) => onUpdateEvent(event.id, 'color', c)}
                    />
                  </td>
                  <td className="py-2 pl-2">
                    <button
                      onClick={() => onRemoveEvent(event.id)}
                      disabled={events.length <= 1}
                      className={`p-1 rounded transition-colors ${
                        events.length <= 1
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                      }`}
                      title="删除事件"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={onAddEvent}
        className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors py-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        添加事件
      </button>
    </div>
  );
}
