import type { rmsLogItem } from '../../lib/data/rms/rmsLogs';

export type RmsMenu = {
      id: string;
      label: string;
      children: {
            id: string;
            label: string;
      }[];
};

export const RMS_MENUS: RmsMenu[] = [
      {
            id: 'acquisition',
            label: '기록물인수',
            children: [
                  { id: 'linked', label: '연계인수' },
                  { id: 'registered', label: '등록인수' },
                  { id: 'non-electronic', label: '비전자기록물인수' },
            ],
      },
      {
            id: 'preservation',
            label: '기록물보존',
            children: [],
      },
      {
            id: 'evaluation',
            label: '기록물평가',
            children: [],
      },
      {
            id: 'transfer',
            label: '기록물이관',
            children: [],
      },
      {
            id: 'standards',
            label: '기준관리',
            children: [],
      },
      {
            id: 'audit',
            label: '접근·감사추적',
            children: [],
      },
      {
            id: 'search',
            label: '검색·활용',
            children: [],
      },
      {
            id: 'system',
            label: '시스템관리',
            children: [],
      },
      {
            id: 'disclosure',
            label: '공개관리',
            children: [],
      },
];

export const PAGE_SIZE = 5;
export const STORAGE_KEY = 'jstory:rms-logs:v1';

export type RmsPost = {
      id: string;
      menuId: string;
      subMenuId: string;
      title: string;
      subtitle: string;
      createdAt: string;
      updatedAt: string;
      content: string;
      contentFormat: 'text' | 'json';
};

export type RmsDraft = Pick<
      RmsPost,
      'menuId' | 'subMenuId' | 'title' | 'subtitle' | 'content' | 'contentFormat'
>;

export function getMenuLabel(menuId: string) {
      return RMS_MENUS.find((menu) => menu.id === menuId)?.label ?? '미분류';
}

export function getSubMenuLabel(menuId: string, subMenuId: string) {
      return (
            RMS_MENUS.find((menu) => menu.id === menuId)
                  ?.children.find((child) => child.id === subMenuId)
                  ?.label ?? ''
      );
}

export function getToday() {
      const date = new Date();

      return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
      ].join('-');
}

function normalize(value: string) {
      return value.replace(/[\s·ㆍ]/g, '');
}

/* 기존 데이터는 원본을 유지하면서 메뉴 분류만 추론합니다. */
export function createInitialPosts(posts: rmsLogItem[]): RmsPost[] {
      return posts.map((post, index) => {
            const topic = normalize(post.topic ?? '');
            const title = normalize(post.title ?? '');

            const menu = RMS_MENUS.find(
                  (item) => normalize(item.label) === topic,
            );

            const subMenu = menu?.children.find(
                  (item) => title.includes(normalize(item.label)),
            );

            const isText = typeof post.content === 'string';

            return {
                  id: `seed-${post.id}-${index}`,
                  menuId: menu?.id ?? 'unclassified',
                  subMenuId: subMenu?.id ?? '',
                  title: post.title,
                  subtitle: post.subtitle ?? '',
                  createdAt: post.createdAt,
                  updatedAt: post.createdAt,
                  content: isText
                        ? post.content as string
                        : JSON.stringify(post.content, null, 2),
                  contentFormat: isText ? 'text' : 'json',
            };
      });
}

export function createEmptyDraft(menuId: string): RmsDraft {
      return {
            menuId: RMS_MENUS.some((menu) => menu.id === menuId)
                  ? menuId
                  : RMS_MENUS[0].id,
            subMenuId: '',
            title: '',
            subtitle: '',
            content: '',
            contentFormat: 'text',
      };
}

export function validateDraft(draft: RmsDraft): string | null {
      if (!draft.title.trim()) {
            return '제목을 입력해 주세요.';
      }

      if (!draft.content.trim()) {
            return '분석 내용을 입력해 주세요.';
      }

      if (draft.contentFormat === 'json') {
            try {
                  JSON.parse(draft.content);
            } catch {
                  return '기존 콘텐츠의 JSON 문법을 확인해 주세요.';
            }
      }

      return null;
}

/* 저장된 값이 손상됐을 때 기존 데이터를 덮어쓰지 않도록 검사합니다. */
export function isRmsPost(value: unknown): value is RmsPost {
      if (!value || typeof value !== 'object') {
            return false;
      }

      const item = value as Record<string, unknown>;

      const fields = [
            'id',
            'menuId',
            'subMenuId',
            'title',
            'subtitle',
            'createdAt',
            'updatedAt',
            'content',
      ];

      if (!fields.every((field) => typeof item[field] === 'string')) {
            return false;
      }

      if (item.contentFormat !== 'text' && item.contentFormat !== 'json') {
            return false;
      }

      if (item.contentFormat === 'json') {
            try {
                  JSON.parse(item.content as string);
            } catch {
                  return false;
            }
      }

      return true;
}