// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/upload");
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>서울교통공사 AI 분석 대시보드</h1>
        <p className={styles.description}>
          내부데이터와 공공데이터를 업로드하면
          <br />
          AI 모델이 자동으로 분석하여 결과를 시각화합니다.
        </p>

        <button className={styles.startButton} onClick={handleStart}>
          분석 시작하기
        </button>
      </div>
    </main>
  );
}
