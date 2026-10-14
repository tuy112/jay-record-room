'use client';

import { useEffect, useState } from 'react';

import { rmsLogPosts } from '../../../lib/data/rms/rmsLogs';

import {
      STORAGE_KEY,
      createInitialPosts,
      getToday,
      isRmsPost,
      validateDraft,
} from '../rms.config';

import type { RmsDraft, RmsPost } from '../rms.config';

type MutationResult =
      | { ok: true; post?: RmsPost }
      | { ok: false; message: string };

export default function useRmsLogs() {
      const [posts, setPosts] = useState<RmsPost[]>([]);
      const [ready, setReady] = useState(false);
      const [loadError, setLoadError] = useState('');

      useEffect(() => {
            try {
                  const saved = window.localStorage.getItem(STORAGE_KEY);

                  if (saved === null) {
                        setPosts(createInitialPosts(rmsLogPosts));
                  } else {
                        const parsed: unknown = JSON.parse(saved);

                        if (
                              !Array.isArray(parsed) ||
                              !parsed.every(isRmsPost)
                        ) {
                              throw new Error('Invalid saved records');
                        }

                        const ids = new Set(parsed.map((post) => post.id));

                        if (ids.size !== parsed.length) {
                              throw new Error('Duplicate record IDs');
                        }

                        setPosts(parsed);
                  }
            } catch {
                  setLoadError(
                        '저장된 기록을 불러오지 못했습니다. 기존 저장 내용은 변경하지 않았습니다. 브라우저 저장소 설정을 확인해 주세요.',
                  );
            } finally {
                  setReady(true);
            }
      }, []);

      const persist = (nextPosts: RmsPost[]): MutationResult => {
            if (!ready || loadError) {
                  return {
                        ok: false,
                        message: '데이터를 정상적으로 불러온 뒤 다시 시도해 주세요.',
                  };
            }

            try {
                  window.localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(nextPosts),
                  );

                  setPosts(nextPosts);

                  return { ok: true };
            } catch {
                  return {
                        ok: false,
                        message: '저장하지 못했습니다. 브라우저 저장 용량이나 저장소 설정을 확인해 주세요.',
                  };
            }
      };

      const savePost = (
            draft: RmsDraft,
            existingId?: string,
      ): MutationResult => {
            const validationError = validateDraft(draft);

            if (validationError) {
                  return {
                        ok: false,
                        message: validationError,
                  };
            }

            const existing = existingId
                  ? posts.find((post) => post.id === existingId)
                  : undefined;

            if (existingId && !existing) {
                  return {
                        ok: false,
                        message: '수정할 기록을 찾을 수 없습니다.',
                  };
            }

            const now = getToday();

            const savedPost: RmsPost = {
                  ...draft,
                  id: existing?.id ?? window.crypto.randomUUID(),
                  title: draft.title.trim(),
                  subtitle: draft.subtitle.trim(),
                  content: draft.content,
                  createdAt: existing?.createdAt ?? now,
                  updatedAt: now,
            };

            const nextPosts = existing
                  ? posts.map((post) =>
                        post.id === existing.id ? savedPost : post,
                  )
                  : [savedPost, ...posts];

            const result = persist(nextPosts);

            return result.ok
                  ? { ok: true, post: savedPost }
                  : result;
      };

      const deletePost = (id: string): MutationResult => {
            if (!posts.some((post) => post.id === id)) {
                  return {
                        ok: false,
                        message: '삭제할 기록을 찾을 수 없습니다.',
                  };
            }

            return persist(posts.filter((post) => post.id !== id));
      };

      return {
            posts,
            ready,
            loadError,
            savePost,
            deletePost,
      };
}