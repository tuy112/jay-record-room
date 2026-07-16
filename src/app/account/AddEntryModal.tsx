import { useState } from 'react';
import { Entry, EntryType, TYPE_LABELS } from './types';
import styles from './AddEntryModal.module.css';

interface Props {
  onClose: () => void;
  onAdd: (entry: Omit<Entry, 'id'>) => void;
}

export default function AddEntryModal({ onClose, onAdd }: Props) {
  const [type, setType] = useState<EntryType>('income');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const parsed = parseInt(amount.replace(/,/g, ''), 10);
    if (!label.trim() || isNaN(parsed) || parsed <= 0) return;
    onAdd({ type, label: label.trim(), amount: parsed });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>항목 추가</h3>

        <div className={styles.typeRow}>
          {(['income', 'fixed', 'expense'] as EntryType[]).map(t => (
            <button
              key={t}
              className={`${styles.typeChip} ${type === t ? styles[`chip_${t}`] : ''}`}
              onClick={() => setType(t)}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <input
          className={styles.input}
          placeholder="항목명 (예: 월급, 관리비)"
          value={label}
          onChange={e => setLabel(e.target.value)}
          maxLength={20}
        />
        <input
          className={styles.input}
          placeholder="금액 (원)"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
        />

        <div className={styles.btnRow}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.confirmBtn} onClick={handleSubmit}>추가</button>
        </div>
      </div>
    </div>
  );
}