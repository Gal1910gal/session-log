import { type SessionEntry } from '../types'
import { TEXT1, TEXT3, TEXT4 } from './FormField'
import * as XLSX from 'xlsx'

const CARD  = 'rgba(255,251,243,0.92)'
const CARD_B = 'rgba(185,158,118,0.28)'

function avgRating(s: SessionEntry) {
  const vals = [s.rating14,s.rating15,s.rating16,s.rating17,s.rating18,s.rating19].filter(v => v > 0)
  if (!vals.length) return null
  return (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1)
}

function exportToExcel(sessions: SessionEntry[]) {
  const rows = sessions.map(s => ({
    'תאריך': s.date,
    'שם מאובחנת': s.subjectName,
    'תאריך לידה': s.birthDate,
    'שם מלא': s.fullName,
    'שאלה מרכזית': s.mainQuestion,
    'משך': s.duration,
    'מגדר': s.gender === 'female' ? 'נקבה' : 'זכר',
    'סוג מפגש': s.sessionType === 'first' ? 'ראשון' : s.sessionType === 'followup' ? 'המשך' : 'לא פרונטלי',
    'תחום': s.domain.join(', '),
    'מה ידעתי מראש': s.priorKnowledge.join(', '),
    'שאלה אמיתית': s.realQuestion.join(', '),
    'ניסוח שאלה עמוקה': s.realQuestionFormulation,
    'דפוס 1 — התנהגות': s.pattern1Behavioral,
    'דפוס 1 — מצביע על': s.pattern1Indicates.join(', '),
    'דפוס 2 — הפער': s.pattern2Gap.join(', '),
    'דפוס 2 — ניסוח': s.pattern2Formulation,
    'דפוס 3 — תזמון': s.pattern3Timing.join(', '),
    'דפוס 3 — משמעות מעשית': s.pattern3Practical,
    'מה השם הוסיף': s.nameAdded.join(', '),
    'מה התזמון הוסיף': s.timingAdded.join(', '),
    'משפט תזמון': s.timingSentence,
    'תגובת לקוחה': s.clientReaction.join(', '),
    'מה הרגיש מדויק': s.feltAccurate,
    'מה לא התחבר': s.didntConnect,
    'משפט 1 שפגע': s.hitSentences[0],
    'משפט 2 שפגע': s.hitSentences[1],
    'משפט 3 שפגע': s.hitSentences[2],
    'נושאים חוזרים': s.repeatingTopics.join(', '),
    'מה היה מדויק': s.whatWasAccurate,
    'מה לא היה מדויק': s.whatWasInaccurate,
    'פירשתי מהר מדי': s.interpretedTooFast,
    'מספרים vs סיפור': s.numbersVsStory,
    'תובנה מרכזית': s.clientMainInsight.join(', '),
    'פירוט תובנה': s.clientMainInsightDetail,
    'ציון 14 — התאמה כללית': s.rating14,
    'ציון 15 — דפוס 1': s.rating15,
    'ציון 16 — דפוס 2': s.rating16,
    'ציון 17 — דפוס 3': s.rating17,
    'ציון 18 — תזמון': s.rating18,
    'ציון 19 — ערך מעשי': s.rating19,
    'ממוצע ציונים': avgRating(s) ?? '',
    'התאמה ישירה': s.matchDirect ? 'כן' : 'לא',
    'התאמה רגשית': s.matchEmotional ? 'כן' : 'לא',
    'התאמה התנהגותית': s.matchBehavioral ? 'כן' : 'לא',
    'התאמה מעשית': s.matchPractical ? 'כן' : 'לא',
    'התאמה בדיעבד': s.matchRetroactive ? 'כן' : 'לא',
    'התאמה חלקית': s.matchPartial ? 'כן' : 'לא',
    'אי התאמה': s.matchNone ? 'כן' : 'לא',
    'שאלת הזהב': s.goldenConclusion,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'מפגשים')
  XLSX.writeFile(wb, `session-log-${new Date().toISOString().slice(0,10)}.xlsx`)
}

interface Props {
  sessions: SessionEntry[]
  onEdit: (s: SessionEntry) => void
  onDelete: (id: string) => void
  onNew: () => void
}

export default function Library({ sessions, onEdit, onDelete, onNew }: Props) {
  const btnBase: React.CSSProperties = {
    padding:'9px 20px', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer', border:'none',
  }

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'28px 16px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:TEXT1, letterSpacing:'-0.02em' }}>יומן מפגשים</h1>
          <p style={{ fontSize:12, color:TEXT4, marginTop:3 }}>שיטת גלית — בקרה ופיתוח שיטה</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {sessions.length > 0 && (
            <button style={{ ...btnBase, background:'rgba(165,130,80,0.12)', color:'#5c4a32', border:'1px solid rgba(165,130,80,0.28)' }}
              onClick={() => exportToExcel(sessions)}>
              ייצוא Excel
            </button>
          )}
          <button style={{ ...btnBase, background:'linear-gradient(135deg,#8a6030,#b07840)', color:'rgba(255,251,243,0.96)', boxShadow:'0 2px 12px rgba(130,90,40,0.22)' }}
            onClick={onNew}>
            + מפגש חדש
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:TEXT4 }}>
          <p style={{ fontSize:16, marginBottom:8 }}>אין מפגשים עדיין</p>
          <p style={{ fontSize:13 }}>לחצי על "מפגש חדש" כדי להתחיל</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <StatsBar sessions={sessions} />
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} onEdit={() => onEdit(s)} onDelete={() => {
              if (confirm(`למחוק את המפגש עם ${s.subjectName}?`)) onDelete(s.id)
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatsBar({ sessions }: { sessions: SessionEntry[] }) {
  const withRating = sessions.filter(s => s.rating14 > 0)
  const globalAvg = withRating.length
    ? (withRating.reduce((a,s) => a + (s.rating14+s.rating15+s.rating16+s.rating17+s.rating18+s.rating19)/6, 0) / withRating.length).toFixed(1)
    : null

  const topicCount: Record<string, number> = {}
  sessions.forEach(s => s.repeatingTopics.forEach(t => { topicCount[t] = (topicCount[t] ?? 0) + 1 }))
  const topTopic = Object.entries(topicCount).sort((a,b) => b[1]-a[1])[0]

  const matchTypes = ['matchDirect','matchEmotional','matchBehavioral','matchPractical','matchRetroactive','matchPartial','matchNone'] as const
  const matchLabels: Record<string, string> = { matchDirect:'ישירה',matchEmotional:'רגשית',matchBehavioral:'התנהגותית',matchPractical:'מעשית',matchRetroactive:'בדיעבד',matchPartial:'חלקית',matchNone:'אי התאמה' }
  const topMatch = matchTypes.map(k => [matchLabels[k], sessions.filter(s => s[k]).length] as [string,number]).sort((a,b) => b[1]-a[1])[0]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:8 }}>
      {[
        { label:'סה"כ מפגשים', value:sessions.length },
        { label:'ממוצע ציון', value:globalAvg ? `${globalAvg}/5` : '—' },
        { label:'נושא חוזר', value:topTopic ? `${topTopic[0]} (${topTopic[1]})` : '—' },
        { label:'התאמה שכיחה', value:topMatch && topMatch[1] > 0 ? `${topMatch[0]} (${topMatch[1]})` : '—' },
      ].map(({ label, value }) => (
        <div key={label} style={{ background:CARD, border:`1px solid ${CARD_B}`, borderRadius:12, padding:'12px 14px', textAlign:'right' }}>
          <p style={{ fontSize:10, color:TEXT4, letterSpacing:'0.12em', marginBottom:4 }}>{label}</p>
          <p style={{ fontSize:18, fontWeight:800, color:TEXT1 }}>{value}</p>
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session: s, onEdit, onDelete }: { session: SessionEntry; onEdit: () => void; onDelete: () => void }) {
  const avg = avgRating(s)
  return (
    <div style={{ background:CARD, border:`1px solid ${CARD_B}`, borderRadius:14, padding:'16px 20px',
      display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      boxShadow:'0 2px 12px rgba(130,95,50,0.07)' }}>
      <div style={{ flex:1, textAlign:'right' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <span style={{ fontSize:16, fontWeight:800, color:TEXT1 }}>{s.subjectName}</span>
          {s.sessionType === 'first' && <span style={{ fontSize:10, background:'rgba(130,90,40,0.12)', color:'#8a6030', padding:'2px 8px', borderRadius:10 }}>ראשון</span>}
          {s.sessionType === 'followup' && <span style={{ fontSize:10, background:'rgba(80,120,80,0.12)', color:'#4a8050', padding:'2px 8px', borderRadius:10 }}>המשך</span>}
          {s.sessionType === 'remote' && <span style={{ fontSize:10, background:'rgba(80,80,160,0.10)', color:'#4a4a90', padding:'2px 8px', borderRadius:10 }}>לא פרונטלי</span>}
          {s.gender === 'male' ? <span style={{ fontSize:10, color:TEXT4 }}>♂</span> : <span style={{ fontSize:10, color:TEXT4 }}>♀</span>}
          {avg && <span style={{ fontSize:11, color:TEXT3 }}>★ {avg}</span>}
        </div>
        <p style={{ fontSize:12, color:TEXT3 }}>{s.date} · {s.birthDate} · {s.duration}</p>
        {s.domain.length > 0 && (
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:6 }}>
            {s.domain.map(d => (
              <span key={d} style={{ fontSize:10, background:'rgba(165,130,80,0.10)', color:'#8c7a62', padding:'2px 8px', borderRadius:10, border:'1px solid rgba(165,130,80,0.20)' }}>{d}</span>
            ))}
          </div>
        )}
        {s.mainQuestion && (
          <p style={{ fontSize:12, color:TEXT4, marginTop:6, fontStyle:'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:460 }}>
            {s.mainQuestion}
          </p>
        )}
        {s.goldenConclusion && (
          <p style={{ fontSize:11, color:'#8a6030', marginTop:4, fontStyle:'italic' }}>
            ✦ {s.goldenConclusion.slice(0, 80)}{s.goldenConclusion.length > 80 ? '...' : ''}
          </p>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginRight: 16 }}>
        <button onClick={onEdit} style={{ padding:'6px 16px', borderRadius:8, border:'1px solid rgba(165,130,80,0.28)', background:'rgba(165,130,80,0.08)', color:'#5c4a32', cursor:'pointer', fontSize:12, fontWeight:600 }}>עריכה</button>
        <button onClick={onDelete} style={{ padding:'6px 16px', borderRadius:8, border:'1px solid rgba(180,80,80,0.25)', background:'rgba(180,80,80,0.06)', color:'#a04040', cursor:'pointer', fontSize:12 }}>מחיקה</button>
      </div>
    </div>
  )
}
