'use client';

import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/header';
import Footer from '../../components/footer';

import styles from './page.module.css';

// 게시글
type RmsPost = {
      id: number;
      topic: string;
      title: string;
      subtitle: string | null;
      content: string;
      createdAt: string | null;
      updatedAt: string | null;
};

// 등록 및 수정 데이터
type RmsDraft = {
      topic: string;
      title: string;
      subtitle: string;
      content: string;
};

// RMS 업무 메뉴
const RMS_MENUS = [
      {
            name: '기록물인수',
            children: ['연계인수', '등록인수', '비전자기록물인수'],
      },
      { 
            name: '기록물보존', 
            children: ['포맷관리', '기록정리', '기록물건정리(비전자)', '서고관리', '디지털변환', '매체수록', 'RFID관리'] 
      },
      { name: '기록물평가', children: ['공개재분류', '접근범위재분류', '평가/폐기'] },
      { name: '기록물이관', children: ['이관', '기관간인계', '기관간인수', '공동형인계인수'] },
      { name: '기준관리', children: ['기록관리기준표', '기록물분류기준표', '기준정보'] },
      { name: '접근·감사추적', children: ['접근관리', '감사증적', '검증현황'] },
      { name: '검색·활용', children: ['검색', '열람', '통계'] },
      { name: '시스템관리', children: ['시스템관리', '내부자료관리', '환경설정', '기록관현황', '마이그레이션', '기록물관리', '일일보고등록'] },
      { name: '공개관리', children: ['공개관리'] },
];

const API_URL = '/api/rms';

const EMPTY_DRAFT: RmsDraft = {
      topic: '기록물인수',
      title: '',
      subtitle: '',
      content: '',
};

// API 공통 요청
async function request<T>(
      path = '',
      options?: RequestInit,
): Promise<T> {
      const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                  'Content-Type': 'application/json',
                  ...options?.headers,
            },
            cache: 'no-store',
      });

      if (!response.ok) {
            throw new Error(`서버 요청 실패 (${response.status})`);
      }
      return response.json() as Promise<T>;
}

// 날짜 출력
function formatDate(value: string | null) {
      return value
            ? value.replace('T', ' ').slice(0, 16)
            : '-';
}

export default function RmsPage() {
      const [posts, setPosts] = useState<RmsPost[]>([]);
      const [selectedId, setSelectedId] = useState<number | null>(null);

      const [topic, setTopic] = useState('전체');
      const [subtopic, setSubtopic] = useState('');
      const [keyword, setKeyword] = useState('');

      const [draft, setDraft] = useState<RmsDraft>(EMPTY_DRAFT);
      const [editingId, setEditingId] = useState<number | null>(null);
      const [editing, setEditing] = useState(false);

      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState('');

      // 목록 조회
      const loadPosts = useCallback(async () => {
            try {
                  const data = await request<RmsPost[]>();

                  setPosts(data);

                  setSelectedId(current =>
                        current !== null &&
                        data.some(post => post.id === current)
                              ? current
                              : data[0]?.id ?? null
                  );

                  setError('');
            } catch {
                  setError('RMS 기록을 불러오지 못했습니다.');
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            void loadPosts();
      }, [loadPosts]);

      // 메뉴 및 검색
      const filteredPosts = posts.filter(post => {
            const selectedMenu = RMS_MENUS.find(
                  menu => menu.name === topic
            );
      
            const matchesTopic =
                  topic === '전체' ||
                  post.topic === topic ||
                  Boolean(selectedMenu?.children.includes(post.topic));
      
            const matchesSubtopic =
                  !subtopic || post.topic === subtopic;
      
            const searchText = [
                  post.title,
                  post.subtitle ?? '',
                  post.content,
            ]
                  .join(' ')
                  .toLowerCase();
      
            return (
                  matchesTopic &&
                  matchesSubtopic &&
                  searchText.includes(keyword.trim().toLowerCase())
            );
      });

      // 상위 메뉴 선택
      const changeTopic = (value: string) => {
            setTopic(value);
            setSubtopic('');
      };

      // 하위 메뉴 선택
      const changeSubtopic = (value: string) => {
            setSubtopic(current => current === value ? '' : value);
      };

      // 현재 선택한 상위 메뉴의 하위 메뉴
      const subtopics = RMS_MENUS.find(
            menu => menu.name === topic
      )?.children ?? [];

      const selectedPost = posts.find(post => post.id === selectedId) ?? null;

      // 신규 등록
      const openCreate = () => {
            setDraft({
                  ...EMPTY_DRAFT,
                  topic: topic === '전체' ? EMPTY_DRAFT.topic : topic,
            });

            setEditingId(null);
            setEditing(true);
            setError('');
            setNotice('');
      };

      // 수정
      const openEdit = (post: RmsPost) => {
            setDraft({
                  topic: post.topic,
                  title: post.title,
                  subtitle: post.subtitle ?? '',
                  content: post.content,
            });

            setEditingId(post.id);
            setEditing(true);
            setError('');
            setNotice('');
      };

      // 등록 및 수정 저장
      const savePost = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!draft.title.trim() || !draft.content.trim()) {
                  setError('제목과 분석 내용을 입력해 주세요.');
                  return;
            }

            setSaving(true);
            setError('');

            try {
                  const isEdit = editingId !== null;

                  const url = isEdit ? `/${editingId}` : '';
                  const method = isEdit ? 'PUT' : 'POST';

                  await request(url, {
                        method,
                        body: JSON.stringify(draft),
                  });

                  setEditing(false);

                  setNotice(
                        isEdit
                              ? '수정이 완료되었습니다.'
                              : '등록이 완료되었습니다.'
                  );

                  await loadPosts();
            } catch {
                  setError('기록 저장에 실패했습니다.');
            } finally {
                  setSaving(false);
            }
      };

      // 삭제
      const deletePost = async (post: RmsPost) => {
            if (!window.confirm('선택한 분석 기록을 삭제하시겠습니까?')) {
                  return;
            }

            setSaving(true);
            setError('');

            try {
                  await request(`/${post.id}`, {
                        method: 'DELETE',
                  });

                  setNotice('삭제가 완료되었습니다.');
                  await loadPosts();
            } catch {
                  setError('기록 삭제에 실패했습니다.');
            } finally {
                  setSaving(false);
            }
      };

      return (
            <>
                  <Header />

                  <main className={styles.page}>
                        <header className={styles.subHeader}>
                              <div>
                                    <small>RECORDS MANAGEMENT SYSTEM</small>
                                    <h1>RMS 기록 연구소</h1>
                                    <p>소프트케이만의 기록관리시스템 연구소</p>
                              </div>

                              <button
                                    type="button"
                                    className={styles.primary}
                                    onClick={openCreate}
                              >
                                    + 기록 등록
                              </button>
                        </header>

                        {notice && (
                              <p className={styles.notice}>{notice}</p>
                        )}

                        {error && (
                              <p className={styles.error}>{error}</p>
                        )}

                        <div className={styles.layout}>

                              {/* 업무 메뉴 */}
                              <aside className={styles.sidebar}>
                                    {/* 상위 */}
                                    <nav
                                          className={`${styles.topicRow} customScroll`}
                                          aria-label="상위 업무 메뉴"
                                    >
                                          <button
                                                type="button"
                                                className={topic === '전체' ? styles.topicActive : ''}
                                                onClick={() => changeTopic('전체')}
                                          >
                                                전체 기록
                                          </button>

                                          {RMS_MENUS.map(menu => (
                                                <button
                                                      type="button"
                                                      key={menu.name}
                                                      className={
                                                            topic === menu.name
                                                                  ? styles.topicActive
                                                                  : ''
                                                      }
                                                      onClick={() => changeTopic(menu.name)}
                                                >
                                                      {menu.name}
                                                </button>
                                          ))}
                                    </nav>

                                    {/* 하위 */}
                                    {subtopics.length > 0 && (
                                          <nav
                                                className={styles.subtopicRow}
                                                aria-label="하위 업무 메뉴"
                                          >
                                                {subtopics.map(child => (
                                                      <button
                                                            type="button"
                                                            key={child}
                                                            className={
                                                                  subtopic === child
                                                                        ? styles.subtopicActive
                                                                        : ''
                                                            }
                                                            onClick={() => changeSubtopic(child)}
                                                      >
                                                            {child}
                                                      </button>
                                                ))}
                                          </nav>
                                    )}
                              </aside>

                              {/* 게시글 목록 */}
                              <section className={styles.list}>
                                    <div className={styles.panelTitle}>
                                          <h2>
                                                분석 목록
                                                <span>{filteredPosts.length}</span>
                                          </h2>

                                          <input
                                                type="search"
                                                placeholder="제목 또는 내용 검색"
                                                value={keyword}
                                                onChange={e => setKeyword(e.target.value)}
                                          />
                                    </div>

                                    {loading ? (
                                          <p className={styles.empty}>
                                                불러오는 중입니다.
                                          </p>
                                    ) : filteredPosts.length === 0 ? (
                                          <p className={styles.empty}>
                                                등록된 기록이 없습니다.
                                          </p>
                                    ) : (
                                          filteredPosts.map(post => (
                                                <button
                                                      type="button"
                                                      key={post.id}
                                                      className={`${styles.post} ${
                                                            selectedId === post.id
                                                                  ? styles.selected
                                                                  : ''
                                                      }`}
                                                      onClick={() => {
                                                            setSelectedId(post.id);
                                                            setEditing(false);
                                                      }}
                                                >
                                                      <small>
                                                            {post.topic} · {formatDate(post.createdAt)}
                                                      </small>

                                                      <strong>{post.title}</strong>

                                                      <span>
                                                            {post.subtitle || '요약 없음'}
                                                      </span>
                                                </button>
                                          ))
                                    )}
                              </section>

                              {/* 상세 및 편집 */}
                              <section className={styles.detail}>
                                    {editing ? (
                                          <form
                                                className={styles.form}
                                                onSubmit={savePost}
                                          >
                                                <h2>
                                                      {editingId === null
                                                            ? '기록 등록'
                                                            : '기록 수정'}
                                                </h2>

                                                <label>
                                                      업무 분류
                                                      <select
                                                            value={draft.topic}
                                                            onChange={e =>
                                                                  setDraft({
                                                                        ...draft,
                                                                        topic: e.target.value,
                                                                  })
                                                            }
                                                      >
                                                            {RMS_MENUS.map(menu => (
                                                                  <optgroup key={menu.name} label={menu.name}>
                                                                        <option value={menu.name}>
                                                                              {menu.name}
                                                                        </option>

                                                                        {menu.children.map(child => (
                                                                              <option key={child} value={child}>
                                                                                    └ {child}
                                                                              </option>
                                                                        ))}
                                                                  </optgroup>
                                                            ))}
                                                      </select>
                                                </label>

                                                <label>
                                                      제목
                                                      <input
                                                            value={draft.title}
                                                            onChange={e =>
                                                                  setDraft({
                                                                        ...draft,
                                                                        title: e.target.value,
                                                                  })
                                                            }
                                                      />
                                                </label>

                                                <label>
                                                      요약
                                                      <input
                                                            value={draft.subtitle}
                                                            onChange={e =>
                                                                  setDraft({
                                                                        ...draft,
                                                                        subtitle: e.target.value,
                                                                  })
                                                            }
                                                      />
                                                </label>

                                                <label>
                                                      분석 내용
                                                      <textarea
                                                            rows={16}
                                                            value={draft.content}
                                                            onChange={e =>
                                                                  setDraft({
                                                                        ...draft,
                                                                        content: e.target.value,
                                                                  })
                                                            }
                                                      />
                                                </label>

                                                <div className={styles.actions}>
                                                      <button
                                                            type="button"
                                                            onClick={() => setEditing(false)}
                                                      >
                                                            취소
                                                      </button>

                                                      <button
                                                            type="submit"
                                                            className={styles.primary}
                                                            disabled={saving}
                                                      >
                                                            {saving ? '저장 중...' : '저장'}
                                                      </button>
                                                </div>
                                          </form>
                                    ) : selectedPost ? (
                                          <article>
                                                <div className={styles.detailTop}>
                                                      <span className={styles.tag}>
                                                            {selectedPost.topic}
                                                      </span>

                                                      <div className={styles.actions}>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => openEdit(selectedPost)}
                                                            >
                                                                  수정
                                                            </button>

                                                            <button
                                                                  type="button"
                                                                  className={styles.danger}
                                                                  disabled={saving}
                                                                  onClick={() => deletePost(selectedPost)}
                                                            >
                                                                  삭제
                                                            </button>
                                                      </div>
                                                </div>

                                                <h2>{selectedPost.title}</h2>

                                                <p className={styles.subtitle}>
                                                      {selectedPost.subtitle}
                                                </p>

                                                <p className={styles.date}>
                                                      등록 {formatDate(selectedPost.createdAt)}
                                                      {' · '}
                                                      수정 {formatDate(selectedPost.updatedAt)}
                                                </p>

                                                <div className={styles.content}>
                                                      {selectedPost.content}
                                                </div>
                                          </article>
                                    ) : (
                                          <p className={styles.empty}>
                                                분석 기록을 선택해 주세요.
                                          </p>
                                    )}
                              </section>
                        </div>
                  </main>

                  <Footer />
            </>
      );
}