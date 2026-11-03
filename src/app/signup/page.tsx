import Link from "next/link";
import styles from "../login/page.module.css";

export default function SignupPage() {
      return (
            <main className={styles.loginPage}>
                  <section className={styles.loginCard}>
                        <div className={styles.loginHeader}>
                              <h1 className={styles.loginTitle}>
                                    회원가입
                              </h1>
                              <p className={styles.loginDescription}>
                                    Jay's Record Room 회원가입 페이지입니다.
                              </p>
                        </div>

                        <form className={styles.loginForm}>
                              <input
                                    name="id"
                                    type="text"
                                    placeholder="아이디"
                                    className={styles.loginInput}
                                    required
                              />
                              <input
                                    name="name"
                                    type="text"
                                    placeholder="이름"
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
                              <input
                                    name="pwConfirm"
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    className={styles.loginInput}
                                    required
                              />

                              <button
                                    type="button"
                                    className={styles.loginButton}
                              >
                                    회원가입
                              </button>
                              <Link
                                    href="/login"
                                    className={styles.registerButton}
                              >
                                    로그인으로 돌아가기
                              </Link>
                        </form>
                  </section>
            </main>
      );
}