/* =======================================
 *リタワーク HEADER
 * URL: src/components/common/Header.tsx
 * Created: 2025-07-11
 * Last updated: 2025-07-11
 * ======================================= */
'use client';
import styles from '@/styles/components/common/Header.module.scss';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    // DOM描画後に確実にoffsetTopを取得する
    requestAnimationFrame(() => {
      headerOffsetRef.current = headerRef.current?.offsetTop ?? 0;

      const handleScroll = () => {
        const y = window.scrollY;
        setIsFixed(y >= headerOffsetRef.current + 400);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      // クリーンアップ
      return () => window.removeEventListener('scroll', handleScroll);
    });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('click', handleOutsideClick, true);
    return () =>
      document.removeEventListener('click', handleOutsideClick, true);
  }, [isOpen]);

  // Fixed header state and ref
  const [isFixed, setIsFixed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // Store the original Y-offset of the header
  const headerOffsetRef = useRef(0);

  useEffect(() => {
    // Set the original offsetTop of the header on mount
    headerOffsetRef.current = headerRef.current?.offsetTop ?? 0;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsFixed(y >= headerOffsetRef.current);
    };
    window.addEventListener('scroll', handleScroll);
    // Run once to set state if already scrolled
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${styles.containerHeader} ${isFixed ? styles['is-fixed'] : ''}`}
      ref={headerRef}
      id="Header"
    >
      <button
        type="button"
        className={`${styles.hamburgerButton} ${
          isOpen ? styles['is-open'] : ''
        }`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="メニューを開閉"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <article>
        <Link href="/" className={styles.itemLogo}>
          <svg aria-label="リタワークkロゴ">
            <use href="#svg_logoMark" />
          </svg>
        </Link>
        <nav>
          <Link href="#">求人検索</Link>
          <Link href="#">お気に入り・閲覧検索</Link>
        </nav>
        <Link href="" className={styles.linkMyPage}>
          <span> マイページ</span>
        </Link>
      </article>
    </header>
  );
};

export default Header;
