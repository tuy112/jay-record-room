import Link from 'next/link';

import PrepareMenu from './PrepareMenu';
import LogoutButton from './LogoutButton';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <Link href="https://jstory-next.vercel.app/" className={styles.logo}>
          JSTORY
        </Link>

        <span className={styles.projectName}>
          부속 프로젝트
        </span>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.menu}>
          <PrepareMenu />
          
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}