'use client';

import { useState } from 'react';

import { EntryType,CardType,MONTHS,TYPE_LABELS,CARD_LABELS,fmt } from '@/lib/account/account';
import { createEntry,updateEntry,deleteEntry,createExpense,updateExpense,deleteExpense,updateAssets,updateBudget } from '@/lib/account/account';
import { useAccountData } from '@/lib/account/useAccountData';

import AccountModal from '@/components/AcountModal';

import styles from './style.module.css';

export default function AccountSection() {
      const {
            loading,
            error,
            year,
            month,
            current,
            prevMonth,
            nextMonth,
            summary,
            budget,
            groupedDaily,
            sortedDates,
            collapsedDates,
            toggleDate,
      } = useAccountData();

      type ModalType = EntryType | 'expense' | 'asset' | 'budget';

      const [modalType, setModalType] = useState<ModalType | null>(null);
      const [selectedItem, setSelectedItem] = useState<any>(null);

      // 모달 열기
      const openModal = (type: ModalType, item?: any) => {
            setModalType(type);
            setSelectedItem(item ?? null);
      };

      // 모달 닫기
      const closeModal = () => {
            setModalType(null);
            setSelectedItem(null);
      };

      // 등록 및 수정
      const handleSave = async (item: any) => {
            const data = {
                  ...item,
                  monthId: current?.id,
                  year,
                  month: month + 1,
            };

            try {
                  if (modalType === 'asset') {
                        await updateAssets({
                              year,
                              month: month + 1,
                              totalAsset: Number(item.amount),
                        });
                  } else if (modalType === 'budget') {
                        await updateBudget({
                              year,
                              month: month + 1,
                              budget: Number(item.amount),
            });
                  } else if (modalType === 'expense') {
                        if (selectedItem?.id) {
                              await updateExpense(selectedItem.id, data);
                        } else {
                              await createExpense(data);
                        }
                  } else if (modalType) {
                        if (selectedItem?.id) {
                              await updateEntry(selectedItem.id, data);
                        } else {
                              await createEntry(data);
                        }
                  }
      
                  closeModal();
                  window.location.reload();

            } catch (error) {
                  console.error('가계부 저장 실패:', error);
                  alert('저장에 실패했습니다.');
            }
      };

      // 삭제
      const handleDelete = async (type: EntryType | 'expense', id?: number) => {
            if (id == null) {
                  alert('삭제할 데이터의 ID가 없습니다.');
                  return;
            }
      
            if (!confirm('정말 삭제하시겠습니까?')) return;
      
            try {
                  if (type === 'expense') {
                        await deleteExpense(id);
                  } else {
                        await deleteEntry(id);
                  }
      
                  window.location.reload();

            } catch (error) {
                  console.error('가계부 삭제 실패:', error);
                  alert('삭제에 실패했습니다.');
            }
      };

      // 로딩
      if (loading) {
            return (
                  <div className={styles.statusContainer}>
                        <div className={styles.loadingIcon} />
                        <div className={styles.statusTitle}>
                              가계부 데이터를 불러오는 중입니다.
                        </div>
                        <div className={styles.statusMessage}>
                              잠시만 기다려 주세요.
                        </div>
                  </div>
            );
      }

      return (
            <section className={styles.section}>
                  {/* 월 네비게이션 */}
                  <div className={styles.monthNav}>
                        <button className={styles.navArrow} onClick={prevMonth}>
                              ‹
                        </button>

                        <span className={styles.monthLabel}>
                              {MONTHS[month]}
                        </span>

                        <button className={styles.navArrow} onClick={nextMonth}>
                              ›
                        </button>
                  </div>

                  {/* 데이터 없음 */}
                  {!current || !summary || !budget ? (
                        <div className={styles.statusContainer}>
                              <div className={`${styles.statusIcon} ${styles.emptyIcon}`}>📋</div>
                              <div className={styles.statusTitle}>이달의 데이터가 없습니다.</div>
                              <div className={styles.statusMessage}>
                                    가계부 내역을 등록하면 이곳에서 확인할 수 있습니다.
                              </div>
                              <button
                                    className={styles.addButton}
                                    onClick={() => openModal('income')}
                              >
                                    수입 등록
                              </button>
                        </div>
                  ) : (
                        <>
                              {/* 총재산 */}
                              <div
                                    className={`${styles.assetCard} ${styles.clickable}`}
                                    onClick={() => openModal('asset', {
                                          amount: current.totalAsset,
                                    })}
                              >
                                    <span className={styles.assetLabel}>
                                          총재산
                                    </span>

                                    <span className={styles.assetValue}>
                                          {fmt(current.totalAsset)}
                                    </span>

                                    <span className={styles.assetHint}>
                                          클릭하여 수정
                                    </span>
                              </div>

                              {/* 수입 / 저축 */}
                              <div className={styles.summaryRow_2}>
                                    <div
                                          className={`${styles.summaryCard} ${styles.income} ${styles.clickable}`}
                                          onClick={() => openModal('income')}
                                    >
                                          <span className={styles.summaryLabel}>
                                                수입
                                          </span>

                                          <span className={styles.summaryValue}>
                                                +{fmt(summary.income)}
                                          </span>
                                    </div>

                                    <div
                                          className={`${styles.summaryCard} ${styles.saving} ${styles.clickable}`}
                                          onClick={() => openModal('saving')}
                                    >
                                          <span className={styles.summaryLabel}>
                                                저축
                                          </span>

                                          <span className={styles.summaryValue}>
                                                {fmt(summary.saving)}
                                          </span>
                                    </div>
                              </div>

                              {/* 고정지출 / 카드지출 / 총지출 */}
                              <div className={styles.summaryRow_3}>
                                    <div
                                          className={`${styles.summaryCard} ${styles.fixed} ${styles.clickable}`}
                                          onClick={() => openModal('fixed')}
                                    >
                                          <span className={styles.summaryLabel}>
                                                고정지출(신용+체크)
                                          </span>

                                          <span className={styles.summaryValue}>
                                                -{fmt(summary.fixed)}
                                          </span>
                                    </div>

                                    <div className={`${styles.summaryCard} ${styles.check}`}>
                                          <span className={styles.summaryLabel}>
                                                신용카드 지출
                                          </span>

                                          <span className={styles.summaryValue}>
                                                -{fmt(summary.creditExpense)}
                                          </span>

                                          <span className={styles.summaryLabel}>
                                                계좌이체+체크카드 지출
                                          </span>

                                          <span className={styles.summaryValue}>
                                                -{fmt(summary.cashExpense)}
                                          </span>
                                    </div>

                                    <div className={`${styles.summaryCard} ${styles.credit}`}>
                                          <span className={styles.summaryLabel}>
                                                총 지출
                                          </span>

                                          <span className={styles.summaryValue}>
                                                -{fmt(summary.totalExpense)}
                                          </span>
                                    </div>
                              </div>

                              {/* 순잔액 */}
                              <div className={styles.netBalanceRow}>
                                    <span className={styles.netBalanceLabel}>
                                          이번 달 순잔액 [수입 - (저축 + 총지출)]
                                    </span>

                                    <span className={`${styles.netBalanceValue} ${summary.netBalance >= 0 ? styles.plus : styles.minus}`}>
                                          {summary.netBalance >= 0 ? '+' : ''}
                                          {fmt(summary.netBalance)}
                                    </span>
                              </div>

                              {/* 목표 지출 */}
                              <div
                                    className={`${styles.budgetCard} ${styles.clickable}`}
                                    onClick={() => openModal('budget', {
                                          amount: budget.goal,
                                    })}
                              >
                                    <div className={styles.budgetHeader}>
                                          <span className={styles.budgetTitle}>
                                                목표 지출 액수 ({month + 1}월)
                                          </span>

                                          <span className={styles.budgetGoal}>
                                                {fmt(budget.goal)}
                                          </span>
                                    </div>

                                    <div className={styles.progressBarBg}>
                                          <div
                                                className={styles.progressBarFill}
                                                style={{
                                                      width: `${budget.progressPct}%`,
                                                      backgroundColor: budget.remaining < 0
                                                            ? '#e74c3c'
                                                            : '#4a90e2',
                                                }}
                                          />
                                    </div>

                                    <div className={styles.budgetRow}>
                                          <span className={styles.budgetLabel}>
                                                현재 지출 중
                                          </span>

                                          <span className={styles.budgetValue}>
                                                -{fmt(budget.spent)}
                                          </span>
                                    </div>

                                    <div className={styles.budgetRow}>
                                          <span className={styles.budgetLabel}>
                                                지출 남은 금액
                                          </span>

                                          <span className={`${styles.budgetValue} ${budget.remaining >= 0 ? styles.plus : styles.minus}`}>
                                                {budget.remaining >= 0 ? '+' : ''}
                                                {fmt(budget.remaining)}
                                          </span>
                                    </div>

                                    {budget.daysLeft !== null && (
                                          <div className={styles.budgetRow}>
                                                <span className={styles.budgetLabel}>
                                                      지출 리셋까지 남은 날
                                                </span>

                                                <span className={styles.ddayValue}>
                                                      D-{budget.daysLeft}
                                                </span>
                                          </div>
                                    )}
                              </div>

                              {/* 수입 / 고정지출 / 저축 목록 */}
                              {(['income', 'fixed', 'saving'] as EntryType[]).map(type => {
                                    const items = current.entries.filter(
                                          item => item.type === type
                                    );

                                    return (
                                          <div key={type} className={styles.entryGroup}>
                                                <div
                                                      className={`${styles.groupHeader} ${styles[`header_${type}`]} ${styles.clickable}`}
                                                      onClick={() => openModal(type)}
                                                >
                                                      {TYPE_LABELS[type]}
                                                </div>

                                                {items.map(item => (
                                                      <div key={item.id} className={styles.entryRow}>
                                                            <span className={styles.entryLabel}>
                                                                  {item.label}
                                                            </span>

                                                            <span className={`${styles.entryAmount} ${styles[`amount_${type}`]}`}>
                                                                  {type === 'income' ? '+' : '-'}
                                                                  {fmt(item.amount)}
                                                            </span>

                                                            <button
                                                                  className={styles.editButton}
                                                                  onClick={() => openModal(type, item)}
                                                            >
                                                                  ✎
                                                            </button>

                                                            <button
                                                                  className={styles.deleteButton}
                                                                  onClick={() => handleDelete(type, item.id)}
                                                            >
                                                                  ×
                                                            </button>
                                                      </div>
                                                ))}
                                          </div>
                                    );
                              })}

                              {/* 일일 지출 */}
                              <div className={styles.entryGroup}>
                                    <div
                                          className={`${styles.groupHeader} ${styles.header_expense} ${styles.clickable}`}
                                          onClick={() => openModal('expense')}
                                    >
                                          일일 지출
                                    </div>

                                    {sortedDates.map(date => {
                                          const isCollapsed = collapsedDates.has(date);

                                          return (
                                                <div key={date}>
                                                      <div
                                                            className={styles.dateRow}
                                                            onClick={() => toggleDate(date)}
                                                      >
                                                            {date.slice(5).replace('-', '/')}

                                                            <span className={styles.dateArrow}>
                                                                  {isCollapsed ? '▶' : '▼'}
                                                            </span>
                                                      </div>

                                                      {!isCollapsed && groupedDaily[date].map(item => (
                                                            <div
                                                                  key={`${date}-${item.label}-${item.amount}`}
                                                                  className={styles.entryRow}
                                                            >
                                                                  <span className={styles.entryLabel}>
                                                                        {item.label}
                                                                  </span>

                                                                  <span className={`${styles.cardBadge} ${styles[`badge_${item.cardType}`]}`}>
                                                                        {CARD_LABELS[item.cardType as CardType]}
                                                                  </span>

                                                                  <span className={`${styles.entryAmount} ${styles.amount_expense}`}>
                                                                        -{fmt(item.amount)}
                                                                  </span>

                                                                  <button
                                                                        className={styles.editButton}
                                                                        onClick={() => openModal('expense', item)}
                                                                  >
                                                                        ✎
                                                                  </button>

                                                                  <button
                                                                        className={styles.deleteButton}
                                                                        onClick={() => handleDelete('expense', item.id)}
                                                                  >
                                                                        ×
                                                                  </button>
                                                            </div>
                                                      ))}
                                                </div>
                                          );
                                    })}
                              </div>
                        </>
                  )}

                  {/* 등록 / 수정 모달 */}
                  {modalType && (
                        <AccountModal
                              type={modalType}
                              item={selectedItem}
                              onClose={closeModal}
                              onSave={handleSave}
                        />
                  )}
            </section>
      );
}