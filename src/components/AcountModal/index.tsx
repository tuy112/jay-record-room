'use client';

import { useState } from 'react';
import styles from './style.module.css';

import {
      EntryType,
      CardType,
      fmt,
} from '@/lib/data/types/account';

type AccountItem = {
      id?: number;
      type?: EntryType;
      date?: string;
      label: string;
      amount: number;
      cardType?: CardType;
};

type Props = {
      item?: AccountItem | null;
      type: EntryType | 'expense';
      onClose: () => void;
      onSave: (item: AccountItem) => Promise<void>;
};

const TYPE_LABELS: Record<EntryType | 'expense', string> = {
      income: '수입',
      fixed: '고정지출',
      saving: '저축',
      expense: '지출',
};

export default function AccountModal({
      item,
      type,
      onClose,
      onSave,
}: Props) {
      const [label, setLabel] = useState(item?.label ?? '');
      const [amount, setAmount] = useState(String(item?.amount ?? ''));
      const [date, setDate] = useState(item?.date ?? new Date().toISOString().slice(0, 10));
      const [cardType, setCardType] = useState<CardType>(item?.cardType ?? 'credit');
      const [saving, setSaving] = useState(false);

      const handleSubmit = async () => {
            if (!label.trim() || !amount || Number(amount) <= 0) {
                  alert('항목명과 금액을 입력해 주세요.');
                  return;
            }

            setSaving(true);

            try {
                  await onSave({
                        ...item,
                        type: type === 'expense' ? undefined : type,
                        date,
                        label: label.trim(),
                        amount: Number(amount),
                        cardType,
                  });

                  onClose();
            } catch (error) {
                  alert('저장에 실패했습니다.');
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className={styles.overlay} onClick={onClose}>
                  <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.header}>
                              <h3>{item ? '항목 수정' : `${TYPE_LABELS[type]} 등록`}</h3>
                              <button onClick={onClose}>×</button>
                        </div>

                        <div className={styles.form}>
                              <label>항목명</label>
                              <input
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="항목명을 입력해 주세요."
                              />

                              <label>금액</label>
                              <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="금액을 입력해 주세요."
                              />

                              {type === 'expense' && (
                                    <>
                                          <label>날짜</label>
                                          <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                          />

                                          <label>결제수단</label>
                                          <select
                                                value={cardType}
                                                onChange={(e) => setCardType(e.target.value as CardType)}
                                          >
                                                <option value="credit">신용카드</option>
                                                <option value="cash">계좌이체 / 체크카드</option>
                                          </select>
                                    </>
                              )}
                        </div>

                        <div className={styles.actions}>
                              <button className={styles.cancel} onClick={onClose}>
                                    취소
                              </button>
                              <button
                                    className={styles.save}
                                    onClick={handleSubmit}
                                    disabled={saving}
                              >
                                    {saving ? '저장 중...' : '저장'}
                              </button>
                        </div>
                  </div>
            </div>
      );
}