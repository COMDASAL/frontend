import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import styles from "./EmptyState.module.scss";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.icon}>📭</div>
      <h3 className={styles.title}>분석 결과가 없습니다</h3>
      <p className={styles.description}>
        아직 AI 분석이 진행되지 않았거나 만료되었습니다.
      </p>
      <Button onClick={() => router.replace("/")}>
        처음부터 다시 시작하기
      </Button>
    </div>
  );
}
