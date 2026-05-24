import { useEffect } from "react";
import styles from "./Toast.module.scss";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3초 뒤 자동 닫힘
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.icon}>✅</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
