import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip,
} from 'recharts';
import { ChartInstance } from '../types';
import { calculateCurvePoints, calculateReferenceAreas, getTotalDuration, hexToRgba } from '../utils/curveData';
import { EVENT_COLORS, EVENT_LABEL_COLORS } from '../constants';

interface EmotionAreaChartProps {
  chart: ChartInstance;
  height?: number | string;
}

export default function EmotionAreaChart({ chart, height = 200 }: EmotionAreaChartProps) {
  const points = useMemo(() => calculateCurvePoints(chart.events), [chart.events]);
  const referenceAreas = useMemo(() => calculateReferenceAreas(chart.events), [chart.events]);

  const totalDuration = useMemo(() => getTotalDuration(chart.events), [chart.events]);

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
      <div className="relative flex-1 min-w-0">
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
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              label={typeof height === 'number' && height > 200 ? { value: '时间 (分钟)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 11 } : undefined}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#475569"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              width={30}
            />
            {typeof height === 'number' && height > 200 && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                }}
                labelFormatter={(x: number) => `${x} 分钟`}
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
            <Area
              type="monotone"
              dataKey="y"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill={`url(#gradient-${chart.id})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

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
                    className="text-[9px] font-medium"
                    style={{ color: area.color ? hexToRgba(area.color, 0.85) : EVENT_LABEL_COLORS[area.colorIndex] }}
                  >
                    {area.eventName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
