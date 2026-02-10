import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function truncateWallet(wallet: string): string {
  if (wallet.length <= 12) return wallet
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}

interface InterestItem {
  name: string
  level: number
}

function parseInterests(raw: string | null): InterestItem[] {
  if (!raw) return []
  return raw.split(',').map((item) => {
    const parts = item.split(':')
    return {
      name: parts[0] || '',
      level: parseInt(parts[1] || '1', 10),
    }
  }).filter((i) => i.name).slice(0, 8)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const wallet = searchParams.get('wallet') || '0x0000...0000'
  const level = parseInt(searchParams.get('level') || '1', 10)
  const trustCircle = parseInt(searchParams.get('trustCircle') || '0', 10)
  const pioneer = parseInt(searchParams.get('pioneer') || '0', 10)
  const explorer = parseInt(searchParams.get('explorer') || '0', 10)
  const interests = parseInterests(searchParams.get('interests'))
  const displayName = searchParams.get('name') || truncateWallet(wallet)

  // Fetch logo from public directory and convert to base64 data URI
  const logoUrl = new URL('/sofia-logo.png', req.url).toString()
  const logoRes = await fetch(logoUrl)
  const logoArrayBuffer = await logoRes.arrayBuffer()
  const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64')
  const logoSrc = `data:image/png;base64,${logoBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Subtle gradient border effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #8276ED, #F6427B, #FFBF33)',
            display: 'flex',
          }}
        />

        {/* Sofia branding top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Sofia"
            width={72}
            height={72}
            style={{ borderRadius: '50%' }}
          />
          <span style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff' }}>
            Sofia
          </span>
        </div>

        {/* Wallet / Display name */}
        <div
          style={{
            fontSize: '40px',
            fontWeight: 600,
            marginBottom: '40px',
            color: '#e5e7eb',
            display: 'flex',
          }}
        >
          {displayName}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Level */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
              }}
            >
              {level}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', display: 'flex' }}>
              Level
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: '1px', height: '70px', background: '#2a2a2a', display: 'flex' }} />

          {/* Trust Circle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', display: 'flex' }}>
              {trustCircle}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', display: 'flex' }}>
              Trust Circle
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: '1px', height: '70px', background: '#2a2a2a', display: 'flex' }} />

          {/* Pioneer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#FFD700', display: 'flex' }}>
              {pioneer}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', display: 'flex' }}>
              Pioneer
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: '1px', height: '70px', background: '#2a2a2a', display: 'flex' }} />

          {/* Explorer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#3B82F6', display: 'flex' }}>
              {explorer}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', display: 'flex' }}>
              Explorer
            </div>
          </div>

        </div>

        {/* Interests pills */}
        {interests.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '900px',
            }}
          >
            {interests.map((interest) => (
              <div
                key={interest.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '28px',
                }}
              >
                <span style={{ fontSize: '20px', color: '#e5e7eb' }}>
                  {interest.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4b5563',
            fontSize: '18px',
          }}
        >
          sofia.intuition.box
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
