import { Suspense } from 'react'

function ResponseReceivedContent({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams?.name || 'there'
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-xl text-center">
        <div className="text-5xl mb-4">🙌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thanks, {name}!</h1>
        <p className="text-gray-700 leading-relaxed">
          We've noted your interest and someone from our team will reach out to you shortly.
        </p>
      </div>
    </div>
  )
}

export default function ResponseReceivedPage({ searchParams }: { searchParams: { name?: string } }) {
  return (
    <Suspense>
      <ResponseReceivedContent searchParams={searchParams} />
    </Suspense>
  )
}
