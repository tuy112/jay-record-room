'use client';

import { useState } from 'react';

import { devRecordData } from '@/lib/data/devRecord/devRecordData';
import { knowledgePosts, KnowledgeItem } from '@/lib/data/knowledge';

import CommonModal from '@/components/common/modal';
import ContentRenderer from '@/components/common/codeRenderer';
import Pagination from '@/components/common/pagination';

import styles from './style.module.css';

type RecordType = '전체' | '개발일지' | '코딩지식';

type DevRecord = {
      id: string | number;
      type: Exclude<RecordType, '전체'>;
      date: string;
      title: string;
      subtitle: string;
      content: string;
      tags: string[];
      page?: string;
};

const PAGE_SIZE = 5;

const records: DevRecord[] = [
      ...devRecordData.map((record) => ({
            id: record.id,
            type: '개발일지' as const,
            date: record.date,
            title: record.title,
            subtitle: record.page,
            content: record.content,
            tags: record.tags,
            page: record.page,
      })),

      ...knowledgePosts.map((post) => ({
            id: `knowledge-${post.id}`,
            type: '코딩지식' as const,
            date: post.createdAt,
            title: post.title,
            subtitle: post.subtitle,
            content: post.content,
            tags: [post.topic],
      })),
];

export default function DevRecordSection() {
      const [type, setType] = useState<RecordType>('전체');
      const [page, setPage] = useState(1);
      const [selectedItem, setSelectedItem] = useState<DevRecord | null>(null);

      const filteredRecords = records.filter(
            (record) => type === '전체' || record.type === type
      );

      const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));

      const pagedRecords = filteredRecords.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE
      );

      const handleTypeChange = (nextType: RecordType) => {
            setType(nextType);
            setPage(1);
      };

      return (
            <section className={styles.devContent}>
                  <div className={styles.filterMenu}>
                        {(['전체', '개발일지', '코딩지식'] as RecordType[]).map((item) => (
                              <button
                                    key={item}
                                    className={`${styles.filterBtn} ${
                                          type === item ? styles.activeFilter : ''
                                    }`}
                                    onClick={() => handleTypeChange(item)}
                              >
                                    {item}
                              </button>
                        ))}
                  </div>

                  {filteredRecords.length === 0 ? (
                        <div className={styles.emptyMessage}>
                              기록이 없습니다.
                        </div>
                  ) : (
                        <>
                              <div className={styles.tableWrap}>
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
                                                {pagedRecords.map((record) => (
                                                      <tr
                                                            key={`${record.type}-${record.id}`}
                                                            onClick={() => setSelectedItem(record)}
                                                      >
                                                            <td data-label="날짜">{record.date}</td>

                                                            <td data-label="분류">
                                                                  <span className={styles.categoryBadge}>
                                                                        {record.type}
                                                                  </span>
                                                            </td>

                                                            <td data-label="제목">
                                                                  <div className={styles.titleCell}>
                                                                        {record.title}
                                                                  </div>
                                                                  <div className={styles.subtitle}>
                                                                        {record.subtitle}
                                                                  </div>
                                                            </td>

                                                            <td data-label="내용">
                                                                  <div className={styles.contentCell}>
                                                                        {record.content}
                                                                  </div>
                                                            </td>

                                                            <td data-label="태그">
                                                                  <div className={styles.tagWrap}>
                                                                        {record.tags.map((tag) => (
                                                                              <span
                                                                                    key={tag}
                                                                                    className={styles.tag}
                                                                              >
                                                                                    {tag}
                                                                              </span>
                                                                        ))}
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>

                              <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onChange={setPage}
                              />
                        </>
                  )}

                  <CommonModal
                        open={!!selectedItem}
                        onClose={() => setSelectedItem(null)}
                  >
                        {selectedItem && (
                              <div className={styles.modalContent}>
                                    <span className={styles.categoryBadge}>
                                          {selectedItem.type}
                                    </span>

                                    <h3 className={styles.modalTitle}>
                                          {selectedItem.title}
                                    </h3>

                                    <p className={styles.subtitle}>
                                          {selectedItem.subtitle}
                                    </p>

                                    <p className={styles.modalDate}>
                                          {selectedItem.date}
                                    </p>

                                    <div className={styles.modalBody}>
                                          <ContentRenderer
                                                content={selectedItem.content}
                                          />
                                    </div>
                              </div>
                        )}
                  </CommonModal>
            </section>
      );
}