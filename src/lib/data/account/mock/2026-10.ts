import { MonthData } from '../../types/account';

export const DATA_2026_10: MonthData = {
      totalAsset: 0, // 10월 1일 기준
      budget: 310000,
      budgetStartDate: '2026-10-01',
      entries: [
            // 수입
            { id: '1', type: 'income', label: '월급', amount: 2534890 },
            { id: '2', type: 'income', label: '부업', amount: 0 },
            { id: '3', type: 'income', label: '기타(계좌이체)', amount: 0 },
            
            // 고정지출
            { id: '4', type: 'fixed',  label: '월세', amount: 300000, cardType: 'cash' },
            { id: '5', type: 'fixed',  label: '전기세', amount: 50000, cardType: 'cash' },
            { id: '6', type: 'fixed',  label: '하이패스비', amount: 0, cardType: 'cash' },
            { id: '7', type: 'fixed',  label: '통신비', amount: 0, cardType: 'credit' },
            { id: '8', type: 'fixed',  label: '대중교통비', amount: 0 },
            { id: '9', type: 'fixed',  label: '구독 서비스 (멜론)', amount: 0, cardType: 'credit' },
            { id: '10', type: 'fixed',  label: '구독 서비스 (티빙)', amount: 0, cardType: 'credit' },
            { id: '11', type: 'fixed',  label: '구독 서비스 (유튜브)', amount: 0, cardType: 'credit' },
            { id: '12', type: 'fixed',  label: '구독 서비스 (쿠팡)', amount: 0, cardType: 'credit' },
            { id: '13', type: 'fixed',  label: '구독 서비스 (넷플릭스)', amount: 0, cardType: 'credit' },
            { id: '14', type: 'fixed',  label: '운전자 보험', amount: 4030 },

            // 저축
            { id: '16', type: 'saving', label: '청년도약계좌', amount: 500000 },
            { id: '17', type: 'saving', label: '굴비적금', amount: 300000 },
            { id: '18', type: 'saving', label: 'ISA계좌', amount: 300000 },
            { id: '19', type: 'saving', label: '청년주택청약', amount: 50000 },
      ],
      dailyExpenses: [
            // 신용카드는 50만까지만! 체크카드는 하루에 만원(총31만까지 목표)
            { date: '2026-10-01', label: '자동차 보험료 ( / )', amount: 0, cardType: 'credit', excludeFromBudget: true },
      ],
};