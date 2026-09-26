import React, { useState } from 'react'
import { sendChat } from '../services/chatApi'

const initialMessage = {
  role: 'assistant',
  content: "Hi! I'm AI Buddy 🤖 Ask me anything, and you can always say 'explain it in the simplest form'."
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([initialMessage])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const data = await sendChat(nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: data.message }])
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: `Sorry, I couldn't answer that. ${error.message}` }
      ])
    } finally {
      setSending(false)
    }
  }

  const newConversation = () => {
    setMessages([initialMessage])
    setInput('')
  }

  return (
    <>
      {!open && (
        <button className="ai-buddy-launcher" onClick={() => setOpen(true)} aria-label="Open AI Buddy">
          <span>🤖</span>
          <span>AI Buddy</span>
        </button>
      )}

      {open && (
        <section className="ai-buddy" aria-label="AI Buddy chatbot">
          <div className="ai-buddy-header">
            <div>
              <strong>🤖 AI Buddy</strong>
              <small>Ask anything</small>
            </div>
            <div className="ai-buddy-actions">
              <button onClick={newConversation} title="New conversation">↻</button>
              <button onClick={() => setOpen(false)} title="Close">×</button>
            </div>
          </div>

          <div className="ai-buddy-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`ai-buddy-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {sending && <div className="ai-buddy-message assistant">Thinking…</div>}
          </div>

          <form className="ai-buddy-form" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask AI Buddy anything..."
              disabled={sending}
              aria-label="Message AI Buddy"
            />
            <button type="submit" disabled={sending || !input.trim()} aria-label="Send message">➤</button>
          </form>
        </section>
      )}
    </>
  )
}

export default Chatbot
