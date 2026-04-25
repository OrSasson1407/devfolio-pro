import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Failed to upload image'
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'devfolio-pro' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as CloudinaryUploadResult)
        }
      ).end(buffer)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error: unknown) {
    console.error('[upload] error:', error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}