import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>전체 진행률</span>
        <span className={styles.percentage}>{progress}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
