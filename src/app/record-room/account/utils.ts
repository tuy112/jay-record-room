// 순수 계산 함수 모음
import { DailyExpense, Entry, EntryType, CardType } from '../../lib/data/types/account';

/** 특정 타입 항목 합계 (예: 수입 전체) */
export function sumByType(entries: Entry[], type: EntryType): number {
  return entries.filter(e => e.type === type).reduce((sum, e) => sum + e.amount, 0);
}

/** 특정 타입 + 카드 종류 조합 합계 (예: 고정지출 중 신용카드분) */
export function sumByTypeAndCard(entries: Entry[], type: EntryType, cardType: CardType): number {
  return entries
    .filter(e => e.type === type && e.cardType === cardType)
    .reduce((sum, e) => sum + e.amount, 0);
}

/** 카드 종류별 금액 합계 (일별 지출 등 amount + cardType만 있으면 재사용 가능) */
export function sumByCard(items: { amount: number; cardType: CardType }[], cardType: CardType): number {
  return items.filter(i => i.cardType === cardType).reduce((sum, i) => sum + i.amount, 0);
}

/** 일별 지출을 날짜별로 그룹화 */
export function groupExpensesByDate(expenses: DailyExpense[]): Record<string, DailyExpense[]> {
  return expenses.reduce<Record<string, DailyExpense[]>>((acc, e) => {
    acc[e.date] = [...(acc[e.date] ?? []), e];
    return acc;
  }, {});
}