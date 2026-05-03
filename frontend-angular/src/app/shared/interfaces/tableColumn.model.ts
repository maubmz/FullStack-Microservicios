export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    formatter?: (row: T) => string | number;
}