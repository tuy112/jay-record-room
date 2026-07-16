// 가계부 DataType
export type EntryType = 'income' | 'fixed' | 'saving';
export type CardType = 'credit' | 'cash';

export interface Entry {
    id: string;
    type: EntryType;
    label: string;
    amount: number;
    cardType?: CardType;
}

export interface DailyExpense {
    date: string;
    label: string;
    amount: number;
    cardType: CardType;
}

export interface MonthData {
    totalAsset: number;
    budget: number; // 이번 달 지출 목표액
    budgetStartDate?: string; // 이 날짜부터 지출 리셋 챌린지 시작
    entries: Entry[];
    dailyExpenses: DailyExpense[];
}

// ===== 상수 =====
export const MONTHS = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
];

export const TYPE_LABELS: Record<EntryType, string> = {
    income: '수입',
    fixed: '고정지출',
    saving: '저축',
};

export const CARD_LABELS: Record<CardType, string> = {
    credit: '신용카드',
    cash: '체크카드',
};

// 유틸 
export const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';
// export const uid = () => Math.random().toString(36).slice(2, 9);
// export const initMonth = (): MonthData => ({ totalAsset: 0, entries: [] });