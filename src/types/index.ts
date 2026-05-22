export interface SpecialMoment {
  id: string;
  name: string;
  icon: string;
  color: string;
  offsetMin: number;
  offsetSec: number;
  image?: string;
  comment?: string;
}

export interface GameEvent {
  id: string;
  name: string;
  durationMin: number;
  durationSec: number;
  startValue: number;
  endValue?: number;
  color?: string;
  moments?: SpecialMoment[];
}

export interface ChartInstance {
  id: string;
  title: string;
  yAxisName: string;
  events: GameEvent[];
  totalDurationLimit?: number;
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
