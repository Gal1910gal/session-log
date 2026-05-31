import React from 'react'

const TEXT1 = '#2a1f12'
const TEXT3 = '#8c7a62'
const TEXT4 = '#b0a090'
const INPUT_B = 'rgba(165,130,80,0.28)'
const INPUT_FOCUS_B = 'rgba(130,90,40,0.55)'

export const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.10em',
  color: TEXT3, marginBottom: 6, textAlign: 'right',
}

export const inputStyle = (focused = false): React.CSSProperties => ({
  width: '100%',
  background: focused ? 'rgba(255,251,243,0.98)' : 'rgba(255,251,240,0.70)',
  border: `1px solid ${focused ? INPUT_FOCUS_B : INPUT_B}`,
  borderRadius: 8, padding: '10px 14px', fontSize: 14, color: TEXT1,
  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
  boxShadow: focused ? '0 0 0 3px rgba(165,130,80,0.10)' : 'none',
  direction: 'rtl', textAlign: 'right',
})

export const textareaStyle = (focused = false): React.CSSProperties => ({
  ...inputStyle(focused),
  minHeight: 80, resize: 'vertical', lineHeight: 1.6,
})

interface CheckGroupProps {
  label: string
  options: string[]
  values: string[]
  onChange: (v: string[]) => void
  otherKey?: string
  otherValue?: string
  onOtherChange?: (v: string) => void
}

export function CheckGroup({ label, options, values, onChange, otherKey, otherValue, onOtherChange }: CheckGroupProps) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) onChange(values.filter(x => x !== opt))
    else onChange([...values, opt])
  }
  return (
    <div style={{ textAlign: 'right' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
        {options.map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, color: TEXT1 }}>
            <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)}
              style={{ accentColor: '#8a6030', width: 15, height: 15, cursor: 'pointer' }} />
            {opt}
          </label>
        ))}
        {otherKey && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, color: TEXT1 }}>
            <input type="checkbox" checked={values.includes('אחר')} onChange={() => toggle('אחר')}
              style={{ accentColor: '#8a6030', width: 15, height: 15, cursor: 'pointer' }} />
            אחר:
            {values.includes('אחר') && (
              <input type="text" value={otherValue ?? ''} onChange={e => onOtherChange?.(e.target.value)}
                style={{ ...inputStyle(), width: 120, padding: '4px 8px', fontSize: 12 }} />
            )}
          </label>
        )}
      </div>
    </div>
  )
}

interface RadioGroupProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}
export function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div style={{ textAlign: 'right' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 16 }}>
        {options.map(o => (
          <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 14, color: TEXT1 }}>
            <input type="radio" name={label} checked={value === o.value} onChange={() => onChange(o.value)}
              style={{ accentColor: '#8a6030', width: 15, height: 15, cursor: 'pointer' }} />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  )
}

interface StarRatingProps {
  label: string
  value: number
  onChange: (v: number) => void
}
export function StarRating({ label, value, onChange }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px',
      background: 'rgba(255,251,240,0.60)', borderRadius: 8, border: `1px solid ${INPUT_B}` }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: n <= value ? 'linear-gradient(135deg,#8a6030,#b07840)' : 'rgba(165,130,80,0.12)',
            color: n <= value ? '#fff' : TEXT4, fontWeight: 700, fontSize: 13,
            transition: 'all 0.15s',
          }}>{n}</button>
        ))}
      </div>
      <span style={{ fontSize: 13, color: TEXT3, textAlign: 'right', flex: 1, marginRight: 12 }}>{label}</span>
    </div>
  )
}

interface YesNoProps {
  label: string
  value: boolean | null
  onChange: (v: boolean) => void
}
export function YesNo({ label, value, onChange }: YesNoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px',
      background: 'rgba(255,251,240,0.60)', borderRadius: 8, border: `1px solid ${INPUT_B}` }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[true, false].map(b => (
          <button key={String(b)} type="button" onClick={() => onChange(b)} style={{
            padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            border: `1px solid ${value === b ? INPUT_FOCUS_B : INPUT_B}`,
            background: value === b ? (b ? 'rgba(100,180,100,0.18)' : 'rgba(180,100,100,0.12)') : 'transparent',
            color: value === b ? TEXT1 : TEXT4, transition: 'all 0.15s',
          }}>{b ? 'כן' : 'לא'}</button>
        ))}
      </div>
      <span style={{ fontSize: 13, color: TEXT3, textAlign: 'right', flex: 1, marginRight: 12 }}>{label}</span>
    </div>
  )
}

export const sectionTitle = (title: string, subtitle?: string): React.ReactElement => (
  <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(165,130,80,0.20)' }}>
    <h2 style={{ fontSize: 17, fontWeight: 800, color: TEXT1, textAlign: 'right' }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 12, color: TEXT4, textAlign: 'right', marginTop: 3 }}>{subtitle}</p>}
  </div>
)

export { TEXT1, TEXT3, TEXT4 }
