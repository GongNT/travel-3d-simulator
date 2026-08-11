import { useState } from 'react'
import { TOKEN_BUNDLES } from '../lib/tokens'

export default function TokenBalance({ balance, onBuy }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="token-balance">
      <button className="token-pill" onClick={() => setOpen((v) => !v)}>
        {balance} tokens
      </button>
      {open && (
        <div className="token-buy-panel">
          <p className="token-buy-title">Buy tokens (demo - no real payment)</p>
          {TOKEN_BUNDLES.map((b) => (
            <button
              key={b.id}
              className="token-bundle-button"
              onClick={() => {
                onBuy(b.tokens)
                setOpen(false)
              }}
            >
              ${b.priceUSD.toFixed(2)} for {b.tokens} tokens
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
