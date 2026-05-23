import styles from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <div className={styles.error}>⚠️ {message}</div>;
}
