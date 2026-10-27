'use client';

import Link from "next/link";

import Header from '../components/header';
import Footer from '../components/footer';

import styles from "./page.module.css";

const money = (value: number) =>
      `${value.toLocaleString("ko-KR")}원`;

/* 실제 데이터를 연결할 때 이 부분을 교체하시면 됩니다. */
const dashboard = {
      income: 2534890,
      savings: 1150000,
      expense: 350000,
      budget: 500000,
      exerciseMinutes: 185,
      exerciseCount: 4,
      diaryCount: 12,
      studyCompleted: 18,
      studyTotal: 30,
};

const weeklyExercise = [
      { day: "월", minutes: 40 },
      { day: "화", minutes: 25 },
      { day: "수", minutes: 0 },
      { day: "목", minutes: 65 },
      { day: "금", minutes: 0 },
      { day: "토", minutes: 55 },
      { day: "일", minutes: 0 },
];

const expenseCategories = [
      { name: "식비", amount: 150000, color: "#344d7a" },
      { name: "생활", amount: 90000, color: "#60aaa6" },
      { name: "교통", amount: 60000, color: "#e4b76e" },
      { name: "기타", amount: 50000, color: "#cbd5e1" },
];

const rooms = [
      {
            number: "01",
            title: "가계부",
            description: "수입과 지출을 정리하고 소비 흐름을 확인해 보세요.",
            href: "/record-room?tab=account",
            category: "MONEY",
            symbol: "₩",
            tone: "navy",
      },
      {
            number: "02",
            title: "운동기록",
            description: "오늘의 움직임을 남기고 꾸준한 변화를 만들어 보세요.",
            href: "/record-room?tab=exercise",
            category: "HEALTH",
            symbol: "↗",
            tone: "green",
      },
      {
            number: "03",
            title: "일기장",
            description: "잊고 싶지 않은 하루와 나만의 생각을 남겨 보세요.",
            href: "/diary",
            category: "DAILY",
            symbol: "✎",
            tone: "orange",
      },
      {
            number: "04",
            title: "정보처리기사 요약",
            description: "과목별 핵심 개념과 공부한 내용을 차곡차곡 정리하세요.",
            href: "/eip-study",
            category: "STUDY",
            symbol: "Aa",
            tone: "purple",
      },
      {
            number: "05",
            title: "RMS 기록방",
            description: "기록관리시스템 로그분석 및 소프트케이 연구소입니다.",
            href: "/rms",
            category: "WORK",
            symbol: "≡",
            tone: "blue",
      },
      {
            number: "06",
            title: "개발기록",
            description: "개발하면서 배운 내용과 문제 해결 경험을 기록하세요.",
            href: "/dev-record",
            category: "DEVELOP",
            symbol: "</>",
            tone: "navy",
      },
      {
            number: "07",
            title: "코딩클럽",
            description: "함께 공부하고 풀어 본 코드와 아이디어를 정리하세요.",
            href: "/coding-club",
            category: "TOGETHER",
            symbol: "{}",
            tone: "green",
      },
];

export default function HomePage() {
      const balance =
            dashboard.income - dashboard.savings - dashboard.expense;

      const budgetRate = Math.min(
            Math.round((dashboard.expense / dashboard.budget) * 100),
            100,
      );

      const studyRate = Math.round(
            (dashboard.studyCompleted / dashboard.studyTotal) * 100,
      );

      const stats = [
            {
                  label: "이번 달 지출",
                  value: money(dashboard.expense),
                  note: `예산 ${money(dashboard.budget)} 중 ${budgetRate}%`,
                  symbol: "₩",
                  tone: "navy",
            },
            {
                  label: "이번 주 운동",
                  value: `${dashboard.exerciseMinutes}분`,
                  note: `일주일 동안 ${dashboard.exerciseCount}회 기록`,
                  symbol: "↗",
                  tone: "green",
            },
            {
                  label: "이번 달 일기",
                  value: `${dashboard.diaryCount}편`,
                  note: "하루의 생각을 차곡차곡",
                  symbol: "✎",
                  tone: "orange",
            },
            {
                  label: "정보처리기사 학습",
                  value: `${studyRate}%`,
                  note: `${dashboard.studyTotal}개 주제 중 ${dashboard.studyCompleted}개 정리`,
                  symbol: "Aa",
                  tone: "purple",
            },
      ];

      return (
            <>
                  <Header />
            
                  <main className={styles.page}>
                        <div className={styles.container}>
                              <header className={styles.pageHeader}>
                                    <div>
                                          <p className={styles.eyebrow}>
                                                MY PERSONAL SPACE
                                          </p>
                                          <h1>Jay Record Room</h1>
                                          <p className={styles.description}>
                                                일상부터 공부까지
                                          </p>
                                    </div>

                                    <div className={styles.headerActions}>
                                          <span className={styles.sampleBadge}>
                                                예시 데이터
                                          </span>
                                          <Link
                                                href="/diary"
                                                className={styles.primaryButton}
                                          >
                                                오늘의 일기 쓰기 <span>↗</span>
                                          </Link>
                                    </div>
                              </header>

                              <section
                                    className={styles.statsGrid}
                                    aria-label="기록 요약"
                              >
                                    {stats.map((stat) => (
                                          <article
                                                className={styles.statCard}
                                                key={stat.label}
                                          >
                                                <div className={styles.statTop}>
                                                      <span>{stat.label}</span>
                                                      <span
                                                            className={`${styles.smallIcon} ${styles[stat.tone]}`}
                                                            aria-hidden="true"
                                                      >
                                                            {stat.symbol}
                                                      </span>
                                                </div>
                                                <strong className={styles.statValue}>
                                                      {stat.value}
                                                </strong>
                                                <p className={styles.statNote}>
                                                      {stat.note}
                                                </p>
                                          </article>
                                    ))}
                              </section>

                              <div className={styles.dashboardGrid}>
                                    <section className={styles.panel}>
                                          <div className={styles.panelHeader}>
                                                <div>
                                                      <p className={styles.eyebrow}>
                                                            MONTHLY FINANCE
                                                      </p>
                                                      <h2>이번 달 가계부</h2>
                                                </div>
                                                <Link
                                                      href="/record-room"
                                                      className={styles.textLink}
                                                >
                                                      자세히 <span>↗</span>
                                                </Link>
                                          </div>

                                          <div className={styles.balanceCard}>
                                                <div>
                                                      <span>이번 달 남은 금액</span>
                                                      <strong>{money(balance)}</strong>
                                                </div>
                                                <span
                                                      className={styles.balanceSymbol}
                                                      aria-hidden="true"
                                                >
                                                      ₩
                                                </span>
                                                <p>수입 − 저축 − 지출 기준</p>
                                          </div>

                                          <div className={styles.moneyGrid}>
                                                <div>
                                                      <span>수입</span>
                                                      <strong className={styles.income}>
                                                            +{money(dashboard.income)}
                                                      </strong>
                                                </div>
                                                <div>
                                                      <span>저축</span>
                                                      <strong className={styles.savings}>
                                                            {money(dashboard.savings)}
                                                      </strong>
                                                </div>
                                                <div>
                                                      <span>지출</span>
                                                      <strong className={styles.expense}>
                                                            -{money(dashboard.expense)}
                                                      </strong>
                                                </div>
                                          </div>

                                          <div className={styles.budgetHeading}>
                                                <span>월 지출 예산</span>
                                                <strong>
                                                      {budgetRate}%
                                                      <span> 사용</span>
                                                </strong>
                                          </div>

                                          <div
                                                className={styles.progressTrack}
                                                role="progressbar"
                                                aria-label="월 지출 예산 사용률"
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-valuenow={budgetRate}
                                          >
                                                <div
                                                      className={styles.progressFill}
                                                      style={{ width: `${budgetRate}%` }}
                                                />
                                          </div>

                                          <div className={styles.budgetFooter}>
                                                <span>예산 {money(dashboard.budget)}</span>
                                                <span>
                                                      {money(
                                                            dashboard.budget -
                                                                  dashboard.expense,
                                                      )} 남음
                                                </span>
                                          </div>
                                    </section>

                                    <section className={styles.panel}>
                                          <div className={styles.panelHeader}>
                                                <div>
                                                      <p className={styles.eyebrow}>
                                                            WEEKLY ACTIVITY
                                                      </p>
                                                      <h2>한 주의 움직임</h2>
                                                </div>
                                                <span className={styles.unitBadge}>
                                                      단위 · 분
                                                </span>
                                          </div>

                                          <div className={styles.activitySummary}>
                                                <strong>
                                                      {dashboard.exerciseMinutes}
                                                      <span>분</span>
                                                </strong>
                                                <p>
                                                      이번 주 {dashboard.exerciseCount}일,
                                                      나를 위한 시간
                                                </p>
                                          </div>

                                          <div
                                                className={styles.barChart}
                                                role="img"
                                                aria-label={weeklyExercise
                                                      .map(
                                                            (item) =>
                                                                  `${item.day}요일 ${item.minutes}분`,
                                                      )
                                                      .join(", ")}
                                          >
                                                {weeklyExercise.map((item) => (
                                                      <div
                                                            className={styles.barColumn}
                                                            key={item.day}
                                                      >
                                                            <div className={styles.barArea}>
                                                                  <div
                                                                        className={
                                                                              item.minutes > 0
                                                                                    ? styles.bar
                                                                                    : styles.emptyBar
                                                                        }
                                                                        style={{
                                                                              height: `${Math.max(
                                                                                    (item.minutes / 80) * 100,
                                                                                    3,
                                                                              )}%`,
                                                                        }}
                                                                  >
                                                                        <span>
                                                                              {item.minutes}
                                                                        </span>
                                                                  </div>
                                                            </div>
                                                            <span className={styles.dayLabel}>
                                                                  {item.day}
                                                            </span>
                                                      </div>
                                                ))}
                                          </div>

                                          <div className={styles.panelFooter}>
                                                <span>
                                                      작은 기록이 꾸준한 습관이 됩니다.
                                                </span>
                                                <Link
                                                      href="/record-room"
                                                      className={styles.textLink}
                                                >
                                                      운동기록 ↗
                                                </Link>
                                          </div>
                                    </section>

                                    <section className={styles.panel}>
                                          <div className={styles.panelHeader}>
                                                <div>
                                                      <p className={styles.eyebrow}>
                                                            SPENDING REPORT
                                                      </p>
                                                      <h2>어디에 썼을까요?</h2>
                                                </div>
                                          </div>

                                          <div
                                                className={styles.donut}
                                                role="img"
                                                aria-label="지출 구성: 식비 15만원, 생활 9만원, 교통 6만원, 기타 5만원"
                                          >
                                                <div className={styles.donutCenter}>
                                                      <span>총 지출</span>
                                                      <strong>
                                                            {money(dashboard.expense)}
                                                      </strong>
                                                </div>
                                          </div>

                                          <div className={styles.legend}>
                                                {expenseCategories.map((item) => (
                                                      <div
                                                            className={styles.legendRow}
                                                            key={item.name}
                                                      >
                                                            <span className={styles.legendName}>
                                                                  <i
                                                                        style={{
                                                                              backgroundColor: item.color,
                                                                        }}
                                                                  />
                                                                  {item.name}
                                                            </span>
                                                            <strong>
                                                                  {money(item.amount)}
                                                            </strong>
                                                      </div>
                                                ))}
                                          </div>
                                    </section>
                              </div>

                              <section className={styles.roomsSection}>
                                    <div className={styles.sectionHeader}>
                                          <div>
                                                <p className={styles.eyebrow}>
                                                      MY RECORDS
                                                </p>
                                                <h2>나의 기록방</h2>
                                          </div>
                                          <p>오늘은 어떤 기록을 남겨볼까요?</p>
                                    </div>

                                    <div className={styles.roomsGrid}>
                                          {rooms.map((room) => (
                                                <Link
                                                      href={room.href}
                                                      className={styles.roomCard}
                                                      key={room.number}
                                                >
                                                      <div className={styles.roomTop}>
                                                            <span
                                                                  className={`${styles.roomIcon} ${styles[room.tone]}`}
                                                                  aria-hidden="true"
                                                            >
                                                                  {room.symbol}
                                                            </span>
                                                            <span className={styles.roomNumber}>
                                                                  {room.number}
                                                            </span>
                                                      </div>
                                                      <span className={styles.roomCategory}>
                                                            {room.category}
                                                      </span>
                                                      <h3>{room.title}</h3>
                                                      <p>{room.description}</p>
                                                      <div className={styles.roomBottom}>
                                                            <span>기록방 열기</span>
                                                            <span aria-hidden="true">↗</span>
                                                      </div>
                                                </Link>
                                          ))}

                                          <div className={styles.quoteCard}>
                                                <span aria-hidden="true">“</span>
                                                <p>
                                                      기록하는 오늘이
                                                      <br />
                                                      내일의 나를 만듭니다.
                                                </p>
                                                <small>하루 한 줄, 나만의 속도로.</small>
                                          </div>
                                    </div>
                              </section>
                        </div>
                  </main>
            </>
      );
}