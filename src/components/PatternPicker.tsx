import { useState, useEffect, useRef } from 'react'
import { BUILT_IN_PATTERNS, loadCustomPatterns, addCustomPattern, removeCustomPattern } from '../types'

const TEXT1 = '#2a1f12'
const TEXT3 = '#8c7a62'
const TEXT4 = '#b0a090'
const INPUT_B = 'rgba(165,130,80,0.28)'
const INPUT_FOCUS_B = 'rgba(130,90,40,0.55)'

interface Props {
  selected: string[]
  onChange: (v: string[]) => void
}

export default function PatternPicker({ selected, onChange }: Props) {
  const [custom, setCustom]     = useState<string[]>([])
  const [search, setSearch]     = useState('')
  const [newName, setNewName]   = useState('')
  const [addFocus, setAddFocus] = useState(false)
  const [srchFocus, setSrchFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setCustom(loadCustomPatterns()) }, [])

  const allPatterns = [...BUILT_IN_PATTERNS, ...custom]
  const filtered = search.trim()
    ? allPatterns.filter(p => p.includes(search.trim()))
    : allPatterns

  const toggle = (p: string) => {
    if (selected.includes(p)) onChange(selected.filter(x => x !== p))
    else onChange([...selected, p])
  }

  const handleAdd = () => {
    const name = newName.trim()
    if (!name || allPatterns.includes(name)) return
    addCustomPattern(name)
    setCustom(loadCustomPatterns())
    setNewName('')
    // Auto-select the newly added pattern
    onChange([...selected, name])
    inputRef.current?.focus()
  }

  const handleRemoveCustom = (p: string) => {
    removeCustomPattern(p)
    setCustom(loadCustomPatterns())
    onChange(selected.filter(x => x !== p))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, textAlign:'right' }}>
      <label style={{ fontSize:12, fontWeight:700, letterSpacing:'0.10em', color:TEXT3 }}>
        זיהוי דפוסים מהמאגר
      </label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {selected.map(p => (
            <span key={p} style={{
              display:'inline-flex', alignItems:'center', gap:5,
              background:'linear-gradient(135deg,rgba(138,96,48,0.15),rgba(176,120,64,0.12))',
              border:'1px solid rgba(138,96,48,0.35)', borderRadius:20,
              padding:'4px 12px', fontSize:12, color:'#5c3a10', fontWeight:600,
            }}>
              {p}
              <button type="button" onClick={() => toggle(p)} style={{
                background:'none', border:'none', cursor:'pointer', color:'#a06030',
                fontSize:14, lineHeight:1, padding:0, fontWeight:700,
              }}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setSrchFocus(true)}
        onBlur={() => setSrchFocus(false)}
        placeholder="חיפוש דפוס..."
        style={{
          width:'100%', background: srchFocus ? 'rgba(255,251,243,0.98)' : 'rgba(255,251,240,0.70)',
          border:`1px solid ${srchFocus ? INPUT_FOCUS_B : INPUT_B}`,
          borderRadius:8, padding:'9px 14px', fontSize:13, color:TEXT1,
          outline:'none', direction:'rtl', textAlign:'right',
        }}
      />

      {/* Pattern grid */}
      <div style={{
        maxHeight:260, overflowY:'auto', display:'flex', flexWrap:'wrap', gap:'6px 8px',
        padding:'10px 12px', background:'rgba(255,251,240,0.55)',
        border:`1px solid ${INPUT_B}`, borderRadius:10,
      }}>
        {filtered.length === 0 && (
          <p style={{ fontSize:12, color:TEXT4, width:'100%', textAlign:'center', padding:'12px 0' }}>
            לא נמצאו תוצאות
          </p>
        )}
        {filtered.map(p => {
          const isSelected = selected.includes(p)
          const isCustom   = custom.includes(p)
          return (
            <div key={p} style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
              <button
                type="button"
                onClick={() => toggle(p)}
                style={{
                  padding:'5px 12px', borderRadius:20, cursor:'pointer', fontSize:12,
                  fontWeight: isSelected ? 700 : 400,
                  border:`1px solid ${isSelected ? 'rgba(130,90,40,0.55)' : INPUT_B}`,
                  background: isSelected
                    ? 'linear-gradient(135deg,#8a6030,#b07840)'
                    : isCustom ? 'rgba(80,140,100,0.08)' : 'rgba(255,251,240,0.80)',
                  color: isSelected ? '#fff' : isCustom ? '#3a6a48' : TEXT1,
                  transition:'all 0.15s',
                }}
              >
                {p}
              </button>
              {isCustom && (
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(p)}
                  title="מחק דפוס"
                  style={{
                    background:'none', border:'none', cursor:'pointer',
                    color:TEXT4, fontSize:12, padding:'2px 3px', lineHeight:1,
                  }}
                >×</button>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new pattern */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim() || allPatterns.includes(newName.trim())}
          style={{
            padding:'9px 18px', borderRadius:8, fontWeight:700, fontSize:13,
            background: newName.trim() && !allPatterns.includes(newName.trim())
              ? 'linear-gradient(135deg,#8a6030,#b07840)' : 'rgba(165,130,80,0.12)',
            color: newName.trim() && !allPatterns.includes(newName.trim())
              ? '#fff' : TEXT4,
            border:'none', cursor: newName.trim() ? 'pointer' : 'default',
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}
        >
          + הוסף דפוס
        </button>
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onFocus={() => setAddFocus(true)}
          onBlur={() => setAddFocus(false)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          placeholder="שם דפוס חדש..."
          style={{
            flex:1, background: addFocus ? 'rgba(255,251,243,0.98)' : 'rgba(255,251,240,0.70)',
            border:`1px solid ${addFocus ? INPUT_FOCUS_B : INPUT_B}`,
            borderRadius:8, padding:'9px 14px', fontSize:13, color:TEXT1,
            outline:'none', direction:'rtl', textAlign:'right',
          }}
        />
      </div>
      {custom.length > 0 && (
        <p style={{ fontSize:10, color:TEXT4, textAlign:'right' }}>
          דפוסים ירוקים = דפוסים שהוספת · לחצי × למחיקה
        </p>
      )}
    </div>
  )
}
