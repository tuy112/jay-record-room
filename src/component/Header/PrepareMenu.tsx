'use client';
import Link from 'next/link';
import { Home, LifeBuoy } from 'lucide-react';

export default function PrepareMenu() {

  return (
    <>
        <Link href="/">
          <Home size={15} />
          홈
        </Link>
      <li>
        <Link href="/diary">
          일기장
        </Link>
      </li>
      <li>
        <Link href="/dev-record">
          개발일지
        </Link>
      </li>
    </>
  );
}