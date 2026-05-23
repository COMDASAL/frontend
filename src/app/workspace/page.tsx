"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import Button from "@/components/common/Button/Button";
import FileDropzone from "@/components/upload/FileDropzone/FileDropzone";
import ValidationItem, {
  ValidationItemType,
} from "@/components/validation/ValidationItem/ValidationItem";
import AnalysisProgress from "@/components/analysis/AnalysisProgress/AnalysisProgress";
import { useUploadStore } from "@/stores/uploadStore";

import DataTable, {
  StationData,
} from "@/components/dashboard/DataTable/DataTable";
import DownloadPanel from "@/components/dashboard/DownloadPanel/DownloadPanel";
import Toast from "@/components/common/Toast/Toast";

type WorkspaceStep = "UPLOAD" | "VALIDATING" | "ANALYZING" | "RESULT";

const INITIAL_VALIDATIONS: ValidationItemType[] = [
  {
    id: "1",
    title: "필수 시트 존재 여부",
    description:
      "업로드된 엑셀 파일 내 필수 데이터 시트가 존재하는지 확인합니다.",
    status: "pending",
  },
  {
    id: "2",
    title: "컬럼 매핑 검증",
    description:
      "역명, 호선, 승하차 인원 등 필수 컬럼명이 일치하는지 확인합니다.",
    status: "pending",
  },
  {
    id: "3",
    title: "결측치 및 무결성 검사",
    description: "빈 데이터(Null)나 잘못된 타입의 데이터가 있는지 검사합니다.",
    status: "pending",
  },
];

export default function WorkspacePage() {
  const router = useRouter();

  const {
    hasStarted,
    internalFile,
    externalFile,
    setInternalFile,
    setExternalFile,
    isReadyToValidate,
  } = useUploadStore();

  const [step, setStep] = useState<WorkspaceStep>("UPLOAD");
  const [validations, setValidations] =
    useState<ValidationItemType[]>(INITIAL_VALIDATIONS);
  const [isValidating, setIsValidating] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [resultData, setResultData] = useState<StationData[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!hasStarted) {
      router.replace("/");
    }
  }, [hasStarted, router]);

  if (!isMounted || !hasStarted) return null;

  const handleStartValidation = async () => {
    if (!isReadyToValidate()) return;
    setStep("VALIDATING");
    setIsValidating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setValidations((prev) => prev.map((v) => ({ ...v, status: "success" })));
      setIsValidating(false);
      setTimeout(() => setStep("ANALYZING"), 800);
    } catch (error) {
      console.error("검증 오류:", error);
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setValidations(INITIAL_VALIDATIONS);
    setStep("UPLOAD");
  };

  const handleShowResult = () => {
    setStep("RESULT");
    const mockData: StationData[] = [
      {
        id: 1,
        rank: 1,
        stationName: "고속터미널",
        line: "3호선",
        currentGrade: "2급지",
        predictedGrade: "1급지",
        score: 98.42,
      },
      {
        id: 2,
        rank: 2,
        stationName: "홍대입구",
        line: "2호선",
        currentGrade: "1급지",
        predictedGrade: "1급지",
        score: 97.15,
      },
      {
        id: 3,
        rank: 3,
        stationName: "강남",
        line: "2호선",
        currentGrade: "1급지",
        predictedGrade: "1급지",
        score: 96.88,
      },
      {
        id: 4,
        rank: 4,
        stationName: "신도림",
        line: "2호선",
        currentGrade: "2급지",
        predictedGrade: "1급지",
        score: 92.05,
      },
      {
        id: 5,
        rank: 5,
        stationName: "사당",
        line: "4호선",
        currentGrade: "2급지",
        predictedGrade: "2급지",
        score: 89.31,
      },
    ];
    setResultData(mockData);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDownloading(false);
    setShowToast(true);
  };

  const handleRestart = () => {
    setStep("UPLOAD");
    setInternalFile(null);
    setExternalFile(null);
    setValidations(INITIAL_VALIDATIONS);
    setIsAnalysisComplete(false);
    setResultData([]);
  };

  return (
    <main className={styles.container}>
      {/* 1. UPLOAD 단계 */}
      {step === "UPLOAD" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>데이터 업로드</h1>
            <p className={styles.description}>
              분석에 필요한 내부데이터와 외부데이터 엑셀 파일을 업로드해주세요.
            </p>
          </div>
          <div className={styles.uploadSection}>
            <FileDropzone
              title="내부데이터 (Excel)"
              file={internalFile}
              onDropFile={setInternalFile}
              onRemoveFile={() => setInternalFile(null)}
            />
            <FileDropzone
              title="외부데이터 (Excel)"
              file={externalFile}
              onDropFile={setExternalFile}
              onRemoveFile={() => setExternalFile(null)}
            />
          </div>
          <div className={styles.actionSection}>
            <Button
              onClick={handleStartValidation}
              disabled={!isReadyToValidate()}
            >
              데이터 검증하기
            </Button>
          </div>
        </>
      )}

      {/* 2. VALIDATING 단계 */}
      {step === "VALIDATING" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>데이터 무결성 검증</h1>
            <p className={styles.description}>
              AI 모델 분석 시작 전, 백엔드 서버에서 데이터 구조 및 타입을
              검증하고 있습니다.
            </p>
          </div>
          <div className={styles.validationList}>
            {validations.map((item) => (
              <ValidationItem key={item.id} item={item} />
            ))}
          </div>
          <div className={styles.actionSection}>
            {validations.some((v) => v.status === "error") ? (
              <Button onClick={handleReset}>다시 업로드하기</Button>
            ) : (
              <Button
                onClick={() => setStep("ANALYZING")}
                disabled={isValidating}
              >
                {isValidating ? "데이터 검증 중..." : "AI 분석 시작하기"}
              </Button>
            )}
          </div>
        </>
      )}

      {/* 3. ANALYZING 단계 */}
      {step === "ANALYZING" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>AI 데이터 분석 진행 중</h1>
            <p className={styles.description}>
              데이터를 기반으로 최적의 역급지를 연산하고 있습니다. 페이지를
              벗어나지 마세요.
            </p>
          </div>
          <AnalysisProgress onComplete={() => setIsAnalysisComplete(true)} />
          <div className={styles.actionSection}>
            <Button onClick={handleShowResult} disabled={!isAnalysisComplete}>
              {isAnalysisComplete
                ? "결과 대시보드 확인하기"
                : "분석 진행 중..."}
            </Button>
          </div>
        </>
      )}

      {/* 4. RESULT 단계 */}
      {step === "RESULT" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>AI 분석 결과 대시보드</h1>
            <p className={styles.description}>
              역별 승하차, 환승 데이터, 상권 피처를 종합하여 예측한 역급지 조정
              결과입니다.
            </p>
          </div>

          <div className={styles.resultCard}>
            <h2 className={styles.resultCardTitle}>
              역별 AI 예측 급지 랭킹 Top 5
            </h2>
            <DataTable data={resultData} />
          </div>

          <DownloadPanel
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />

          <div className={styles.actionSection} style={{ marginTop: "24px" }}>
            <Button onClick={handleRestart}>새로운 데이터 분석하기</Button>
          </div>
        </>
      )}

      <Toast
        message="결과 리포트(.xlsx)가 성공적으로 다운로드되었습니다."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}
