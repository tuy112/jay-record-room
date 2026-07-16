// 상태 + 집계
import { useState, useMemo, useEffect } from 'react';

import { store } from '../../../lib/data/account/store';
import { MonthData } from '../../../lib/data/types/account';
import { sumByType, sumByTypeAndCard, sumByCard, groupExpensesByDate } from '../utils';

export function useAccountData() {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  const current: MonthData | null = store[key] ?? null;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // 수입 / 고정지출 / 저축 / 카드별 지출 집계
  const summary = useMemo(() => {
    if (!current) return null;

    const income = sumByType(current.entries, 'income');
    const fixed  = sumByType(current.entries, 'fixed');
    const saving = sumByType(current.entries, 'saving');

    const fixedCredit = sumByTypeAndCard(current.entries, 'fixed', 'credit');
    const fixedCash   = sumByTypeAndCard(current.entries, 'fixed', 'cash');
    const dailyCredit = sumByCard(current.dailyExpenses, 'credit');
    const dailyCash   = sumByCard(current.dailyExpenses, 'cash');

    const creditExpense = fixedCredit + dailyCredit;
    const cashExpense   = fixedCash + dailyCash;
    const totalExpense  = creditExpense + cashExpense;
    const netBalance    = income - (saving + totalExpense);

    return { income, fixed, saving, creditExpense, cashExpense, totalExpense, netBalance };
  }, [current]);

  // 지출 목표 진행률
  const budget = useMemo(() => {
    if (!current || !summary) return null;

    const goal = current.budget;
    const startDate = current.budgetStartDate ?? null;
    const spent = startDate
      ? current.dailyExpenses.filter(e => e.date >= startDate).reduce((s, e) => s + e.amount, 0)
      : summary.totalExpense;

    const remaining = goal - spent;
    const progressPct = goal > 0 ? Math.min((spent / goal) * 100, 100) : 0;

    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const daysLeft = isCurrentMonth ? Math.max(lastDay - today.getDate(), 0) : null;

    return { goal, spent, remaining, progressPct, daysLeft };
  }, [current, summary, year, month]);

  // 일별 지출 그룹화 + 날짜순 정렬
  const groupedDaily = useMemo(
    () => (current ? groupExpensesByDate(current.dailyExpenses) : {}),
    [current]
  );
  const sortedDates = useMemo(() => Object.keys(groupedDaily).sort(), [groupedDaily]);

  // 날짜별 접기/펼치기 — 월이 바뀌면 전부 다시 접힘 (버그 수정: 기존엔 최초 마운트에만 적용됨)
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());
  useEffect(() => {
    setCollapsedDates(new Set(sortedDates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const toggleDate = (date: string) => {
    setCollapsedDates(prev => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  return {
    year, month, current,
    prevMonth, nextMonth,
    summary, budget,
    groupedDaily, sortedDates, collapsedDates, toggleDate,
  };
}