import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag, secret } = body

    // Verify the secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate by path
    if (path) {
      console.log(`[Revalidation] Revalidating path: ${path}`)
      revalidatePath(path)
    }

    // Revalidate by tag
    if (tag) {
      console.log(`[Revalidation] Revalidating tag: ${tag}`)
      revalidateTag(tag)
    }

    return NextResponse.json({
      message: 'Revalidation successful',
      timestamp: new Date().toISOString(),
      path,
      tag
    })
  } catch (error) {
    console.error('[Revalidation] Error:', error)
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const tag = searchParams.get('tag')
  const secret = searchParams.get('secret')

  try {
    // Verify the secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate by path
    if (path) {
      console.log(`[Revalidation] Revalidating path: ${path}`)
      revalidatePath(path)
    }

    // Revalidate by tag
    if (tag) {
      console.log(`[Revalidation] Revalidating tag: ${tag}`)
      revalidateTag(tag)
    }

    return NextResponse.json({
      message: 'Revalidation successful',
      timestamp: new Date().toISOString(),
      path,
      tag
    })
  } catch (error) {
    console.error('[Revalidation] Error:', error)
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    )
  }
}
