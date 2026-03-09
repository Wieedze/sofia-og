import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function truncateWallet(wallet: string): string {
  if (wallet.length <= 12) return wallet
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const wallet = searchParams.get('wallet') || '0x0000...0000'
  const displayName = searchParams.get('name') || truncateWallet(wallet)
  const alphaRank = parseInt(searchParams.get('alphaRank') || '0', 10)
  const totalAlpha = parseInt(searchParams.get('totalAlpha') || '0', 10)
  const tx = parseInt(searchParams.get('tx') || '0', 10)
  const intentions = parseInt(searchParams.get('intentions') || '0', 10)
  const pioneer = parseInt(searchParams.get('pioneer') || '0', 10)
  const trustVolume = searchParams.get('trustVolume') || '0 T'
  const poolRank = searchParams.get('poolRank')
  const totalPool = searchParams.get('totalPool')
  const pnl = searchParams.get('pnl')
  const pnlPercent = searchParams.get('pnlPercent')

  const hasPool = poolRank && pnl && pnlPercent

  const logoSrc = 'https://sofia-og.vercel.app/sofia-logo.png'

  const statCard = (label: string, value: string, color?: string) => (
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
      <span style={{ fontSize: '11px', color: color || '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px', display: 'flex', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', display: 'flex' }}>
        {value}
      </span>
    </div>
  )

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
          padding: '44px 56px',
        }}
      >
        {/* Left column: branding + rank */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '440px',
            paddingRight: '48px',
            borderRight: '1px solid #14141e',
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
                SOFIA BOARD
              </span>
              <span style={{ fontSize: '18px', color: '#a0a0b8', display: 'flex' }}>
                {displayName}
              </span>
            </div>
          </div>

          {/* Alpha Rank - prominent */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#C7866C', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px', display: 'flex' }}>
              ALPHA RANK
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '64px', fontWeight: 700, color: '#fff', display: 'flex', lineHeight: 1 }}>
                #{alphaRank}
              </span>
              <span style={{ fontSize: '20px', color: '#555568', display: 'flex' }}>
                of {totalAlpha}
              </span>
            </div>
          </div>

          {/* Trust Volume */}
          <div
            style={{
              padding: '18px 22px',
              background: '#0e0e16',
              border: '1px solid #1a1a2e',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '11px', color: '#C7866C', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px', display: 'flex' }}>
              TRUST VOLUME
            </span>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff', display: 'flex' }}>
              {trustVolume}
            </span>
          </div>
        </div>

        {/* Right column: stats grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingLeft: '48px',
          }}
        >
          {/* Stats section label */}
          <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '16px', display: 'flex' }}>
            SEASON STATS
          </span>

          {/* Stats row 1 */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            {statCard('Transactions', String(tx))}
            {statCard('Intentions', String(intentions))}
          </div>

          {/* Stats row 2 */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: hasPool ? '24px' : '0' }}>
            {statCard('Pioneer', String(pioneer), '#D4A843')}
          </div>

          {/* Pool stats (conditional) */}
          {hasPool && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#555568', letterSpacing: '1px', fontWeight: 600, marginBottom: '12px', display: 'flex', paddingTop: '12px', borderTop: '1px solid #14141e' }}>
                SEASON POOL
              </span>
              <div style={{ display: 'flex', gap: '14px' }}>
                {statCard('Pool Rank', `#${poolRank}${totalPool ? ` / ${totalPool}` : ''}`)}
                {statCard('P&L', pnl!, parseInt(pnl!) >= 0 || pnl!.startsWith('+') ? '#22c55e' : '#ef4444')}
                {statCard('P&L %', pnlPercent!, pnlPercent!.startsWith('+') ? '#22c55e' : '#ef4444')}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            color: '#333340',
            fontSize: '13px',
          }}
        >
          board-sofia.intuition.box
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
