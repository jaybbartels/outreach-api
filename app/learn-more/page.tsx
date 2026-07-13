import { Suspense } from 'react'

function LearnMoreContent({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams?.name || 'there'
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-xl text-center">
        <div className="text-5xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hi {name}, thanks for your interest!</h1>
        <p className="text-gray-700 leading-relaxed mb-6">
          Here's some more information about what we do and how we can help your organization.
          A member of our team will be happy to walk you through the details whenever it's convenient for you.
        </p>
        <p className="text-gray-600 text-sm">
          Have questions right now? Just reply to the original email and we'll get back to you promptly.
        </p>
      </div>
    </div>
  )
}

export default function LearnMorePage({ searchParams }: { searchParams: { name?: string } }) {
  return (
    <Suspense>
      <LearnMoreContent searchParams={searchParams} />
    </Suspense>
  )
}
