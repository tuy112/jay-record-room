export interface QuizQuestion {
    question: string;
    options: string[]; // 4개의 선택지
    answerIndex: number; // 정답 인덱스 (0~3)
    explanation: string;
}

export interface StudyBoardItem {
    id: number;
    title: string;
    subject: string;
    createdAt: string;
    content: string;
    memoryTip: string;
    quiz?: QuizQuestion[];
}