import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Level badge colors (matching Sofia extension design)
const LEVEL_COLORS: Record<number, string> = {
  1: '#9CA3AF',
  2: '#22C55E',
  3: '#3B82F6',
  4: '#8B5CF6',
  5: '#F59E0B',
  6: '#EF4444',
  7: '#EC4899',
  8: '#06B6D4',
  9: '#F97316',
  10: '#FFD700',
}

function getLevelColor(level: number): string {
  return LEVEL_COLORS[Math.min(level, 10)] || LEVEL_COLORS[10]
}

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
  }).filter((i) => i.name).slice(0, 5)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const wallet = searchParams.get('wallet') || '0x0000...0000'
  const level = parseInt(searchParams.get('level') || '1', 10)
  const signals = parseInt(searchParams.get('signals') || '0', 10)
  const interests = parseInterests(searchParams.get('interests'))
  const displayName = searchParams.get('name') || truncateWallet(wallet)

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
            src={`${req.nextUrl.origin}/sofia-logo.png`}
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
            gap: '64px',
            marginBottom: '48px',
          }}
        >
          {/* Level */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
              }}
            >
              {level}
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280', display: 'flex' }}>
              Level
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              width: '1px',
              height: '80px',
              background: '#2a2a2a',
              display: 'flex',
            }}
          />

          {/* Signals */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                display: 'flex',
              }}
            >
              {signals}
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280', display: 'flex' }}>
              Signals
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              width: '1px',
              height: '80px',
              background: '#2a2a2a',
              display: 'flex',
            }}
          />

          {/* Interests count */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                display: 'flex',
              }}
            >
              {interests.length}
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280', display: 'flex' }}>
              Interests
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
                  gap: '10px',
                  padding: '14px 24px',
                  background: '#1a1a1a',
                  border: `1px solid ${getLevelColor(interest.level)}40`,
                  borderRadius: '28px',
                }}
              >
                <span style={{ fontSize: '22px', color: '#e5e7eb' }}>
                  {interest.name}
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: getLevelColor(interest.level),
                    background: `${getLevelColor(interest.level)}20`,
                    padding: '4px 10px',
                    borderRadius: '10px',
                  }}
                >
                  LVL {interest.level}
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
