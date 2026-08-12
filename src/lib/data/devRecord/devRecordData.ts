import { DevRecord } from '@/lib/data/types/devRecord';

export const devRecordData: DevRecord[] = [
      {
            id: '1',
            date: '2026-08-11',
            category: 'Next.js',
            page: 'record-page',
            title: '일기장 UI 작업',
            content: 'DiaryPage에 감정 선택 컴포넌트 추가, mock data 연결',
            tags: ['Next.js', 'TypeScript'],
      },
      {
            id: '2',
            date: '2026-08-12',
            category: 'Next.js',
            page: 'travel-page',
            title: '세부 디테일 작업 + 데이터 추가',
            content: '여행 일정 상세 데이터 구조 추가 및 화면 반영',
            tags: ['Next.js', 'TypeScript'],
      },
      {
            id: '3',
            date: '2026-08-12',
            category: 'Next.js',
            page: 'record-page',
            title: '개발일지 페이지 추가',
            content: '개발일지 테이블 UI 및 mock data 구조 작업',
            tags: ['Next.js', 'TypeScript'],
      },
      {
            id: '4',
            date: '2026-08-12',
            category: 'Next.js',
            page: 'jstory - 메인',
            title: '구조 수정 작업 및 디테일링',
            content: 'profile + project 버튼 삭제 / 개발일지 페이지 미리보기가 Jstory 메인에 보이도록 수정 작업',
            tags: ['Next.js', 'TypeScript'],
      },
];