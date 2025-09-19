"use client";

import { Suspense } from "react";
import ProductListing from "../../components/productListing/ProductListing";

export default function ProductsPage() {
  console.log("ProductsPage is rendering");
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <div>
        <ProductListing />
      </div>
    </Suspense>
  );
}
