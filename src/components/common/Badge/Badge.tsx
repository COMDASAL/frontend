import styles from "./Badge.module.scss";

export type BadgeStatus = "success" | "error" | "pending";

interface BadgeProps {
  status: BadgeStatus;
}

export default function Badge({ status }: BadgeProps) {
  const statusConfig = {
    success: { text: "검증 완료", emoji: "✅" },
    error: { text: "검증 실패", emoji: "❌" },
    pending: { text: "대기 중", emoji: "⏳" },
  };

  const { text, emoji } = statusConfig[status];

  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.emoji}>{emoji}</span>
      {text}
    </span>
  );
}
