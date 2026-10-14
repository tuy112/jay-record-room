'use client';

import styles from './style.module.css';
import { BoardProps, RowData } from './types';

export default function Board<T extends RowData>({
    columns,
    data,
    onRowClick,
}: BoardProps<T>) {
    return (
        <div className={styles.boardWrap}>
            <table className={styles.boardTable}>
                <thead>
                    <tr>
                        <th className={styles.checkboxColumn}>
                            <input type="checkbox" />
                        </th>

                        <th className={styles.numberColumn}>번호</th>

                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{
                                    width: column.width,
                                    textAlign: column.align || 'left',
                                }}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick?.(row)}
                            >
                                <td
                                    className={styles.checkboxColumn}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input type="checkbox" />
                                </td>

                                <td className={styles.numberColumn}>
                                    {row.id}
                                </td>

                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        style={{
                                            textAlign: column.align || 'left',
                                        }}
                                    >
                                        {row[column.key] as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 2}
                                className={styles.empty}
                            >
                                게시글이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}