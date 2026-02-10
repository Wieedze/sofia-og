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
  const signals = parseInt(searchParams.get('signals') || '0', 10)
  const interests = parseInterests(searchParams.get('interests'))
  const displayName = searchParams.get('name') || truncateWallet(wallet)

  const logoSrc = 'https://sofia-og.vercel.app/sofia-logo.png'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#050507',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          padding: '48px 56px',
        }}
      >
        {/* Left column: branding + stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '520px',
            paddingRight: '48px',
            borderRight: '1px solid #14141e',
          }}
        >
          {/* Header: Sofia branding + wallet */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '32px',
              }}
            >
              <img
                src={logoSrc}
                alt="Sofia"
                width={48}
                height={48}
                style={{ borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', color: '#555568', letterSpacing: '0.5px', display: 'flex' }}>
                  SOFIA PROFILE
                </span>
                <span style={{ fontSize: '20px', color: '#a0a0b8', display: 'flex' }}>
                  {displayName}
                </span>
              </div>
            </div>

            {/* Stats: Level, Signals, Trusted By */}
            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff', display: 'flex', lineHeight: 1 }}>
                  {level}
                </span>
                <span style={{ fontSize: '13px', color: '#555568', display: 'flex', marginTop: '6px', letterSpacing: '1px' }}>
                  LEVEL
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff', display: 'flex', lineHeight: 1 }}>
                  {signals}
                </span>
                <span style={{ fontSize: '13px', color: '#555568', display: 'flex', marginTop: '6px', letterSpacing: '1px' }}>
                  SIGNALS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff', display: 'flex', lineHeight: 1 }}>
                  {trustCircle}
                </span>
                <span style={{ fontSize: '13px', color: '#555568', display: 'flex', marginTop: '6px', letterSpacing: '1px' }}>
                  TRUSTED BY
                </span>
              </div>
            </div>
          </div>

          {/* Discovery Score */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '12px', display: 'flex' }}>
              DISCOVERY SCORE
            </span>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  background: '#0e0e16',
                  border: '1px solid #1a1a2e',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '12px', color: '#D4A843', letterSpacing: '1px', fontWeight: 600, marginBottom: '6px', display: 'flex' }}>
                  PIONEER
                </span>
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                  {pioneer}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  background: '#0e0e16',
                  border: '1px solid #1a1a2e',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '12px', color: '#6366f1', letterSpacing: '1px', fontWeight: 600, marginBottom: '6px', display: 'flex' }}>
                  EXPLORER
                </span>
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                  {explorer}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: interests */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingLeft: '48px',
            justifyContent: 'center',
          }}
        >
          {interests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '20px', display: 'flex' }}>
                INTERESTS
              </span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {interests.slice(0, 8).map((interest) => (
                  <div
                    key={interest.name}
                    style={{
                      padding: '10px 22px',
                      background: '#0e0e16',
                      border: '1px solid #1a1a2e',
                      borderRadius: '20px',
                      display: 'flex',
                    }}
                  >
                    <span style={{ fontSize: '16px', color: '#b0b0c8', display: 'flex' }}>
                      {interest.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={logoSrc}
                alt="Sofia"
                width={120}
                height={120}
                style={{ borderRadius: '50%', opacity: 0.15 }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            color: '#333340',
            fontSize: '14px',
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
