// lib/data/account/store.ts
// import 'server-only';
import { MonthData } from '@/lib/data/types/account';

import { DATA_2026_07 } from './mock/2026-07';
import { DATA_2026_08 } from './mock/2026-08';
import { DATA_2026_09 } from './mock/2026-09';
import { DATA_2026_10 } from './mock/2026-10';

// 저장소
export const store: Record<string, MonthData> = {
      '2026-07': structuredClone(DATA_2026_07),
      '2026-08': structuredClone(DATA_2026_08),
      '2026-09': structuredClone(DATA_2026_09),
      '2026-10': structuredClone(DATA_2026_10),
};

export function readMonth(month: string): MonthData | undefined {
      return store[month];
}

export function writeMonth(month: string, data: MonthData) {
      store[month] = data;
}