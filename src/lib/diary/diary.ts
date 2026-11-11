const API_URL = '/api/diary';
// const API_URL = 'http://localhost:8087/api/diary';

export type EmotionType =
      | 'happy'
      | 'sad'
      | 'angry'
      | 'calm'
      | 'excited'
      | 'anxious'
      | 'tired'
      | 'grateful';

export interface Diary {
      id?: number;
      diaryDate: string;
      emotion: EmotionType;
      title: string;
      content: string;
      musicTitle?: string;
      musicArtist?: string;
      musicLink?: string;
}

export interface DiaryMusic {
      title: string;
      artist: string;
      link: string;
}

export interface DiaryEntry {
      id: number;
      date: string;
      emotion: EmotionType;
      title: string;
      content: string;
      music: DiaryMusic;
}

export interface EmotionInfo {
      key: EmotionType;
      label: string;
      emoji: string;
      color: string;
}

export const emotionList: EmotionInfo[] = [
      { key: 'happy', label: '행복', emoji: '😊', color: '#fbbf24' },
      { key: 'sad', label: '슬픔', emoji: '😢', color: '#60a5fa' },
      { key: 'angry', label: '화남', emoji: '😠', color: '#f87171' },
      { key: 'calm', label: '평온', emoji: '😌', color: '#34d399' },
      { key: 'excited', label: '설렘', emoji: '🤩', color: '#f472b6' },
      { key: 'anxious', label: '불안', emoji: '😰', color: '#a78bfa' },
      { key: 'tired', label: '피곤', emoji: '😴', color: '#94a3b8' },
      { key: 'grateful', label: '감사', emoji: '🙏', color: '#fb923c' },
];

// 일기 목록 조회
export async function getDiaryList(): Promise<Diary[]> {
      const response = await fetch(API_URL, {
            cache: 'no-store',
      });

      if (!response.ok) {
            throw new Error('일기 목록 조회에 실패했습니다.');
      }

      return response.json();
}

// 일기 상세 조회
export async function getDiaryDetail(id: number): Promise<Diary> {
      const response = await fetch(`${API_URL}/${id}`, {
            cache: 'no-store',
      });

      if (!response.ok) {
            throw new Error('일기 상세 조회에 실패했습니다.');
      }

      return response.json();
}

// 일기 등록
export async function createDiary(diary: Diary): Promise<number> {
      const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(diary),
      });

      if (!response.ok) {
            const message = await response.text();
            console.error('일기 등록 오류:', message);
            throw new Error('일기 등록에 실패했습니다.');
      }

      return response.json();
}

// 일기 수정
export async function updateDiary(
      id: number,
      diary: Diary
): Promise<number> {
      const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(diary),
      });

      if (!response.ok) {
            throw new Error('일기 수정에 실패했습니다.');
      }

      return response.json();
}

// 일기 삭제
export async function deleteDiary(id: number): Promise<number> {
      const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
      });

      if (!response.ok) {
            throw new Error('일기 삭제에 실패했습니다.');
      }

      return response.json();
}