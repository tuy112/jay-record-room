export type EmotionType =
      | 'happy'
      | 'sad'
      | 'angry'
      | 'calm'
      | 'excited'
      | 'anxious'
      | 'tired'
      | 'grateful';

export interface DiaryMusic {
      title: string;
      artist: string;
      link: string;
}

export interface DiaryEntry {
      id: string;
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