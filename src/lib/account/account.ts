// const API_URL = 'http://192.168.0.37:8087/api/account';
const API_URL = 'http://localhost:8087/api/account';

// 타입
export type EntryType = 'income' | 'fixed' | 'saving';
export type CardType = 'credit' | 'cash';

export interface Entry {
      id?: number;
      monthId?: number;
      type: EntryType;
      label: string;
      amount: number;
      cardType?: CardType;
}

export interface DailyExpense {
      id?: number;
      monthId?: number;
      expenseDate: string;
      label: string;
      amount: number;
      cardType: CardType;
      excludeBudget: boolean;
}

export interface MonthData {
      id: number;
      year: number;
      month: number;
      totalAsset: number;
      budget: number;
      budgetStartDate?: string;
      entries: Entry[];
      dailyExpenses: DailyExpense[];
}


// 상수
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

export const fmt = (amount: number) =>
      amount.toLocaleString('ko-KR') + '원';


// API 요청
async function request<T>(
      endpoint: string,
      options?: RequestInit
): Promise<T> {
      const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                  'Content-Type': 'application/json',
                  ...options?.headers,
            },
      });

      if (!response.ok) {
            const message = await response.text();
            throw new Error(message || '가계부 API 요청에 실패했습니다.');
      }

      return response.json() as Promise<T>;
}

// 월별 가계부 조회
export function getMonthly(year: number, month: number) {
      return request<MonthData>(
            `/monthly?year=${year}&month=${month}`
      );
}

// 월별 가계부 생성
export function saveMonthly(data: {
      year: number;
      month: number;
      budgetStartDate?: string;
}) {
      return request<{ success: boolean; message: string; id: number }>(
            '/monthly',
            {
                  method: 'PUT',
                  body: JSON.stringify(data),
            }
      );
}

// 수입 / 고정비 / 저축 조회
export function getEntries(year: number, month: number) {
      return request<Entry[]>(
            `/entries?year=${year}&month=${month}`
      );
}

// 항목 등록
export function createEntry(data: Entry) {
      return request<Entry>('/entries', {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 항목 수정
export function updateEntry(id: number, data: Entry) {
      return request<Entry>(`/entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 항목 삭제
export function deleteEntry(id: number) {
      return request<void>(`/entries/${id}`, {
            method: 'DELETE',
      });
}

// 일별 지출 조회
export function getExpenses(year: number, month: number) {
      return request<DailyExpense[]>(
            `/expenses?year=${year}&month=${month}`
      );
}

// 지출 등록
export function createExpense(data: DailyExpense) {
      return request<DailyExpense>('/expenses', {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 지출 수정
export function updateExpense(id: number, data: DailyExpense) {
      return request<DailyExpense>(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 지출 삭제
export function deleteExpense(id: number) {
      return request<void>(`/expenses/${id}`, {
            method: 'DELETE',
      });
}

// 지출 목표 수정
export function updateBudget(data: {
      year: number;
      month: number;
      budget: number;
}) {
      return request('/budget', {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 총재산 수정
export function updateAssets(data: {
      year: number;
      month: number;
      totalAsset: number;
}) {
      return request('/assets', {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// ===== 계산 유틸 =====

// 특정 타입 항목 합계
export function sumByType(entries: Entry[], type: EntryType): number {
      return entries
            .filter((entry) => entry.type === type)
            .reduce((sum, entry) => sum + entry.amount, 0);
}

// 특정 타입 + 카드 종류 합계
export function sumByTypeAndCard(
      entries: Entry[],
      type: EntryType,
      cardType: CardType
): number {
      return entries
            .filter((entry) => {
                  return entry.type === type && entry.cardType === cardType;
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
}

// 카드 종류별 금액 합계
export function sumByCard(
      items: { amount: number; cardType: CardType }[],
      cardType: CardType
): number {
      return items
            .filter((item) => item.cardType === cardType)
            .reduce((sum, item) => sum + item.amount, 0);
}

// 일별 지출 날짜별 그룹화
export function groupExpensesByDate(
      expenses: DailyExpense[]
): Record<string, DailyExpense[]> {
      return expenses.reduce<Record<string, DailyExpense[]>>(
            (result, expense) => {
                  const date = expense.expenseDate;

                  if (!result[date]) {
                        result[date] = [];
                  }

                  result[date].push(expense);

                  return result;
            },
            {}
      );
}

// 천 단위 쉼표 표시
export function formatAmount(value: string | number) {
      const number = Number(String(value).replace(/,/g, ''));

      if (Number.isNaN(number)) {
            return '';
      }

      return number.toLocaleString('ko-KR');
}

// 쉼표 제거 후 숫자 변환
export function parseAmount(value: string | number) {
      return Number(String(value).replace(/,/g, ''));
}