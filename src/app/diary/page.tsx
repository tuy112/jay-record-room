'use client'
import { useState, useEffect } from 'react';

import Header from '../../component/Header/Header';
import Footer from '../../component/Footer/Footer';

import { diaryEntries, emotionList } from '../../lib/data/diary/diaryData';
import type { DiaryEntry, EmotionType } from '../../lib/data/types/diaryTypes';

import styles from "./page.module.css";

export default function DiaryPage() {
      const [entries, setEntries] = useState<DiaryEntry[]>(diaryEntries);
      const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('happy');
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');
      const [musicTitle, setMusicTitle] = useState('');
      const [musicArtist, setMusicArtist] = useState('');
      const [musicLink, setMusicLink] = useState('');

      useEffect(() => {
            const saved = localStorage.getItem('diaryEntries');
            if (saved) {
                  setEntries(JSON.parse(saved));
            }
      }, []);

      const getEmotionInfo = (emotion: EmotionType) => {
            return emotionList.find((item) => item.key === emotion);
      };

      const handleAddEntry = () => {
            if (!title.trim() || !content.trim()) {
                  alert('제목과 내용을 입력해주세요.');
                  return;
            }

            const newEntry: DiaryEntry = {
                  id: Date.now().toString(),
                  date: new Date().toISOString().slice(0, 10),
                  emotion: selectedEmotion,
                  title,
                  content,
                  music: {
                        title: musicTitle || '음악 없음',
                        artist: musicArtist || '-',
                        link: musicLink,
                  },
            };

            const updated = [newEntry, ...entries];
            setEntries(updated);
            localStorage.setItem('diaryEntries', JSON.stringify(updated));

            setTitle('');
            setContent('');
            setMusicTitle('');
            setMusicArtist('');
            setMusicLink('');
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
                                    <div className={styles.writeBox}>
                                          <h2 className={styles.writeBoxTitle}>오늘의 일기 쓰기</h2>

                                          <div className={styles.emotionSelect}>
                                                {emotionList.map((item) => (
                                                      <button
                                                            key={item.key}
                                                            type="button"
                                                            className={styles.emotionBtn}
                                                            style={{
                                                                  backgroundColor: selectedEmotion === item.key ? item.color : 'transparent',
                                                                  borderColor: item.color,
                                                            }}
                                                            onClick={() => setSelectedEmotion(item.key)}
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
                                                      onChange={(e) => setMusicTitle(e.target.value)}
                                                />
                                                <input
                                                      className={styles.musicInput}
                                                      type="text"
                                                      placeholder="아티스트"
                                                      value={musicArtist}
                                                      onChange={(e) => setMusicArtist(e.target.value)}
                                                />
                                                <input
                                                      className={styles.musicInput}
                                                      type="text"
                                                      placeholder="유튜브링크"
                                                      value={musicLink}
                                                      onChange={(e) => setMusicLink(e.target.value)}
                                                />
                                          </div>

                                          <button className={styles.saveBtn} onClick={handleAddEntry}>
                                                일기 저장하기
                                          </button>
                                    </div>

                                    <div className={styles.entryList}>
                                          {entries.map((entry) => {
                                                const emotionInfo = getEmotionInfo(entry.emotion);

                                                return (
                                                      <div key={entry.id} className={styles.entryCard}>
                                                            <div className={styles.entryCardHeader}>
                                                                  <span
                                                                        className={styles.entryEmotionBadge}
                                                                        style={{ backgroundColor: emotionInfo?.color }}
                                                                  >
                                                                        {emotionInfo?.emoji} {emotionInfo?.label}
                                                                  </span>
                                                                  <span className={styles.entryDate}>{entry.date}</span>
                                                            </div>

                                                            <h3 className={styles.entryTitle}>{entry.title}</h3>
                                                            <p className={styles.entryContent}>{entry.content}</p>

                                                            <div className={styles.musicCard}>
                                                                  <span className={styles.musicIcon}>🎵</span>
                                                                  <div className={styles.musicInfo}>
                                                                        <span className={styles.musicName}>{entry.music.title}</span>
                                                                        <span className={styles.musicArtist}>{entry.music.artist}</span>
                                                                  </div>
                                                                  {entry.music.link && (
                                                                        <a
                                                                              className={styles.musicLink}
                                                                              href={entry.music.link}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                        >
                                                                              듣기
                                                                        </a>
                                                                  )}
                                                            </div>
                                                      </div>
                                                );
                                          })}
                                    </div>
                              </section>
                        </div>
                  </main>

                  <Footer />
            </>
      );
}