import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Failed to generate image'
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const name = searchParams.get('name') || 'Developer'
    const username = searchParams.get('username') || 'dev'
    const image = searchParams.get('image')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #3b0764 2%, transparent 0%), radial-gradient(circle at 75px 75px, #3b0764 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111827',
              border: '2px solid #374151',
              borderRadius: '32px',
              padding: '60px 80px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 100px rgba(139, 92, 246, 0.2)',
            }}
          >
            {image ? (
              <img
                src={image}
                alt="avatar"
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  marginBottom: 30,
                  border: '6px solid #8b5cf6',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  backgroundColor: '#374151',
                  marginBottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '6px solid #8b5cf6',
                }}
              >
                <span style={{ fontSize: 72, color: '#9ca3af' }}>{name.charAt(0).toUpperCase()}</span>
              </div>
            )}

            <h1 style={{ fontSize: 72, color: '#f9fafb', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {name}
            </h1>
            <p style={{ fontSize: 36, color: '#a78bfa', margin: '16px 0 0 0', fontWeight: 500 }}>
              @{username}
            </p>

            <div style={{ display: 'flex', marginTop: 48, alignItems: 'center' }}>
              <div style={{ fontSize: 24, color: '#9ca3af', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <span style={{ color: '#8b5cf6', marginRight: 12, fontSize: 30 }}>✦</span> Built with DevFolio Pro
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.error('OG Image Generation Error:', e)
    return new Response(getErrorMessage(e), { status: 500 })
  }
}