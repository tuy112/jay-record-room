// 가계부 상태 관리
import { useState, useMemo, useEffect } from 'react';

import {
      getMonthly,
      MonthData,
      sumByType,
      sumByTypeAndCard,
      sumByCard,
      groupExpensesByDate,
} from '@/lib/account/account';

export function useAccountData() {
      const now = new Date();

      const [year, setYear] = useState(now.getFullYear());
      const [month, setMonth] = useState(now.getMonth());

      const key = `${year}-${String(month + 1).padStart(2, '0')}`;

      const [current, setCurrent] = useState<MonthData | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // 1. 월별 가계부 조회
      useEffect(() => {
            let cancelled = false;

            const fetchMonthly = async () => {
                  setLoading(true);
                  setError(null);
                  setCurrent(null);

                  try {
                        const data = await getMonthly(year, month + 1);

                        if (cancelled) return;

                        setCurrent(data);
                  } catch (error) {
                        if (cancelled) return;

                        setError(
                              error instanceof Error
                                    ? error.message
                                    : '가계부 조회에 실패했습니다.'
                        );
                  } finally {
                        if (!cancelled) {
                              setLoading(false);
                        }
                  }
            };

            fetchMonthly();

            return () => {
                  cancelled = true;
            };
      }, [year, month]);

      // 2. 월 변경
      const prevMonth = () => {
            if (month === 0) {
                  setYear(year - 1);
                  setMonth(11);
                  return;
            }

            setMonth(month - 1);
      };

      const nextMonth = () => {
            if (month === 11) {
                  setYear(year + 1);
                  setMonth(0);
                  return;
            }

            setMonth(month + 1);
      };

      // 3. 수입 / 지출 / 저축 집계
      const summary = useMemo(() => {
            if (!current) return null;

            const income = sumByType(current.entries, 'income');
            const fixed = sumByType(current.entries, 'fixed');
            const saving = sumByType(current.entries, 'saving');

            const fixedCredit = sumByTypeAndCard(
                  current.entries,
                  'fixed',
                  'credit'
            );

            const fixedCash = sumByTypeAndCard(
                  current.entries,
                  'fixed',
                  'cash'
            );

            const dailyCredit = sumByCard(current.dailyExpenses, 'credit');
            const dailyCash = sumByCard(current.dailyExpenses, 'cash');

            const creditExpense = fixedCredit + dailyCredit;
            const cashExpense = fixedCash + dailyCash;
            const totalExpense = creditExpense + cashExpense;

            return {
                  income,
                  fixed,
                  saving,
                  creditExpense,
                  cashExpense,
                  totalExpense,
                  netBalance: income - saving - totalExpense,
            };
      }, [current]);

      // 4. 지출 목표 집계
      const budget = useMemo(() => {
            if (!current || !summary) return null;

            const goal = current.budget;
            const startDate = current.budgetStartDate;

            const spent = current.dailyExpenses
                  .filter((expense) => {
                        if (expense.excludeBudget) return false;

                        return (
                              !startDate ||
                              expense.expenseDate >= startDate
                        );
                  })
                  .reduce((sum, expense) => sum + expense.amount, 0);

            const remaining = goal - spent;

            const progressPct =
                  goal > 0 ? Math.min((spent / goal) * 100, 100) : 0;

            const lastDay = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            const isCurrentMonth =
                  today.getFullYear() === year &&
                  today.getMonth() === month;

            const daysLeft = isCurrentMonth
                  ? Math.max(lastDay - today.getDate(), 0)
                  : null;

            return {
                  goal,
                  spent,
                  remaining,
                  progressPct,
                  daysLeft,
            };
      }, [current, summary, year, month]);

      // 5. 날짜별 지출 그룹화
      const groupedDaily = useMemo(
            () => (current ? groupExpensesByDate(current.dailyExpenses) : {}),
            [current]
      );

      const sortedDates = useMemo(
            () => Object.keys(groupedDaily).sort(),
            [groupedDaily]
      );

      // 6. 날짜별 접기 / 펼치기
      const [collapsedDates, setCollapsedDates] = useState<Set<string>>(
            new Set()
      );

      useEffect(() => {
            setCollapsedDates(new Set(sortedDates));
      }, [key, sortedDates]);

      const toggleDate = (date: string) => {
            setCollapsedDates((prev) => {
                  const next = new Set(prev);

                  if (next.has(date)) {
                        next.delete(date);
                  } else {
                        next.add(date);
                  }

                  return next;
            });
      };

      return {
            year,
            month,
            current,
            loading,
            error,
            prevMonth,
            nextMonth,
            summary,
            budget,
            groupedDaily,
            sortedDates,
            collapsedDates,
            toggleDate,
      };
}