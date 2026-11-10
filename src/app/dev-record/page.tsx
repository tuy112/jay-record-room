'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Board from '@/components/common/board';
import CommonModal from '@/components/common/modal';
import ContentRenderer from '@/components/common/codeRenderer';
import QuizList from '@/components/common/quiz';
import Pagination from '@/components/common/pagination';

import {
      DevRecord,
      getDevRecordList,
      createDevRecord,
      updateDevRecord,
      deleteDevRecord
} from '@/lib/dev-record/devRecord';

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

const emptyForm: DevRecord = {
      date: new Date().toISOString().slice(0, 10),
      category: '',
      page: '',
      title: '',
      content: '',
      tags: []
};

export default function DevRecordPage() {
      const [activeTab, setActiveTab] = useState<TabType>('dev');
      const [page, setPage] = useState(1);

      const [devRecords, setDevRecords] = useState<DevRecord[]>([]);
      const [loading, setLoading] = useState(false);

      const [selectedDevRecord, setSelectedDevRecord] = useState<DevRecord | null>(null);
      const [selectedStudy, setSelectedStudy] = useState<StudyBoardItem | null>(null);

      const [isOpen, setIsOpen] = useState(false);
      const [isFormOpen, setIsFormOpen] = useState(false);

      const [editingId, setEditingId] = useState<number | null>(null);
      const [form, setForm] = useState<DevRecord>(emptyForm);

      // 개발일지 조회
      const fetchDevRecords = async () => {
            try {
                  setLoading(true);

                  const data = await getDevRecordList();
                  setDevRecords(data);
            } catch (error) {
                  console.error('개발일지 조회 실패:', error);
                  alert('개발일지를 불러오지 못했습니다.');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchDevRecords();
      }, []);

      // 정보처리기사 과목
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

      // 현재 탭 데이터
      const currentData = activeTab === 'dev'
            ? devRecords
            : filteredStudyData;

      const totalPages = Math.max(
            1,
            Math.ceil(currentData.length / PAGE_SIZE[activeTab])
      );

      const pagedData = currentData.slice(
            (page - 1) * PAGE_SIZE[activeTab],
            page * PAGE_SIZE[activeTab]
      );

      // 상단 탭 변경
      const handleTabChange = (tab: TabType) => {
            setActiveTab(tab);
            setPage(1);
            handleCloseModal();
            setIsFormOpen(false);
      };

      // 정보처리기사 과목 변경
      const handleSubjectChange = (subject: string) => {
            setActiveSubject(subject);
            setPage(1);
      };

      // 개발일지 등록
      const handleCreate = () => {
            setEditingId(null);
            setForm({
                  ...emptyForm,
                  date: new Date().toISOString().slice(0, 10)
            });
            setIsFormOpen(true);
      };

      // 개발일지 수정
      const handleEdit = (record: DevRecord) => {
            setEditingId(record.id ?? null);
            setForm({
                  ...record,
                  tags: record.tags ?? []
            });
            setIsFormOpen(true);
      };

      // 개발일지 등록 / 수정
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            try {
                  const data = {
                        ...form,
                        tags: form.tags
                              .map((tag) => tag.trim())
                              .filter(Boolean)
                  };

                  if (editingId !== null) {
                        await updateDevRecord(editingId, data);
                        alert('수정이 완료되었습니다.');
                  } else {
                        await createDevRecord(data);
                        alert('등록이 완료되었습니다.');
                  }

                  setIsFormOpen(false);
                  setEditingId(null);

                  await fetchDevRecords();
            } catch (error) {
                  console.error('개발일지 저장 실패:', error);
                  alert('저장에 실패했습니다.');
            }
      };

      // 개발일지 삭제
      const handleDelete = async (id?: number) => {
            if (id === undefined) return;

            if (!confirm('해당 개발일지를 삭제하시겠습니까?')) {
                  return;
            }

            try {
                  await deleteDevRecord(id);
                  alert('삭제가 완료되었습니다.');

                  handleCloseModal();
                  await fetchDevRecords();
            } catch (error) {
                  console.error('개발일지 삭제 실패:', error);
                  alert('삭제에 실패했습니다.');
            }
      };

      // 개발일지 상세
      const handleDevClick = (record: DevRecord) => {
            setSelectedDevRecord(record);
            setSelectedStudy(null);
            setIsOpen(true);
      };

      // 정보처리기사 상세
      const handleStudyClick = (item: StudyBoardItem) => {
            setSelectedStudy(item);
            setSelectedDevRecord(null);
            setIsOpen(true);
      };

      // 상세 모달 닫기
      const handleCloseModal = () => {
            setIsOpen(false);
            setSelectedDevRecord(null);
            setSelectedStudy(null);
      };

      // 날짜 형식
      const formatDate = (date: string) => {
            if (!date) return '';

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
                                          <>
                                                <div className={styles.devAction}>
                                                      <button
                                                            type="button"
                                                            className={styles.createButton}
                                                            onClick={handleCreate}
                                                      >
                                                            + 개발일지 등록
                                                      </button>
                                                </div>

                                                <table className={styles.devTable}>
                                                      <thead>
                                                            <tr>
                                                                  <th>날짜</th>
                                                                  <th>분류</th>
                                                                  <th>제목</th>
                                                                  <th>내용</th>
                                                                  <th>태그</th>
                                                                  <th>관리</th>
                                                            </tr>
                                                      </thead>

                                                      <tbody>
                                                            {loading ? (
                                                                  <tr>
                                                                        <td colSpan={6}>
                                                                              불러오는 중입니다.
                                                                        </td>
                                                                  </tr>
                                                            ) : pagedData.length === 0 ? (
                                                                  <tr>
                                                                        <td colSpan={6}>
                                                                              등록된 개발 기록이 없습니다.
                                                                        </td>
                                                                  </tr>
                                                            ) : (
                                                                  (pagedData as DevRecord[]).map((record) => (
                                                                        <tr
                                                                              key={record.id}
                                                                              className={styles.clickableRow}
                                                                              onClick={() => handleDevClick(record)}
                                                                        >
                                                                              <td data-label="날짜">
                                                                                    {record.date}
                                                                              </td>
                                                                              <td data-label="분류">
                                                                                    <span className={styles.categoryBadge}>
                                                                                          {record.category || '개발일지'}
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
                                                                                          {(record.tags ?? []).map((tag) => (
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

                                                                              <td data-label="관리">
                                                                                    <div className={styles.tableButtons}>
                                                                                          <button
                                                                                                type="button"
                                                                                                onClick={(e) => {
                                                                                                      e.stopPropagation();
                                                                                                      handleEdit(record);
                                                                                                }}
                                                                                          >
                                                                                                수정
                                                                                          </button>

                                                                                          <button
                                                                                                type="button"
                                                                                                onClick={(e) => {
                                                                                                      e.stopPropagation();
                                                                                                      handleDelete(record.id);
                                                                                                }}
                                                                                          >
                                                                                                삭제
                                                                                          </button>
                                                                                    </div>
                                                                              </td>
                                                                        </tr>
                                                                  ))
                                                            )}
                                                      </tbody>
                                                </table>
                                          </>
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
                                                                  onClick={() => handleSubjectChange(subject)}
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
                                                      data={(pagedData as StudyBoardItem[]).map((item) => ({
                                                            ...item,
                                                            createdAt: formatDate(item.createdAt)
                                                      }))}
                                                      onRowClick={(row) =>
                                                            handleStudyClick(row as StudyBoardItem)
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

                  {/* 개발일지 등록 / 수정 모달 */}
                  <CommonModal
                        open={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                  >
                        <div className={styles.modalContent}>
                              <h3 className={styles.modalTitle}>
                                    {editingId !== null ? '개발일지 수정' : '개발일지 등록'}
                              </h3>

                              <form onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>날짜</label>
                                          <input
                                                className={styles.formInput}
                                                type="date"
                                                required
                                                value={form.date}
                                                onChange={(e) =>
                                                      setForm({ ...form, date: e.target.value })
                                                }
                                          />
                                    </div>

                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>분류</label>
                                          <input
                                                className={styles.formInput}
                                                type="text"
                                                value={form.category}
                                                onChange={(e) =>
                                                      setForm({ ...form, category: e.target.value })
                                                }
                                                placeholder="개발일지"
                                          />
                                    </div>

                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>수정 페이지</label>
                                          <input
                                                className={styles.formInput}
                                                type="text"
                                                value={form.page}
                                                onChange={(e) =>
                                                      setForm({ ...form, page: e.target.value })
                                                }
                                                placeholder="예: /dev-record"
                                          />
                                    </div>

                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>제목</label>
                                          <input
                                                className={styles.formInput}
                                                type="text"
                                                required
                                                value={form.title}
                                                onChange={(e) =>
                                                      setForm({ ...form, title: e.target.value })
                                                }
                                          />
                                    </div>

                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>내용</label>
                                          <textarea
                                                className={styles.formTextarea}
                                                rows={6}
                                                value={form.content}
                                                onChange={(e) =>
                                                      setForm({ ...form, content: e.target.value })
                                                }
                                          />
                                    </div>

                                    <div className={styles.formGroup}>
                                          <label className={styles.formLabel}>태그</label>
                                          <input
                                                className={styles.formInput}
                                                type="text"
                                                value={form.tags.join(', ')}
                                                onChange={(e) =>
                                                      setForm({
                                                            ...form,
                                                            tags: e.target.value.split(',')
                                                      })
                                                }
                                                placeholder="쉼표(,)로 구분해서 입력하세요."
                                          />
                                    </div>

                                    <div className={styles.formButtons}>
                                          <button
                                                type="button"
                                                onClick={() => setIsFormOpen(false)}
                                          >
                                                취소
                                          </button>

                                          <button type="submit">
                                                {editingId !== null ? '수정' : '등록'}
                                          </button>
                                    </div>
                              </form>
                        </div>
                  </CommonModal>

                  {/* 개발일지 상세 모달 */}
                  <CommonModal
                        open={isOpen && !!selectedDevRecord}
                        onClose={handleCloseModal}
                  >
                        {selectedDevRecord && (
                              <div className={styles.modalContent}>
                                    <span className={styles.categoryBadge}>
                                          {selectedDevRecord.category || '개발일지'}
                                    </span>
                                    <h3 className={styles.modalTitle}>
                                          {selectedDevRecord.title}
                                    </h3>
                                    <p className={styles.modalSubtitle}>
                                          수정 페이지 : {selectedDevRecord.page || '-'}
                                    </p>
                                    <p className={styles.modalDate}>
                                          {selectedDevRecord.date}
                                    </p>
                                    <div className={styles.modalBody}>
                                          {selectedDevRecord.content}
                                    </div>

                                    {(selectedDevRecord.tags ?? []).length > 0 && (
                                          <div className={styles.tagWrap}>
                                                {selectedDevRecord.tags.map((tag) => (
                                                      <span key={tag} className={styles.tag}>
                                                            {tag}
                                                      </span>
                                                ))}
                                          </div>
                                    )}

                                    <div className={styles.modalFooter}>
                                          <button
                                                type="button"
                                                className={styles.editButton}
                                                onClick={() => {
                                                      handleEdit(selectedDevRecord);
                                                      handleCloseModal();
                                                }}
                                          >
                                                수정
                                          </button>

                                          <button
                                                type="button"
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(selectedDevRecord.id)}
                                          >
                                                삭제
                                          </button>
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
                                          <ContentRenderer content={selectedStudy.content} />

                                          {selectedStudy.memoryTip && (
                                                <div className={styles.memorySection}>
                                                      <p className={styles.sectionLabel}>💡 암기팁</p>
                                                      <div className={styles.memoryBox}>
                                                            <ContentRenderer content={selectedStudy.memoryTip} />
                                                      </div>
                                                </div>
                                          )}

                                          {selectedStudy.quiz && selectedStudy.quiz.length > 0 && (
                                                <div className={styles.quizSection}>
                                                      <p className={styles.sectionLabel}>📝 관련 기출문제</p>
                                                      <QuizList quiz={selectedStudy.quiz} />
                                                </div>
                                          )}
                                    </div>
                              </div>
                        )}
                  </CommonModal>
            </>
      );
}
