"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Button from "@/components/common/Button/Button";
import FileDropzone from "@/components/upload/FileDropzone/FileDropzone";
import { useUploadStore } from "@/stores/uploadStore";

export default function UploadPage() {
  const router = useRouter();
  // Zustand 전역 상태 가져오기
  const {
    internalFile,
    externalFile,
    setInternalFile,
    setExternalFile,
    isReadyToValidate,
  } = useUploadStore();

  const handleNext = () => {
    // 두 파일이 모두 등록되었을 때만 이동
    if (isReadyToValidate()) {
      router.push("/validation");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>데이터 업로드</h1>
        <p className={styles.description}>
          분석에 필요한 내부데이터(역별 배치인력 등)와 외부데이터(공공데이터)
          엑셀 파일을 업로드해주세요.
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
          onClick={handleNext}
          disabled={!isReadyToValidate()} // 조건부 비활성화
        >
          데이터 검증하기
        </Button>
      </div>
    </main>
  );
}
