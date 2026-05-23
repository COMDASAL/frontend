import styles from "./DataTable.module.scss";

export interface StationData {
  id: number;
  rank: number;
  stationName: string;
  line: string;
  currentGrade: string;
  predictedGrade: string;
  score: number;
}

interface DataTableProps {
  data: StationData[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>예측 순위</th>
            <th>역명</th>
            <th>호선</th>
            <th>현재 급지</th>
            <th>AI 예측 급지</th>
            <th>분석 스코어</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className={styles.rank}>{row.rank}</td>
              <td className={styles.bold}>{row.stationName}</td>
              <td>{row.line}</td>
              <td>{row.currentGrade}</td>
              <td>
                <span
                  className={
                    row.currentGrade !== row.predictedGrade
                      ? styles.changed
                      : styles.same
                  }
                >
                  {row.predictedGrade}
                </span>
              </td>
              <td className={styles.score}>{row.score.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
