import { useMemo, useState, useCallback, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { ChartInstance } from '../types';
import { calculateCurvePoints, calculateReferenceAreas, getTotalDuration, calculateSpecialMomentPoints, hexToRgba, formatMinutesDisplay } from '../utils/curveData';
import { EVENT_COLORS } from '../constants';

interface EmotionAreaChartProps {
  chart: ChartInstance;
  height?: number | string;
  fixedTooltips?: boolean;
  showMoments?: boolean;
}

export default function EmotionAreaChart({ chart, height = 200, fixedTooltips = false, showMoments = true }: EmotionAreaChartProps) {
  const points = useMemo(() => calculateCurvePoints(chart.events), [chart.events]);
  const referenceAreas = useMemo(() => calculateReferenceAreas(chart.events), [chart.events]);
  const totalDuration = useMemo(() => getTotalDuration(chart.events), [chart.events]);
  const momentPoints = useMemo(() => calculateSpecialMomentPoints(chart.events), [chart.events]);

  const momentRows = useMemo(() => {
    if (!fixedTooltips || momentPoints.length === 0) return [] as ('above' | 'below')[];
    const rows: ('above' | 'below')[] = [];
    let lastAboveX = -Infinity;
    let lastBelowX = -Infinity;
    const threshold = 0.16;
    for (let i = 0; i < momentPoints.length; i++) {
      const x = momentPoints[i].x;
      const distAbove = (x - lastAboveX) / Math.max(totalDuration, 1);
      const distBelow = (x - lastBelowX) / Math.max(totalDuration, 1);
      if (distAbove < threshold && distBelow >= threshold) {
        rows.push('below');
        lastBelowX = x;
      } else if (distBelow < threshold && distAbove >= threshold) {
        rows.push('above');
        lastAboveX = x;
      } else if (distAbove < threshold && distBelow < threshold) {
        if (distAbove > distBelow) {
          rows.push('above');
          lastAboveX = x;
        } else {
          rows.push('below');
          lastBelowX = x;
        }
      } else {
        rows.push('below');
        lastBelowX = x;
      }
    }
    return rows;
  }, [fixedTooltips, momentPoints, totalDuration]);

  const eventTicks = useMemo(() => {
    const xs = new Set<number>();
    referenceAreas.forEach(area => { xs.add(area.x1); xs.add(area.x2); });
    return Array.from(xs).sort((a, b) => a - b);
  }, [referenceAreas]);

  const [hoveredMoment, setHoveredMoment] = useState<{ name: string; icon: string; color: string; time: string; image?: string } | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleMomentEnter = useCallback((mp: typeof momentPoints[number]) => {
    clearHoverTimer();
    setHoveredMoment({
      name: mp.name,
      icon: mp.icon,
      color: mp.color,
      time: formatMinutesDisplay(mp.x),
      image: mp.image,
    });
  }, []);

  const handleMomentLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setHoveredMoment(null), 150);
  }, []);

  const handleTooltipEnter = useCallback(() => {
    clearHoverTimer();
  }, []);

  const handleTooltipLeave = useCallback(() => {
    setHoveredMoment(null);
  }, []);

  return (
    <div className="flex items-stretch h-full min-h-0">
      {/* 竖排 Y 轴标签 */}
      <div className="flex flex-col justify-center items-center px-0.5 py-2 shrink-0 select-none w-4">
        {chart.yAxisName.split('').map((char, i) => (
          <span
            key={i}
            className="text-[10px] font-medium leading-relaxed"
            style={{ color: '#c4b5fd' }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Above cards strip (zoom mode, overlapping moments) */}
        {showMoments && fixedTooltips && totalDuration > 0 && momentPoints.some((_mp, i) => momentRows[i] === 'above') && (
          <div className="relative flex-[1] ml-[38px] mr-[16px] min-h-0">
            {momentPoints.map((mp, i) => {
              if (momentRows[i] !== 'above') return null;
              const xMax = Math.max(totalDuration, 1);
              const leftPct = (mp.x / xMax) * 100;
              return (
                <div
                  key={`above-moment-${i}`}
                  className="absolute transform -translate-x-1/2 pointer-events-auto"
                  style={{ left: `${leftPct}%`, top: 4 }}
                >
                  <div className="flex flex-col items-center gap-1 bg-slate-800 border border-slate-600 rounded-lg p-1.5 shadow-lg" style={{ minWidth: 80 }}>
                    {mp.image && (
                      <img
                        src={mp.image}
                        alt={mp.name}
                        className="max-w-[140px] max-h-[80px] rounded object-contain cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all"
                        onClick={() => setLightboxImage(mp.image!)}
                      />
                    )}
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="text-base" style={{ color: mp.color }}>{mp.icon}</span>
                      <span className="text-white text-xs font-medium">{mp.name}</span>
                      <span className="text-[10px] text-slate-400">· {formatMinutesDisplay(mp.x)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={`relative min-h-0 ${fixedTooltips ? 'flex-[2]' : 'flex-1'}`}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={points}
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          >
            <defs>
              <linearGradient id={`gradient-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, Math.max(totalDuration, 1)]}
              stroke="#475569"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              ticks={eventTicks}
              tickFormatter={formatMinutesDisplay}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              label={typeof height === 'number' && height > 200 ? { value: '时间', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 11 } : undefined}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#475569"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              width={30}
            />
            {showMoments && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                }}
                labelFormatter={formatMinutesDisplay}
                formatter={(value: number) => [`${value}`, chart.yAxisName]}
              />
            )}
            {referenceAreas.map((area) => (
              <ReferenceArea
                key={area.eventId}
                x1={area.x1}
                x2={area.x2}
                fill={area.color ? hexToRgba(area.color, 0.15) : EVENT_COLORS[area.colorIndex]}
                fillOpacity={1}
                stroke="none"
              />
            ))}
            {showMoments && momentPoints.map((mp, i) => (
              <ReferenceLine
                key={`moment-line-${i}`}
                x={mp.x}
                stroke={mp.color}
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
            ))}
            <Area
              type="monotone"
              dataKey="y"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill={`url(#gradient-${chart.id})`}
              dot={false}
              activeDot={showMoments ? { r: 3, fill: '#a78bfa', stroke: '#fff', strokeWidth: 1.5 } : false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* X-axis moment markers + tooltips */}
        {showMoments && totalDuration > 0 && momentPoints.length > 0 && (
          <div className="absolute left-[38px] right-[16px] pointer-events-none" style={{ bottom: 22, height: 1 }}>
            {momentPoints.map((mp, i) => {
              const xMax = Math.max(totalDuration, 1);
              const leftPct = (mp.x / xMax) * 100;
              const isHovered = hoveredMoment?.name === mp.name && hoveredMoment?.time === formatMinutesDisplay(mp.x);
              return (
                <div
                  key={`moment-marker-${i}`}
                  className="absolute pointer-events-auto"
                  style={{ left: `${leftPct}%`, bottom: 0 }}
                  onMouseEnter={() => !fixedTooltips && handleMomentEnter(mp)}
                  onMouseLeave={() => !fixedTooltips && handleMomentLeave()}
                >
                  <div className={`-translate-x-1/2 ${!fixedTooltips ? 'cursor-pointer' : ''} ${isHovered && !fixedTooltips ? 'scale-110' : ''} transition-transform`}>
                    <div
                      className="text-xs leading-none font-medium"
                      style={{ color: mp.color }}
                    >
                      {mp.icon}
                    </div>
                  </div>
                  {/* Tooltip */}
                  {isHovered && !fixedTooltips && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 shadow-xl z-30 pointer-events-auto"
                      style={{ minWidth: 120 }}
                      onMouseEnter={handleTooltipEnter}
                      onMouseLeave={handleTooltipLeave}
                    >
                      {mp.image && (
                        <div className="mb-1.5 flex justify-center">
                          <img
                            src={mp.image}
                            alt={mp.name}
                            className="max-w-[200px] max-h-[150px] rounded object-contain cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all"
                            onClick={() => setLightboxImage(mp.image!)}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span style={{ color: mp.color }}>{mp.icon}</span>
                        <span className="text-white text-xs font-medium">{mp.name}</span>
                        <span className="text-[10px] text-slate-400">· {formatMinutesDisplay(mp.x)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Event name labels */}
        {totalDuration > 0 && (
          <div className="absolute top-0.5 left-[8px] right-[16px] flex pointer-events-none">
            {referenceAreas.map((area) => {
              const leftPct = ((area.x1 + area.x2) / 2 / totalDuration) * 100;
              return (
                <div
                  key={area.eventId}
                  className="absolute transform -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${leftPct}%` }}
                >
                  <span
                    className="text-[11px] font-medium text-white"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                  >
                    {area.eventName}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        </div>

        {/* Fixed tooltips strip (zoom mode) */}
        {showMoments && fixedTooltips && totalDuration > 0 && momentPoints.length > 0 && (
          <div className="relative flex-[1] ml-[38px] mr-[16px] min-h-0">
            {momentPoints.map((mp, i) => {
              if (momentRows[i] !== 'below') return null;
              const xMax = Math.max(totalDuration, 1);
              const leftPct = (mp.x / xMax) * 100;
              const compact = momentPoints.some((_, j) => momentRows[j] === 'above');
              return (
                <div
                  key={`fixed-moment-${i}`}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${leftPct}%`, top: 4 }}
                >
                  <div className={`flex flex-col items-center bg-slate-800 border border-slate-600 rounded-lg shadow-lg ${compact ? 'gap-1 p-1.5' : 'gap-1.5 p-2.5'}`} style={{ minWidth: compact ? 80 : 100 }}>
                    {mp.image && (
                      <img
                        src={mp.image}
                        alt={mp.name}
                        className={`rounded object-contain cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all ${compact ? 'max-w-[140px] max-h-[80px]' : 'max-w-[200px] max-h-[120px]'}`}
                        onClick={() => setLightboxImage(mp.image!)}
                      />
                    )}
                    <div className={`flex items-center whitespace-nowrap ${compact ? 'gap-1' : 'gap-1.5'}`}>
                      <span className={compact ? 'text-base' : 'text-lg'} style={{ color: mp.color }}>{mp.icon}</span>
                      <span className={`text-white font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{mp.name}</span>
                      <span className={`text-slate-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>· {formatMinutesDisplay(mp.x)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
