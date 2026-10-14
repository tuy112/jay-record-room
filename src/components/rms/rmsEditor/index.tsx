'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import {
      RMS_MENUS,
      createEmptyDraft,
      validateDraft,
} from '../../../app/rms/rms.config';

import type { RmsDraft, RmsPost } from '../../../app/rms/rms.config';

import styles from './style.module.css';

type Props = {
      initialPost: RmsPost | null;
      defaultMenuId: string;
      onSave: (draft: RmsDraft) => string | null;
      onCancel: () => void;
};

export default function RmsEditor({
      initialPost,
      defaultMenuId,
      onSave,
      onCancel,
}: Props) {
      const [draft, setDraft] = useState<RmsDraft>(() =>
            initialPost
                  ? {
                        menuId: initialPost.menuId,
                        subMenuId: initialPost.subMenuId,
                        title: initialPost.title,
                        subtitle: initialPost.subtitle,
                        content: initialPost.content,
                        contentFormat: initialPost.contentFormat,
                  }
                  : createEmptyDraft(defaultMenuId),
      );

      const [error, setError] = useState('');

      const selectedMenu = RMS_MENUS.find(
            (menu) => menu.id === draft.menuId,
      );

      const changeField = <K extends keyof RmsDraft>(
            field: K,
            value: RmsDraft[K],
      ) => {
            setDraft((previous) => ({
                  ...previous,
                  [field]: value,
            }));

            setError('');
      };

      const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const validationError = validateDraft(draft);

            if (validationError) {
                  setError(validationError);
                  return;
            }

            const saveError = onSave(draft);

            if (saveError) {
                  setError(saveError);
            }
      };

      return (
            <form className={styles.editor} onSubmit={handleSubmit}>
                  <div className={styles.editorHeading}>
                        <span className={styles.eyebrow}>RMS ANALYSIS</span>
                        <h2>
                              {initialPost ? '분석 내용 수정' : '새 분석 기록'}
                        </h2>
                        <p>업무 메뉴를 선택하고 분석 내용을 정리해 주세요.</p>
                  </div>

                  <div className={styles.formGrid}>
                        <label className={styles.field}>
                              <span>업무 메뉴</span>
                              <select
                                    value={draft.menuId}
                                    onChange={(event) => {
                                          setDraft((previous) => ({
                                                ...previous,
                                                menuId: event.target.value,
                                                subMenuId: '',
                                          }));
                                    }}
                              >
                                    <option value="unclassified">미분류</option>

                                    {RMS_MENUS.map((menu) => (
                                          <option key={menu.id} value={menu.id}>
                                                {menu.label}
                                          </option>
                                    ))}
                              </select>
                        </label>

                        <label className={styles.field}>
                              <span>하위 메뉴</span>
                              <select
                                    value={draft.subMenuId}
                                    disabled={!selectedMenu?.children.length}
                                    onChange={(event) =>
                                          changeField(
                                                'subMenuId',
                                                event.target.value,
                                          )
                                    }
                              >
                                    <option value="">공통 / 미지정</option>

                                    {selectedMenu?.children.map((child) => (
                                          <option key={child.id} value={child.id}>
                                                {child.label}
                                          </option>
                                    ))}
                              </select>
                        </label>
                  </div>

                  <label className={styles.field}>
                        <span>제목</span>
                        <input
                              autoFocus
                              required
                              maxLength={150}
                              value={draft.title}
                              placeholder="예: 접수처리 목록 조회 쿼리 분석"
                              onChange={(event) =>
                                    changeField('title', event.target.value)
                              }
                        />
                  </label>

                  <label className={styles.field}>
                        <span>요약</span>
                        <input
                              maxLength={300}
                              value={draft.subtitle}
                              placeholder="화면 위치나 분석 목적을 간단히 입력해 주세요."
                              onChange={(event) =>
                                    changeField('subtitle', event.target.value)
                              }
                        />
                  </label>

                  <label className={styles.field}>
                        <span>
                              분석 내용
                              {draft.contentFormat === 'json' && ' · 기존 JSON 형식'}
                        </span>

                        {draft.contentFormat === 'json' && (
                              <small className={styles.fieldHelp}>
                                    기존 ContentRenderer에서 사용하는 데이터입니다.
                                    속성명과 배열 구조는 유지하고 내용을 수정해 주세요.
                              </small>
                        )}

                        <textarea
                              required
                              rows={16}
                              spellCheck={false}
                              className={
                                    draft.contentFormat === 'json'
                                          ? styles.codeInput
                                          : undefined
                              }
                              value={draft.content}
                              placeholder={
                                    '■ 화면 / 기능\n\n■ 실행 쿼리\n\n■ 분석 내용\n\n■ 확인 결과'
                              }
                              onChange={(event) =>
                                    changeField('content', event.target.value)
                              }
                        />
                  </label>

                  {error && (
                        <p className={styles.errorMessage} role="alert">
                              {error}
                        </p>
                  )}

                  <div className={styles.editorActions}>
                        <button
                              type="button"
                              className={styles.secondaryButton}
                              onClick={onCancel}
                        >
                              취소
                        </button>

                        <button
                              type="submit"
                              className={styles.primaryButton}
                        >
                              {initialPost ? '수정 저장' : '기록 등록'}
                        </button>
                  </div>
            </form>
      );
}