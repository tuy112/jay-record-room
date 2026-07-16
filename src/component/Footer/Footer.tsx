import Image from "next/image";

import styles from "./Footer.module.css";

export default function Footer() {
    
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <h3>Jay's Record Room</h3>

                <div className={styles.always}>
                    <p>
                        Do your Best, Then Good
                        Result will be following
                        you :)
                    </p>
                </div>
            </div>
        </footer>
    );
}