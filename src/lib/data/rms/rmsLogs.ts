export type rmsLogItem = {
      id: number;
      topic: string;
      title: string;
      subtitle: string;
      createdAt: string;
      content: string;
};

// SQL 중 ContentRenderer용 코드 블록으로 감싸기
const formatSql = (sql: string) => `\`\`\`sql\n${sql.trim()}\n\`\`\``;
export const rmsLogPosts: rmsLogItem[] = [
      {
            id: 1,
            topic: '기록물 인수',
            title: '연계인수',
            subtitle: '연계인수란?',
            createdAt: '2026-10-12',
            content: `
            연계인수는 생산시스템과 기록관리시스템 간 연계규격에 의한 기능을 이용하여
            기록물인수와 생산현황접수, 생산현황통보 업무를 수행한다.
            `,
      },
      {
            id: 2,
            topic: '기록물 인수',
            title: '연계인수',
            subtitle: '인수일정수립',
            createdAt: '2026-10-12',
            content: `
            연계일정수립은 기록관에서 각 생산부서로부터 기록물을 인수받는 일정 계획을 수립하는 화면이다.
            인수부서별로 생산기록물 목록과 전자기록물을 연계인수받는 전자기록물 인수일정계
            획과 비전자(혼용)기록물을 인수받는 비전자기록물 인수일정을 등록/삭제/수정하는 업무를
            수행합니다.

            ${formatSql(`
SELECT C.*
FROM (
      SELECT ROWNUM AS rnum, B.*
      FROM (
            SELECT
                  A.org_cd AS take_org_cd,
                  A.org_nm AS take_org_nm,
                  A.full_org_nm AS take_full_org_nm,
                  A.org_abbr_nm AS take_org_abbr_nm,
                  B.take_yyyy,
                  B.erecord_take_start_plan_ymd,
                  B.erecord_take_close_plan_ymd,
                  B.noelct_take_start_plan_ymd,
                  B.noelct_take_close_plan_ymd,
                  B.take_sched_set_state
            FROM TB_STORG A,
                  (
                        SELECT *
                        FROM TB_TKORGTAKESCHED
                        WHERE record_center_id = '0000001'
                              AND take_yyyy = '2026'
                  ) B
            WHERE A.record_center_id = B.record_center_id(+)
                  AND A.org_cd = B.take_org_cd(+)
                  AND A.record_center_id = '0000001'
            ORDER BY A.org_cd
      ) B
      WHERE ROWNUM <= 20
) C
WHERE C.rnum >= 1;
            `)}
            `,
      },
      {
            id: 3,
            topic: '기록물 인수',
            title: '연계인수',
            subtitle: '접수처리',
            createdAt: '2026-10-12',
            content: `
            접수처리 기능에서는 인수부서별 생산시스템별로 온라인/오프라인 기록물 인수 접수처리 상태와
            접수된 기록물철/건수 등 접수현황을 조회를 하고, 오프라인 접수처리 업무를 수행할 수 있습니다.

            ${formatSql(`
-- 실행 시간: 2,203ms
SELECT COUNT(1)
FROM (
      SELECT
            A.record_center_id,
            A.org_cd AS take_org_cd,
            A.org_nm AS take_org_nm,
            A.org_abbr_nm AS take_org_abbr_nm,
            A.creat_sys_cd,
            (
                  SELECT com_cd_nm
                  FROM TB_ZZCOMCD
                  WHERE com_type_cd = 'RD17'
                        AND com_cd = A.creat_sys_cd
            ) AS creat_sys_cd_nm,
            '2026' AS take_yyyy,
            B.take_sno,
            NVL(
                  B.take_state_div_cd,
                  DECODE(A.take_sched_set_state, '1', '02', '3', '02', '01')
              ) AS take_state_div_cd,
            NVL(
                  (
                        SELECT com_cd_nm
                        FROM TB_ZZCOMCD
                        WHERE com_type_cd = 'TK08'
                              AND com_cd = B.take_state_div_cd
                  ),
                  DECODE(
                        A.take_sched_set_state,
                        '1', '일정등록완료',
                        '3', '인수작업완료',
                        '일정미수립'
                  )
            ) AS take_state_div_cd_nm,
            NVL(B.recv_fin_state_cd, '0') AS recv_fin_state_cd,
            DECODE(
                  B.recv_fin_state_cd,
                  '1', '미접수',
                  '2', '접수중',
                  '3', '접수완료',
                  '4', '반려',
                  '미대상'
            ) AS recv_fin_state_cd_nm
      FROM (
            SELECT
                  A.record_center_id,
                  A.org_cd,
                  A.org_nm,
                  A.org_abbr_nm,
                  B.creat_sys_cd,
                  C.take_sched_set_state
            FROM TB_STORG A,
                  TB_STLINKTRGT B,
                  (
                        SELECT
                              record_center_id,
                              take_org_cd,
                              take_sched_set_state
                        FROM TB_TKORGTAKESCHED
                        WHERE take_yyyy = '2026'
                  ) C
            WHERE A.record_center_id = '0000001'
                  AND A.link_trgt_id = B.link_trgt_id
                  AND A.record_center_id = C.record_center_id(+)
                  AND A.org_cd = C.take_org_cd(+)
      ) A,
      (
            SELECT *
            FROM TB_TKORGTAKEPLAN
            WHERE record_center_id = '0000001'
                  AND take_yyyy = '2026'
                  AND (app_take_type_cd IS NULL OR app_take_type_cd = '0')
      ) B
      WHERE A.record_center_id = B.record_center_id(+)
            AND A.org_cd = B.take_org_cd(+)
            AND A.creat_sys_cd = B.creat_sys_cd(+)
) Z;
            `)}

            ${formatSql(`
-- 실행 시간: 11,811ms
SELECT C.*
FROM (
      SELECT
            ROWNUM AS rnum,
            B.*
      FROM (
            SELECT
                  Z.record_center_id,
                  Z.take_yyyy,
                  Z.take_org_cd,
                  Z.take_org_nm,
                  Z.take_org_abbr_nm,
                  Z.creat_sys_cd,
                  Z.creat_sys_cd_nm,
                  Z.take_sno,
                  Z.parent_take_sno,
                  Z.take_state_div_cd,
                  Z.take_state_div_cd_nm,
                  Z.recv_fin_state_cd,
                  Z.recv_fin_state_cd_nm,
                  Z.recv_folder_cnt,
                  Z.recv_record_cnt,
                  Z.recv_attach_cnt,
                  NVL(Z.folder_cnt01, 0) AS folder_cnt01,
                  NVL(Z.folder_cnt01 - Z.folder_cnt03, 0) AS folder_cnt02,
                  NVL(Z.folder_cnt03, 0) AS folder_cnt03,
                  NVL(Z.record_cnt01, 0) AS record_cnt01,
                  NVL(Z.record_cnt01 - Z.record_cnt03, 0) AS record_cnt02,
                  NVL(Z.record_cnt03, 0) AS record_cnt03,
                  NVL(Z.attach_cnt01, 0) AS attach_cnt01,
                  NVL(Z.attach_cnt01 - Z.attach_cnt03, 0) AS attach_cnt02,
                  NVL(Z.attach_cnt03, 0) AS attach_cnt03,
                  NVL(Z.folder_cnt04, 0) AS folder_cnt04,
                  NVL(Z.folder_cnt05, 0) AS folder_cnt05,
                  Z.rjct_hist_cnt,
                  Z.reg_dtime,
                  Z.recv_re_flag,
                  Z.creat_yyyy
            FROM (
                  SELECT
                        A.record_center_id,
                        A.org_cd AS take_org_cd,
                        A.org_nm AS take_org_nm,
                        A.org_abbr_nm AS take_org_abbr_nm,
                        A.creat_sys_cd,
                        (
                              SELECT com_cd_nm
                              FROM TB_ZZCOMCD
                              WHERE com_type_cd = 'RD17'
                                    AND com_cd = A.creat_sys_cd
                        ) AS creat_sys_cd_nm,
                        '2026' AS take_yyyy,
                        B.take_sno,
                        B.parent_take_sno,
                        NVL(
                              B.take_state_div_cd,
                              DECODE(A.take_sched_set_state, '1', '02', '3', '02', '01')
                        ) AS take_state_div_cd,
                        CASE
                              WHEN B.take_sno != B.parent_take_sno
                                    AND B.take_state_div_cd = '04'
                              THEN '인수작업완료'
                              ELSE '진행중'
                        END AS take_state_div_cd_nm
                  FROM TB_STORG A
                  -- (이하 조인 및 조건 로직 생략)
            ) Z
      ) B
) C;
            `)}
            `,
      },
      {
            id: 4,
            topic: '기록물 인수',
            title: '연계인수',
            subtitle: '검수처리',
            createdAt: '2026-10-12',
            content: `
            검수처리 기능은 인수 접수가 완료된 전자기록물 및 비전자기록물의 메타데이터와 본문 파일을
            기록물 관리 표준에 맞게 정밀 검수하는 화면입니다. 오류 데이터를 추출하고 수정/보완 처리를 수행합니다.
            `,
      },
      {
            id: 5,
            topic: '기록물 인수',
            title: '등록인수',
            subtitle: '기록물등록 > 등록',
            createdAt: '2026-10-12',
            content: `
            등록인수는 연계인수 이외에 기록관에서 보유하고 있는 기록물 또는 생산시스템 이외의정보시스템으로부터 보유하고 있는 기록물을 기록관리시스템 등록인수 기능으로 기록물 철/
            건을 직접 등록 또는 일괄등록 지침(『행정정보DB구축 기록물의 기록관리시스템규격』, 『구전자기록물의 기록관리시스템규격』) 에 따라 기록물 등록 데이터를 작성하여 일괄기록물을 등록하는 업무를 수행합니다.
            
            ${formatSql(`
                  -- SQL ID: 3653 (Tuned)
-- 예상 개선 실행 시간: 1,879ms -> 50ms 미만 (인덱스 상황에 따라 상이)

SELECT C.*
FROM (
      SELECT
            ROWNUM AS rnum,
            B.*
      FROM (
            SELECT
                  A.record_center_id,
                  A.folder_take_seq,
                  A.org_cd,
                  O1.full_org_nm AS org_nm,
                  O1.org_abbr_nm AS org_abbr_nm,
                  A.creat_user_org_cd,
                  O2.org_nm AS creat_user_org_nm,
                  O2.org_abbr_nm AS creat_user_org_abbr_nm,
                  A.clss_id,
                  A.clss_nm,
                  -- CASE문 내 중복 쿼리를 인라인 뷰 내 연산된 H.ho_no_cnt로 대체
                  CASE
                        WHEN A.ho_no != '1' AND H.ho_no_cnt != 1
                        THEN A.title || ' (' || A.ho_no || '/' || H.max_ho_no || ')'
                        ELSE A.title
                  END AS title,
                  A.creat_yyyy,
                  A.presv_term_cd,
                  CC.com_cd_nm AS presv_term_nm,
                  TO_CHAR(TO_NUMBER(NVL(A.record_reg_cnt, '0'))) AS record_reg_cnt,
                  A.exam_rslt_cd,
                  -- 깨진 한글 정상 복원 (검수결과코드 및 등록완료여부 기준 추정)
                  DECODE(
                        A.exam_rslt_cd,
                        '2', '검수오류',
                        DECODE(A.reg_fin_flag, '1', '이관완료', '대기중')
                  ) AS exam_rslt_nm,
                  A.ho_no,
                  H.ho_no_cnt,
                  R.record_count,
                  SUBSTR(RPAD(A.folder_start_dtime, 14, '0'), 1, 4) AS start_yyyy,
                  SUBSTR(RPAD(A.folder_close_dtime, 14, '0'), 1, 4) AS end_yyyy,
                  A.close_yyyy
            FROM TB_TKFOLDER A
            
            -- 1. 소속 조직 정보 조인 (1회로 단축)
            LEFT OUTER JOIN TB_STORG O1 
               ON O1.record_center_id = '0000001' 
              AND O1.org_cd = A.org_cd
              
            -- 2. 생산자 조직 정보 조인 (1회로 단축)
            LEFT OUTER JOIN TB_STORG O2 
               ON O2.record_center_id = '0000001' 
              AND O2.org_cd = A.creat_user_org_cd
              
            -- 3. 보존기간 공통코드 조인
            LEFT OUTER JOIN TB_ZZCOMCD CC 
               ON CC.com_type_cd = 'RD07' 
              AND CC.com_cd = DECODE(A.presv_term_cd, '20', '25', A.presv_term_cd)
              
            -- 4. 동일 철 권수 정보 미리 그룹핑 조인 (반복 카운트 제거의 핵심)
            LEFT OUTER JOIN (
                  SELECT 
                        record_center_id, creat_sys_cd, org_cd, clss_id, creat_yyyy, folder_reg_seq,
                        COUNT(*) AS ho_no_cnt,
                        MAX(ho_no) AS max_ho_no
                  FROM TB_TKFOLDER
                  WHERE record_center_id = '0000001'
                    AND creat_sys_cd = '03'
                  GROUP BY record_center_id, creat_sys_cd, org_cd, clss_id, creat_yyyy, folder_reg_seq
            ) H ON H.record_center_id = A.record_center_id
               AND H.creat_sys_cd = A.creat_sys_cd
               AND H.org_cd = A.org_cd
               AND H.clss_id = A.clss_id
               AND H.creat_yyyy = A.creat_yyyy
               AND H.folder_reg_seq = A.folder_reg_seq
               
            -- 5. 기록물 건수 집계 조인
            LEFT OUTER JOIN (
                  SELECT record_center_id, folder_take_seq, COUNT(1) AS record_count
                  FROM TB_TKRECORD
                  WHERE record_center_id = '0000001'
                  GROUP BY record_center_id, folder_take_seq
            ) R ON R.record_center_id = A.record_center_id
               AND R.folder_take_seq = A.folder_take_seq
               
            WHERE A.record_center_id = '0000001'
              AND A.creat_sys_cd = '03'
              AND A.take_fin_flag = '0'
              AND A.exam_rslt_cd IN ('0', '2')
            ORDER BY
                  A.record_center_id,
                  A.reg_dtime DESC
      ) B
      WHERE ROWNUM <= 10
) C
WHERE C.rnum >= 1;
                  

            `)}
            
            `,
      }
];