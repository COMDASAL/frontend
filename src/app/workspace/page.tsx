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

    const formData = new FormData();
    if (internalFile) formData.append("internalFile", internalFile);
    if (externalFile) formData.append("externalFile", externalFile);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const isSuccess = true;

      if (isSuccess) {
        setValidations((prev) =>
          prev.map((v) => ({ ...v, status: "success" })),
        );
        setIsValidating(false);

        setTimeout(() => {
          setStep("ANALYZING");
        }, 800);
      } else {
        setValidations((prev) => {
          const updated = [...prev];
          updated[2] = {
            ...updated[2],
            status: "error",
            guide:
              "3행 4열의 '승하차 인원' 데이터가 누락되었습니다. 파일을 수정 후 다시 시도해 주세요.",
          };
          return updated;
        });
        setIsValidating(false);
      }
    } catch (error) {
      console.error("검증 요청 중 오류 발생:", error);
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
        id: "1",
        rank: 1,
        SWST_NM: "명동",
        line: "4호선",
        score: 100,
        type: "정규",
        mainFactors:
          "일평균 승하차 높음 (+1.7), 외국어 응대 비중 높음 (+0.3), 출퇴근 노인 집중 (+0.1)",
      },
      {
        id: "2",
        rank: 2,
        SWST_NM: "서울",
        line: "1호선",
        score: 99.28,
        type: "정규",
        mainFactors:
          "일평균 승하차 높음 (+1.7), 외국어 응대 비중 높음 (+0.3), 출퇴근 노인 집중 (+0.1)",
      },
      {
        id: "3",
        rank: 3,
        SWST_NM: "홍대입구",
        line: "2호선",
        score: 99.05,
        type: "정규",
        mainFactors:
          "일평균 승하차 높음 (+1.8), 외국어 응대 비중 높음 (+0.4), 부하 변동성 높음",
      },
      {
        id: "250",
        rank: 250,
        SWST_NM: "하남풍산",
        line: "5호선",
        score: 17.6,
        type: "정규",
        mainFactors:
          "일평균 승하차 낮음 (-1.9), 우대권 응대 비중 높음 (+0.1), 부하 변동성 높음 (+0.1)",
      },
      {
        id: "251",
        rank: 251,
        SWST_NM: "용두",
        line: "2호선",
        score: 16.78,
        type: "정규",
        mainFactors:
          "일평균 승하차 낮음 (-2.0), 우대권 응대 비중 높음 (+0.3), 출퇴근 노인 집중 (+0.1)",
      },
      {
        id: "252",
        rank: 252,
        SWST_NM: "무악재",
        line: "3호선",
        score: 16.54,
        type: "정규",
        mainFactors:
          "일평균 승하차 낮음 (-1.9), 우대권 응대 비중 높음 (+0.1), 외국어 응대 비중 낮음 (-0.0)",
      },
      {
        id: "253",
        rank: 253,
        SWST_NM: "동대문역사문화공원",
        line: "5호선",
        score: 15.75,
        type: "정규",
        mainFactors:
          "일평균 승하차 낮음 (-2.0), 외국어 응대 비중 높음 (+0.2), 우대권 응대 비중 낮음 (-0.1)",
      },
      {
        id: "254",
        rank: 254,
        SWST_NM: "충정로",
        line: "5호선",
        score: 13.67,
        type: "정규",
        mainFactors:
          "일평균 승하차 낮음 (-1.9), 부하 변동성 낮음 (-0.1), 우대권 응대 비중 낮음 (-0.0)",
      },
      {
        id: "266",
        rank: 266,
        SWST_NM: "장암",
        line: "7호선",
        score: 2.11,
        type: "정규",
        mainFactors: "일평균 승하차 매우 낮음 (-2.5), 주요 시설 부재",
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

      {step === "RESULT" && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>AI 분석 결과 대시보드</h1>
            <p className={styles.description}>
              업로드하신 데이터를 바탕으로 산출된 전체 역사 AI 예측 스코어 및
              기여 요인입니다.
            </p>
          </div>

          <div className={styles.resultCard}>
            <h2 className={styles.resultCardTitle}>
              전체 역사 AI 분석 종합 결과
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
