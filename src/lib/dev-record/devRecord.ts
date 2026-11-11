// const API_URL = 'http://192.168.0.37:8087/api/dev-record';
// const API_URL = 'http://localhost:8087/api/dev-record';
const API_URL = '/api/dev-record';

export interface DevRecord {
      id?: number;
      date: string;
      category: string;
      page: string;
      title: string;
      content: string;
      tags: string[];
}

// 공통 API 요청
async function request(url: string, options?: RequestInit) {
      const response = await fetch(url, {
            ...options,
            headers: {
                  'Content-Type': 'application/json',
                  ...options?.headers,
            },
            cache: 'no-store',
      });

      if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'API 요청에 실패했습니다.');
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
            return response.json();
      }

      return response.text();
}

// 목록 조회
export async function getDevRecordList(): Promise<DevRecord[]> {
      return request(API_URL);
}

// 상세 조회
export async function getDevRecord(id: number): Promise<DevRecord> {
      return request(`${API_URL}/${id}`);
}

// 등록
export async function createDevRecord(data: DevRecord) {
      return request(API_URL, {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 수정
export async function updateDevRecord(id: number, data: DevRecord) {
      return request(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 삭제
export async function deleteDevRecord(id: number) {
      return request(`${API_URL}/${id}`, {
            method: 'DELETE',
      });
}