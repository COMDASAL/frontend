import Badge, { BadgeStatus } from "../../common/Badge/Badge";
import ErrorMessage from "../../common/ErrorMessage/ErrorMessage";
import styles from "./ValidationItem.module.scss";

export interface ValidationItemType {
  id: string;
  title: string;
  description: string;
  status: BadgeStatus;
  guide?: string;
}

interface ValidationItemProps {
  item: ValidationItemType;
}

export default function ValidationItem({ item }: ValidationItemProps) {
  return (
    <div className={`${styles.container} ${styles[item.status]}`}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h4 className={styles.title}>{item.title}</h4>
          <p className={styles.description}>{item.description}</p>
        </div>
        <Badge status={item.status} />
      </div>

      {/* 에러 상태일 때만 수정 가이드 노출 */}
      {item.status === "error" && item.guide && (
        <div className={styles.guideWrapper}>
          <ErrorMessage message={item.guide} />
        </div>
      )}
    </div>
  );
}
