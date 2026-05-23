import { useState, useEffect } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import StepIndicator from "../StepIndicator/StepIndicator";
import LogPanel from "../LogPanel/LogPanel";
import styles from "./AnalysisProgress.module.scss";

const ANALYSIS_STEPS = [
  { id: 1, label: "데이터 전처리" },
  { id: 2, label: "공간 Feature 생성" },
  { id: 3, label: "AI 모델 연산" },
  { id: 4, label: "리포트 생성" },
];

interface AnalysisProgressProps {
  onComplete: () => void;
}

export default function AnalysisProgress({
  onComplete,
}: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "AI 분석 파이프라인을 초기화하고 있습니다.",
  ]);

  useEffect(() => {
    // SSE 연동 코드
    /*
    let eventSource: EventSource | null = null;

    const startRealAnalysis = async () => {
      try {
        // 1. 분석 엔진 백그라운드 구동 요청 (202 Accepted)
        await fetch("http://localhost:8080/api/v1/analyze/start", { method: "POST" });
        
        // 2. SSE 스트리밍 연결로 실시간 진행률 및 로그 수신
        eventSource = new EventSource("http://localhost:8080/api/v1/analyze/progress");
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // data 예시: { progress: 72, step: 2, log: "XGBoost 모델 연산 진행 중..." }
          
          setProgress(data.progress);
          setCurrentStepIndex(data.step);
          
          if (data.log) {
            setLogs((prev) => [...prev, data.log]);
          }

          if (data.progress >= 100) {
            eventSource?.close();
            onComplete();
          }
        };

        eventSource.onerror = () => {
          console.error("SSE Connection Error");
          eventSource?.close();
        };

      } catch (error) {
        console.error("분석 시작 실패:", error);
      }
    };
    
    startRealAnalysis();
    return () => eventSource?.close(); // 컴포넌트 언마운트 시 안전하게 연결 종료
    */

    // Mock 테스트
    let currentP = 0;

    const mockLogMessages = [
      {
        triggerAt: 5,
        step: 0,
        msg: "내부 엑셀 데이터 및 외부 공공 데이터 병합 완료",
      },
      {
        triggerAt: 20,
        step: 1,
        msg: "PostGIS를 활용한 역 반경 500m 상권 데이터 추출 시작",
      },
      {
        triggerAt: 40,
        step: 1,
        msg: "지하철 환승 인원 및 승하차 통계 공간 데이터 맵핑 중...",
      },
      {
        triggerAt: 60,
        step: 2,
        msg: "배치 인력 가중치 연산 및 XGBoost AI 모델 예측 스코어 산출",
      },
      {
        triggerAt: 85,
        step: 3,
        msg: "최종 역급지 분류 기준 적용 및 결과 리포트 포맷팅",
      },
      { triggerAt: 100, step: 4, msg: "모든 AI 분석이 완료되었습니다!" },
    ];

    const interval = setInterval(() => {
      // 1~4% 씩 랜덤하게 증가하여 실제 연산하는 느낌을 줌
      currentP += Math.floor(Math.random() * 4) + 1;
      if (currentP > 100) currentP = 100;

      setProgress(currentP);

      const triggeredLog = mockLogMessages.find(
        (m) =>
          m.triggerAt === currentP ||
          (currentP > m.triggerAt && currentP - 4 <= m.triggerAt),
      );
      if (triggeredLog) {
        setLogs((prev) => [...prev, triggeredLog.msg]);
        setCurrentStepIndex(triggeredLog.step);
      }

      if (currentP === 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <StepIndicator
        steps={ANALYSIS_STEPS}
        currentStepIndex={currentStepIndex}
      />
      <ProgressBar progress={progress} />
      <LogPanel logs={logs} />
    </div>
  );
}
