interface TopBarProps {
  chartClipboard: { title: string; count: number } | null;
  eventClipboard: { name: string; duration: string } | null;
}

export default function TopBar({ chartClipboard, eventClipboard }: TopBarProps) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 h-12 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-white tracking-wide">游戏情绪流设计器</h1>
      <div className="flex gap-3">
        {chartClipboard && (
          <span className="text-xs text-purple-400">
            已复制「{chartClipboard.title}」· {chartClipboard.count} 个事件
          </span>
        )}
        {eventClipboard && (
          <span className="text-xs text-purple-400">
            已复制事件「{eventClipboard.name}」{eventClipboard.duration}
          </span>
        )}
      </div>
    </div>
  );
}
