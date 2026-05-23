import { useEffect, useRef } from "react";
import styles from "./LogPanel.module.scss";

interface LogPanelProps {
  logs: string[];
}

export default function LogPanel({ logs }: LogPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새로운 메시지가 추가될 때마다 부드럽게 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>📝</span>
        <span className={styles.title}>세부 진행 현황</span>
      </div>
      <div className={styles.content}>
        {logs.length === 0 && (
          <p className={styles.empty}>분석을 준비하고 있습니다...</p>
        )}
        {logs.map((log, i) => (
          <div key={i} className={styles.logItem}>
            <div className={styles.checkIcon}>
              {i === logs.length - 1 ? (
                <span className={styles.spinner}>⏳</span>
              ) : (
                "✓"
              )}
            </div>
            <div className={styles.messageWrapper}>
              <span
                className={`${styles.message} ${i === logs.length - 1 ? styles.active : ""}`}
              >
                {log}
              </span>
              <span className={styles.time}>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
