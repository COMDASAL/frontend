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

type WorkspaceStep = "UPLOAD" | "VALIDATING" | "ANALYZING";

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

  useEffect(() => {
    setIsMounted(true);
    if (!hasStarted) {
      router.replace("/");
    }
  }, [hasStarted, router]);

  if (!isMounted || !hasStarted) {
    return null;
  }

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

  const handleGoToDashboard = () => {
    router.push("/dashboard");
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
            <Button
              onClick={handleGoToDashboard}
              disabled={!isAnalysisComplete}
            >
              {isAnalysisComplete ? "결과 대시보드로 이동" : "분석 진행 중..."}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
