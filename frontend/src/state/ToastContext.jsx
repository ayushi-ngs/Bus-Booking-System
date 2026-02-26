import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(() => ({
    push: (msg, type = 'info') => {
      const id = Math.random().toString(16).slice(2)
      setToasts(t => [...t, { id, msg, type }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
    }
  }), [])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div style={{ position:'fixed', right:14, bottom:14, display:'grid', gap:10, zIndex:9999 }}>
        {toasts.map(t => (
          <div key={t.id} className="card" style={{
            padding:'10px 12px',
            borderColor: t.type==='error' ? 'rgba(239,68,68,.45)' :
                         t.type==='success' ? 'rgba(34,197,94,.45)' :
                         t.type==='warn' ? 'rgba(245,158,11,.45)' :
                         'rgba(139,92,246,.45)',
            minWidth: 260
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {t.type === 'error' ? 'Error' : t.type==='success' ? 'Done' : t.type==='warn' ? 'Heads up' : 'Info'}
            </div>
            <div className="small muted">{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
