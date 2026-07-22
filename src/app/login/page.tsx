import { login } from "./actions";
import styles from "./style.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <form action={login} className={styles.form}>
        <h1 className={styles.title}>로그인</h1>
        <input name="id" type="text" placeholder="아이디" className={styles.input} />
        <input name="pw" type="password" placeholder="비밀번호" className={styles.input} />
        <button type="submit" className={styles.button}>로그인</button>
      </form>
    </div>
  );
}