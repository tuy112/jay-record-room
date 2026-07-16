import { useState } from 'react';
import { fmt } from './types';
import styles from './EditAssetModal.module.css';

interface Props {
  current: number;
  onClose: () => void;
  onSave: (value: number) => void;
}

export default function EditAssetModal({ current, onClose, onSave }: Props) {
  const [val, setVal] = useState(current === 0 ? '' : String(current));

  const handleSave = () => {
    const parsed = parseInt(val.replace(/,/g, ''), 10);
    if (isNaN(parsed)) return;
    onSave(parsed);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>총재산 수정</h3>
        <p className={styles.desc}>현재: {fmt(current)}</p>
        <input
          className={styles.input}
          placeholder="총재산 (원)"
          value={val}
          onChange={e => setVal(e.target.value.replace(/[^0-9-]/g, ''))}
          inputMode="numeric"
          autoFocus
        />
        <div className={styles.btnRow}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.confirmBtn} onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}