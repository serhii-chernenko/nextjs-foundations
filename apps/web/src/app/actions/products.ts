"use server"
 
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/server/db';
 
export async function updateProduct(
  id: string, 
  data: { title?: string; price?: number; stock?: number }
) {
  try {
    // Update in database
    await db.products.update({
      where: { id },
      data,
    })
    
    // Invalidate specific product and product list (16.1.x requires second arg)
    revalidateTag(`product-${id}`, 'max')
    revalidateTag('products', 'max')
    
    return { success: true }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log error for debugging
    console.error('Failed to update product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}
 
export async function deleteProduct(id: string) {
  try {
    await db.products.delete({ where: { id } })
    
    // Only invalidate product list, specific product cache will expire naturally
    revalidateTag('products', 'max')
    
    return { success: true }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log error for debugging
    console.error('Failed to delete product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}