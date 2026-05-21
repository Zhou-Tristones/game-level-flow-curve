import { useState } from 'react';
import { Plus, Trash2, Copy, ClipboardPaste } from 'lucide-react';
import { GameEvent } from '../types';
import { COLOR_PRESETS, EVENT_COLORS } from '../constants';

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number;
  const l = (max + min) / 2;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s, l };
}

function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return rgbToHex(Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255));
}

function ColorSelect({ value, defaultColor, onChange }: { value: string | undefined; defaultColor: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string>('');
  const [showRgb, setShowRgb] = useState(false);

  const current = value || defaultColor;

  const openPopover = () => {
    setEditing(value || defaultColor);
    setShowRgb(false);
    setOpen(true);
  };

  const commitColor = (color: string) => {
    if (color && color !== value) {
      onChange(color === defaultColor ? '' : color);
    }
  };

  const closePopover = () => {
    commitColor(editing);
    setOpen(false);
  };

  const currentRgb = hexToRgb(editing || current);
  const { h } = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);
  const rgb = hexToRgb(editing || current);

  return (
    <div className="relative">
      <button
        onClick={openPopover}
        className={`w-5 h-5 rounded-full border-2 transition-all ${
          value ? 'border-white' : 'border-slate-600'
        }`}
        style={{ backgroundColor: current }}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={closePopover} />
          <div className="absolute top-7 right-0 z-20 bg-slate-800 border border-slate-700 rounded-lg p-2.5 shadow-xl w-56">
            {/* Row 1: Presets */}
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

            {/* Row 2: Hue slider bar */}
            <div className="mt-2.5">
              <input
                type="range"
                min={0}
                max={360}
                value={h}
                onInput={(e) => {
                  const hue = parseInt((e.target as HTMLInputElement).value, 10);
                  const cRgb = hexToRgb(editing || current);
                  const hsl = rgbToHsl(cRgb.r, cRgb.g, cRgb.b);
                  setEditing(hslToHex(hue, hsl.s, hsl.l));
                }}
                onChange={(e) => {
                  const hue = parseInt((e.target as HTMLInputElement).value, 10);
                  const cRgb = hexToRgb(editing || current);
                  const hsl = rgbToHsl(cRgb.r, cRgb.g, cRgb.b);
                  const color = hslToHex(hue, hsl.s, hsl.l);
                  setEditing(color);
                  commitColor(color);
                }}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-800
                  [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                style={{
                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
              />
            </div>

            {/* Row 3: Expandable RGB */}
            <button
              onClick={() => setShowRgb(!showRgb)}
              className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-300 transition-colors w-full"
            >
              <span className={`inline-block transition-transform ${showRgb ? 'rotate-90' : ''}`}>▶</span>
              RGB 编辑
            </button>
            {showRgb && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 w-2">R</span>
                <input
                  type="number"
                  min={0} max={255}
                  value={rgb.r}
                  onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setEditing(rgbToHex(v, rgb.g, rgb.b)); }}
                  className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-[10px] text-center focus:outline-none focus:border-purple-500
                    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-green-400 w-2">G</span>
                <input
                  type="number"
                  min={0} max={255}
                  value={rgb.g}
                  onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setEditing(rgbToHex(rgb.r, v, rgb.b)); }}
                  className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-[10px] text-center focus:outline-none focus:border-purple-500
                    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-blue-400 w-2">B</span>
                <input
                  type="number"
                  min={0} max={255}
                  value={rgb.b}
                  onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setEditing(rgbToHex(rgb.r, rgb.g, v)); }}
                  className="w-10 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-white text-[10px] text-center focus:outline-none focus:border-purple-500
                    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div
                  className="w-5 h-5 rounded-full border border-slate-600 ml-1 shrink-0"
                  style={{ backgroundColor: editing || current }}
                />
              </div>
            )}

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
  durationDisplay: string;
  hasEventClipboard: boolean;
  totalDurationLimit?: number;
  overLimitEventIds: Set<string>;
  onUpdateEvent: (chartId: string, eventId: string, field: keyof GameEvent, value: string | number) => void;
  onRemoveEvent: (chartId: string, eventId: string) => void;
  onAddEvent: (chartId: string) => void;
  onCopyEvent: (chartId: string, eventId: string) => void;
  onPasteEvent: (chartId: string, targetEventId?: string) => void;
}

export default function EventTable({
  chartId,
  events,
  isOverLimit,
  durationDisplay,
  hasEventClipboard,
  totalDurationLimit,
  overLimitEventIds,
  onUpdateEvent,
  onRemoveEvent,
  onAddEvent,
  onCopyEvent,
  onPasteEvent,
}: EventTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-300">事件列表</h3>
        <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
          总时长: {durationDisplay}
        </span>
      </div>

      <div className="space-y-2">
        {events.map((event, index) => {
          const defaultEnd = event.endValue === undefined;
          const eventOverLimit = totalDurationLimit !== undefined && overLimitEventIds.has(event.id);
          return (
            <div key={event.id} className={`rounded-lg p-3 space-y-2 ${
              eventOverLimit ? 'bg-red-900/20 border border-red-500/30' : 'bg-slate-800/50'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs w-4 ${eventOverLimit ? 'text-red-400' : 'text-slate-500'}`}>{index + 1}</span>
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) => onUpdateEvent(chartId, event.id, 'name', e.target.value)}
                  className={`flex-1 bg-slate-800 border rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                    eventOverLimit ? 'border-red-500 text-red-300' : 'border-slate-700'
                  }`}
                  placeholder="事件名"
                />
                <button
                  onClick={() => onCopyEvent(chartId, event.id)}
                  className="p-1 rounded text-slate-500 hover:text-purple-400 hover:bg-slate-800 transition-colors"
                  title="复制此事件"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {hasEventClipboard && (
                  <button
                    onClick={() => onPasteEvent(chartId, event.id)}
                    className="p-1 rounded text-slate-500 hover:text-purple-400 hover:bg-slate-800 transition-colors"
                    title="粘贴覆盖此事件"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onRemoveEvent(chartId, event.id)}
                  disabled={events.length <= 1}
                  className={`p-1 rounded transition-colors ${
                    events.length <= 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 items-center text-xs">
                  <input
                    type="number"
                    min={0}
                    value={event.durationMin}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'durationMin', e.target.value)}
                    className={`w-10 bg-slate-800 border rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors ${
                      eventOverLimit ? 'border-red-500 text-red-300' : 'border-slate-700'
                    }`}
                  />
                  <span className="text-slate-500">m</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={event.durationSec}
                    onChange={(e) => onUpdateEvent(chartId, event.id, 'durationSec', e.target.value)}
                    className={`w-10 bg-slate-800 border rounded px-1 py-0.5 text-white text-xs text-center focus:outline-none focus:border-purple-500 transition-colors ${
                      eventOverLimit ? 'border-red-500 text-red-300' : 'border-slate-700'
                    }`}
                  />
                  <span className="text-slate-500">s</span>
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
                  defaultColor={COLOR_PRESETS[index % EVENT_COLORS.length]}
                  onChange={(c) => onUpdateEvent(chartId, event.id, 'color', c)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onAddEvent(chartId)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors py-2 border border-dashed border-slate-700 rounded-lg hover:border-purple-500/50"
        >
          <Plus className="w-3.5 h-3.5" />
          添加事件
        </button>
        {hasEventClipboard && (
          <button
            onClick={() => onPasteEvent(chartId)}
            className="flex items-center justify-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors px-3 py-2 border border-dashed border-purple-500/50 rounded-lg hover:border-purple-500 bg-purple-500/5"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            粘贴为新事件
          </button>
        )}
      </div>
    </div>
  );
}
