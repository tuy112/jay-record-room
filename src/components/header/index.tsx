import { useState } from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import styles from './style.module.css';

const menuItems = [
      { label: '홈 (가계부 + 운동기록방)', href: '/' },
      { label: '일기장', href: '/diary' },
      { label: '개발일지', href: '/dev-record' },
      { label: '기록관리시스템 연구소', href: '/rms' },
      { label: '정보처리기사 요약', href: '/eip-study' },
      { label: '알쓸개지 (알면 쓸데있는 개발 지식)', href: '/coding-club' },
];

export default function Header() {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

      const handleLogout = async () => {
            // 로그아웃 기능
            
      };

      return (
            <header className={styles.header}>
                  <div className={styles.logoArea}>
                        <Link href="https://jstory-next.vercel.app/" className={styles.logo}>
                              JSTORY
                        </Link>
                        <span className={styles.projectName}>부속 프로젝트</span>
                  </div>

                  {/* 햄버거 메뉴 버튼 */}
                  <button
                        type="button"
                        className={styles.menuToggle}
                        aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                        <span />
                        <span />
                        <span />
                  </button>

                  <nav className={`${styles.navigation} ${isMenuOpen ? styles.open : ''}`}>
                        <ul className={styles.menu}>
                              {menuItems.map((item) => (
                                    <li key={item.href}>
                                          <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                                                {item.label}
                                          </Link>
                                    </li>
                              ))}
                              <li>
                                    <button
                                          type="button"
                                          className={styles.logoutButton}
                                          onClick={handleLogout}
                                    >
                                          로그아웃
                                    </button>
                              </li>
                        </ul>
                  </nav>
            </header>
      );
}