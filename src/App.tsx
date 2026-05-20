import { useChartManager } from './hooks/useChartManager';
import TopBar from './components/TopBar';
import ChartCard from './components/ChartCard';
import EditingPanel from './components/EditingPanel';

export default function App() {
  const m = useChartManager();

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      <TopBar clipboard={!!m.clipboard} />

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：三个预设图表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {m.charts.map((chart) => (
            <ChartCard
              key={chart.id}
              chart={chart}
              isSelected={chart.id === m.selectedChartId}
              hasClipboard={!!m.clipboard}
              onSelect={() => m.selectChart(chart.id)}
              onCopy={() => m.copyEvents(chart.id)}
              onPaste={() => m.pasteEvents(chart.id)}
              totalDuration={m.getDuration(chart.id)}
              isOverLimit={m.isOverLimit(chart.id)}
            />
          ))}
        </div>

        {/* 右侧：事件编辑面板 */}
        <div className="w-80 shrink-0 border-l border-slate-800 bg-slate-900/50 overflow-y-auto p-4">
          <EditingPanel
            chart={m.selectedChart}
            isOverLimit={m.isOverLimit(m.selectedChartId)}
            totalDuration={m.getDuration(m.selectedChartId)}
            onUpdateChartMeta={m.updateChartMeta}
            onUpdateEvent={m.updateEvent}
            onRemoveEvent={m.removeEvent}
            onAddEvent={m.addEvent}
          />
        </div>
      </div>
    </div>
  );
}
