'use client';

import { useMemo, useState } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Board from '@/components/common/board';
import CommonModal from '@/components/common/modal';
import ContentRenderer from '@/components/common/codeRenderer';
import QuizList from '@/components/common/quiz';
import Pagination from '@/components/common/pagination';

import { devRecordData } from '@/lib/data/devRecord/devRecordData';
import { knowledgePosts, KnowledgeItem } from '@/lib/data/knowledge';
import { studyBoardData, StudyBoardItem } from '@/lib/data/eip-study';

import styles from './page.module.css';

const tabs = [
      { key: 'dev', label: '일일 개발일지' },
      { key: 'eip', label: '정보처리기사' }
];

const PAGE_SIZE = {
      dev: 3,
      eip: 10
};

type TabType = 'dev' | 'eip';

type DevRecordItem = (typeof devRecordData)[number];

type DevItem =
      | { type: 'dev'; record: DevRecordItem }
      | { type: 'coding'; post: KnowledgeItem };

export default function DevRecordPage() {
      const [activeTab, setActiveTab] = useState<TabType>('dev');
      const [page, setPage] = useState(1);

      const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
      const [selectedStudy, setSelectedStudy] = useState<StudyBoardItem | null>(null);

      const [isOpen, setIsOpen] = useState(false);

      // 1. 개발일지 데이터
      const devData = useMemo<DevItem[]>(() => {
            const records: DevItem[] = devRecordData.map((record) => ({
                  type: 'dev',
                  record
            }));

            const posts: DevItem[] = knowledgePosts.map((post) => ({
                  type: 'coding',
                  post
            }));

            return [...records, ...posts].sort((a, b) => {
                  const dateA = a.type === 'dev'
                        ? a.record.date
                        : a.post.createdAt;

                  const dateB = b.type === 'dev'
                        ? b.record.date
                        : b.post.createdAt;

                  return dateB.localeCompare(dateA);
            });
      }, []);

      // 2. 정보처리기사
      const subjects = useMemo(() => {
            return Array.from(
                  new Set(studyBoardData.map((item) => item.subject))
            );
      }, []);

      const [activeSubject, setActiveSubject] = useState(
            subjects[0] ?? ''
      );

      const filteredStudyData = useMemo(() => {
            return studyBoardData.filter(
                  (item) => item.subject === activeSubject
            );
      }, [activeSubject]);

      // 3. 현재 탭 데이터
      const currentData = activeTab === 'dev'
            ? devData
            : filteredStudyData;

      const totalPages = Math.max(
            1,
            Math.ceil(currentData.length / PAGE_SIZE[activeTab])
      );

      const pagedData = currentData.slice(
            (page - 1) * PAGE_SIZE[activeTab],
            page * PAGE_SIZE[activeTab]
      );

      // 4. 상단 탭 변경
      const handleTabChange = (tab: TabType) => {
            setActiveTab(tab);
            setPage(1);
            setSelectedKnowledge(null);
            setSelectedStudy(null);
            setIsOpen(false);
      };

      // 5. 정보처리기사 과목 변경
      const handleSubjectChange = (subject: string) => {
            setActiveSubject(subject);
            setPage(1);
      };

      // 코딩클럽 상세
      const handleKnowledgeClick = (item: KnowledgeItem) => {
            setSelectedKnowledge(item);
            setSelectedStudy(null);
            setIsOpen(true);
      };

      // 정보처리기사 상세
      const handleStudyClick = (item: StudyBoardItem) => {
            setSelectedStudy(item);
            setSelectedKnowledge(null);
            setIsOpen(true);
      };

      const handleCloseModal = () => {
            setIsOpen(false);
            setSelectedKnowledge(null);
            setSelectedStudy(null);
      };

      const formatDate = (date: string) => {
            const [year, month, day] = date.split('-');

            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      return (
            <>
                  <Header />

                  <main className={styles.devPage}>
                        <div className={styles.devPageInner}>
                              <section className={styles.devPageHeader}>
                                    <h1>개발 기록</h1>
                                    <p>하루하루 개발 기록방 + 정보처리기사 공부방</p>
                              </section>

                              {/* 상단 탭 */}
                              <div className={styles.tabMenu}>
                                    {tabs.map((tab) => (
                                          <button
                                                key={tab.key}
                                                type="button"
                                                className={`${styles.tabBtn} ${
                                                      activeTab === tab.key
                                                            ? styles.activeTab
                                                            : ''
                                                }`}
                                                onClick={() =>
                                                      handleTabChange(tab.key as TabType)
                                                }
                                          >
                                                {tab.label}
                                          </button>
                                    ))}
                              </div>

                              <section className={styles.devPageContent}>
                                    {/* 일일 개발일지 */}
                                    {activeTab === 'dev' && (
                                          <table className={styles.devTable}>
                                                <thead>
                                                      <tr>
                                                            <th>날짜</th>
                                                            <th>분류</th>
                                                            <th>제목</th>
                                                            <th>내용</th>
                                                            <th>태그</th>
                                                      </tr>
                                                </thead>

                                                <tbody>
                                                      {pagedData.length === 0 ? (
                                                            <tr>
                                                                  <td colSpan={5}>
                                                                        등록된 개발 기록이 없습니다.
                                                                  </td>
                                                            </tr>
                                                      ) : (
                                                            (pagedData as DevItem[]).map((item) => {
                                                                  if (item.type === 'dev') {
                                                                        const record = item.record;

                                                                        return (
                                                                              <tr key={`dev-${record.id}`}>
                                                                                    <td data-label="날짜">
                                                                                          {record.date}
                                                                                    </td>

                                                                                    <td data-label="분류">
                                                                                          <span className={styles.categoryBadge}>
                                                                                                개발일지
                                                                                          </span>
                                                                                    </td>

                                                                                    <td data-label="제목">
                                                                                          {record.title}
                                                                                    </td>

                                                                                    <td data-label="내용">
                                                                                          {record.content}
                                                                                    </td>

                                                                                    <td data-label="태그">
                                                                                          <div className={styles.tagWrap}>
                                                                                                {record.tags.map((tag) => (
                                                                                                      tag && (
                                                                                                            <span
                                                                                                                  key={tag}
                                                                                                                  className={styles.tag}
                                                                                                            >
                                                                                                                  {tag}
                                                                                                            </span>
                                                                                                      )
                                                                                                ))}
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        );
                                                                  }

                                                                  const post = item.post;

                                                                  return (
                                                                        <tr
                                                                              key={`coding-${post.id}`}
                                                                              className={styles.clickableRow}
                                                                              onClick={() =>
                                                                                    handleKnowledgeClick(post)
                                                                              }
                                                                        >
                                                                              <td data-label="날짜">
                                                                                    {post.createdAt}
                                                                              </td>

                                                                              <td data-label="분류">
                                                                                    <span className={styles.categoryBadge}>
                                                                                          코딩클럽
                                                                                    </span>
                                                                              </td>

                                                                              <td data-label="제목">
                                                                                    <div className={styles.titleCell}>
                                                                                          {post.title}
                                                                                    </div>

                                                                                    <div className={styles.subtitle}>
                                                                                          {post.subtitle}
                                                                                    </div>
                                                                              </td>

                                                                              <td data-label="내용">
                                                                                    {post.topic}
                                                                              </td>

                                                                              <td data-label="태그">
                                                                                    <span className={styles.tag}>
                                                                                          상세보기
                                                                                    </span>
                                                                              </td>
                                                                        </tr>
                                                                  );
                                                            })
                                                      )}
                                                </tbody>
                                          </table>
                                    )}

                                    {/* 정보처리기사 */}
                                    {activeTab === 'eip' && (
                                          <>
                                                <div className={styles.subjectTabs}>
                                                      {subjects.map((subject, index) => (
                                                            <button
                                                                  key={subject}
                                                                  type="button"
                                                                  className={`${styles.subjectTab} ${
                                                                        activeSubject === subject
                                                                              ? styles.subjectTabActive
                                                                              : ''
                                                                  }`}
                                                                  onClick={() =>
                                                                        handleSubjectChange(subject)
                                                                  }
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
                                                                  width: '38%'
                                                            },
                                                            {
                                                                  key: 'subject',
                                                                  label: '과목',
                                                                  width: '20%',
                                                                  align: 'center'
                                                            },
                                                            {
                                                                  key: 'createdAt',
                                                                  label: '등록일',
                                                                  width: '20%',
                                                                  align: 'center'
                                                            }
                                                      ]}
                                                      data={(pagedData as StudyBoardItem[]).map(
                                                            (item) => ({
                                                                  ...item,
                                                                  createdAt: formatDate(item.createdAt)
                                                            })
                                                      )}
                                                      onRowClick={(row) =>
                                                            handleStudyClick(
                                                                  row as StudyBoardItem
                                                            )
                                                      }
                                                />
                                          </>
                                    )}

                                    {/* 페이지네이션 */}
                                    {currentData.length > 0 && (
                                          <Pagination
                                                page={page}
                                                totalPages={totalPages}
                                                onChange={setPage}
                                          />
                                    )}
                              </section>
                        </div>
                  </main>

                  <Footer />

                  {/* 코딩클럽 상세 모달 */}
                  <CommonModal
                        open={isOpen && !!selectedKnowledge}
                        onClose={handleCloseModal}
                  >
                        {selectedKnowledge && (
                              <div className={styles.modalContent}>
                                    <span className={styles.categoryBadge}>
                                          {selectedKnowledge.topic}
                                    </span>
                                    <h3 className={styles.modalTitle}>
                                          {selectedKnowledge.title}
                                    </h3>
                                    <p className={styles.modalSubtitle}>
                                          {selectedKnowledge.subtitle}
                                    </p>
                                    <p className={styles.modalDate}>
                                          {selectedKnowledge.createdAt}
                                    </p>
                                    <div className={styles.modalBody}>
                                          <ContentRenderer
                                                content={selectedKnowledge.content}
                                          />
                                    </div>
                              </div>
                        )}
                  </CommonModal>

                  {/* 정보처리기사 상세 모달 */}
                  <CommonModal
                        open={isOpen && !!selectedStudy}
                        onClose={handleCloseModal}
                        className={styles.studyModal}
                  >
                        {selectedStudy && (
                              <div className={styles.modalContent}>
                                    <span className={styles.categoryBadge}>
                                          {selectedStudy.subject}
                                    </span>
                                    <h3 className={styles.modalTitle}>
                                          {selectedStudy.title}
                                    </h3>
                                    <p className={styles.modalSubtitle}>
                                          ID : {selectedStudy.id}
                                    </p>
                                    <p className={styles.modalDate}>
                                          {formatDate(selectedStudy.createdAt)}
                                    </p>

                                    <div className={styles.modalBody}>
                                          <ContentRenderer
                                                content={selectedStudy.content}
                                          />

                                          {selectedStudy.memoryTip && (
                                                <div className={styles.memorySection}>
                                                      <p className={styles.sectionLabel}>💡 암기팁</p>
                                                      <div className={styles.memoryBox}>
                                                            <ContentRenderer
                                                                  content={selectedStudy.memoryTip}
                                                            />
                                                      </div>
                                                </div>
                                          )}

                                          {selectedStudy.quiz &&
                                                selectedStudy.quiz.length > 0 && (
                                                      <div className={styles.quizSection}>
                                                            <p className={styles.sectionLabel}>📝 관련 기출문제</p>
                                                            <QuizList
                                                                  quiz={selectedStudy.quiz}
                                                            />
                                                      </div>
                                                )}
                                    </div>

                                    <div className={styles.modalFooter}>
                                          <button
                                                className={styles.editButton}
                                                onClick={() =>
                                                      alert('수정 기능 준비중')
                                                }
                                          >
                                                수정
                                          </button>
                                    </div>
                              </div>
                        )}
                  </CommonModal>
            </>
      );
}