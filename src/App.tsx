import { useChartManager } from './hooks/useChartManager';
import TopBar from './components/TopBar';
import ChartCard from './components/ChartCard';

export default function App() {
  const manager = useChartManager();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <TopBar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <ChartCard
            chart={manager.chart}
            isOverLimit={manager.isOverLimit}
            totalDuration={manager.totalDuration}
            onUpdateChartMeta={manager.updateChartMeta}
            onUpdateEvent={manager.updateEvent}
            onRemoveEvent={manager.removeEvent}
            onAddEvent={manager.addEvent}
          />
        </div>
      </div>
    </div>
  );
}
