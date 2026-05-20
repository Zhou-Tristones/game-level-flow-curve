import { GameEvent, CurvePoint, ReferenceAreaInfo } from '../types';
import { EVENT_COLORS } from '../constants';

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function toMinutes(duration: number, unit: 's' | 'm'): number {
  const raw = unit === 's' ? duration / 60 : duration;
  return Math.round(raw * 10) / 10;
}

export function calculateCurvePoints(events: GameEvent[]): CurvePoint[] {
  if (events.length === 0) return [];

  const points: CurvePoint[] = [];
  let currentX = 0;

  events.forEach((event) => {
    const durationMin = toMinutes(event.duration, event.durationUnit);
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
    const durationMin = toMinutes(event.duration, event.durationUnit);
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
  return events.reduce((sum, e) => sum + toMinutes(e.duration, e.durationUnit), 0);
}
