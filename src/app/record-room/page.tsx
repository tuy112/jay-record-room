'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Header from '../../components/header';
import Footer from '../../components/footer';

import AccountSection from './account/AccountSection';
import ExerciseSection from './exercise/ExerciseSection';

import styles from './page.module.css';

type Tab = 'account' | 'exercise';

function RecordContent() {
      const router = useRouter();
      const pathname = usePathname();
      const searchParams = useSearchParams();

      const activeTab: Tab =
            searchParams.get('tab') === 'exercise' ? 'exercise' : 'account';

      const changeTab = (tab: Tab) => {
            const params = new URLSearchParams(searchParams.toString());

            params.set('tab', tab);

            router.replace(`${pathname}?${params.toString()}`, {
                  scroll: false,
            });
      };

      return (
            <section className={styles.recordPageContent}>
                  <div
                        className={styles.tabBar}
                        role="tablist"
                        aria-label="기록방 선택"
                  >
                        <button
                              type="button"
                              id="account-tab"
                              role="tab"
                              aria-selected={activeTab === 'account'}
                              aria-controls="account-panel"
                              className={`${styles.tabBtn} ${
                                    activeTab === 'account' ? styles.tabActive : ''
                              }`}
                              onClick={() => changeTab('account')}
                        >
                              가계부
                        </button>

                        <button
                              type="button"
                              id="exercise-tab"
                              role="tab"
                              aria-selected={activeTab === 'exercise'}
                              aria-controls="exercise-panel"
                              className={`${styles.tabBtn} ${
                                    activeTab === 'exercise' ? styles.tabActive : ''
                              }`}
                              onClick={() => changeTab('exercise')}
                        >
                              운동기록
                        </button>
                  </div>

                  {activeTab === 'account' && (
                        <div
                              id="account-panel"
                              role="tabpanel"
                              aria-labelledby="account-tab"
                        >
                              <AccountSection />
                        </div>
                  )}

                  {activeTab === 'exercise' && (
                        <div
                              id="exercise-panel"
                              role="tabpanel"
                              aria-labelledby="exercise-tab"
                        >
                              <ExerciseSection />
                        </div>
                  )}
            </section>
      );
}

export default function RecordPage() {
      return (
            <>
                  <Header />

                  <main className={styles.recordPage}>
                        <div className={styles.recordPageInner}>
                              <section className={styles.recordPageHeader}>
                                    <h1>가계부 + 운동기록방</h1>
                                    <p>Jay의 가계부 및 운동기록방입니다.</p>
                              </section>

                              <Suspense
                                    fallback={
                                          <div className={styles.recordPageContent}>
                                                기록방을 불러오는 중입니다.
                                          </div>
                                    }
                              >
                                    <RecordContent />
                              </Suspense>
                        </div>
                  </main>

                  <Footer />
            </>
      );
}