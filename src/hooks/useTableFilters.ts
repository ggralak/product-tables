import { useState } from "react";

export type ColumnFilters<T extends string = string> = Partial<Record<T, string>>;

export function useTableFilters<T extends string>() {
    const [filters, setFilters] = useState<ColumnFilters<T>>({});

    const handleFilterChange = (column: T, value: string) => {
        setFilters(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return {
        filters,
        handleFilterChange,
        clearFilters
    };
}
