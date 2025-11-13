export type ProductStatus = 'in stock' | 'out of stock' | 'discontinued';

export type ProductRow = {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  quantity_in_stock: number;
  supplier_name: string;
  date_added: string;
  location: string;
  weight: number;
  status: ProductStatus;
};

const categories = ['Electronics', 'Clothing', 'Books', 'Toys', 'Home', 'Beauty', 'Sports', 'Automotive'];
const suppliers = ['Acme Corp', 'Globex', 'Umbrella', 'Wayne Enterprises', 'Stark Industries', 'Wonka', 'Initech'];
const locations = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const statuses: ProductStatus[] = ['in stock', 'out of stock', 'discontinued'];
const productNames = [
  'Widget', 'Gadget', 'Book', 'Shirt', 'Laptop', 'Phone', 'Sneakers', 'Backpack', 'Blender', 'Headphones',
  'Camera', 'Watch', 'Mug', 'Lamp', 'Tablet', 'Jacket', 'Socks', 'Bicycle', 'Drill', 'Sofa',
];

// Deterministic pseudo-random number generator (Linear Congruential Generator)
function lcg(seed: number): () => number {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function randomDate(start: Date, end: Date, randFn: (() => number) | undefined = undefined): string {
  const rnd = randFn ? randFn() : Math.random();
  const date = new Date(start.getTime() + rnd * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function pad(num: number, size: number): string {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

export function generateProductRows(count: number = 10000): ProductRow[] {
  const rows: ProductRow[] = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const product_name = productNames[Math.floor(Math.random() * productNames.length)] + ' ' + (Math.floor(Math.random() * 1000));
    const price = parseFloat((Math.random() * 500 + 5).toFixed(2));
    const quantity_in_stock = status === 'discontinued' ? 0 : Math.floor(Math.random() * 200);
    const weight = parseFloat((Math.random() * 10 + 0.1).toFixed(2));
    const date_added = randomDate(new Date(2015, 0, 1), new Date());
    const product_id = `PRD-${pad(i + 1, 5)}`;
    rows.push({
      product_id,
      product_name,
      category,
      price,
      quantity_in_stock,
      supplier_name: supplier,
      date_added,
      location,
      weight,
      status
    });
  }
  return rows;
}

/**
 * Generates the same set of product rows on every invocation.
 * Uses a seeded pseudo-random generator for determinism.
 */
export function generateProducts(count: number = 10000, seed: number = 42): ProductRow[] {
  const rand = lcg(seed);
  const rows: ProductRow[] = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(rand() * categories.length)];
    const supplier = suppliers[Math.floor(rand() * suppliers.length)];
    const location = locations[Math.floor(rand() * locations.length)];
    const status = statuses[Math.floor(rand() * statuses.length)];
    const product_name = productNames[Math.floor(rand() * productNames.length)] + ' ' + (Math.floor(rand() * 1000));
    const price = parseFloat((rand() * 500 + 5).toFixed(2));
    const quantity_in_stock = status === 'discontinued' ? 0 : Math.floor(rand() * 200);
    const weight = parseFloat((rand() * 10 + 0.1).toFixed(2));
    const date_added = randomDate(new Date(2015, 0, 1), new Date(2025, 0, 1), rand);
    const product_id = `PRD-${pad(i + 1, 5)}`;
    rows.push({
      product_id,
      product_name,
      category,
      price,
      quantity_in_stock,
      supplier_name: supplier,
      date_added,
      location,
      weight,
      status
    });
  }
  return rows;
}

export type SortOrder = 'asc' | 'desc';

export type ProductFilters = Partial<Record<keyof ProductRow, string>>;

export type ProductApiParams = {
  page: number;
  pageSize: number;
  sortBy?: keyof ProductRow;
  sortOrder?: SortOrder;
  filters?: ProductFilters;
  seed?: number;
};

export type ProductApiResponse = {
  total: number;
  page: number;
  pageSize: number;
  data: ProductRow[];
};

/**
 * Simulates an API endpoint for products with paging, sorting, and filtering.
 */
export function fetchProducts({
  page,
  pageSize,
  sortBy = 'product_id',
  sortOrder = 'asc',
  filters = {},
  seed = 42
}: ProductApiParams): ProductApiResponse {
  const all = generateProducts(10000, seed);

  // Apply filters
  let filtered = all;
  const hasFilters = Object.values(filters).some(val => val !== '');
  if (hasFilters) {
    filtered = all.filter(product => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const productValue = String(product[key as keyof ProductRow]);
        return productValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }

  // Sort filtered results
  let sorted = filtered;
  if (sortBy) {
    sorted = [...filtered].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginate
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = sorted.slice(start, end);

  return {
    total: filtered.length,
    page,
    pageSize,
    data
  };
}