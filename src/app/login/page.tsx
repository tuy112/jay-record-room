import Link from "next/link";
import { login } from "./actions";
import styles from "./page.module.css";

export default function LoginPage() {
      return (
      
            <main className={styles.loginPage}>
                  <section className={styles.loginCard}>
                        <div className={styles.loginHeader}>
                              <h1 className={styles.loginTitle}>Jay's Record Room</h1>
                              <p className={styles.loginDescription}>
                                    기록관리시스템을 보시려면<br/> 회원가입을 해주세요.<br/>
                              </p>
                        </div>

                        <form action={login} className={styles.loginForm}>
                              <input
                                    name="id"
                                    type="text"
                                    placeholder="아이디"
                                    className={styles.loginInput}
                                    required
                              />

                              <input
                                    name="pw"
                                    type="password"
                                    placeholder="비밀번호"
                                    className={styles.loginInput}
                                    required
                              />

                              <button type="submit" className={styles.loginButton}>
                                    로그인
                              </button>
                              <Link
                                    href="/signup"
                                    className={styles.registerButton}
                              >
                                    회원가입
                              </Link>
                        </form>
                  </section>
            </main>
      );
}