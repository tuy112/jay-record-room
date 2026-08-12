'use client'
import { useState } from 'react';

import Header from '../../component/Header/Header';
import Footer from '../../component/Footer/Footer';

import { devRecordData } from '@/lib/data/devRecord/devRecordData';
import styles from "./page.module.css";

const PAGE_SIZE = 3;

export default function devRecordPage() {
      const [page, setPage] = useState(1);

      const totalPages = Math.ceil(devRecordData.length / PAGE_SIZE);
      const pagedData = devRecordData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

      const handlePrev = () => {
            setPage((prev) => Math.max(prev - 1, 1));
      };

      const handleNext = () => {
            setPage((prev) => Math.min(prev + 1, totalPages));
      };

      return (
            <>
                  <Header/>

                  <main className={styles.devPage}>
                        <div className={styles.devPageInner}>
                              <section className={styles.devPageHeader}>
                                    <h1>개발일지</h1>
                                    <p>오늘 자 개발 및 공부한 내용을 기록하는 공간입니다.</p>
                              </section>

                              <section className={styles.devPageContent}>
                                    <table className={styles.devTable}>
                                          <thead>
                                                <tr>
                                                      <th>날짜</th>
                                                      <th>분류</th>
                                                      <th>수정 페이지</th>
                                                      <th>제목</th>
                                                      <th>내용</th>
                                                      <th>태그</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {pagedData.map((record) => (
                                                      <tr key={record.id}>
                                                            <td data-label="날짜" className={styles.dateCell}>{record.date}</td>
                                                            <td data-label="분류">
                                                                  <span className={styles.categoryBadge}>{record.category}</span>
                                                            </td>
                                                            <td data-label="수정 페이지" className={styles.pageCell}>{record.page}</td>
                                                            <td data-label="제목" className={styles.titleCell}>{record.title}</td>
                                                            <td data-label="내용" className={styles.contentCell}>{record.content}</td>
                                                            <td data-label="태그">
                                                                  <div className={styles.tagWrap}>
                                                                        {record.tags.map((tag) => (
                                                                              tag && <span key={tag} className={styles.tag}>{tag}</span>
                                                                        ))}
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>

                                    <div className={styles.pagination}>
                                          <button
                                                className={styles.pageBtn}
                                                onClick={handlePrev}
                                                disabled={page === 1}
                                          >
                                                이전
                                          </button>

                                          <span className={styles.pageIndicator}>
                                                {page} / {totalPages}
                                          </span>

                                          <button
                                                className={styles.pageBtn}
                                                onClick={handleNext}
                                                disabled={page === totalPages}
                                          >
                                                다음
                                          </button>
                                    </div>
                              </section>
                        </div>
                  </main>

                  <Footer/>
            </>
      );
}