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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050507',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Card */}
        <div
          style={{
            width: '520px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(165deg, #0f1018 0%, #0a0a0f 50%, #08080c 100%)',
            border: '1px solid #1a1a2e',
            borderRadius: '24px',
            padding: '36px 32px',
          }}
        >
          {/* Header: Sofia branding + wallet */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            <img
              src={logoSrc}
              alt="Sofia"
              width={44}
              height={44}
              style={{ borderRadius: '50%' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '0.5px', display: 'flex' }}>
                SOFIA WALLET ADDRESS STATS
              </span>
              <span style={{ fontSize: '17px', color: '#a0a0b8', display: 'flex' }}>
                {displayName}
              </span>
            </div>
          </div>

          {/* Stats row: Level, Signals, Trusted By */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid #14141e',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                {level}
              </span>
              <span style={{ fontSize: '11px', color: '#555568', display: 'flex', letterSpacing: '0.5px' }}>
                LEVEL
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                {signals}
              </span>
              <span style={{ fontSize: '11px', color: '#555568', display: 'flex', letterSpacing: '0.5px' }}>
                SIGNALS
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                {trustCircle}
              </span>
              <span style={{ fontSize: '11px', color: '#555568', display: 'flex', letterSpacing: '0.5px' }}>
                TRUSTED BY
              </span>
            </div>
          </div>

          {/* Discovery Score */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '12px', display: 'flex' }}>
              DISCOVERY SCORE
            </span>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: '#0e0e16',
                  border: '1px solid #1a1a2e',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '11px', color: '#D4A843', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px', display: 'flex' }}>
                  PIONEER
                </span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                  {pioneer}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: '#0e0e16',
                  border: '1px solid #1a1a2e',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '11px', color: '#6366f1', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px', display: 'flex' }}>
                  EXPLORER
                </span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                  {explorer}
                </span>
              </div>
            </div>
          </div>

          {/* Interests */}
          {interests.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '12px', display: 'flex' }}>
                INTERESTS
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {interests.slice(0, 6).map((interest) => (
                  <div
                    key={interest.name}
                    style={{
                      padding: '6px 16px',
                      background: '#0e0e16',
                      border: '1px solid #1a1a2e',
                      borderRadius: '20px',
                      display: 'flex',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#b0b0c8', display: 'flex' }}>
                      {interest.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            display: 'flex',
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
