import Button from "@/components/common/Button/Button";
import styles from "./DownloadPanel.module.scss";

interface DownloadPanelProps {
  onDownload: () => void;
  isDownloading: boolean;
}

export default function DownloadPanel({
  onDownload,
  isDownloading,
}: DownloadPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.info}>
        <h3 className={styles.title}>최종 리포트 다운로드</h3>
        <p className={styles.description}>
          AI 예측 스코어 및 주요 Feature 기여도가 포함된 엑셀(.xlsx) 원본 파일을
          다운로드합니다.
        </p>
      </div>
      <Button onClick={onDownload} disabled={isDownloading}>
        {isDownloading ? "다운로드 중..." : "엑셀 다운로드 (Excel)"}
      </Button>
    </div>
  );
}
