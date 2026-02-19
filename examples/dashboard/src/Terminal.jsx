import React, { useState, useRef, useEffect } from 'react'

const Terminal = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState([
        'SOVEREIGN_TERMINAL_V11 initialized...',
        'Awaiting protocol handshake...',
        'Type HELP for available protocols'
    ])
    const scrollRef = useRef()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    const executeCommand = async (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim()
            setHistory(prev => [...prev, `> ${cmd}`])
            setInput('')

            if (cmd.toUpperCase() === 'HELP') {
                setHistory(prev => [...prev,
                    'AVAILABLE PROTOCOLS:',
                    ' - PROTOCOL_OMEGA: Trigger Reality Shatter / Max Replication',
                    ' - RESTORE_REALITY: Stabilize Cluster / Reset Shatter',
                    ' - PURGE_NODES: Sever all cluster connections',
                    ' - RESYNC: Re-establish cluster heartbeat',
                    ' - HELP: Display this intel log'
                ])
                return
            }

            try {
                const res = await fetch(`http://localhost:8888/omega?cmd=${encodeURIComponent(cmd)}`, {
                    method: 'POST'
                })
                const data = await res.json()
                setHistory(prev => [...prev, `< RESPONSE: ${data.result}`])
            } catch (err) {
                setHistory(prev => [...prev, '! ERROR: SIGNAL_INTERRUPTED'])
            }
        }
    }

    return (
        <div className="omega-terminal">
            <div className="terminal-log" ref={scrollRef}>
                {history.map((line, i) => (
                    <div key={i} className="terminal-line">{line}</div>
                ))}
            </div>
            <div className="terminal-input-row">
                <span>$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={executeCommand}
                    placeholder="ENTER_PROTOCOL_CMD..."
                    autoFocus
                />
            </div>
        </div>
    )
}

export default Terminal
