import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ErrorMessage from "../../common/ErrorMessage/ErrorMessage";
import styles from "./FileDropzone.module.scss";

interface FileDropzoneProps {
  title: string;
  file: File | null;
  onDropFile: (file: File) => void;
  onRemoveFile: () => void;
}

export default function FileDropzone({
  title,
  file,
  onDropFile,
  onRemoveFile,
}: FileDropzoneProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // 1. 파일 검증 실패 처리
      if (fileRejections.length > 0) {
        setError(
          "지원하지 않는 파일 형식이거나 문제가 있습니다. (.xlsx, .csv 권장)",
        );
        return;
      }
      // 2. 검증 통과 및 상태 업데이트
      if (acceptedFiles.length > 0) {
        setError("");
        onDropFile(acceptedFiles[0]);
      }
    },
    [onDropFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1, // 한 번에 하나의 파일만 업로드 허용
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>

      {!file ? (
        <>
          {/* 업로드 대기 상태 */}
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
          >
            <input {...getInputProps()} />
            <div className={styles.icon}>📄</div>
            <p>
              {isDragActive
                ? "여기로 파일을 놔주세요!"
                : "파일을 여기로 드래그하거나 클릭하여 선택하세요."}
            </p>
            <span className={styles.hint}>지원 확장자: .xlsx, .csv</span>
          </div>
          <ErrorMessage message={error} />
        </>
      ) : (
        /* 업로드 완료 상태 (UploadStatusCard) */
        <div className={styles.successCard}>
          <div className={styles.fileInfo}>
            <span className={styles.checkIcon}>✅</span>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button className={styles.removeButton} onClick={onRemoveFile}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
