'use client';

import { MouseEvent, useState } from 'react';
import Link from 'next/link';

import PrepareModal from '../modal/Modal';

export default function PrepareMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <li>
        <Link href="/diary">
          나의감정일기
        </Link>
      </li>

      <li>
        <Link href="/contact" onClick={handleClick}>
          미정메뉴
        </Link>
      </li>

      <PrepareModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}