'use client';

import { useMemo, useState } from 'react';

import Header from '../../components/header';
import Footer from '../../components/footer';
import CommonModal from '../../components/common/modal';
import ContentRenderer from '../../components/common/contentRenderer';
import Pagination from '../../components/common/pagination';

import type { rmsLogItem } from '../../lib/data/rms/rmsLogs';

import RmsEditor from '../../components/rms/rmsEditor';
import useRmsLogs from './hooks/useRmsLogs';

import {
      PAGE_SIZE,
      RMS_MENUS,
      getMenuLabel,
      getSubMenuLabel,
} from './rms.config';

import type { RmsDraft, RmsPost } from './rms.config';

import styles from './page.module.css';

type EditorState = {
      open: boolean;
      post: RmsPost | null;
};

function AnalysisContent({ post }: { post: RmsPost }) {
      if (post.contentFormat === 'text') {
            return <div className={styles.plainContent}>{post.content}</div>;
      }

      const content = JSON.parse(post.content) as rmsLogItem['content'];

      return <ContentRenderer content={content} />;
}

export default function RmsResearchPage() {
      const {
            posts,
            ready,
            loadError,
            savePost,
            deletePost,
      } = useRmsLogs();

      const [menuId, setMenuId] = useState('all');
      const [subMenuId, setSubMenuId] = useState('');
      const [keyword, setKeyword] = useState('');
      const [page, setPage] = useState(1);

      const [selectedId, setSelectedId] = useState<string | null>(null);

      const [editor, setEditor] = useState<EditorState>({
            open: false,
            post: null,
      });

      const [deleteTarget, setDeleteTarget] = useState<RmsPost | null>(null);
      const [actionError, setActionError] = useState('');
      const [notice, setNotice] = useState('');

      const activeMenu = RMS_MENUS.find((menu) => menu.id === menuId);

      const menuTitle =
            menuId === 'all' ? '전체 분석 기록' : getMenuLabel(menuId);

      const menuCounts = useMemo(() => {
            const counts: Record<string, number> = {};

            posts.forEach((post) => {
                  counts[post.menuId] = (counts[post.menuId] ?? 0) + 1;
            });

            return counts;
      }, [posts]);

      const filteredPosts = useMemo(() => {
            const search = keyword.trim().toLocaleLowerCase();

            return posts.filter((post) => {
                  const matchesMenu =
                        menuId === 'all' || post.menuId === menuId;

                  const matchesSubMenu =
                        !subMenuId || post.subMenuId === subMenuId;

                  const searchableText = [
                        post.title,
                        post.subtitle,
                        post.content,
                        getMenuLabel(post.menuId),
                        getSubMenuLabel(post.menuId, post.subMenuId),
                  ]
                        .join(' ')
                        .toLocaleLowerCase();

                  return (
                        matchesMenu &&
                        matchesSubMenu &&
                        (!search || searchableText.includes(search))
                  );
            });
      }, [posts, menuId, subMenuId, keyword]);

      const totalPages = Math.max(
            1,
            Math.ceil(filteredPosts.length / PAGE_SIZE),
      );

      const currentPage = Math.min(page, totalPages);

      const pagedPosts = filteredPosts.slice(
            (currentPage - 1) * PAGE_SIZE,
            currentPage * PAGE_SIZE,
      );

      const selectedPost =
            posts.find((post) => post.id === selectedId) ?? null;

      const changeMenu = (nextMenuId: string) => {
            setMenuId(nextMenuId);
            setSubMenuId('');
            setPage(1);
      };

      const closeEditor = () => {
            setEditor({ open: false, post: null });
      };

      const handleSave = (draft: RmsDraft): string | null => {
            const result = savePost(draft, editor.post?.id);

            if (!result.ok) {
                  return result.message;
            }

            if (result.post) {
                  setMenuId(result.post.menuId);
                  setSubMenuId('');
                  setKeyword('');
                  setPage(1);
                  setSelectedId(result.post.id);
            }

            setNotice(
                  editor.post
                        ? '분석 내용을 수정했습니다.'
                        : '새 분석 기록을 등록했습니다.',
            );

            closeEditor();

            return null;
      };

      const handleDelete = () => {
            if (!deleteTarget) {
                  return;
            }

            const result = deletePost(deleteTarget.id);

            if (!result.ok) {
                  setActionError(result.message);
                  return;
            }

            if (selectedId === deleteTarget.id) {
                  setSelectedId(null);
            }

            setDeleteTarget(null);
            setActionError('');
            setPage(currentPage);
            setNotice('분석 기록을 삭제했습니다.');
      };

      return (
            <>
                  <Header />

                  <main className={styles.page}>
                        <div className={styles.container}>
                              <header className={styles.pageHeader}>
                                    <div>
                                          <span className={styles.eyebrow}>
                                                RECORDS MANAGEMENT SYSTEM
                                          </span>
                                          <h1>기록관리시스템 연구소</h1>
                                          <p>
                                                실제 업무 메뉴를 기준으로 로그와 쿼리,
                                                분석 내용을 정리합니다.
                                          </p>
                                    </div>

                                    <button
                                          type="button"
                                          className={styles.primaryButton}
                                          disabled={!ready || Boolean(loadError)}
                                          onClick={() => {
                                                setNotice('');
                                                setEditor({
                                                      open: true,
                                                      post: null,
                                                });
                                          }}
                                    >
                                          + 분석 기록 추가
                                    </button>
                              </header>

                              <div className={styles.storageNotice}>
                                    <span className={styles.storageDot} />
                                    이 브라우저에 저장되는 개인 분석 기록입니다.
                              </div>

                              {notice && (
                                    <p className={styles.notice} role="status">
                                          {notice}
                                    </p>
                              )}

                              {loadError && (
                                    <p className={styles.errorMessage} role="alert">
                                          {loadError}
                                    </p>
                              )}

                              <section className={styles.workspace}>
                                    <nav
                                          className={styles.menuBar}
                                          aria-label="기록관 업무 메뉴"
                                    >
                                          <button
                                                type="button"
                                                aria-pressed={menuId === 'all'}
                                                className={`${styles.menuButton} ${
                                                      menuId === 'all'
                                                            ? styles.menuActive
                                                            : ''
                                                }`}
                                                onClick={() => changeMenu('all')}
                                          >
                                                전체
                                                <span>{posts.length}</span>
                                          </button>

                                          {RMS_MENUS.map((menu) => (
                                                <button
                                                      type="button"
                                                      key={menu.id}
                                                      aria-pressed={menuId === menu.id}
                                                      className={`${styles.menuButton} ${
                                                            menuId === menu.id
                                                                  ? styles.menuActive
                                                                  : ''
                                                      }`}
                                                      onClick={() => changeMenu(menu.id)}
                                                >
                                                      {menu.label}
                                                      <span>
                                                            {menuCounts[menu.id] ?? 0}
                                                      </span>
                                                </button>
                                          ))}

                                          <button
                                                type="button"
                                                aria-pressed={menuId === 'unclassified'}
                                                className={`${styles.menuButton} ${
                                                      menuId === 'unclassified'
                                                            ? styles.menuActive
                                                            : ''
                                                }`}
                                                onClick={() => changeMenu('unclassified')}
                                          >
                                                미분류
                                                <span>
                                                      {menuCounts.unclassified ?? 0}
                                                </span>
                                          </button>
                                    </nav>

                                    {Boolean(activeMenu?.children.length) && (
                                          <nav
                                                className={styles.subMenuBar}
                                                aria-label="하위 업무 메뉴"
                                          >
                                                <button
                                                      type="button"
                                                      aria-pressed={!subMenuId}
                                                      className={
                                                            !subMenuId
                                                                  ? styles.subMenuActive
                                                                  : ''
                                                      }
                                                      onClick={() => {
                                                            setSubMenuId('');
                                                            setPage(1);
                                                      }}
                                                >
                                                      전체
                                                </button>

                                                {activeMenu?.children.map((child) => (
                                                      <button
                                                            type="button"
                                                            key={child.id}
                                                            aria-pressed={
                                                                  subMenuId === child.id
                                                            }
                                                            className={
                                                                  subMenuId === child.id
                                                                        ? styles.subMenuActive
                                                                        : ''
                                                            }
                                                            onClick={() => {
                                                                  setSubMenuId(child.id);
                                                                  setPage(1);
                                                            }}
                                                      >
                                                            {child.label}
                                                      </button>
                                                ))}
                                          </nav>
                                    )}

                                    <div className={styles.workspaceBody}>
                                          <div className={styles.toolbar}>
                                                <div>
                                                      <div className={styles.breadcrumb}>
                                                            RMS 연구소 / {menuTitle}
                                                            {subMenuId && (
                                                                  <>
                                                                        {' / '}
                                                                        {getSubMenuLabel(
                                                                              menuId,
                                                                              subMenuId,
                                                                        )}
                                                                  </>
                                                            )}
                                                      </div>

                                                      <h2>
                                                            {menuTitle}
                                                            <span>
                                                                  {filteredPosts.length}
                                                            </span>
                                                      </h2>
                                                </div>

                                                <label className={styles.searchBox}>
                                                      <span className={styles.srOnly}>
                                                            분석 기록 검색
                                                      </span>
                                                      <input
                                                            type="search"
                                                            value={keyword}
                                                            placeholder="제목, 요약, 분석 내용 검색"
                                                            onChange={(event) => {
                                                                  setKeyword(event.target.value);
                                                                  setPage(1);
                                                            }}
                                                      />
                                                </label>
                                          </div>

                                          <div className={styles.contentGrid}>
                                                <section
                                                      className={styles.listPanel}
                                                      aria-label="분석 기록 목록"
                                                >
                                                      <div className={styles.listHeading}>
                                                            <span>분석 목록</span>
                                                            <span>
                                                                  {currentPage} / {totalPages}
                                                            </span>
                                                      </div>

                                                      {!ready ? (
                                                            <div className={styles.empty}>
                                                                  기록을 불러오는 중입니다.
                                                            </div>
                                                      ) : loadError ? (
                                                            <div className={styles.empty}>
                                                                  저장소를 확인한 뒤 새로고침해 주세요.
                                                            </div>
                                                      ) : pagedPosts.length === 0 ? (
                                                            <div className={styles.empty}>
                                                                  <strong>
                                                                        {keyword
                                                                              ? '검색 결과가 없습니다.'
                                                                              : '등록된 분석이 없습니다.'}
                                                                  </strong>
                                                                  <p>
                                                                        검색 조건을 변경하거나
                                                                        새 기록을 추가해 주세요.
                                                                  </p>
                                                            </div>
                                                      ) : (
                                                            <div className={styles.postList}>
                                                                  {pagedPosts.map((post) => (
                                                                        <button
                                                                              type="button"
                                                                              key={post.id}
                                                                              aria-pressed={
                                                                                    selectedId === post.id
                                                                              }
                                                                              className={`${styles.postButton} ${
                                                                                    selectedId === post.id
                                                                                          ? styles.postActive
                                                                                          : ''
                                                                              }`}
                                                                              onClick={() =>
                                                                                    setSelectedId(post.id)
                                                                              }
                                                                        >
                                                                              <span className={styles.postMeta}>
                                                                                    <span className={styles.badge}>
                                                                                          {getSubMenuLabel(
                                                                                                post.menuId,
                                                                                                post.subMenuId,
                                                                                          ) || getMenuLabel(post.menuId)}
                                                                                    </span>
                                                                                    <time>{post.createdAt}</time>
                                                                              </span>

                                                                              <strong>{post.title}</strong>
                                                                              <span className={styles.postSummary}>
                                                                                    {post.subtitle || '요약 없음'}
                                                                              </span>
                                                                        </button>
                                                                  ))}
                                                            </div>
                                                      )}

                                                      {filteredPosts.length > PAGE_SIZE && (
                                                            <div className={styles.pagination}>
                                                                  <Pagination
                                                                        page={currentPage}
                                                                        totalPages={totalPages}
                                                                        onChange={setPage}
                                                                  />
                                                            </div>
                                                      )}
                                                </section>

                                                <section
                                                      className={styles.detailPanel}
                                                      aria-label="선택한 분석 내용"
                                                >
                                                      {selectedPost ? (
                                                            <>
                                                                  <div className={styles.detailTop}>
                                                                        <span className={styles.badge}>
                                                                              {getMenuLabel(selectedPost.menuId)}
                                                                              {selectedPost.subMenuId && (
                                                                                    <>
                                                                                          {' / '}
                                                                                          {getSubMenuLabel(
                                                                                                selectedPost.menuId,
                                                                                                selectedPost.subMenuId,
                                                                                          )}
                                                                                    </>
                                                                              )}
                                                                        </span>

                                                                        <div className={styles.detailActions}>
                                                                              <button
                                                                                    type="button"
                                                                                    className={styles.secondaryButton}
                                                                                    onClick={() =>
                                                                                          setEditor({
                                                                                                open: true,
                                                                                                post: selectedPost,
                                                                                          })
                                                                                    }
                                                                              >
                                                                                    수정
                                                                              </button>

                                                                              <button
                                                                                    type="button"
                                                                                    className={styles.dangerButton}
                                                                                    onClick={() => {
                                                                                          setActionError('');
                                                                                          setDeleteTarget(selectedPost);
                                                                                    }}
                                                                              >
                                                                                    삭제
                                                                              </button>
                                                                        </div>
                                                                  </div>

                                                                  <h2 className={styles.detailTitle}>
                                                                        {selectedPost.title}
                                                                  </h2>

                                                                  {selectedPost.subtitle && (
                                                                        <p className={styles.detailSummary}>
                                                                              {selectedPost.subtitle}
                                                                        </p>
                                                                  )}

                                                                  <div className={styles.detailDates}>
                                                                        <span>
                                                                              등록 {selectedPost.createdAt}
                                                                        </span>
                                                                        <span>
                                                                              수정 {selectedPost.updatedAt}
                                                                        </span>
                                                                  </div>

                                                                  <div className={styles.analysisBody}>
                                                                        <AnalysisContent post={selectedPost} />
                                                                  </div>
                                                            </>
                                                      ) : (
                                                            <div className={styles.detailEmpty}>
                                                                  <span aria-hidden="true">≡</span>
                                                                  <h3>분석 내용을 선택해 주세요.</h3>
                                                                  <p>
                                                                        목록에서 기록을 선택하면
                                                                        <br />
                                                                        상세 분석을 이곳에서 확인할 수 있습니다.
                                                                  </p>
                                                            </div>
                                                      )}
                                                </section>
                                          </div>
                                    </div>
                              </section>
                        </div>
                  </main>

                  <Footer />

                  <CommonModal open={editor.open} onClose={closeEditor}>
                        {editor.open && (
                              <RmsEditor
                                    key={editor.post?.id ?? 'new'}
                                    initialPost={editor.post}
                                    defaultMenuId={menuId}
                                    onSave={handleSave}
                                    onCancel={closeEditor}
                              />
                        )}
                  </CommonModal>

                  <CommonModal
                        open={Boolean(deleteTarget)}
                        onClose={() => setDeleteTarget(null)}
                  >
                        {deleteTarget && (
                              <div className={styles.deleteDialog}>
                                    <span className={styles.eyebrow}>DELETE RECORD</span>
                                    <h2>이 분석 기록을 삭제할까요?</h2>
                                    <p className={styles.deleteTitle}>
                                          {deleteTarget.title}
                                    </p>
                                    <p>삭제한 기록은 복구할 수 없습니다.</p>

                                    {actionError && (
                                          <p className={styles.errorMessage} role="alert">
                                                {actionError}
                                          </p>
                                    )}

                                    <div className={styles.editorActions}>
                                          <button
                                                type="button"
                                                className={styles.secondaryButton}
                                                onClick={() => setDeleteTarget(null)}
                                          >
                                                취소
                                          </button>

                                          <button
                                                type="button"
                                                className={styles.deleteConfirmButton}
                                                onClick={handleDelete}
                                          >
                                                삭제하기
                                          </button>
                                    </div>
                              </div>
                        )}
                  </CommonModal>
            </>
      );
}