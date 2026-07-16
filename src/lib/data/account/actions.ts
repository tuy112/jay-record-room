// lib/data/account/actions.ts
// 가계부 추가 / 수정
'use server';

import { revalidatePath } from 'next/cache';
import { readMonth, writeMonth } from './store';
import { Entry, DailyExpense, MonthData } from '@/lib/data/types/account';

export async function getMonthData(month: string): Promise<MonthData | null> {
  return readMonth(month) ?? null;
}

export async function addEntry(month: string, entry: Omit<Entry, 'id'>) {
  const current = readMonth(month);
  if (!current) throw new Error(`${month} 데이터 없음`);

  const newEntry: Entry = { ...entry, id: crypto.randomUUID() };
  writeMonth(month, {
    ...current,
    entries: [...current.entries, newEntry],
  });

  revalidatePath('/account');
}

export async function addDailyExpense(month: string, expense: DailyExpense) {
  const current = readMonth(month);
  if (!current) throw new Error(`${month} 데이터 없음`);

  writeMonth(month, {
    ...current,
    dailyExpenses: [...current.dailyExpenses, expense],
  });

  revalidatePath('/account');
}

export async function updateAsset(month: string, totalAsset: number) {
  const current = readMonth(month);
  if (!current) throw new Error(`${month} 데이터 없음`);

  writeMonth(month, { ...current, totalAsset });
  revalidatePath('/account');
}