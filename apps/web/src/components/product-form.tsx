'use client';
import { useState } from 'react';
import { updateProduct } from '@/app/actions/products';
import type { Product } from '@/lib/products';

export function ProductForm({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage('');

    const result = await updateProduct(product.id, {
      title: formData.get('title') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
    });

    setLoading(false);

    if (result.success) {
      setMessage('Product updated! Cache invalidated.');
    } else {
      setMessage(result.error || 'Failed to update');
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input
          className="w-full rounded border px-3 py-2"
          defaultValue={product.title}
          id="title"
          name="title"
        />
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input
          className="w-full rounded border px-3 py-2"
          defaultValue={product.price}
          id="price"
          name="price"
          type="number"
        />
      </div>

      <div>
        <label htmlFor="stock">Stock</label>
        <input
          className="w-full rounded border px-3 py-2"
          defaultValue={product.stock}
          id="stock"
          name="stock"
          type="number"
        />
      </div>

      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>

      {message && (
        <p
          className={
            message.includes('success') ? 'text-green-600' : 'text-red-600'
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
