'use client';

import { useActionState } from 'react';
import { submitContactForm } from '@/app/actions/contact';
import { SubmitButton } from '@/app/ui/submit-button';

const initialState = {
  message: '',
};

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState
  );

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 font-bold text-2xl">Contact Us</h1>

      <form action={formAction} className="space-y-4">
        {/* Name field */}
        <div>
          <label className="mb-1 block font-medium text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="w-full rounded-md border px-3 py-2"
            id="name"
            name="name"
            required
            type="text"
          />
          {state?.errors?.name && (
            <p aria-live="polite" className="mt-1 text-red-600 text-sm">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label className="mb-1 block font-medium text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-md border px-3 py-2"
            id="email"
            name="email"
            required
            type="email"
          />
          {state?.errors?.email && (
            <p aria-live="polite" className="mt-1 text-red-600 text-sm">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Message field */}
        <div>
          <label className="mb-1 block font-medium text-sm" htmlFor="message">
            Message
          </label>
          <textarea
            className="w-full rounded-md border px-3 py-2"
            id="message"
            name="message"
            required
            rows={4}
          />
          {state?.errors?.message && (
            <p aria-live="polite" className="mt-1 text-red-600 text-sm">
              {state.errors.message[0]}
            </p>
          )}
        </div>

        {/* Success message */}
        {state?.success && (
          <p aria-live="polite" className="font-medium text-green-600">
            {state.message}
          </p>
        )}

        {/* Generic error message */}
        {state?.message && !state?.success && (
          <p aria-live="polite" className="text-red-600">
            {state.message}
          </p>
        )}

        {/* Submit button with loading state */}
        <SubmitButton />
      </form>
    </div>
  );
}
