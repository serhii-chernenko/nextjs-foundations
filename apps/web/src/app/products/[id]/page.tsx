import { cacheLife } from 'next/cache';
import { Suspense } from 'react';
import { ProductForm } from '@/components/product-form';
import { getProduct } from '@/lib/products';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <header>
        <h1>Product Details</h1>
      </header>

      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetailsWrapper params={params} />
      </Suspense>

      <footer>© 2024 ACME Corp</footer>
    </div>
  );
}

async function ProductDetailsWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetails id={id} />;
}

async function ProductDetails({ id }: { id: string }) {
  'use cache';
  cacheLife('products');

  const product = await getProduct(id);

  return (
    <div>
      <h2>{product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>{product.availabilityStatus}</p>
      <ProductForm product={product} />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-5 w-48 rounded bg-gray-200" />
      <div className="mb-2 h-5 w-32 rounded bg-gray-200" />
      <div className="h-5 w-24 rounded bg-gray-200" />
    </div>
  );
}
