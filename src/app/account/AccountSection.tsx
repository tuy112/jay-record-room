import { EntryType, MONTHS, TYPE_LABELS, CARD_LABELS, fmt } from '../../lib/data/types/account';
import { useAccountData } from './hooks/useAccountData';
// import AddEntryModal from './AddEntryModal';
// import EditAssetModal from './EditAssetModal';

import styles from './style.module.css';

export default function AccountSection() {
  const {
    month, current,
    prevMonth, nextMonth,
    summary, budget,
    groupedDaily, sortedDates, collapsedDates, toggleDate,
  } = useAccountData();

  return (
    <section className={styles.section}>
      {/* 월 네비게이션 */}
      <div className={styles.monthNav}>
        <button className={styles.navArrow} onClick={prevMonth}>‹</button>
        <span className={styles.monthLabel}>{MONTHS[month]}</span>
        <button className={styles.navArrow} onClick={nextMonth}>›</button>
      </div>

      {!current || !summary || !budget ? (
        <div className={styles.empty}>이 달의 데이터가 없습니다.</div>
      ) : (
        <>
          {/* 총재산 카드 */}
          <div className={styles.assetCard}>
            <span className={styles.assetLabel}>총재산</span>
            <span className={styles.assetValue}>{fmt(current.totalAsset)}</span>
          </div>

          {/* 요약 카드 */}
          <div className={styles.summaryRow_2}>
            <div className={`${styles.summaryCard} ${styles.income}`}>
              <span className={styles.summaryLabel}>수입</span>
              <span className={styles.summaryValue}>+{fmt(summary.income)}</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.saving}`}>
              <span className={styles.summaryLabel}>저축</span>
              <span className={styles.summaryValue}>{fmt(summary.saving)}</span>
            </div>
          </div>

          <div className={styles.summaryRow_3}>
            <div className={`${styles.summaryCard} ${styles.fixed}`}>
              <span className={styles.summaryLabel}>고정지출(신용+체크)</span>
              <span className={styles.summaryValue}>-{fmt(summary.fixed)}</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.check}`}>
              <span className={styles.summaryLabel}>신용카드 지출</span>
              <span className={styles.summaryValue}>-{fmt(summary.creditExpense)}</span>
              <span className={styles.summaryLabel}>계좌이체+체크카드 지출</span>
              <span className={styles.summaryValue}>-{fmt(summary.cashExpense)}</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.credit}`}>
              <span className={styles.summaryLabel}>총 지출</span>
              <span className={styles.summaryValue}>-{fmt(summary.totalExpense)}</span>
            </div>
          </div>

          {/* 이번 달 순잔액 */}
          <div className={styles.netBalanceRow}>
            <span className={styles.netBalanceLabel}>이번 달 순잔액 [수입 - (저축 + 총지출)]</span>
            <span className={`${styles.netBalanceValue} ${summary.netBalance >= 0 ? styles.plus : styles.minus}`}>
              {summary.netBalance >= 0 ? '+' : ''}{fmt(summary.netBalance)}
            </span>
          </div>

          {/* 지출 목표 카드 */}
          <div className={styles.budgetCard}>
            <div className={styles.budgetHeader}>
              <span className={styles.budgetTitle}>목표 지출 액수 ({month + 1}월)</span>
              <span className={styles.budgetGoal}>{fmt(budget.goal)}</span>
            </div>

            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${budget.progressPct}%`,
                  backgroundColor: budget.remaining < 0 ? '#e74c3c' : '#4a90e2',
                }}
              />
            </div>

            <div className={styles.budgetRow}>
              <span className={styles.budgetLabel}>현재 지출 중</span>
              <span className={styles.budgetValue}>-{fmt(budget.spent)}</span>
            </div>

            <div className={styles.budgetRow}>
              <span className={styles.budgetLabel}>지출 남은 금액</span>
              <span className={`${styles.budgetValue} ${budget.remaining >= 0 ? styles.plus : styles.minus}`}>
                {budget.remaining >= 0 ? '+' : ''}{fmt(budget.remaining)}
              </span>
            </div>

            {budget.daysLeft !== null && (
              <div className={styles.budgetRow}>
                <span className={styles.budgetLabel}>지출 리셋까지 남은 날</span>
                <span className={styles.ddayValue}>D-{budget.daysLeft}</span>
              </div>
            )}
          </div>

          {/* 항목 리스트 - 수입 / 고정지출 / 저축 */}
          {(['income', 'fixed', 'saving'] as EntryType[]).map(t => {
            const items = current.entries.filter(e => e.type === t);
            if (items.length === 0) return null;

            return (
              <div key={t} className={styles.entryGroup}>
                <span className={`${styles.groupHeader} ${styles[`header_${t}`]}`}>
                  {TYPE_LABELS[t]}
                </span>
                {items.map(item => (
                  <div key={item.id} className={styles.entryRow}>
                    <span className={styles.entryLabel}>{item.label}</span>
                    <span className={`${styles.entryAmount} ${styles[`amount_${t}`]}`}>
                      {t === 'income' ? '+' : '-'}{fmt(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}

          {/* 일별 지출 (신용 + 체크 통합, 카드 뱃지 표시) */}
          {sortedDates.length > 0 && (
            <div className={styles.entryGroup}>
              <span className={`${styles.groupHeader} ${styles.header_expense}`}>지출</span>

              {sortedDates.map(date => {
                const isCollapsed = collapsedDates.has(date);
                return (
                  <div key={date}>
                    <div
                      className={styles.dateRow}
                      onClick={() => toggleDate(date)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {date.slice(5).replace('-', '/')}
                      <span style={{ marginLeft: 6, fontSize: '0.75rem', color: '#888' }}>
                        {isCollapsed ? '▶' : '▼'}
                      </span>
                    </div>
                    {!isCollapsed && groupedDaily[date].map((item, i) => (
                      <div key={i} className={styles.entryRow}>
                        <span className={styles.entryLabel}>{item.label}</span>
                        <span className={`${styles.cardBadge} ${styles[`badge_${item.cardType}`]}`}>
                          {CARD_LABELS[item.cardType]}
                        </span>
                        <span className={`${styles.entryAmount} ${styles.amount_expense}`}>
                          -{fmt(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}