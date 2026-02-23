import React, { useState, useRef, useEffect } from 'react'

const Terminal = ({ isConnected = false }) => {
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
            if (!cmd) return
            setHistory(prev => [...prev, `> ${cmd}`])
            setInput('')

            if (cmd.toUpperCase() === 'HELP') {
                setHistory(prev => [...prev,
                    ' • PING [host]     — ICMP connectivity test (e.g., PING google.com)',
                    ' • IPCONFIG [/ALL] — Show TCP/IP network configuration',
                    ' • TRACERT [host]  — Trace path packets take to destination',
                    ' • NETSTAT         — Show active TCP/IP connections/ports',
                    ' • NSLOOKUP [dom]  — Query DNS for IP mapping',
                    ' • ARP -A          — Show IP to MAC address mappings',
                    ' • PATHPING [host] — Latency/loss stats (Ping + Tracert)',
                    ' • NETSH           — Configure network interfaces/settings',
                    ' • HELP            — Display this intel log',
                    '═══════════════════════════════════',
                `MODE: ${isConnected ? 'LIVE_BACKEND' : 'OFFLINE (AWAITING_HANDSHAKE)'}`
                ])
                return
            }

            if (!isConnected) {
                setHistory(prev => [...prev, '! ERROR: SIGNAL_OFFLINE — Handshake required'])
                return
            }

            try {
                const res = await fetch(`http://localhost:54321/omega?cmd=${encodeURIComponent(cmd)}`, {
                    method: 'POST'
                })
                if (!res.ok) throw new Error('BACKEND_ERROR')
                const data = await res.json()
                const responseLines = data.result.split('\n')
                setHistory(prev => [...prev, ...responseLines.map(line => `< ${line}`)])
            } catch (err) {
                setHistory(prev => [...prev, '! ERROR: LINK_SEVERED — Check backend status'])
            }
        }
    }

    return (
        <div className="omega-terminal">
            <div className="terminal-log" ref={scrollRef}>
                {history.map((line, i) => (
                    <div key={i} className={`terminal-line ${line.startsWith('>') ? 'cmd' : line.startsWith('<') ? 'resp' : ''}`}>{line}</div>
                ))}
            </div>
            <div className="terminal-input-row">
                <span style={{ color: isConnected ? '#00f0ff' : '#ffaa00' }}>$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={executeCommand}
                    placeholder={isConnected ? 'ENTER_PROTOCOL_CMD...' : 'OFFLINE_MODE — ENTER_CMD...'}
                    autoFocus
                />
            </div>
        </div>
    )
}

export default Terminal
