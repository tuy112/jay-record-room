import { logout } from '@/app/login/actions';
import styles from './Header.module.css';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={styles.logoutButton}
      >
        로그아웃
      </button>
    </form>
  );
}