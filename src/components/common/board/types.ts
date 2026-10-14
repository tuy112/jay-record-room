export interface Column {
    key: string;
    label: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface RowData {
    id: number | string;
    [key: string]: unknown;
}

export interface BoardProps<T extends RowData = RowData> {
    columns: Column[];
    data: T[];
    onRowClick?: (row: T) => void;
}