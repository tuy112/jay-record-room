'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';

import PrepareModal from '../modal/Modal';
import { logout } from '../../app/login/actions';
import styles from './Header.module.css';

export default function Header() {
  // 1. 미구현 모달창 열기
  const [open, setOpen] = useState(false);

  const handlePrepareClick = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  // 2. 로그아웃 기능


  return (
    <header className={styles.header}>
      <h1>
        <Link href="https://jstory-next.vercel.app">JSTORY</Link>
        <span className={styles.subLogo}>부속 프로젝트</span>
      </h1>

      <nav>
        <ul>
          <li>
            <Link href="/about" onClick={handlePrepareClick}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={handlePrepareClick}>
              Contact Us
            </Link>
          </li>
          <li>
            <form action={logout}>
              <button className="logoutBtn" type="submit">로그아웃</button>
            </form>
          </li>
        </ul>
      </nav>

      <PrepareModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}