'use client';

import { useState } from 'react';
import { knowledgePosts, KnowledgeItem } from '../../lib/data/knowledge';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CommonModal from '../../components/common/modal';
import ContentRenderer from '../../components/common/contentRenderer';
import Pagination from '../../components/common/pagination';

import styles from './page.module.css';

const PAGE_SIZE = 5;

export default function codingClub() {

    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(knowledgePosts.length / PAGE_SIZE);
    const pagedPosts = knowledgePosts.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleRowClick = (item: KnowledgeItem) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    return (
            <>
                  <Header />

                  <main className={styles.detailPage}>
                        <div className={styles.detailPageInner}>
                              <section className={styles.detailPageHeader}>
                                    <h1>코딩지식 저장소</h1>
                                    <p>공부하거나 정리한 내용을 기록하는 공간입니다.</p>
                              </section>

                              <section className={styles.detailPageContent}>
                                    
                                    {/* 자체 테이블 */}
                                    <table className={styles.table}>
                                    <thead>
                                          <tr>
                                                <th className={styles.topicCol}>주제</th>
                                                <th className={styles.titleCol}>제목</th>
                                                <th className={styles.dateCol}>등록일</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {pagedPosts.map((post) => (
                                                <tr
                                                      key={post.id}
                                                      className={styles.row}
                                                      onClick={() => handleRowClick(post)}
                                                >
                                                <td className={styles.topicCol}>
                                                      <span className={styles.topicBadge}>{post.topic}</span>
                                                </td>
                                                <td>
                                                      <div className={styles.title}>{post.title}</div>
                                                      <div className={styles.subtitle}>{post.subtitle}</div>
                                                </td>
                                                <td className={styles.dateCol}>{post.createdAt}</td>
                                                </tr>
                                          ))}
                                    </tbody>
                                    </table>

                                    {/* 페이지네이션 */}
                                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                              </section>
                        </div>
                  </main>

                  <Footer />

                  <CommonModal 
                        open={isOpen} 
                        onClose={() => setIsOpen(false)}
                  >
                  {selectedItem && (
                        <div className={styles.modalContent}>
                              <span className={styles.topicBadge}>{selectedItem.topic}</span>
                              <h3 className={styles.modalTitle}>{selectedItem.title}</h3>
                              <p className={styles.modalSubtitle}>{selectedItem.subtitle}</p>
                              <p className={styles.modalDate}>{selectedItem.createdAt}</p>

                              <div className={styles.modalBody}>
                                    <ContentRenderer content={selectedItem.content} />
                              </div>
                        </div>
                  )}
                  </CommonModal>
            </>
    );
}