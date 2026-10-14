import styles from './style.module.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function Modal({ open, onClose, title, className, children }: ModalProps) {
    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} ${className ?? ''}`} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>

                {title && <h3 className={styles.title}>{title}</h3>}
                {children}
            </div>
        </div>
    );
}