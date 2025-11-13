import { useState } from "react";
import { SortOrder } from "@/utils/tableData.ts";

export function useTableSort<T extends string>(initialSortBy: T, initialSortOrder: SortOrder = 'asc') {
    const [sortBy, setSortBy] = useState<T>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

    const handleSort = (column: T) => {
        if (sortBy === column) {
            // Toggle order if same column
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // New column, default to ascending
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    return {
        sortBy,
        sortOrder,
        handleSort
    };
}
