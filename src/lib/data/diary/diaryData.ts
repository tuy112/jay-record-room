import { DiaryEntry, EmotionInfo } from '../types/diaryTypes';

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
                                                                                                                                                       
export const diaryEntries: DiaryEntry[] = [
      {
            id: '1',
            date: '2026-08-05',
            emotion: 'sad',
            title: '빛나 생일...',
            content: '오늘은 빛나 생일이다..톡을 안 읽길래 끝났음을 알고있는데 그래도 아가를 위해 선물은 해주고싶었다..나도 사랑했고 언제든지 나한테 와줘ㅠ.. 늘 같은 자리에서 기다릴게',
            music: { title: '닫혀진 사랑을 향해', artist: '엠씨더맥스', link: 'https://www.youtube.com/watch?v=16xqfAu8iEk&list=RD16xqfAu8iEk&start_radio=1' },
      },
      {
            id: '2',
            date: '2026-08-08',
            emotion: 'calm',
            title: '야볼 정모',
            content: '야볼 정모를 위해 강남역 교촌치킨으로 간 날이다.',
            music: { title: 'Giants Love Song', artist: 'B.cruz', link: 'https://www.youtube.com/watch?v=G7A_VLkSucM' },
      },
      {
            id: '3',
            date: '2026-08-11',
            emotion: 'calm',
            title: '금정구청 8월 정기점검날',
            content: '금정구청으로 8월 정기점검을 완료하고 온 날이다. 이번 달도 잘 마무리했다.',
            music: { title: '구름이 피어낸 꽃', artist: 'NealK', link: 'https://www.youtube.com/watch?v=yE-GXvYkC7o&list=RDyE-GXvYkC7o&start_radio=1' },
      },
];