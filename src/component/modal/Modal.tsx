import styles from './style.module.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export default function Modal({ open, onClose }: ModalProps) {
    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>안내</h3>
                <p className={styles.message}>
                    아직 미구현 페이지입니다. <br />
                    빠른 시일 내 화면 개발 완료하겠습니다 :)
                </p>
                <button className={styles.confirmBtn} onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
}