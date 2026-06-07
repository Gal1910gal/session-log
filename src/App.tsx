import { useState, useEffect } from 'react'
import './index.css'
import { type SessionEntry, loadSessions, saveSession, deleteSession } from './types'
import Library from './components/Library'
import SessionForm from './components/SessionForm'

type View = 'library' | 'form'

export default function App() {
  const [view, setView]       = useState<View>('library')
  const [sessions, setSessions] = useState<SessionEntry[]>([])
  const [editing, setEditing]  = useState<SessionEntry | undefined>()

  useEffect(() => { setSessions(loadSessions()) }, [])

  const handleSave = (s: SessionEntry) => {
    saveSession(s)
    setSessions(loadSessions())
    setView('library')
    setEditing(undefined)
  }

  const handleDelete = (id: string) => {
    deleteSession(id)
    setSessions(loadSessions())
  }

  const handleEdit = (s: SessionEntry) => {
    setEditing(s)
    setView('form')
  }

  const handleNew = () => {
    setEditing(undefined)
    setView('form')
  }

  if (view === 'form') {
    return (
      <SessionForm
        initial={editing}
        onSave={handleSave}
        onCancel={() => { setView('library'); setEditing(undefined) }}
      />
    )
  }

  return (
    <Library
      sessions={sessions}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
      onImport={(imported) => setSessions(imported)}
    />
  )
}
