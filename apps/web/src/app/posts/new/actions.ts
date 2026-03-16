'use server';
import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Save to database
  const post = await db.post.create({
    data: { title, content },
  });

  // Revalidate the posts list so it shows the new post
  revalidatePath('/posts');

  // Redirect to the newly created post
  // Server Actions use 303 status code by default
  redirect(`/posts/${post.slug}`);
}
