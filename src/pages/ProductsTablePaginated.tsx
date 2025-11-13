import {useEffect, useState} from "react";
import {fetchProducts, ProductRow} from "@/utils/tableData.ts";
import {Field} from "@/components/fieldset.tsx";
import {Select} from "@/components/select.tsx";
import {
    Pagination,
    PaginationNext,
    PaginationPrevious
} from "@/components/pagination.tsx";
import ProductTable from "@/components/productTable.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";
import {usePagination} from "@/hooks/usePagination.ts";
import {useTableSort} from "@/hooks/useTableSort.ts";
import {useTableFilters} from "@/hooks/useTableFilters.ts";

function PageSizeSelector({ pageSize, onPageSizeChange }: {
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}) {
    return (
        <Field>
            <Select name="status" value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
                {[10, 25, 50, 100].map(size => (
                    <option key={size} value={size}>{size} / page</option>
                ))}
            </Select>
        </Field>
    );
}

function TableSizeDetails({ page, pageSize, total }: { page: number; pageSize: number; total: number }) {
    return (
        <div className="text-sm text-gray-600">
            Showing {Math.min((page - 1) * pageSize + 1, total)}-
            {Math.min(page * pageSize, total)} of {total}
        </div>
    );
}

function TableControls({
    page, pageSize, total,
    onPrev, onNext
}: {
    page: number;
    pageSize: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex items-center justify-between mt-4">
            <TableSizeDetails page={page} pageSize={pageSize} total={total} />

            <Pagination>
                <PaginationPrevious onClick={onPrev} disabled={page === 1} />

                <PaginationNext onClick={onNext} disabled={page * pageSize >= total} />
            </Pagination>
        </div>
    );
}

const ProductsTablePaginated = () => {
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Custom hooks for table state management
    const { page, pageSize, setPage, setPageSize, resetToFirstPage } = usePagination(1, 25);
    const { sortBy, sortOrder, handleSort: handleSortColumn } = useTableSort<keyof ProductRow>('product_id');
    const { filters, handleFilterChange: handleFilterInput } = useTableFilters<keyof ProductRow>();

    // Debounce filters to avoid excessive API calls while typing
    const debouncedFilters = useDebounce(filters, 300);

    // Fetch data with server-side pagination, sorting, and filtering
    useEffect(() => {
        const productApiResponse = fetchProducts({
            page,
            pageSize,
            sortBy,
            sortOrder,
            filters: debouncedFilters
        });
        setProducts(productApiResponse.data);
        setTotalCount(productApiResponse.total);
    }, [page, pageSize, sortBy, sortOrder, debouncedFilters]);

    const handleSort = (col: keyof ProductRow) => {
        handleSortColumn(col);
        resetToFirstPage();
    };

    const handleFilterChange = (column: keyof ProductRow, value: string) => {
        handleFilterInput(column, value);
        resetToFirstPage();
    };

    return (
        <div className="p-6 flex flex-col">
            <div className="flex items-center mb-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Products Table - Paginated</h2>
                <PageSizeSelector pageSize={pageSize} onPageSizeChange={setPageSize} />
            </div>
            <div className="w-full">
                <ProductTable
                    products={products}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <TableControls
                page={page}
                pageSize={pageSize}
                total={totalCount}
                onPrev={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
            />
        </div>
    );
};

export default ProductsTablePaginated;