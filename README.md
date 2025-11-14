# Data Table Examples

This project demonstrates three different approaches to handling large datasets (10,000 rows) in React.

**Note:** While the examples simulate server-side API calls (pagination, filtering, sorting), all data is generated client-side using the `generateProducts()` function. In a real application, these would be actual backend API requests.

## Live Demo

Check out the live example at: http://product-tables.ggralak.com/

## The Three Approaches

### 1. Paginated (ProductsTablePaginated.tsx)
- Traditional server-side pagination with page controls
- Users select page size (10/25/50/100 rows)
- Data fetched on demand per page
- Uses standard HTML `<table>` markup
- Best for: Traditional data browsing with discrete pages

### 2. On Demand (ProductsTableOnDemand.tsx)
- Infinite scroll with virtual rendering
- Uses `react-window` List component for virtualization
- Loads pages dynamically as user scrolls
- Implements page unloading to maintain constant memory usage (±2 page buffer)
- **Note**: Uses div-based layout from react-window, not HTML `<table>` markup
- Best for: Smooth scrolling through large datasets

### 3. Long (ProductsTableLong.tsx)
- Loads all 10,000 rows at once
- Client-side filtering and sorting
- No virtualization - renders full dataset
- Uses standard HTML `<table>` markup
- Best for: Demonstrating performance baseline / small-ish datasets

## Features Common to All Examples

- Column sorting (click headers)
- Column filtering (type in filter row)
- Debounced filtering (300ms delay)
- Custom React hooks for state management:
    - `usePagination` - page and page size management
    - `useTableSort` - sorting state and toggle logic
    - `useTableFilters` - filter state management

## Future Improvements

Given more time, I would consider using:
- **TanStack Table** (https://tanstack.com/table/latest) - Headless table logic with better TypeScript support
- **TanStack Virtual** (https://tanstack.com/virtual) - More powerful virtualization with better HTML table support

These libraries would provide:
- True `<table>` markup even with virtualization
- More robust sorting/filtering APIs
- Better row selection and column resizing
- Stronger type safety

## Tech Stack

- React 19
- TypeScript
- react-window (virtualization)
- React Router (navigation)
- Tailwind CSS (styling)
- Vite (build tool)

## Running the Project

```bash
npm install
npm run dev
```
