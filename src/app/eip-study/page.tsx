'use client';

import { useState, useMemo } from 'react';

import Header from '../../components/header';
import Footer from '../../components/footer';
import Board from '../../components/common/board';
import CommonModal from '../../components/common/modal';
import ContentRenderer from '../../components/common/contentRenderer';
import QuizList from '../../components/common/quiz';
import Pagination from '../../components/common/pagination';

import { studyBoardData, StudyBoardItem } from '../../lib/data/eip-study';
import styles from './page.module.css';

const PAGE_SIZE = 10;

export default function EipStudy() {
      const [selectedItem, setSelectedItem] = useState<StudyBoardItem | null>(null);
      const [isOpen, setIsOpen] = useState(false);

      // 탭 분리
      const subjects = useMemo(() => {
            return Array.from(
            new Set(studyBoardData.map((item) => item.subject))
            );
      }, []);

      const [activeSubject, setActiveSubject] =
            useState(subjects[0]);

      const filteredData = useMemo(() => {
            return studyBoardData.filter(
                  (item) => item.subject === activeSubject
            );
      }, [activeSubject]);

      // 페이지 처리
      const [page, setPage] = useState(1);
      const totalPages = Math.max(
            Math.ceil(filteredData.length / PAGE_SIZE), 1
      );
      const pagedData = filteredData.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE
      );

      // 탭 클릭 이벤트
      const handleTabClick = (subject: string) => {
            setActiveSubject(subject);
            setPage(1);
      };

      // 행 클릭 이벤트
      const handleRowClick = (
            item: StudyBoardItem
      ) => {
            setSelectedItem(item);
            setIsOpen(true);
      };

      const formatDate = (date: string) => {
            const [year, month, day] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      return (
            <>
                  <Header />

                  <main className={styles.detailPage}>
                        <div className={styles.detailPageInner}>
                        <section className={styles.detailPageHeader}>
                              <h1>정보처리기사 공부방</h1>
                              <p>8/15 정보처리기사 시험 준비방입니다.</p>
                        </section>

                        <section className={styles.detailPageContent}>
                              {/* 탭 분리 */}
                              <div className={styles.tabs}>
                                    {subjects.map((subject, index) => (
                                    <button
                                          key={subject}
                                          className={`${styles.tabButton} ${
                                                activeSubject === subject ? styles.tabButtonActive : ''
                                          }`}
                                          onClick={() => handleTabClick(subject)}
                                    >
                                          {`${index + 1}과목`}
                                    </button>
                                    ))}
                              </div>

                              <Board
                                    columns={[
                                    {
                                          key: 'title',
                                          label: '제목',
                                          width: '38%',
                                    },
                                    {
                                          key: 'subject',
                                          label: '과목',
                                          width: '20%',
                                          align: 'center',
                                    },
                                    {
                                          key: 'createdAt',
                                          label: '등록일',
                                          width: '20%',
                                          align: 'center',
                                    },
                                    ]}
                                    data={pagedData.map((item) => ({
                                    ...item,
                                    createdAt: formatDate(item.createdAt),
                                    }))}
                                    onRowClick={(row) =>
                                    handleRowClick(
                                          row as StudyBoardItem
                                    )
                                    }
                              />

                              {/* 페이지네이션 */}
                              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                        </section>
                        </div>
                  </main>

                  <Footer />

                  <CommonModal
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        className={styles.studyModal}
                  >
                        {selectedItem && (
                              <div className={styles.modalContent}>
                                    <span className={styles.topicBadge}>{selectedItem.subject}</span>
                                    <h3 className={styles.modalTitle}>{selectedItem.title}</h3>
                                    <p className={styles.modalSubtitle}>ID : {selectedItem.id}</p>
                                    <p className={styles.modalDate}>{formatDate(selectedItem.createdAt)}</p>

                                    <div className={styles.modalBody}>
                                    <ContentRenderer content={selectedItem.content} />

                                    {selectedItem.memoryTip && (
                                          <div className={styles.memorySection}>
                                                <p className={styles.sectionLabel}>💡 암기팁</p>
                                                <div className={styles.memoryBox}>
                                                <ContentRenderer content={selectedItem.memoryTip} />
                                                </div>
                                          </div>
                                    )}

                                    {selectedItem.quiz && selectedItem.quiz.length > 0 && (
                                          <div className={styles.quizSection}>
                                                <p className={styles.sectionLabel}>📝 관련 기출문제</p>
                                                <QuizList quiz={selectedItem.quiz} />
                                          </div>
                                    )}
                                    </div>

                                    <div className={styles.modalFooter}>
                                          <button className={styles.editButton} onClick={() => alert('수정 기능 준비중')}>
                                                수정
                                          </button>
                                    </div>
                              </div>
                        )}
                  </CommonModal>
            </>
      );
}