'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';

import PrepareModal from '../modal/Modal';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);

  const handlePrepareClick = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

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
        </ul>
      </nav>

      <PrepareModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}