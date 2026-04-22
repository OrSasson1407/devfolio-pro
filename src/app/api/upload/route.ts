import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'

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

    // Convert the File object to a Buffer to stream to Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'devfolio-pro' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({ url: (result as any).secure_url })
  } catch (error) {
    console.error('[upload] error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}