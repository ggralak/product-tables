import {useEffect, useMemo, useState} from "react";
import {fetchProducts, ProductRow} from "@/utils/tableData.ts";
import ProductTable from "@/components/productTable.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";
import {useTableSort} from "@/hooks/useTableSort.ts";
import {useTableFilters} from "@/hooks/useTableFilters.ts";

const ProductsTableLong = () => {
    const [products, setProducts] = useState<ProductRow[]>([]);

    // Custom hooks for table state management
    const { sortBy, sortOrder, handleSort } = useTableSort<keyof ProductRow>('product_id');
    const { filters, handleFilterChange } = useTableFilters<keyof ProductRow>();

    // Debounce filters to avoid excessive filtering computations while typing
    const debouncedFilters = useDebounce(filters, 300);

    useEffect(() => {
        const productApiResponse = fetchProducts({page: 1, pageSize: 10000, sortBy, sortOrder});
        setProducts(productApiResponse.data);
    }, [sortBy, sortOrder]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            return Object.entries(debouncedFilters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const productValue = String(product[key as keyof ProductRow]);
                return productValue.toLowerCase().includes(filterValue.toLowerCase());
            });
        });
    }, [products, debouncedFilters]);

    return (
        <div className="p-6">
            <div className="flex items-center mb-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Products Table - Long</h2>
            </div>
            <div className="overflow-x-scroll">
                <ProductTable
                    products={filteredProducts}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </div>
    )
}

export default ProductsTableLong;