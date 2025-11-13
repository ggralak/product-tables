import {ProductRow, SortOrder} from "@/utils/tableData.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table.tsx";
import {Input} from "@/components/input.tsx";
import {ColumnFilters} from "@/hooks/useTableFilters.ts";

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

export type { ColumnFilters };

const  ProductTable = ({
    products,
    sortBy,
    sortOrder,
    onSort,
    filters,
    onFilterChange
}: {
    products: ProductRow[];
    sortBy: keyof ProductRow;
    sortOrder: SortOrder;
    onSort: (col: keyof ProductRow) => void;
    filters?: ColumnFilters;
    onFilterChange?: (column: keyof ProductRow, value: string) => void;
}) => {
    return (
        <Table className="border border-gray-200 bg-white w-full table-fixed">
            <TableHead className="bg-gray-100 border-b border-gray-300">
                <TableRow>
                    {columns.map(col => (
                        <TableHeader
                            key={col.key}
                            className="px-3 py-2 cursor-pointer select-none font-semibold text-sm min-w-[120px]"
                            onClick={() => onSort(col.key)}
                        >
                            {col.label}
                            {sortBy === col.key && (
                                <span className="ml-1 text-xs">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                            )}
                        </TableHeader>
                    ))}
                </TableRow>
                {onFilterChange && (
                    <TableRow className="bg-gray-50">
                        {columns.map(col => (
                            <TableHeader key={`filter-${col.key}`} className="px-3 py-2">
                                <Input
                                    type="text"
                                    placeholder={`Filter...`}
                                    value={filters?.[col.key] || ''}
                                    onChange={(e) => onFilterChange(col.key, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full text-xs"
                                />
                            </TableHeader>
                        ))}
                    </TableRow>
                )}
            </TableHead>
            <TableBody>
                {products.map((row, idx) => (
                    <TableRow key={row.product_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {columns.map(col => (
                            <TableCell key={col.key} className="px-3 py-2 text-sm truncate border-b border-gray-200">
                                {col.key === 'price' ? row[col.key].toFixed(2) : row[col.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ProductTable;