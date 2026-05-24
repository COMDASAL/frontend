import styles from "./DataTable.module.scss";

export interface StationData {
  id: string | number;
  rank: number;
  SWST_NM: string;
  line: string;
  score: number | string;
  type: string;
  mainFactors: string;
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
            <th className={styles.centerAlign}>순위</th>
            <th>역명</th>
            <th>호선</th>
            <th>종합 스코어</th>
            <th>구분</th>
            <th>주요 기여 요인</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className={`${styles.rank} ${styles.centerAlign}`}>
                {row.rank}
              </td>
              <td className={styles.bold}>{row.SWST_NM}</td>
              <td>{row.line}</td>
              <td className={styles.score}>{row.score}</td>
              <td>
                <span className={styles.typeBadge}>{row.type}</span>
              </td>
              <td className={styles.factors}>{row.mainFactors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
