import { useState } from 'react'
import { type SessionEntry, type SessionDraft, newId } from '../types'
import {
  CheckGroup, RadioGroup, StarRating, YesNo,
  sectionTitle, labelStyle, inputStyle, textareaStyle,
  TEXT3, TEXT4,
} from './FormField'

const CARD  = 'rgba(255,251,243,0.92)'
const CARD_B = 'rgba(185,158,118,0.28)'
const CARD_S = '0 4px 32px rgba(130,95,50,0.10), 0 1px 6px rgba(130,95,50,0.07)'

const DOMAIN_OPTS = ['זוגיות','קריירה','בריאות','קבלת החלטה','עסק','כסף','משפחה','מגורים','תקיעות כללית']
const PRIOR_OPTS = ['רק שם ותאריך לידה','גם שאלה כתובה','גם רקע עסקי','גם רקע אישי','מידע רגשי/סיפורי רחב','היכרות קודמת']
const REAL_Q_OPTS = ['למה אני תקועה?','האם אני בכיוון הנכון?','האם להישאר או לשנות?','האם עכשיו הזמן לפעול?','למה זה חוזר לי שוב ושוב?','האם לבחור בין שתי אפשרויות?','איך להוציא את עצמי לפועל?']
const PATTERN1_OPTS = ['עצמאות והובלה','צורך בשליטה','אחריות יתר','רגישות גבוהה','פחד מטעות','צורך בביטחון','צורך בחופש','קושי לבחור','חוסר שקט','נתינה מוגזמת']
const PATTERN2_OPTS = ['בין הרצון הפנימי לבין הביטוי החיצוני','בין רכות לכוח','בין צורך בביטחון לבין צורך בתנועה','בין נתינה לבין גבולות','בין חשיבה לבין פעולה','בין עצמאות לבין תלות','בין נראות לבין הסתתרות']
const PATTERN3_OPTS = ['השנה תומכת בכיוון החיים','השנה מאטה את הכיוון','השנה יוצרת קונפליקט','השנה מבקשת דיוק לפני פעולה','השנה מבקשת חשיפה ויציאה החוצה','השנה מבקשת סגירה, ניקוי או שחרור','השנה מבקשת בנייה שקטה','השנה יוצרת עומס רגשי']
const NAME_ADDED_OPTS = ['הבנתי איך האדם פועל בעולם','הבנתי איפה יש חסימה בביטוי','הבנתי איך אחרים רואים אותו','הבנתי מה לא יוצא החוצה','הבנתי איפה יש פער בין פוטנציאל לבין ביצוע','לא הוסיף משמעות מיוחדת הפעם']
const TIMING_OPTS = ['עכשיו זמן בדיקה','עכשיו זמן פעולה','עכשיו זמן חשיפה','עכשיו זמן סגירה','עכשיו זמן מנוחה / התכנסות','עכשיו זמן למידה','עכשיו נכון לקבל החלטה','עכשיו לא נכון לדחוף בכוח']
const REACTION_OPTS = ['התרגשות','זיהוי מיידי','בלבול','התנגדות','בכי','שקט / עיבוד','"בדיוק"','צחוק','"זה לא אני"','"לא חשבתי על זה ככה"']
const TOPICS_OPTS = ['עומס','פחד משינוי','שליטה','גבולות','זוגיות','כסף','עצמאות','ביטחון עצמי','נראות','תחושת פספוס','קושי לבחור','ריצוי','צורך בהכרה','פחד להיכשל']
const INSIGHT_OPTS = ['אישור לכיוון','הבנה על עצמה','הקלה רגשית','החלטה מעשית','שינוי זווית הסתכלות','הבנה של דפוס חוזר','פעולה קונקרטית להמשך']

const STEPS = [
  'פרטים כלליים',
  'לפני המפגש',
  'שלב האבחון',
  'שכבות נוספות',
  'בזמן המפגש',
  'אחרי המפגש',
  'דירוג ואיכות',
]

const today = () => new Date().toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'numeric' }).replace(/\./g,'/')

function empty(): SessionDraft {
  return {
    date: today(), subjectName: '', birthDate: '', fullName: '', mainQuestion: '',
    gender: 'female', duration: '', sessionType: 'first', domain: [], domainOther: '',
    priorKnowledge: [], priorKnowledgeDetail: '', realQuestion: [], realQuestionOther: '', realQuestionFormulation: '',
    pattern1Behavioral: '', pattern1Indicates: [], pattern1OtherText: '',
    pattern2Gap: [], pattern2OtherText: '', pattern2Formulation: '',
    pattern3Timing: [], pattern3OtherText: '', pattern3Practical: '',
    nameAdded: [], nameAddedDetail: '', timingAdded: [], timingAddedOther: '', timingSentence: '',
    clientReaction: [], clientReactionOther: '', feltAccurate: '', didntConnect: '',
    hitSentences: ['','',''],
    repeatingTopics: [], repeatingTopicsOther: '',
    whatWasAccurate: '', whatWasInaccurate: '', interpretedTooFast: '', numbersVsStory: '',
    clientMainInsight: [], clientMainInsightOther: '', clientMainInsightDetail: '',
    rating14: 0, rating15: 0, rating16: 0, rating17: 0, rating18: 0, rating19: 0,
    matchDirect: false, matchEmotional: false, matchBehavioral: false, matchPractical: false,
    matchRetroactive: false, matchPartial: false, matchNone: false,
    goldenConclusion: '',
  }
}

interface Props {
  initial?: SessionEntry
  onSave: (s: SessionEntry) => void
  onCancel: () => void
}

export default function SessionForm({ initial, onSave, onCancel }: Props) {
  const [step, setStep] = useState(0)
  const [d, setD] = useState<SessionDraft>(initial ?? empty())
  const [focusMap, setFocusMap] = useState<Record<string, boolean>>({})

  const f = (k: string) => ({
    onFocus: () => setFocusMap(m => ({ ...m, [k]: true })),
    onBlur:  () => setFocusMap(m => ({ ...m, [k]: false })),
  })

  const set = <K extends keyof SessionDraft>(k: K, v: SessionDraft[K]) => setD(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    const s: SessionEntry = {
      id: initial?.id ?? newId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      date: d.date ?? today(),
      subjectName: d.subjectName ?? '',
      birthDate: d.birthDate ?? '',
      fullName: d.fullName ?? '',
      mainQuestion: d.mainQuestion ?? '',
      gender: d.gender ?? 'female',
      duration: d.duration ?? '',
      sessionType: d.sessionType ?? 'first',
      domain: d.domain ?? [],
      domainOther: d.domainOther ?? '',
      priorKnowledge: d.priorKnowledge ?? [],
      priorKnowledgeDetail: d.priorKnowledgeDetail ?? '',
      realQuestion: d.realQuestion ?? [],
      realQuestionOther: d.realQuestionOther ?? '',
      realQuestionFormulation: d.realQuestionFormulation ?? '',
      pattern1Behavioral: d.pattern1Behavioral ?? '',
      pattern1Indicates: d.pattern1Indicates ?? [],
      pattern1OtherText: d.pattern1OtherText ?? '',
      pattern2Gap: d.pattern2Gap ?? [],
      pattern2OtherText: d.pattern2OtherText ?? '',
      pattern2Formulation: d.pattern2Formulation ?? '',
      pattern3Timing: d.pattern3Timing ?? [],
      pattern3OtherText: d.pattern3OtherText ?? '',
      pattern3Practical: d.pattern3Practical ?? '',
      nameAdded: d.nameAdded ?? [],
      nameAddedDetail: d.nameAddedDetail ?? '',
      timingAdded: d.timingAdded ?? [],
      timingAddedOther: d.timingAddedOther ?? '',
      timingSentence: d.timingSentence ?? '',
      clientReaction: d.clientReaction ?? [],
      clientReactionOther: d.clientReactionOther ?? '',
      feltAccurate: d.feltAccurate ?? '',
      didntConnect: d.didntConnect ?? '',
      hitSentences: d.hitSentences ?? ['','',''],
      repeatingTopics: d.repeatingTopics ?? [],
      repeatingTopicsOther: d.repeatingTopicsOther ?? '',
      whatWasAccurate: d.whatWasAccurate ?? '',
      whatWasInaccurate: d.whatWasInaccurate ?? '',
      interpretedTooFast: d.interpretedTooFast ?? '',
      numbersVsStory: d.numbersVsStory ?? '',
      clientMainInsight: d.clientMainInsight ?? [],
      clientMainInsightOther: d.clientMainInsightOther ?? '',
      clientMainInsightDetail: d.clientMainInsightDetail ?? '',
      rating14: d.rating14 ?? 0,
      rating15: d.rating15 ?? 0,
      rating16: d.rating16 ?? 0,
      rating17: d.rating17 ?? 0,
      rating18: d.rating18 ?? 0,
      rating19: d.rating19 ?? 0,
      matchDirect: d.matchDirect ?? false,
      matchEmotional: d.matchEmotional ?? false,
      matchBehavioral: d.matchBehavioral ?? false,
      matchPractical: d.matchPractical ?? false,
      matchRetroactive: d.matchRetroactive ?? false,
      matchPartial: d.matchPartial ?? false,
      matchNone: d.matchNone ?? false,
      goldenConclusion: d.goldenConclusion ?? '',
    }
    onSave(s)
  }

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sectionTitle('פרטים כלליים')}

          {/* Gender toggle */}
          <div style={{ textAlign:'right' }}>
            <label style={labelStyle}>מגדר</label>
            <div style={{ display:'flex', gap:8 }}>
              {(['female','male'] as const).map(g => (
                <button key={g} type="button" onClick={() => set('gender', g)} style={{
                  flex:1, padding:'10px 0', borderRadius:10, cursor:'pointer',
                  border:`1px solid ${d.gender===g ? 'rgba(130,90,40,0.55)' : 'rgba(165,130,80,0.28)'}`,
                  background: d.gender===g ? 'rgba(165,130,80,0.14)' : 'rgba(255,251,240,0.70)',
                  color: d.gender===g ? '#2a1f12' : '#8c7a62',
                  fontSize:14, fontWeight: d.gender===g ? 700 : 500, transition:'all 0.15s',
                }}>
                  {g === 'female' ? '♀ נקבה' : '♂ זכר'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={labelStyle}>תאריך</label>
              <input value={d.date ?? ''} onChange={e => set('date', e.target.value)} style={inputStyle(focusMap['date'])} {...f('date')} />
            </div>
            <div>
              <label style={labelStyle}>שם {d.gender === 'female' ? 'המאובחנת' : 'המאובחן'} (לזיהוי)</label>
              <input value={d.subjectName ?? ''} onChange={e => set('subjectName', e.target.value)} style={inputStyle(focusMap['subjectName'])} {...f('subjectName')} />
            </div>
            <div>
              <label style={labelStyle}>תאריך לידה</label>
              <input value={d.birthDate ?? ''} onChange={e => set('birthDate', e.target.value)} placeholder="DD/MM/YYYY" style={inputStyle(focusMap['birthDate'])} {...f('birthDate')} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>שם מלא בעברית (לחישוב נומרולוגי)</label>
              <input value={d.fullName ?? ''} onChange={e => set('fullName', e.target.value)} style={inputStyle(focusMap['fullName'])} {...f('fullName')} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>שאלה מרכזית שהביאה לפגישה</label>
            <textarea value={d.mainQuestion ?? ''} onChange={e => set('mainQuestion', e.target.value)} style={textareaStyle(focusMap['mainQuestion'])} {...f('mainQuestion')} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={labelStyle}>משך המפגש</label>
              <input value={d.duration ?? ''} onChange={e => set('duration', e.target.value)} placeholder="60 דקות" style={inputStyle(focusMap['duration'])} {...f('duration')} />
            </div>
            <RadioGroup label="סוג מפגש"
              options={[
                {value:'first', label:'מפגש ראשון'},
                {value:'followup', label:'המשך תהליך'},
                {value:'remote', label:'אבחון לא פרונטלי'},
              ]}
              value={d.sessionType ?? 'first'} onChange={v => set('sessionType', v as 'first'|'followup'|'remote')} />
          </div>
          <CheckGroup label="תחום השאלה" options={DOMAIN_OPTS} values={d.domain ?? []}
            onChange={v => set('domain', v)} otherKey="domainOther"
            otherValue={d.domainOther} onOtherChange={v => set('domainOther', v)} />
        </div>
      )

      case 1: return (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {sectionTitle('לפני המפגש')}
          <CheckGroup label="1. מה ידעתי מראש?" options={PRIOR_OPTS} values={d.priorKnowledge ?? []} onChange={v => set('priorKnowledge', v)} />
          <div>
            <label style={labelStyle}>פירוט קצר</label>
            <textarea value={d.priorKnowledgeDetail ?? ''} onChange={e => set('priorKnowledgeDetail', e.target.value)} style={textareaStyle(focusMap['pkd'])} {...f('pkd')} />
          </div>
          <CheckGroup label="2. מה היתה השאלה האמיתית מאחורי השאלה?" options={REAL_Q_OPTS} values={d.realQuestion ?? []}
            onChange={v => set('realQuestion', v)} otherKey="realQuestionOther"
            otherValue={d.realQuestionOther} onOtherChange={v => set('realQuestionOther', v)} />
          <div>
            <label style={labelStyle}>ניסוח שלי לשאלה העמוקה</label>
            <textarea value={d.realQuestionFormulation ?? ''} onChange={e => set('realQuestionFormulation', e.target.value)} style={textareaStyle(focusMap['rqf'])} {...f('rqf')} />
          </div>
        </div>
      )

      case 2: return (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {sectionTitle('שלב האבחון לפני השיחה', 'שלושת הדפוסים שעלו')}

          <div style={{ padding:14, background:'rgba(255,251,240,0.6)', borderRadius:10, border:'1px solid rgba(165,130,80,0.20)', display:'flex', flexDirection:'column', gap:12 }}>
            <p style={{ fontSize:13, fontWeight:700, color:TEXT3 }}>דפוס 1 — המשמעות ההתנהגותית</p>
            <div>
              <label style={labelStyle}>מה המשמעות ההתנהגותית שעלתה?</label>
              <textarea value={d.pattern1Behavioral ?? ''} onChange={e => set('pattern1Behavioral', e.target.value)} style={textareaStyle(focusMap['p1b'])} {...f('p1b')} />
            </div>
            <CheckGroup label="הדפוס מצביע בעיקר על:" options={PATTERN1_OPTS} values={d.pattern1Indicates ?? []}
              onChange={v => set('pattern1Indicates', v)} otherKey="p1o"
              otherValue={d.pattern1OtherText} onOtherChange={v => set('pattern1OtherText', v)} />
          </div>

          <div style={{ padding:14, background:'rgba(255,251,240,0.6)', borderRadius:10, border:'1px solid rgba(165,130,80,0.20)', display:'flex', flexDirection:'column', gap:12 }}>
            <p style={{ fontSize:13, fontWeight:700, color:TEXT3 }}>דפוס 2 — הפער המרכזי</p>
            <CheckGroup label="מה הפער המרכזי שזיהיתי?" options={PATTERN2_OPTS} values={d.pattern2Gap ?? []}
              onChange={v => set('pattern2Gap', v)} otherKey="p2o"
              otherValue={d.pattern2OtherText} onOtherChange={v => set('pattern2OtherText', v)} />
            <div>
              <label style={labelStyle}>ניסוח הדפוס בשפה אנושית</label>
              <textarea value={d.pattern2Formulation ?? ''} onChange={e => set('pattern2Formulation', e.target.value)} style={textareaStyle(focusMap['p2f'])} {...f('p2f')} />
            </div>
          </div>

          <div style={{ padding:14, background:'rgba(255,251,240,0.6)', borderRadius:10, border:'1px solid rgba(165,130,80,0.20)', display:'flex', flexDirection:'column', gap:12 }}>
            <p style={{ fontSize:13, fontWeight:700, color:TEXT3 }}>דפוס 3 — הכיוון הרחב לעומת התזמון הנוכחי</p>
            <CheckGroup label="מה היחסים?" options={PATTERN3_OPTS} values={d.pattern3Timing ?? []}
              onChange={v => set('pattern3Timing', v)} otherKey="p3o"
              otherValue={d.pattern3OtherText} onOtherChange={v => set('pattern3OtherText', v)} />
            <div>
              <label style={labelStyle}>המשמעות המעשית כרגע</label>
              <textarea value={d.pattern3Practical ?? ''} onChange={e => set('pattern3Practical', e.target.value)} style={textareaStyle(focusMap['p3p'])} {...f('p3p')} />
            </div>
          </div>
        </div>
      )

      case 3: return (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {sectionTitle('שכבות נוספות באבחון')}
          <CheckGroup label="4. מה השם המלא הוסיף לי?" options={NAME_ADDED_OPTS} values={d.nameAdded ?? []} onChange={v => set('nameAdded', v)} />
          <div>
            <label style={labelStyle}>פירוט</label>
            <textarea value={d.nameAddedDetail ?? ''} onChange={e => set('nameAddedDetail', e.target.value)} style={textareaStyle(focusMap['nad'])} {...f('nad')} />
          </div>
          <CheckGroup label="5. מה התזמון הוסיף לי?" options={TIMING_OPTS} values={d.timingAdded ?? []}
            onChange={v => set('timingAdded', v)} otherKey="tao"
            otherValue={d.timingAddedOther} onOtherChange={v => set('timingAddedOther', v)} />
          <div>
            <label style={labelStyle}>משפט תזמון ברור ללקוחה</label>
            <textarea value={d.timingSentence ?? ''} onChange={e => set('timingSentence', e.target.value)} style={textareaStyle(focusMap['ts'])} {...f('ts')} />
          </div>
        </div>
      )

      case 4: return (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {sectionTitle('בזמן המפגש')}
          <CheckGroup label="6. תגובת הלקוחה כשהצגתי את האבחון" options={REACTION_OPTS} values={d.clientReaction ?? []}
            onChange={v => set('clientReaction', v)} otherKey="cro"
            otherValue={d.clientReactionOther} onOtherChange={v => set('clientReactionOther', v)} />
          <div>
            <label style={labelStyle}>מה הרגיש הכי מדויק עבורה?</label>
            <textarea value={d.feltAccurate ?? ''} onChange={e => set('feltAccurate', e.target.value)} style={textareaStyle(focusMap['fa'])} {...f('fa')} />
          </div>
          <div>
            <label style={labelStyle}>מה לא התחבר לה?</label>
            <textarea value={d.didntConnect ?? ''} onChange={e => set('didntConnect', e.target.value)} style={textareaStyle(focusMap['dc'])} {...f('dc')} />
          </div>
          <div>
            <label style={labelStyle}>7. משפטים שפגעו בול (2-3 משפטים)</label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[0,1,2].map(i => (
                <input key={i} value={(d.hitSentences ?? ['','',''])[i]}
                  onChange={e => {
                    const arr: [string,string,string] = [...(d.hitSentences ?? ['','',''])] as [string,string,string]
                    arr[i] = e.target.value
                    set('hitSentences', arr)
                  }}
                  placeholder={`משפט ${i+1}`}
                  style={inputStyle(focusMap[`hs${i}`])} {...f(`hs${i}`)} />
              ))}
            </div>
          </div>
          <CheckGroup label="8. נושאים שחזרו שוב ושוב" options={TOPICS_OPTS} values={d.repeatingTopics ?? []}
            onChange={v => set('repeatingTopics', v)} otherKey="rto"
            otherValue={d.repeatingTopicsOther} onOtherChange={v => set('repeatingTopicsOther', v)} />
        </div>
      )

      case 5: return (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sectionTitle('אחרי המפגש')}
          {[
            { k:'whatWasAccurate' as const, label:'9. מה התברר כמדויק?' },
            { k:'whatWasInaccurate' as const, label:'10. מה לא היה מספיק מדויק?' },
            { k:'interpretedTooFast' as const, label:'11. איפה פירשתי מהר מדי?' },
            { k:'numbersVsStory' as const, label:'12. איפה המספרים תמכו בסיפור — ואיפה לא הספיקו?' },
          ].map(({ k, label }) => (
            <div key={k}>
              <label style={labelStyle}>{label}</label>
              <textarea value={(d[k] as string) ?? ''} onChange={e => set(k, e.target.value)} style={textareaStyle(focusMap[k])} {...f(k)} />
            </div>
          ))}
          <CheckGroup label="13. התובנה המרכזית שהלקוחה לקחה" options={INSIGHT_OPTS} values={d.clientMainInsight ?? []}
            onChange={v => set('clientMainInsight', v)} otherKey="cmio"
            otherValue={d.clientMainInsightOther} onOtherChange={v => set('clientMainInsightOther', v)} />
          <div>
            <label style={labelStyle}>פירוט</label>
            <textarea value={d.clientMainInsightDetail ?? ''} onChange={e => set('clientMainInsightDetail', e.target.value)} style={textareaStyle(focusMap['cmid'])} {...f('cmid')} />
          </div>
        </div>
      )

      case 6: return (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sectionTitle('דירוג איכות האבחון')}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <StarRating label="14. רמת התאמה בין האבחון לבין מה שעלה בפגישה" value={d.rating14 ?? 0} onChange={v => set('rating14', v)} />
            <StarRating label="15. רמת דיוק של דפוס 1" value={d.rating15 ?? 0} onChange={v => set('rating15', v)} />
            <StarRating label="16. רמת דיוק של דפוס 2" value={d.rating16 ?? 0} onChange={v => set('rating16', v)} />
            <StarRating label="17. רמת דיוק של דפוס 3" value={d.rating17 ?? 0} onChange={v => set('rating17', v)} />
            <StarRating label="18. רמת דיוק של התזמון" value={d.rating18 ?? 0} onChange={v => set('rating18', v)} />
            <StarRating label="19. רמת הערך המעשי שניתן ללקוחה" value={d.rating19 ?? 0} onChange={v => set('rating19', v)} />
          </div>

          <div style={{ marginTop:8 }}>
            {sectionTitle('סיווג סוגי התאמה')}
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              <YesNo label="התאמה ישירה — הלקוחה זיהתה מיד ואמרה שזה מדויק" value={d.matchDirect ?? null} onChange={v => set('matchDirect', v)} />
              <YesNo label="התאמה רגשית — המשפט נגע בה רגשית" value={d.matchEmotional ?? null} onChange={v => set('matchEmotional', v)} />
              <YesNo label="התאמה התנהגותית — הדפוס הופיע בדוגמאות מהחיים" value={d.matchBehavioral ?? null} onChange={v => set('matchBehavioral', v)} />
              <YesNo label="התאמה עסקית / מעשית — עזר להבין החלטה או כיוון" value={d.matchPractical ?? null} onChange={v => set('matchPractical', v)} />
              <YesNo label="התאמה בדיעבד — קיבל משמעות תוך כדי השיחה" value={d.matchRetroactive ?? null} onChange={v => set('matchRetroactive', v)} />
              <YesNo label="התאמה חלקית — כיוון נכון, ניסוח דרש תיקון" value={d.matchPartial ?? null} onChange={v => set('matchPartial', v)} />
              <YesNo label="אי התאמה — האבחון לא התחבר, לא יצר ערך" value={d.matchNone ?? null} onChange={v => set('matchNone', v)} />
            </div>
          </div>

          <div style={{ marginTop:8, padding:16, background:'rgba(185,158,118,0.12)', borderRadius:10, border:'1px solid rgba(165,130,80,0.25)' }}>
            <label style={{ ...labelStyle, fontSize:14, color:'#5c4a32' }}>✦ שאלת הזהב — איזה כלל חדש למדתי היום על דפוסים?</label>
            <textarea value={d.goldenConclusion ?? ''} onChange={e => set('goldenConclusion', e.target.value)}
              style={{ ...textareaStyle(focusMap['gc']), minHeight:100 }} {...f('gc')} />
          </div>
        </div>
      )

      default: return null
    }
  }

  const btnBase: React.CSSProperties = {
    padding:'10px 24px', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer',
    border:'none', transition:'opacity 0.15s',
  }
  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background:'linear-gradient(135deg,#8a6030 0%,#b07840 50%,#8a6030 100%)',
    color:'rgba(255,251,243,0.96)',
    boxShadow:'0 2px 12px rgba(130,90,40,0.22)',
  }
  const btnSecondary: React.CSSProperties = {
    ...btnBase, background:'rgba(165,130,80,0.12)',
    color:'#5c4a32', border:'1px solid rgba(165,130,80,0.28)',
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 16px' }}>
      {/* Step indicator */}
      <div style={{ display:'flex', gap:4, marginBottom:24, justifyContent:'center' }}>
        {STEPS.map((s,i) => (
          <button key={i} type="button" onClick={() => setStep(i)} style={{
            padding:'4px 10px', borderRadius:20, fontSize:11, cursor:'pointer',
            background: i === step ? 'linear-gradient(135deg,#8a6030,#b07840)' : 'rgba(165,130,80,0.12)',
            color: i === step ? '#fff' : TEXT4,
            border: i < step ? '1px solid rgba(130,90,40,0.3)' : '1px solid transparent',
            fontWeight: i === step ? 700 : 500,
          }}>{s}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{ background:CARD, border:`1px solid ${CARD_B}`, borderRadius:20, padding:28, boxShadow:CARD_S }}>
        <form onSubmit={e => e.preventDefault()} dir="rtl" lang="he">
          {stepContent()}
        </form>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20 }}>
        <button style={btnSecondary} onClick={onCancel}>ביטול</button>
        <div style={{ display:'flex', gap:10 }}>
          {step > 0 && <button style={btnSecondary} onClick={() => setStep(s => s - 1)}>← הקודם</button>}
          {step < STEPS.length - 1
            ? <button style={btnPrimary} onClick={() => setStep(s => s + 1)}>הבא →</button>
            : <button style={btnPrimary} onClick={handleSave}>שמור מפגש ✓</button>
          }
        </div>
      </div>
    </div>
  )
}
