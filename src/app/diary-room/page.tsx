'use client'
import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';

import DiarySection from './diary/DiarySection';
import DevRecordSection from './devRecord/DevRecordSection';

import styles from "./page.module.css";

type DiaryTab = 'diary' | 'dev-record';

export default function DiaryRoom() {
      const [activeTab, setActiveTab] = useState<DiaryTab>('diary');

      return (
            <>
                  <Header />

                  <main className={styles.diaryPage}>
                        <div className={styles.diaryPageInner}>
                              <section className={styles.diaryPageHeader}>
                                    <h1>나의 기록</h1>
                                    <p>일상과 개발 경험을 기록하는 공간입니다.</p>
                              </section>

                              <nav className={styles.tabMenu}>
                                    <button
                                          className={`${styles.tabBtn} ${
                                                activeTab === 'diary' ? styles.activeTab : ''
                                          }`}
                                          onClick={() => setActiveTab('diary')}
                                    >
                                          일기장
                                    </button>

                                    <button
                                          className={`${styles.tabBtn} ${
                                                activeTab === 'dev-record' ? styles.activeTab : ''
                                          }`}
                                          onClick={() => setActiveTab('dev-record')}
                                    >
                                          개발 기록
                                    </button>
                              </nav>

                              {activeTab === 'diary' ? (
                                    <DiarySection />
                              ) : (
                                    <DevRecordSection />
                              )}
                        </div>
                  </main>

                  <Footer />
            </>
      );
}