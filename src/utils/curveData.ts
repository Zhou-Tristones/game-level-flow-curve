import { GameEvent, CurvePoint, ReferenceAreaInfo } from '../types';
import { EVENT_COLORS } from '../constants';

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function toMinutes(durationMin: number, durationSec: number): number {
  return durationMin + durationSec / 60;
}

export function calculateCurvePoints(events: GameEvent[]): CurvePoint[] {
  if (events.length === 0) return [];

  const points: CurvePoint[] = [];
  let currentX = 0;

  events.forEach((event) => {
    const durationMin = toMinutes(event.durationMin, event.durationSec);
    const startX = currentX;
    const endX = startX + durationMin;
    const startY = event.startValue;
    const endY = event.endValue ?? event.startValue;

    points.push({ x: startX, y: startY });
    points.push({ x: endX, y: endY });

    currentX = endX;
  });

  return points;
}

export function calculateReferenceAreas(events: GameEvent[]): ReferenceAreaInfo[] {
  const areas: ReferenceAreaInfo[] = [];
  let currentX = 0;

  events.forEach((event, index) => {
    const durationMin = toMinutes(event.durationMin, event.durationSec);
    areas.push({
      x1: currentX,
      x2: currentX + durationMin,
      eventId: event.id,
      eventName: event.name,
      colorIndex: index % EVENT_COLORS.length,
      color: event.color,
    });
    currentX += durationMin;
  });

  return areas;
}

export function getTotalDuration(events: GameEvent[]): number {
  return events.reduce((sum, e) => sum + toMinutes(e.durationMin, e.durationSec), 0);
}

export function formatMinutesDisplay(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (s >= 60) return `${m + 1}m`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function formatTotalDuration(events: GameEvent[]): string {
  const totalSeconds = events.reduce((sum, e) => {
    return sum + e.durationMin * 60 + e.durationSec;
  }, 0);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}秒`;
  if (s === 0) return `${m}分钟`;
  return `${m}分${s}秒`;
}
