import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const baseUrl = request.nextUrl.origin

  try {
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || undefined

    const result = await service.resolveTrackedLink(token, userAgent, ipAddress)

    if (!result) {
      return NextResponse.redirect(`${baseUrl}/learn-more`)
    }

    const nameParam = encodeURIComponent(result.recipientName)
    const destination =
      result.linkType === 'request_response'
        ? `${baseUrl}/response-received?name=${nameParam}`
        : `${baseUrl}/learn-more?name=${nameParam}`

    return NextResponse.redirect(destination)
  } catch (error) {
    console.error('Track link error:', error)
    return NextResponse.redirect(`${baseUrl}/learn-more`)
  }
}
