import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {fetchProducts, ProductRow} from "@/utils/tableData.ts";
import {useDebounce} from "@/hooks/useDebounce.ts";
import { List } from 'react-window';
import {Input} from "@/components/input.tsx";
import {useTableSort} from "@/hooks/useTableSort.ts";
import {useTableFilters} from "@/hooks/useTableFilters.ts";

const PAGE_SIZE = 50;
const ITEM_HEIGHT = 50;
const HEADER_HEIGHT = 100;
const PAGE_BUFFER = 2; // Keep ±2 pages around visible area

const columns: { key: keyof ProductRow; label: string }[] = [
    { key: 'product_id', label: 'Product ID' },
    { key: 'product_name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price (€)' },
    { key: 'quantity_in_stock', label: 'Stock' },
    { key: 'supplier_name', label: 'Supplier' },
    { key: 'date_added', label: 'Date Added' },
    { key: 'location', label: 'Location' },
    { key: 'weight', label: 'Weight (kg)' },
    { key: 'status', label: 'Status' },
];

const ProductsTableOnDemand = () => {
    const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
    const [pageData, setPageData] = useState<Map<number, ProductRow[]>>(new Map());
    const [totalCount, setTotalCount] = useState(0);
    const listRef = useRef<any>(null);
    const loadedPagesRef = useRef<Set<number>>(new Set());
    const isLoadingRef = useRef<Set<number>>(new Set());

    // Custom hooks for table state management
    const { sortBy, sortOrder, handleSort: handleSortColumn } = useTableSort<keyof ProductRow>('product_id');
    const { filters, handleFilterChange: handleFilterInput } = useTableFilters<keyof ProductRow>();

    // Debounce filters to avoid excessive API calls while typing
    const debouncedFilters = useDebounce(filters, 300);

    // Calculate total pages based on filtered results
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Flatten all loaded page data into a single array
    const allProducts = useMemo(() => {
        const products: ProductRow[] = [];
        for (let page = 1; page <= totalPages; page++) {
            const data = pageData.get(page);
            if (data) {
                products.push(...data);
            } else {
                // Add placeholders for pages we haven't loaded yet
                products.push(...Array(PAGE_SIZE).fill(null));
            }
        }
        return products.slice(0, totalCount);
    }, [pageData, totalCount, totalPages]);

    // Load a specific page
    const loadPage = useCallback(async (page: number) => {
        if (loadedPagesRef.current.has(page) || isLoadingRef.current.has(page) || page < 1) {
            return;
        }

        isLoadingRef.current.add(page);

        try {
            const response = fetchProducts({
                page,
                pageSize: PAGE_SIZE,
                sortBy,
                sortOrder,
                filters: debouncedFilters
            });

            setPageData(prev => new Map(prev).set(page, response.data));
            loadedPagesRef.current.add(page);
            setLoadedPages(new Set(loadedPagesRef.current));
            setTotalCount(response.total);
        } finally {
            isLoadingRef.current.delete(page);
        }
    }, [sortBy, sortOrder, debouncedFilters]);

    // Reset and load page 1 when filters/sort changes
    useEffect(() => {
        loadedPagesRef.current = new Set();
        isLoadingRef.current = new Set();
        setLoadedPages(new Set());
        setPageData(new Map());
        setTotalCount(0);

        // Scroll to top by accessing the DOM element directly
        if (listRef.current?.element) {
            listRef.current.element.scrollTop = 0;
        }

        loadPage(1);
    }, [sortBy, sortOrder, debouncedFilters, loadPage]);

    // Handle scroll and predictive loading
    const handleItemsRendered = useCallback((
        visibleRows: { startIndex: number; stopIndex: number },
        _allRows: { startIndex: number; stopIndex: number }
    ) => {
        const startPage = Math.floor(visibleRows.startIndex / PAGE_SIZE) + 1;
        const endPage = Math.floor(visibleRows.stopIndex / PAGE_SIZE) + 1;

        // Load visible pages and adjacent pages
        const pagesToLoad = new Set<number>();

        // Current visible pages
        for (let page = startPage; page <= endPage; page++) {
            pagesToLoad.add(page);
        }

        // Pre-load adjacent pages
        if (startPage > 1) pagesToLoad.add(startPage - 1);
        if (endPage < totalPages) pagesToLoad.add(endPage + 1);

        pagesToLoad.forEach(page => loadPage(page));

        // Unload pages outside the buffer zone
        const minPageToKeep = Math.max(1, startPage - PAGE_BUFFER);
        const maxPageToKeep = Math.min(totalPages, endPage + PAGE_BUFFER);

        // Remove pages outside the keep range
        const pagesToRemove: number[] = [];
        loadedPagesRef.current.forEach(page => {
            if (page < minPageToKeep || page > maxPageToKeep) {
                pagesToRemove.push(page);
            }
        });

        if (pagesToRemove.length > 0) {
            // Remove from data
            setPageData(prev => {
                const next = new Map(prev);
                pagesToRemove.forEach(page => next.delete(page));
                return next;
            });

            // Remove from loaded pages tracking
            pagesToRemove.forEach(page => {
                loadedPagesRef.current.delete(page);
            });
            setLoadedPages(new Set(loadedPagesRef.current));
        }
    }, [loadPage, totalPages]);

    const handleSort = (col: keyof ProductRow) => {
        handleSortColumn(col);
    };

    const handleFilterChange = (column: keyof ProductRow, value: string) => {
        handleFilterInput(column, value);
    };

    // Row renderer
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const product = allProducts[index];

        if (!product) {
            return (
                <div style={style} className="flex items-center px-4 border-b border-gray-200 bg-gray-50">
                    <span className="text-gray-400">Loading...</span>
                </div>
            );
        }

        return (
            <div
                style={style}
                className={`flex items-center border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
            >
                {columns.map((col) => {
                    const value = product[col.key];
                    const displayValue = col.key === 'price'
                        ? (value as number).toFixed(2)
                        : String(value);

                    return (
                        <div
                            key={col.key}
                            className="flex-1 px-3 py-2 text-sm truncate min-w-[120px]"
                        >
                            {displayValue}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 flex flex-col h-screen">
            <div className="flex items-center mb-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Products Table - On Demand</h2>
                <div className="text-sm text-gray-600">
                    Loaded: {loadedPages.size} of {totalPages} pages ({totalCount} items)
                </div>
            </div>

            {/* Table Header */}
            <div className="flex flex-col border border-gray-200 bg-white" style={{ height: HEADER_HEIGHT }}>
                {/* Column Headers */}
                <div className="flex border-b border-gray-300 bg-gray-100">
                    {columns.map((col) => (
                        <div
                            key={col.key}
                            className="flex-1 px-3 py-2 cursor-pointer select-none min-w-[120px]"
                            onClick={() => handleSort(col.key)}
                        >
                            <span className="font-semibold text-sm text-zinc-500">
                                {col.label}
                            </span>
                            {sortBy === col.key && (
                                <span className="ml-1 text-xs">
                                    {sortOrder === 'asc' ? '▲' : '▼'}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Filter Row */}
                <div className="flex p-2 bg-gray-50">
                    {columns.map((col) => (
                        <div key={col.key} className="flex-1 px-1 min-w-[120px]">
                            <Input
                                type="text"
                                placeholder={`Filter...`}
                                value={filters?.[col.key] || ''}
                                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                className="w-full text-xs"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Virtualized List */}
            <div className="flex-1 border-l border-r border-b border-gray-200">
                <List
                    listRef={listRef}
                    rowHeight={ITEM_HEIGHT}
                    rowCount={totalCount}
                    rowComponent={Row as any}
                    rowProps={{} as any}
                    onRowsRendered={handleItemsRendered}
                    style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                />
            </div>
        </div>
    );
};

export default ProductsTableOnDemand;
