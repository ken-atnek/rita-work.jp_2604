/* =======================================
 *リタワーク HEADER
 * URL: src/components/common/Header.tsx
 * Created: 2025-07-11
 * Last updated: 2026-02-23
 * ======================================= */
'use client';

import styles from './Header.module.scss';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import FacilitySearchBox from '@/components/facility/search/FacilitySearchBox';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  // -----------------------------
  // Fixed header (PC)
  // -----------------------------
  const [isFixed, setIsFixed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headerOffsetRef = useRef(0);

  useEffect(() => {
    headerOffsetRef.current = headerRef.current?.offsetTop ?? 0;

    const handleScroll = () => {
      const y = window.scrollY;
      setIsFixed(y >= headerOffsetRef.current + 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -----------------------------
  // Outside click to close
  // -----------------------------
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isOpen) return;

      const target = event.target as Node;

      // メニュー内クリックは無視
      if (navRef.current?.contains(target)) return;

      // ハンバーガーボタンのクリックも無視（ここが重要）
      if (buttonRef.current?.contains(target)) return;

      closeMenu();
    };

    document.addEventListener('click', handleOutsideClick, true);
    return () =>
      document.removeEventListener('click', handleOutsideClick, true);
  }, [isOpen]);

  // -----------------------------
  // Route change -> close menu
  // （同一パスでもクエリが変わるケース対策で searchParams も監視）
  // -----------------------------
  const pathname = usePathname();
  const isTop = pathname === '/';

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={clsx(
          styles.containerHeader,
          isFixed && styles['is-fixed'],
          isTop ? styles.isTop : styles.isSub
        )}
        ref={headerRef}
        id="Header"
      >
        <article>
          <Link href="/" className={styles.itemLogo}>
            <h1>
              <svg aria-label="リタワーク" className={styles.statusPc}>
                <use href="#svg_logoMark" />
              </svg>
              <svg aria-label="リタワーク" className={styles.statusSp}>
                <use href="#svg_logoMax" />
              </svg>
              <span>熊本医療＆介護の転職サイト</span>
            </h1>
          </Link>

          <div
            className={clsx(
              styles.boxMobileMenu,
              isOpen && styles.isOpen,
              !isOpen && styles.closing
            )}
            ref={navRef}
          >
            <nav>
              <Link href="/" className={styles.itemSp} onClick={closeMenu}>
                ホーム<i></i>
              </Link>

              <Link href="/jobs/" onClick={closeMenu}>
                求人検索<i></i>
              </Link>

              <FacilitySearchBox
                className={styles.itemSearch}
                inputClassName={styles.itemSearchInput}
                buttonClassName={styles.itemSearchBtn}
                placeholder="事業所名で探す"
              />

              <Link href="/library/" onClick={closeMenu}>
                お気に入り・閲覧検索<i></i>
              </Link>
            </nav>
          </div>

          {/*
          <Link href="" className={styles.linkMyPage}>
            <span> マイページ</span>
          </Link>
          */}
        </article>
      </header>

      <button
        ref={buttonRef}
        type="button"
        className={`${styles.hamburgerButton} ${
          isOpen ? styles['is-open'] : ''
        }`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="メニューを開閉"
      >
        <div className={styles.itemLogo}>
          <svg aria-label="リタワーク">
            <use href="#svg_logoMark" />
          </svg>
        </div>
        <span></span>
        <span></span>
        <i>閉じる</i>
        <span></span>
      </button>
    </>
  );
};

export default Header;
