import { createPost } from './actions';

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-2xl">Create New Post</h1>

      <form action={createPost} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            id="title"
            name="title"
            required
            type="text"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700" htmlFor="content">
            Content
          </label>
          <textarea
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            id="content"
            name="content"
            required
            rows={5}
          />
        </div>

        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          type="submit"
        >
          Create Post
        </button>
      </form>
    </main>
  );
}
