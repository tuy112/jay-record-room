import styles from './style.module.css';

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                disabled={page === 1}
                onClick={() => onChange(Math.max(page - 1, 1))}
            >
                이전
            </button>

            <span className={styles.pageInfo}>
                {page} / {totalPages}
            </span>

            <button
                className={styles.pageButton}
                disabled={page === totalPages}
                onClick={() => onChange(Math.min(page + 1, totalPages))}
            >
                다음
            </button>
        </div>
    );
}