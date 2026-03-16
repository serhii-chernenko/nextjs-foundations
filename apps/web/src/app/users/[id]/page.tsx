import { notFound, redirect } from 'next/navigation';

async function fetchUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  const user = await fetchUser(id);

  // Redirect to login if user not found (auth scenario)
  if (!user) {
    redirect('/login');
  }

  // Alternative: show 404 for missing resources
  // if (!user) {
  //   notFound();
  // }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
}
