'use client';

import { useState } from 'react';
import styles from './style.module.css';

interface QuizQuestion {
      question: string;
      options: string[];
      answerIndex: number;
      explanation: string;
}

interface QuizListProps {
      quiz: QuizQuestion[];
}

export default function QuizList({ quiz }: QuizListProps) {
      const [selected, setSelected] = useState<Record<number, number>>({});

      const handleSelect = (qIndex: number, optIndex: number) => {
            if (selected[qIndex] !== undefined) return; // 이미 답 고른 문제는 재선택 불가(다시풀기로만 초기화)
            setSelected((prev) => ({ ...prev, [qIndex]: optIndex }));
      };

      const handleRetry = (qIndex: number) => {
            setSelected((prev) => {
                  const next = { ...prev };
                  delete next[qIndex];
                  return next;
            });
      };

      return (
            <div className={styles.quizList}>
                  {quiz.map((q, qIndex) => {
                        const selectedOption = selected[qIndex];
                        const isRevealed = selectedOption !== undefined;
                        const isCorrectAnswer = selectedOption === q.answerIndex;

                        return (
                              <div key={qIndex} className={styles.quizItem}>
                                    <div className={styles.quizQuestionRow}>
                                          <span className={styles.quizNumber}>Q{qIndex + 1}</span>
                                          <p className={styles.quizQuestion}>{q.question}</p>
                                    </div>

                                    <div className={styles.optionList}>
                                    {q.options.map((option, optIndex) => {
                                          const isCorrectOption = optIndex === q.answerIndex;
                                          const isSelectedOption = optIndex === selectedOption;

                                          const classNames = [styles.optionButton];
                                          if (isRevealed && isCorrectOption) classNames.push(styles.optionCorrect);
                                          if (isRevealed && isSelectedOption && !isCorrectOption) classNames.push(styles.optionWrong);

                                          return (
                                                <button
                                                key={optIndex}
                                                type="button"
                                                className={classNames.join(' ')}
                                                onClick={() => handleSelect(qIndex, optIndex)}
                                                disabled={isRevealed}
                                                >
                                                <span className={styles.optionLabel}>
                                                      {String.fromCharCode(65 + optIndex)}
                                                </span>
                                                <span className={styles.optionText}>{option}</span>
                                                </button>
                                          );
                                    })}
                                    </div>

                                    {isRevealed && (
                                    <div className={styles.quizAnswerBox}>
                                          <p className={isCorrectAnswer ? styles.resultCorrect : styles.resultWrong}>
                                                {isCorrectAnswer
                                                ? '정답입니다 ✅'
                                                : `오답입니다 ❌ (정답 : ${String.fromCharCode(65 + q.answerIndex)})`}
                                          </p>
                                          <p className={styles.quizExplanation}>
                                                <span className={styles.quizExplanationLabel}>해설</span>
                                                {q.explanation}
                                          </p>
                                          <button
                                                type="button"
                                                className={styles.retryButton}
                                                onClick={() => handleRetry(qIndex)}
                                          >
                                                다시 풀기
                                          </button>
                                    </div>
                                    )}
                              </div>
                        );
                  })}
            </div>
      );
}