import { Copy, ClipboardPaste } from 'lucide-react';
import { ChartInstance } from '../types';
import EmotionAreaChart from './EmotionAreaChart';

interface ChartCardProps {
  chart: ChartInstance;
  isSelected: boolean;
  hasClipboard: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onPaste: () => void;
  isOverLimit: boolean;
}

export default function ChartCard({
  chart,
  isSelected,
  hasClipboard,
  onSelect,
  onCopy,
  onPaste,
  isOverLimit,
}: ChartCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col rounded-xl border-2 overflow-hidden transition-all cursor-pointer flex-1 min-h-0 ${
        isSelected
          ? 'border-purple-500 bg-slate-900 shadow-lg shadow-purple-500/10'
          : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 shrink-0">
        <h3 className="text-sm font-semibold text-white truncate min-w-0">
          {chart.title}
          <span className="font-normal text-slate-500 ml-1.5">
            · {chart.events.length} 事件
          </span>
          {isOverLimit && <span className="text-red-400 ml-1.5 text-xs font-normal">超限</span>}
        </h3>
        <div className="flex gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={onCopy}
            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-slate-800 transition-colors"
            title="复制此图表的事件"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {hasClipboard && (
            <button
              onClick={onPaste}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-slate-800 transition-colors"
              title="粘贴事件到此图表（覆盖原有事件）"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <EmotionAreaChart chart={chart} height="100%" />
      </div>
    </div>
  );
}
