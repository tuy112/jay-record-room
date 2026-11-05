'use client';

import { useState } from 'react';
import Link from 'next/link';

import Header from '../components/header';
import Footer from '../components/footer';
import Modal from '../components/common/modal';

import styles from './page.module.css';

interface HomePageProps {
    userRole?: string;
}

const rooms = [
      {
            number: '01',
            title: '가계부',
            description: '수입과 지출을 정리하고 소비 흐름을 확인해 보세요.',
            href: '/record-room?tab=account',
            category: 'MONEY',
            symbol: '₩',
            tone: 'navy',
      },
      {
            number: '02',
            title: '운동기록',
            description: '오늘의 움직임을 남기고 꾸준한 변화를 만들어 보세요.',
            href: '/record-room?tab=exercise',
            category: 'HEALTH',
            symbol: '↗',
            tone: 'green',
      },
      {
            number: '03',
            title: '일기장',
            description: '잊고 싶지 않은 하루와 나만의 생각을 남겨 보세요.',
            href: '/diary',
            category: 'DAILY',
            symbol: '✎',
            tone: 'orange',
      },
      {
            number: '04',
            title: '정보처리기사 요약',
            description: '과목별 핵심 개념과 공부한 내용을 차곡차곡 정리하세요.',
            href: '/eip-study',
            category: 'STUDY',
            symbol: 'Aa',
            tone: 'purple',
      },
      {
            number: '05',
            title: 'RMS 기록방',
            description: '기록관리시스템 로그분석 및 소프트케이 연구소입니다.',
            href: '/rms',
            category: 'WORK',
            symbol: '≡',
            tone: 'blue',
      },
      {
            number: '06',
            title: '개발기록',
            description: '개발하면서 배운 내용과 문제 해결 경험을 기록하세요.',
            href: '/dev-record',
            category: 'DEVELOP',
            symbol: '</>',
            tone: 'navy',
      },
      {
            number: '07',
            title: '코딩클럽',
            description: '함께 공부하고 풀어 본 코드와 아이디어를 정리하세요.',
            href: '/coding-club',
            category: 'TOGETHER',
            symbol: '{}',
            tone: 'green',
      },
      ];

      export default function HomePage({ userRole }: HomePageProps) {
      const [showModal, setShowModal] = useState(false);

      const handleModal = (
            e: React.MouseEvent<HTMLAnchorElement>
      ) => {
            e.preventDefault();
            setShowModal(true);
      };

      const handleRoomClick = (
            e: React.MouseEvent<HTMLAnchorElement>,
            href: string
      ) => {
            if (userRole === 'ADMIN' || href === '/rms') {
                  return;
            }

            handleModal(e);
      };

      return (
            <>
                  <Header />

                  <Modal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        title="접근 권한 안내"
                  >
                        <p>관리자 계정만 들어갈 수 있습니다.</p>
                  </Modal>

                  <main className={styles.page}>
                        <div className={styles.container}>
                              <header className={styles.pageHeader}>
                                    <div>
                                          <p className={styles.eyebrow}>MY PERSONAL SPACE</p>
                                          <h1>Jay Record Room</h1>
                                          <p className={styles.description}>일반 회원은 RMS기록방만 들어갈 수 있습니다.</p>
                                    </div>
                              </header>

                              <section className={styles.roomsSection}>

                                    <div className={styles.roomsGrid}>
                                          {rooms.map((room) => (
                                                <Link
                                                      href={room.href}
                                                      className={styles.roomCard}
                                                      key={room.number}
                                                      onClick={(e) =>handleRoomClick(e, room.href)}
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
                                                      기록하는 오늘이<br />
                                                      내일의 나를 만듭니다.
                                                </p>
                                                <small>하루 한 줄 ㄱㄱ</small>
                                          </div>
                                    </div>
                              </section>
                        </div>
                  </main>

                  <Footer />
            </>
      );
}