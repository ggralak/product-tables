import { useState } from "react";

export function usePagination(initialPage: number = 1, initialPageSize: number = 25) {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const resetToFirstPage = () => setPage(1);

    const setPageSizeAndReset = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    return {
        page,
        pageSize,
        setPage,
        setPageSize: setPageSizeAndReset,
        resetToFirstPage
    };
}
