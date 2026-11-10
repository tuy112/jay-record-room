'use client';

import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Pagination from '@/components/common/pagination';

import {
      emotionList,
      getDiaryList,
      createDiary,
      updateDiary,
      deleteDiary,
      type Diary,
      type EmotionType,
} from '@/lib/diary/diary';

import styles from './page.module.css';

const PAGE_SIZE = 5;

export default function DiaryPage() {
      const [entries, setEntries] = useState<Diary[]>([]);
      const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('happy');

      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');

      const [musicTitle, setMusicTitle] = useState('');
      const [musicArtist, setMusicArtist] = useState('');
      const [musicLink, setMusicLink] = useState('');

      const [editId, setEditId] = useState<number | null>(null);
      const [loading, setLoading] = useState(true);

      // 검색 조건
      const [selectedYear, setSelectedYear] = useState('all');
      const [selectedMonth, setSelectedMonth] = useState('all');
      const [selectedDay, setSelectedDay] = useState('all');

      // Pagination
      const [page, setPage] = useState(1);

      // 일기 목록 조회
      const fetchDiaryList = async () => {
            try {
                  const data = await getDiaryList();

                  setEntries(data);
            } catch (error) {
                  console.error('일기 조회 실패:', error);
                  alert('일기 목록을 불러오지 못했습니다.');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchDiaryList();
      }, []);

      // 검색 조건 변경 시 첫 페이지로 이동
      useEffect(() => {
            setPage(1);
      }, [selectedYear, selectedMonth, selectedDay]);

      const getEmotionInfo = (emotion: EmotionType) => {
            return emotionList.find((item) => item.key === emotion);
      };

      // 년도 목록
      const yearList = Array.from(
            new Set(entries.map((entry) => entry.diaryDate.substring(0, 4)))
      ).sort((a, b) => Number(b) - Number(a));

      // 일기 검색 및 최신순 정렬
      const filteredEntries = entries
            .filter((entry) => {
                  const [year, month, day] = entry.diaryDate.split('-');

                  return (
                        (selectedYear === 'all' || year === selectedYear) &&
                        (selectedMonth === 'all' || Number(month) === Number(selectedMonth)) &&
                        (selectedDay === 'all' || Number(day) === Number(selectedDay))
                  );
            })
            .sort((a, b) => b.diaryDate.localeCompare(a.diaryDate));

      // Pagination
      const totalPages = Math.max(
            1,
            Math.ceil(filteredEntries.length / PAGE_SIZE)
      );

      const currentPage = Math.min(page, totalPages);

      const paginatedEntries = filteredEntries.slice(
            (currentPage - 1) * PAGE_SIZE,
            currentPage * PAGE_SIZE
      );

      // 입력창 초기화
      const resetForm = () => {
            setTitle('');
            setContent('');
            setSelectedEmotion('happy');
            setMusicTitle('');
            setMusicArtist('');
            setMusicLink('');
            setEditId(null);
      };

      // 일기 등록 및 수정
      const handleSaveEntry = async () => {
            if (!title.trim() || !content.trim()) {
                  alert('제목과 내용을 입력해주세요.');
                  return;
            }

            const diaryData = {
                  diaryDate: new Date().toISOString().slice(0, 10),
                  emotion: selectedEmotion,
                  title: title.trim(),
                  content: content.trim(),
                  musicTitle: musicTitle.trim(),
                  musicArtist: musicArtist.trim(),
                  musicLink: musicLink.trim(),
            };

            try {
                  if (editId !== null) {
                        await updateDiary(editId, diaryData);
                        alert('일기가 수정되었습니다.');
                  } else {
                        await createDiary(diaryData);
                        alert('일기가 저장되었습니다.');
                  }

                  resetForm();
                  setPage(1);
                  await fetchDiaryList();
            } catch (error) {
                  console.error('일기 저장 실패:', error);
                  alert('일기 저장에 실패했습니다.');
            }
      };

      // 수정 버튼
      const handleEditEntry = (entry: Diary) => {
            if (entry.id === undefined) {
                  alert('일기 ID를 확인할 수 없습니다.');
                  return;
            }

            setEditId(entry.id);
            setSelectedEmotion(entry.emotion);
            setTitle(entry.title);
            setContent(entry.content);
            setMusicTitle(entry.musicTitle || '');
            setMusicArtist(entry.musicArtist || '');
            setMusicLink(entry.musicLink || '');

            window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
            });
      };

      // 삭제 버튼
      const handleDeleteEntry = async (id?: number) => {
            if (id === undefined) {
                  alert('일기 ID를 확인할 수 없습니다.');
                  return;
            }

            if (!confirm('이 일기를 삭제하시겠습니까?')) {
                  return;
            }

            try {
                  await deleteDiary(id);

                  alert('일기가 삭제되었습니다.');

                  if (editId === id) {
                        resetForm();
                  }

                  await fetchDiaryList();
            } catch (error) {
                  console.error('일기 삭제 실패:', error);
                  alert('일기 삭제에 실패했습니다.');
            }
      };

      return (
            <>
                  <Header />

                  <main className={styles.diaryPage}>
                        <div className={styles.diaryPageInner}>
                              <section className={styles.diaryPageHeader}>
                                    <h1>나의 감정일기</h1>
                                    <p>나의 감정을 하루하루 기록하는 일기장입니다.</p>
                              </section>

                              <section className={styles.diaryPageContent}>
                                    {/* 일기 작성 */}
                                    <div className={styles.writeBox}>
                                          <h2 className={styles.writeBoxTitle}>
                                                {editId !== null
                                                      ? '일기 수정하기'
                                                      : '오늘의 일기 쓰기'}
                                          </h2>

                                          <div className={styles.emotionSelect}>
                                                {emotionList.map((item) => (
                                                      <button
                                                            key={item.key}
                                                            type="button"
                                                            className={styles.emotionBtn}
                                                            style={{
                                                                  backgroundColor:
                                                                        selectedEmotion === item.key
                                                                              ? item.color
                                                                              : 'transparent',
                                                                  borderColor: item.color,
                                                            }}
                                                            onClick={() =>
                                                                  setSelectedEmotion(item.key)
                                                            }
                                                      >
                                                            <span>{item.emoji}</span>
                                                            <span>{item.label}</span>
                                                      </button>
                                                ))}
                                          </div>

                                          <input
                                                className={styles.titleInput}
                                                type="text"
                                                placeholder="제목을 입력하세요"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                          />

                                          <textarea
                                                className={styles.contentInput}
                                                placeholder="오늘 있었던 일과 느낀 감정을 기록해보세요"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={5}
                                          />

                                          <div className={styles.musicInputRow}>
                                                <input
                                                      className={styles.musicInput}
                                                      type="text"
                                                      placeholder="곡 제목"
                                                      value={musicTitle}
                                                      onChange={(e) =>
                                                            setMusicTitle(e.target.value)
                                                      }
                                                />

                                                <input
                                                      className={styles.musicInput}
                                                      type="text"
                                                      placeholder="아티스트"
                                                      value={musicArtist}
                                                      onChange={(e) =>
                                                            setMusicArtist(e.target.value)
                                                      }
                                                />

                                                <input
                                                      className={styles.musicInput}
                                                      type="text"
                                                      placeholder="유튜브 링크"
                                                      value={musicLink}
                                                      onChange={(e) =>
                                                            setMusicLink(e.target.value)
                                                      }
                                                />
                                          </div>

                                          <div className={styles.formButtonRow}>
                                                <button
                                                      type="button"
                                                      className={styles.saveBtn}
                                                      onClick={handleSaveEntry}
                                                >
                                                      {editId !== null
                                                            ? '일기 수정하기'
                                                            : '일기 저장하기'}
                                                </button>

                                                {editId !== null && (
                                                      <button
                                                            type="button"
                                                            className={styles.cancelBtn}
                                                            onClick={resetForm}
                                                      >
                                                            수정 취소
                                                      </button>
                                                )}
                                          </div>
                                    </div>

                                    {/* 일기 검색 */}
                                    <div className={styles.searchBox}>
                                          <select
                                                value={selectedYear}
                                                onChange={(e) =>
                                                      setSelectedYear(e.target.value)
                                                }
                                          >
                                                <option value="all">전체 년도</option>

                                                {yearList.map((year) => (
                                                      <option key={year} value={year}>
                                                            {year}년
                                                      </option>
                                                ))}
                                          </select>

                                          <select
                                                value={selectedMonth}
                                                onChange={(e) =>
                                                      setSelectedMonth(e.target.value)
                                                }
                                          >
                                                <option value="all">전체 월</option>

                                                {Array.from(
                                                      { length: 12 },
                                                      (_, i) => i + 1
                                                ).map((month) => (
                                                      <option key={month} value={month}>
                                                            {month}월
                                                      </option>
                                                ))}
                                          </select>

                                          <select
                                                value={selectedDay}
                                                onChange={(e) =>
                                                      setSelectedDay(e.target.value)
                                                }
                                          >
                                                <option value="all">전체 일</option>

                                                {Array.from(
                                                      { length: 31 },
                                                      (_, i) => i + 1
                                                ).map((day) => (
                                                      <option key={day} value={day}>
                                                            {day}일
                                                      </option>
                                                ))}
                                          </select>

                                          <button
                                                type="button"
                                                onClick={() => {
                                                      setSelectedYear('all');
                                                      setSelectedMonth('all');
                                                      setSelectedDay('all');
                                                }}
                                          >
                                                초기화
                                          </button>
                                    </div>

                                    {/* 일기 목록 */}
                                    <div className={styles.entryList}>
                                          {loading ? (
                                                <p>일기를 불러오는 중입니다.</p>
                                          ) : filteredEntries.length === 0 ? (
                                                <p>작성된 일기가 없습니다.</p>
                                          ) : (
                                                paginatedEntries.map((entry) => {
                                                      const emotionInfo = getEmotionInfo(
                                                            entry.emotion
                                                      );

                                                      return (
                                                            <div
                                                                  key={entry.id}
                                                                  className={styles.entryCard}
                                                            >
                                                                  <div
                                                                        className={styles.entryCardHeader}
                                                                  >
                                                                        <span
                                                                              className={styles.entryEmotionBadge}
                                                                              style={{
                                                                                    backgroundColor:
                                                                                          emotionInfo?.color,
                                                                              }}
                                                                        >
                                                                              {emotionInfo?.emoji}{' '}
                                                                              {emotionInfo?.label}
                                                                        </span>

                                                                        <span
                                                                              className={styles.entryDate}
                                                                        >
                                                                              {entry.diaryDate}
                                                                        </span>
                                                                  </div>

                                                                  <h3 className={styles.entryTitle}>
                                                                        {entry.title}
                                                                  </h3>

                                                                  <p className={styles.entryContent}>
                                                                        {entry.content}
                                                                  </p>

                                                                  <div className={styles.musicCard}>
                                                                        <span
                                                                              className={styles.musicIcon}
                                                                        >
                                                                              🎵
                                                                        </span>

                                                                        <div
                                                                              className={styles.musicInfo}
                                                                        >
                                                                              <span
                                                                                    className={styles.musicName}
                                                                              >
                                                                                    {entry.musicTitle ||
                                                                                          '음악 없음'}
                                                                              </span>

                                                                              <span
                                                                                    className={styles.musicArtist}
                                                                              >
                                                                                    {entry.musicArtist ||
                                                                                          '-'}
                                                                              </span>
                                                                        </div>

                                                                        {entry.musicLink && (
                                                                              <a
                                                                                    className={styles.musicLink}
                                                                                    href={entry.musicLink}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                              >
                                                                                    듣기
                                                                              </a>
                                                                        )}
                                                                  </div>

                                                                  {/* 수정 및 삭제 */}
                                                                  <div
                                                                        className={styles.entryActions}
                                                                  >
                                                                        <button
                                                                              type="button"
                                                                              className={styles.editBtn}
                                                                              onClick={() =>
                                                                                    handleEditEntry(entry)
                                                                              }
                                                                        >
                                                                              수정
                                                                        </button>

                                                                        <button
                                                                              type="button"
                                                                              className={styles.deleteBtn}
                                                                              onClick={() =>
                                                                                    handleDeleteEntry(
                                                                                          entry.id
                                                                                    )
                                                                              }
                                                                        >
                                                                              삭제
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      );
                                                })
                                          )}
                                    </div>

                                    {/* Pagination */}
                                    {!loading && filteredEntries.length > 0 && (
                                          <Pagination
                                                page={currentPage}
                                                totalPages={totalPages}
                                                onChange={setPage}
                                          />
                                    )}
                              </section>
                        </div>
                  </main>

                  <Footer />
            </>
      );
}
