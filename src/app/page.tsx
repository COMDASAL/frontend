"use client";

import { useUploadStore } from "@/stores/uploadStore";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";

export default function Home() {
  const router = useRouter();
  const setHasStarted = useUploadStore((state) => state.setHasStarted);

  const handleStart = () => {
    setHasStarted(true);
    router.push("/workspace");
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>서울교통공사 AI 분석 대시보드</h1>
        <p className={styles.description}>
          내부 데이터와 공공 데이터를 업로드하면 AI 모델이 자동 분석하여 결과를
          시각화합니다.
        </p>

        {/* 1. 공통 Card 컴포넌트 재사용 */}
        <div className={styles.cardGrid}>
          <Card title="데이터 검증">
            <div className={styles.cardInner}>
              <div className={styles.icon}>📊</div>
              <p>필수 시트 존재 여부 및 데이터 누락을 자동으로 체크합니다.</p>
            </div>
          </Card>

          <Card title="AI 모델 분석">
            <div className={styles.cardInner}>
              <div className={styles.icon}>🤖</div>
              <p>역별 배치인력, 환승인원, 승하차 데이터를 종합 분석합니다.</p>
            </div>
          </Card>

          <Card title="결과 대시보드">
            <div className={styles.cardInner}>
              <div className={styles.icon}>📈</div>
              <p>예측 결과를 다양한 차트와 테이블로 한눈에 확인합니다.</p>
            </div>
          </Card>
        </div>

        {/* 2. 공통 Button 컴포넌트 재사용 */}
        <Button onClick={handleStart}>분석 시작하기</Button>
      </div>
    </main>
  );
}
