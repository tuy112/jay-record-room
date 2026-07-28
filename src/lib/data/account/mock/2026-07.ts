import { MonthData } from '../../types/account';

export const DATA_2026_07: MonthData = {
  totalAsset: 0, // 7월 31일 기준
  budget: 80000,
  budgetStartDate: '2026-07-24',
  entries: [
    // 수입
    { id: '1', type: 'income', label: '월급', amount: 2447834 },
    { id: '2', type: 'income', label: '부업', amount: 21720 },
    { id: '3', type: 'income', label: '기타(계좌이체)', amount: 0 },
    
    // 고정지출
    { id: '4', type: 'fixed',  label: '월세', amount: 300000, cardType: 'cash' },
    { id: '5', type: 'fixed',  label: '차 할부금', amount: 154840, cardType: 'cash' },
    { id: '6', type: 'fixed',  label: '전 월 전기세', amount: 44000, cardType: 'cash' },
    { id: '7', type: 'fixed',  label: '하이패스비', amount: 31200, cardType: 'cash' },
    { id: '8', type: 'fixed',  label: '통신비', amount: 63990, cardType: 'credit' },
    { id: '9', type: 'fixed',  label: '버스요금', amount: 0, cardType: 'cash' },
    { id: '10', type: 'fixed',  label: '구독 서비스 (멜론)', amount: 6083, cardType: 'credit' },
    { id: '11', type: 'fixed',  label: '구독 서비스 (티빙)', amount: 6300, cardType: 'credit' },
    { id: '12', type: 'fixed',  label: '구독 서비스 (유튜브)', amount: 14900, cardType: 'credit' },
    { id: '13', type: 'fixed',  label: '구독 서비스 (쿠팡)', amount: 0, cardType: 'credit' },
    { id: '14', type: 'fixed',  label: '구독 서비스 (넷플릭스)', amount: 0, cardType: 'credit' },
    { id: '15', type: 'fixed',  label: '운전자 보험', amount: 4030, cardType: 'cash' },

    // 저축
    { id: '16', type: 'saving', label: '청년도약계좌', amount: 500000 },
    { id: '17', type: 'saving', label: '굴비적금', amount: 300000 },
    { id: '18', type: 'saving', label: 'ISA계좌', amount: 300000 },
    { id: '19', type: 'saving', label: '청년주택청약', amount: 50000 },
  ],

  // 일일 지출
  dailyExpenses: [
    { date: '2026-06-30', label: '6월 부산버스 1건', amount: 1550, cardType: 'credit' },
    { date: '2026-07-01', label: '헬스 10개월(2/3)', amount: 206277, cardType: 'credit' },
    { date: '2026-07-01', label: '야식', amount: 7900, cardType: 'credit' },
    { date: '2026-07-01', label: '쿠팡쇼핑', amount: 16830, cardType: 'cash' },
    
    { date: '2026-07-02', label: 'kt구장 취소수수료', amount: 2200, cardType: 'credit' },
    { date: '2026-07-02', label: '점심', amount: 7000, cardType: 'credit' },
    { date: '2026-07-02', label: '저녁', amount: 8400, cardType: 'cash' },
    
    { date: '2026-07-03', label: '야식', amount: 5900, cardType: 'cash' },
    { date: '2026-07-03', label: '베리어스', amount: 21714, cardType: 'cash' },
    { date: '2026-07-03', label: '베리어스 7월회비', amount: 5000, cardType: 'cash' },
    { date: '2026-07-03', label: '저녁', amount: 2500, cardType: 'credit' },
    { date: '2026-07-03', label: '주유비(낙동강구미)', amount: 20000, cardType: 'credit' },

    { date: '2026-07-04', label: '주유비(원천주유소)', amount: 15000, cardType: 'credit' },
    { date: '2026-07-04', label: 'kt구장 티켓팅', amount: 13000, cardType: 'cash' },
    { date: '2026-07-04', label: '한양대주차비', amount: 3000, cardType: 'cash' },
    { date: '2026-07-04', label: '편의점(음료)', amount: 2100, cardType: 'credit' },

    { date: '2026-07-05', label: '편의점(핫식스)', amount: 2300, cardType: 'credit' },
    { date: '2026-07-05', label: '편의점(북통영ic점)', amount: 1700, cardType: 'credit' },
    { date: '2026-07-05', label: '가덕도칼국수', amount: 10000, cardType: 'cash' },
    { date: '2026-07-05', label: '마트 장보기(저녁)', amount: 5360, cardType: 'credit' },

    { date: '2026-07-06', label: 'gps이모티콘 구매', amount: 2500, cardType: 'credit' },
    { date: '2026-07-06', label: '저녁', amount: 3900, cardType: 'credit' },
    { date: '2026-07-06', label: '야볼 8/8 정모비', amount: 20000, cardType: 'cash' },
    { date: '2026-07-06', label: '사직구장 티켓', amount: 9500, cardType: 'credit' },

    { date: '2026-07-07', label: '야식(순대)', amount: 4000, cardType: 'credit' },
    { date: '2026-07-07', label: '쿠팡 장보기', amount: 7890, cardType: 'cash' },
    { date: '2026-07-07', label: '사직구장 티켓(백승화)', amount: 14500, cardType: 'cash' },
    { date: '2026-07-07', label: '점심', amount: 5000, cardType: 'credit' },
    { date: '2026-07-07', label: '저녁', amount: 6300, cardType: 'credit' },
    { date: '2026-07-07', label: '티빙(중복구매)', amount: 6300, cardType: 'credit' },
    { date: '2026-07-07', label: '야식', amount: 3650, cardType: 'credit' },

    { date: '2026-07-08', label: '점심(직화짬뽕)', amount: 7000, cardType: 'credit' },
    { date: '2026-07-08', label: '저녁(고메스퀘어)', amount: 33900, cardType: 'credit' },
    { date: '2026-07-08', label: '편의점(활명수)', amount: 1200, cardType: 'credit' },

    { date: '2026-07-09', label: '쿠팡 장 보기', amount: 10100, cardType: 'credit' },
    { date: '2026-07-09', label: '점심(편의점)', amount: 5000, cardType: 'credit' },
    { date: '2026-07-09', label: '저녁(사직편의점)', amount: 3500, cardType: 'credit' },

    { date: '2026-07-10', label: '9일 gps 뒷풀이', amount: 45000, cardType: 'cash' },
    { date: '2026-07-10', label: '점심', amount: 5100, cardType: 'credit' },
    { date: '2026-07-10', label: '미용실', amount: 13512, cardType: 'credit' },
    { date: '2026-07-10', label: '구포->수원(무궁화호)', amount: 21200, cardType: 'credit' },
    { date: '2026-07-10', label: '편의점(구포역)', amount: 3900, cardType: 'credit' },

    { date: '2026-07-11', label: '택시비(매탄권선역)', amount: 8200, cardType: 'credit' },
    { date: '2026-07-11', label: '음료', amount: 700, cardType: 'credit' },
    { date: '2026-07-11', label: '취소표구매신청', amount: 1800, cardType: 'cash' },
    { date: '2026-07-11', label: '점심(냉면)', amount: 8500, cardType: 'cash' },

    { date: '2026-07-12', label: '유진이누나 생일선물', amount: 15000, cardType: 'credit' },
    { date: '2026-07-12', label: '기차에서먹을거리구매(주먹밥)', amount: 1500, cardType: 'credit' },
    { date: '2026-07-12', label: '기차에서먹을거리구매(맥주)', amount: 3500, cardType: 'cash' },
    { date: '2026-07-12', label: '수원->구포(새마을호)', amount: 34700, cardType: 'cash' },
    { date: '2026-07-12', label: '11일 새벽 집 복귀(자전거)', amount: 2820, cardType: 'cash' },
    { date: '2026-07-12', label: '점심 겸 저녁', amount: 5680, cardType: 'cash' },
    { date: '2026-07-12', label: '게임구매(맷차카멜)', amount: 6369, cardType: 'cash' },
    { date: '2026-07-12', label: '쿠팡장보기(휴지)', amount: 3930, cardType: 'credit' },
    { date: '2026-07-12', label: '저녁(쿠팡이츠)', amount: 8700, cardType: 'credit' },
    { date: '2026-07-13', label: '커피', amount: 1800, cardType: 'credit' },
    { date: '2026-07-13', label: '저녁(편의점)', amount: 4600, cardType: 'cash' },

    { date: '2026-07-14', label: '커피', amount: 1800, cardType: 'cash' },
    { date: '2026-07-14', label: '생새우벙(gps)', amount: 53875, cardType: 'cash' },
    
    { date: '2026-07-15', label: '출근길 카카오바이크', amount: 660, cardType: 'cash' },
    { date: '2026-07-15', label: '점심(토마토도시락)', amount: 3900, cardType: 'cash' },
    { date: '2026-07-15', label: '쿠팡쇼핑', amount: 9480, cardType: 'cash' },
    { date: '2026-07-15', label: '주유비(오토바이)', amount: 3626, cardType: 'cash' },
    { date: '2026-07-15', label: '저녁(편의점)', amount: 4200, cardType: 'cash' },
    { date: '2026-07-15', label: '저녁(음료2잔)', amount: 1800, cardType: 'cash' },
    { date: '2026-07-15', label: '커피(루나 캡슐 무인카페)', amount: 2200, cardType: 'cash' },
    
    { date: '2026-07-16', label: '점심(토마토도시락)', amount: 5000, cardType: 'cash' },
    { date: '2026-07-16', label: '편의점(광안리 맥주)', amount: 1750, cardType: 'cash' },
    { date: '2026-07-16', label: '편의점(광안리 맥주)', amount: 3450, cardType: 'cash' },
    { date: '2026-07-16', label: '다이소(탈취제)', amount: 6000, cardType: 'credit' },
    { date: '2026-07-16', label: '마트(맥주2캔-혜린)', amount: 8560, cardType: 'credit' },
    { date: '2026-07-16', label: '코인노래방(혜린)', amount: 5000, cardType: 'credit' },
    
    { date: '2026-07-17', label: '코인노래방(혜린)', amount: 5000, cardType: 'cash' },
    { date: '2026-07-17', label: '카카오바이크', amount: 660, cardType: 'cash' },
    { date: '2026-07-17', label: '쿠팡장보기', amount: 1700, cardType: 'cash' },
    { date: '2026-07-17', label: '쿠팡장보기', amount: 3000, cardType: 'cash' },
    { date: '2026-07-17', label: '쿠팡장보기', amount: 3260, cardType: 'cash' },
    { date: '2026-07-17', label: '쿠팡장보기', amount: 8190, cardType: 'cash' },
    
    { date: '2026-07-18', label: '미남역 고기(gps)', amount: 53671, cardType: 'cash' },
    { date: '2026-07-18', label: '주유비(부산->대구)', amount: 20000, cardType: 'cash' },
    { date: '2026-07-18', label: '대구 초밥집', amount: 11500, cardType: 'cash' },
    { date: '2026-07-18', label: '편의점(대구)', amount: 3700, cardType: 'cash' },
    { date: '2026-07-18', label: '대구 국밥집', amount: 13000, cardType: 'cash' },
    
    { date: '2026-07-19', label: '사직 티켓값', amount: 9500, cardType: 'cash' },
    { date: '2026-07-19', label: '점심(진영 짜장면)', amount: 13000, cardType: 'cash' },
    { date: '2026-07-19', label: '저녁(마트 장보기)', amount: 4000, cardType: 'cash' },
    
    { date: '2026-07-20', label: '삼라온 합동 뒷풀이 정산', amount: 54193, cardType: 'cash' },
    { date: '2026-07-20', label: '클로드 ai', amount: 33096, cardType: 'credit' },
    { date: '2026-07-20', label: '정보처리기사 필기 접수', amount: 9700, cardType: 'cash' },
    { date: '2026-07-20', label: '오토바이 정비(엔진오일,브레이크등 센서)', amount: 26000, cardType: 'cash' },
    { date: '2026-07-20', label: '저녁(마트 장보기1)', amount: 4710, cardType: 'cash' },
    { date: '2026-07-20', label: '저녁(마트 장보기2)', amount: 1980, cardType: 'cash' },
    
    { date: '2026-07-21', label: '점심(편의점)', amount: 3450, cardType: 'cash' },
    { date: '2026-07-21', label: '저녁(마트 장보기)', amount: 4900, cardType: 'cash' },
    { date: '2026-07-21', label: '?지출', amount: 3000, cardType: 'cash' },
    { date: '2026-07-21', label: '편의점(음료)', amount: 3300, cardType: 'cash' },
    { date: '2026-07-21', label: '편의점(?)', amount: 2400, cardType: 'cash' },
    
    { date: '2026-07-22', label: '편의점(맥주)', amount: 3500, cardType: 'cash' },
    { date: '2026-07-22', label: '승통', amount: 27500, cardType: 'cash' },
    
    { date: '2026-07-23', label: '토끼 티모시', amount: 19200, cardType: 'cash' },
    { date: '2026-07-23', label: '베리어스 정모비', amount: 10000, cardType: 'cash' },
    { date: '2026-07-23', label: '점심(토마토 도시락)', amount: 3900, cardType: 'cash' },
    { date: '2026-07-23', label: '저녁(마트 장보기)', amount: 1500, cardType: 'cash' },
    { date: '2026-07-24', label: '저녁(사직 닭갈비-진성주)', amount: 33100, cardType: 'cash', excludeFromBudget: true },

    // 이때부터 7/31일까지 현금 8만원으로만 생활하기 시작!!
    { date: '2026-07-24', label: '사직직관', amount: 3200, cardType: 'cash' },
    { date: '2026-07-24', label: '편의점(맥주2캔)', amount: 3500, cardType: 'cash' },
    { date: '2026-07-24', label: '야식(마트 장보기)+25일 휴게소(핫식스 2캔)', amount:5000, cardType: 'cash' },
    
    { date: '2026-07-25', label: '주유비(부산->단양)', amount: 20000, cardType: 'cash', excludeFromBudget: true },
    { date: '2026-07-26', label: '캠핑장 커피 4잔', amount: 16000, cardType: 'cash', excludeFromBudget: true },
    { date: '2026-07-26', label: '주유비(단양->부산)', amount: 45000, cardType: 'cash', excludeFromBudget: true },
    { date: '2026-07-26', label: '다이소(탈취제)', amount: 4000, cardType: 'cash', excludeFromBudget: true },
    
    { date: '2026-07-27', label: '지출 제로!!', amount: 0, cardType: 'cash' },
    
    { date: '2026-07-28', label: '쿠팡쇼핑(캠핑용품-의자,테이블,가스랜턴,차방석)', amount: 68180, cardType: 'cash', excludeFromBudget: true },
    { date: '2026-07-28', label: '8/22 잠실직관', amount: 19000, cardType: 'cash', excludeFromBudget: true },
  ],
};