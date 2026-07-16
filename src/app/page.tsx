'use client'
import { useState } from 'react';

import Header from '../component/Header/Header';
import Footer from '../component/Footer/Footer';

import AccountSection from './account/AccountSection';
import ExerciseSection from './exercise/ExerciseSection';

import styles from "./page.module.css";

export default function RecordPage() {
    const [activeTab, setActiveTab] = useState<'account' | 'exercise'>('account');

    return (
        <>
            <Header />

            <main className={styles.recordPage}>
                <div className={styles.recordPageInner}>
                    <section className={styles.recordPageHeader}>
                        <h1>가계부 + 운동기록방</h1>
                        <p>Jay의 가계부 및 운동기록방입니다.</p>
                    </section>

                    <section className={styles.recordPageContent}>
                        {/* 탭 바 */}
                        <div className={styles.tabBar}>
                            <button
                            className={`${styles.tabBtn} ${activeTab === 'account' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('account')}
                            >
                            가계부
                            </button>
                            <button
                            className={`${styles.tabBtn} ${activeTab === 'exercise' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('exercise')}
                            >
                            운동기록
                            </button>
                        </div>

                        {/* 가게부 */}
                        {activeTab === 'account'  && <AccountSection />}

                        {/* 운동기록방 */}
                        {activeTab === 'exercise' && <ExerciseSection />}
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}