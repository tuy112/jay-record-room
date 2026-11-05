// API 호출부 (백 -> 프론트)
// const API_URL = 'http://192.168.0.37:8087/api/account';
const API_URL = 'http://localhost:8087/api/account';

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

      return response.json();
}

// 월별 가계부 조회
export function getMonthly(year: number, month: number) {
      
      return request(`/monthly?year=${year}&month=${month}`);
}

// 월별 가계부 생성
export function saveMonthly(data: {
      year: number;
      month: number;
      budgetStartDate?: string;
}) {
      return request('/monthly', {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 수입, 고정비, 저축 조회
export function getEntries(year: number, month: number) {
      
      return request(`/entries?year=${year}&month=${month}`);
}

// 항목 등록
export function createEntry(data: object) {
      return request('/entries', {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 항목 수정
export function updateEntry(id: number, data: object) {
      return request(`/entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 항목 삭제
export function deleteEntry(id: number) {
      return request(`/entries/${id}`, {
            method: 'DELETE',
      });
}

// 일별 지출 조회
export function getExpenses(year: number, month: number) {
    
      return request(`/expenses?year=${year}&month=${month}`);
}

// 지출 등록
export function createExpense(data: object) {
      return request('/expenses', {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 지출 수정
export function updateExpense(id: number, data: object) {
      return request(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 지출 삭제
export function deleteExpense(id: number) {
      return request(`/expenses/${id}`, {
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