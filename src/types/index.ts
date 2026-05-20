export type DurationUnit = 's' | 'm';

export interface GameEvent {
  id: string;
  name: string;
  duration: number;
  durationUnit: DurationUnit;
  startValue: number;
  endValue?: number;
  color?: string;
}

export interface ChartInstance {
  id: string;
  title: string;
  yAxisName: string;
  events: GameEvent[];
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface ReferenceAreaInfo {
  x1: number;
  x2: number;
  eventId: string;
  eventName: string;
  colorIndex: number;
  color?: string;
}
