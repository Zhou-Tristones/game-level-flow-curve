interface TopBarProps {
  clipboard: boolean;
}

export default function TopBar({ clipboard }: TopBarProps) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 h-12 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-white tracking-wide">游戏情绪流设计器</h1>
      {clipboard && (
        <span className="text-xs text-purple-400">已复制事件到剪贴板</span>
      )}
    </div>
  );
}
