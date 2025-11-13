import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './index.css';
import ProductsTablePaginated from "./pages/ProductsTablePaginated.tsx";
import ProductsTableOnDemand from "./pages/ProductsTableOnDemand.tsx";
import ProductsTableLong from "./pages/ProductsTableLong.tsx";
import ProductTablesLayout from "./pages/ProductTablesLayout.tsx";
import AppLayout from "./AppLayout.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout/>} >
          <Route index element={<Navigate to="/product-tables/paginated" replace />} />

          <Route path="/product-tables" element={<ProductTablesLayout />}>
            <Route index element={<Navigate to="/product-tables/paginated" replace />} />
            <Route path="paginated" element={<ProductsTablePaginated />} />
            <Route path="on-demand" element={<ProductsTableOnDemand />} />
            <Route path="long" element={<ProductsTableLong />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
