import { login } from "./actions";
import styles from "./style.module.css";

export default function LoginPage() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>가계부 & 운동기록</h1>
          <p className={styles.loginDescription}>
            저만 로그인할 수 있습니다.<br/> 왜 제 가계부가 궁금하신가요?
          </p>
        </div>

        <form action={login} className={styles.loginForm}>
          <input
            name="id"
            type="text"
            placeholder="아이디"
            className={styles.loginInput}
          />

          <input
            name="pw"
            type="password"
            placeholder="비밀번호"
            className={styles.loginInput}
          />

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>
      </section>
    </main>
  );
}