const API_URL = '/api/rms';

// RMS 게시글
export interface RmsPost {
      id: number;
      topic: string;
      title: string;
      subtitle: string;
      content: string;
      createdAt?: string | null;
      updatedAt?: string | null;
}

// 등록 및 수정 데이터
export type RmsDraft = {
      topic: string;
      title: string;
      subtitle: string;
      content: string;
};

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
export async function getRmsPosts(): Promise<RmsPost[]> {
      return request(API_URL);
}

// 상세 조회
export async function getRmsPost(id: number): Promise<RmsPost> {
      return request(`${API_URL}/${id}`);
}

// 등록
export async function createRmsPost(data: RmsDraft) {
      return request(API_URL, {
            method: 'POST',
            body: JSON.stringify(data),
      });
}

// 수정
export async function updateRmsPost(id: number, data: RmsDraft) {
      return request(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
      });
}

// 삭제
export async function deleteRmsPost(id: number) {
      return request(`${API_URL}/${id}`, {
            method: 'DELETE',
      });
}
