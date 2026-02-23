import React, { useState, useEffect, useRef, memo } from 'react'
import Scene from './Scene'
import Terminal from './Terminal'

// Top-Level Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("AEON_CRASH:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#200', color: '#f00', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'auto' }}>
          <h1 style={{ fontSize: '2rem' }}>SYSTEM_CRASH: SINGULARITY_INVERSION</h1>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ fontSize: '0.8rem', opacity: 0.7 }}>{this.state.error?.stack}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '1rem', background: '#f00', color: '#fff', border: 'none', cursor: 'pointer' }}>REBOOT</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Memoize the Scene to prevent re-renders on every metric update or mouse move
const MemoizedScene = memo(Scene);



function App() {
  const [metrics, setMetrics] = useState({
    total_requests: 0,
    success_count: 0,
    error_count: 0,
    active_requests: 0,
    average_latency: 0,
    requests_per_sec: 0,
    uptime_seconds: 0,
    health_status: 'HEALTHY',
    cpu_pct: 12,
    memory_mb: 24.3,
    goroutines: 8,
    anomaly_score: 0,
    risk_score: 0,
    chaos_level: 0,
    signal_pulse: 0,
    fractal_depth: 2,
    dna_health: 0.85,
    generation: 1,
    system_temp: 0,
    heap_objects: 0,
    cluster: [],
    shatter_state: false,
    overload_state: false,
    evolve_state: false,
    blackout_state: false
  })

  const [isConnected, setConnected] = useState(false)
  const eventSourceRef = useRef(null)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let retryTimeout;
    const connect = () => {
      if (eventSourceRef.current) eventSourceRef.current.close();

      const es = new EventSource('http://localhost:54321/metrics');
      eventSourceRef.current = es;

      let lastUpdate = 0;
      es.onopen = () => setConnected(true);
      es.onmessage = (e) => {
        const now = Date.now();
        if (now - lastUpdate < 100) return; // Throttle to 10fps for UI stability
        lastUpdate = now;
        try {
          const data = JSON.parse(e.data);
          setMetrics(prev => ({
            ...prev,
            ...data,
            cluster: Array.isArray(data.cluster) ? data.cluster : prev.cluster,
            spatial: prev.spatial
          }));
        } catch (err) {
          console.error("PARSE_ERR", err);
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        retryTimeout = setTimeout(connect, 2000);
      };
    };

    connect();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      clearTimeout(retryTimeout);
    };
  }, [isConnected]);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1

    if (Math.abs(x - lastPos.current.x) > 0.05 || Math.abs(y - lastPos.current.y) > 0.05) {
      lastPos.current = { x, y }
      if (isConnected) {
        fetch(`http://localhost:54321/spatial?x=${x.toFixed(2)}&y=${y.toFixed(2)}`, { method: 'POST' }).catch(() => { })
      }
    }
  }

  // Protocol Actions
  const triggerChaos = (val) => {
    fetch(`http://localhost:54321/orchestrate?chaos=${val}`, { method: 'POST' }).catch(() => { })
  }

  const mutateDNA = () => {
    fetch(`http://localhost:54321/dna?gene=REPLICATION&val=${Math.random()}`, { method: 'POST' }).catch(() => { })
  }

  const controlNode = (id, action) => {
    // Robust ID handling (fallback to 0 if something is wrong)
    const nodeId = (id !== undefined && id !== null) ? id : 0;
    console.log(`[AEON_CLUSTER] Triggering ${action} on Node_${nodeId}`);
    fetch(`http://localhost:54321/cluster/${action}?id=${nodeId}`, { method: 'POST' })
      .then(r => r.json())
      .then(d => console.log(`[AEON_CLUSTER] Success:`, d))
      .catch(e => console.error(`[AEON_CLUSTER] Error:`, e));
  }

  return (
    <ErrorBoundary>
      <div
        className={`App cyberpunk-theme ${metrics.shatter_state ? 'shatter-mode' : ''}`}
        onMouseMove={handleMouseMove}
        style={{
          background: 'transparent',
          color: '#00f0ff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="scanline" style={{ background: 'none', zIndex: 3 }} />

        <div style={{ position: 'fixed', top: 5, right: 5, fontSize: '0.6rem', opacity: 0.3, zIndex: 1000 }}>
          AEON_NODE_READY: {isConnected ? 'STABLE' : 'SYNCING'}
        </div>

        <div className="dashboard-container" style={{ position: 'fixed', zIndex: 2, pointerEvents: 'none', inset: 0, padding: '2rem' }}>
          <header style={{ pointerEvents: 'auto', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '4px', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>
              AEON
              <span className="fast-tag" style={{ fontSize: '0.8rem', color: '#ffaa00', marginLeft: '1rem', verticalAlign: 'middle', background: 'rgba(255,170,0,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #ffaa00', boxShadow: '0 0 10px #ffaa00' }}>FAST_v13</span>
            </h1>
            <p className="evolution-label" style={{
              margin: '0.5rem 0 0 0',
              fontSize: '1rem',
              color: '#00f0ff',
              letterSpacing: '2px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textShadow: '0 0 10px #00f0ff',
              animation: 'pulse-text 3s infinite ease-in-out'
            }}>

            </p>
            <div className={`status-badge-mini ${isConnected ? '' : 'offline'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div className="pulse" style={{ width: 10, height: 10, background: isConnected ? '#00f0ff' : '#f00', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                {isConnected
                  ? `NODE_0${metrics.cluster.filter(n => (n.role || '') !== 'DEAD').length}_ACTIVE / 0${metrics.cluster.filter(n => (n.role || '') === 'DEAD').length}_OFFLINE`
                  : 'LINK_INTERRUPTED'}
              </span>
            </div>
          </header>

          <div className="side-by-side-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', pointerEvents: 'auto', marginBottom: '1.5rem' }}>
            {/* SYSTEM_FLUX */}
            <div className="glass-card holographic-accent-cyan">
              <h3>SYSTEM_FLUX</h3>
              <div className="metrics-grid">
                <div className="metric-box">
                  <label>THROUGHPUT</label>
                  <div className="value cyan-glow">{metrics.requests_per_sec?.toFixed(1)} <span style={{ fontSize: '0.6rem' }}>RPS</span></div>
                </div>
                <div className="metric-box">
                  <label>SYNC_LATENCY</label>
                  <div className="value orange-glow">{metrics.average_latency?.toFixed(1)} <span style={{ fontSize: '0.6rem' }}>ms</span></div>
                </div>
                <div className="metric-box large">
                  <label>AEON_HEALTH</label>
                  <div className="value" style={{ color: metrics.health_status === 'HEALTHY' ? '#00f0ff' : '#f04' }}>{metrics.health_status}</div>
                  <div className="progress-bar" style={{ height: 4, background: 'rgba(0,240,255,0.1)', marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, metrics.cpu_pct || 0)}%`, height: '100%', background: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card gold-border">
              <h3 className="gold-glow">DIGITAL_GENOME</h3>
              <div className="metrics-grid">
                <div className="metric-box">
                  <label>TOTAL_GENETICS</label>
                  <div className="value gold-glow">{metrics.generation}</div>
                </div>
                <div className="metric-box">
                  <label>FITNESS_INDEX</label>
                  <div className="value gold-glow">{((metrics.dna_health || 0) * 100).toFixed(1)}%</div>
                </div>
                <div className="dna-sequence" style={{ height: 35, display: 'flex', gap: 3, alignItems: 'flex-end', padding: '0 5px' }}>
                  {/* Living DNA: Time-Harmonic Sine Wave Fluctuation */}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const time = Date.now() / 1000;
                    const val = Math.sin(time * 2 + i * 0.5) * 30 + 50;
                    return (
                      <div
                        key={i}
                        className="dna-bar-pulse"
                        style={{
                          flex: 1,
                          height: `${val}%`,
                          background: metrics.system_temp > 85 ? '#f04' : (i % 2 === 0 ? '#ffaa00' : '#00f0ff'),
                          boxShadow: `0 0 10px ${metrics.system_temp > 85 ? '#f04' : (i % 2 === 0 ? '#ffaa00' : '#00f0ff')}`,
                          opacity: 0.6 + Math.sin(time + i) * 0.2,
                          borderRadius: '1px'
                        }}
                      />
                    );
                  })}
                </div>
                <button onClick={mutateDNA} className="action-btn small gold" style={{ marginTop: '0.5rem' }}>MUTATE_SEQUENCE</button>
              </div>
            </div>

            {/* CHAOS_ENGINE */}
            <div className="glass-card holographic-accent-red">
              <h3 style={{ color: '#f04' }}>CHAOS_ENGINE</h3>
              <div className="metrics-grid" style={{ gap: '1rem' }}>
                <div className="metric-box">
                  <label>CHAOS_LEVEL</label>
                  <div className="value" style={{ color: '#f04' }}>{metrics.chaos_level.toFixed(0)}%</div>
                </div>
                <div className="metric-box">
                  <label>ANOMALY_CORE</label>
                  <div className="value" style={{ color: '#f04' }}>{metrics.anomaly_score?.toFixed(2)}</div>
                </div>
                <div className="metric-box large" style={{ padding: '0.5rem 0' }}>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={metrics.chaos_level}
                    onChange={(e) => triggerChaos(e.target.value)}
                    style={{ width: '100%', accentColor: '#f04' }}
                  />
                </div>
              </div>
            </div>

            {/* KERNEL_STATS */}
            <div className="glass-card holographic-accent-cyan">
              <h3>KERNEL_INSIGHT</h3>
              <div className="metrics-grid">
                <div className="metric-box">
                  <label>GOROUTINES</label>
                  <div className="value">{metrics.goroutines}</div>
                </div>
                <div className="metric-box">
                  <label>MEMORY_USAGE</label>
                  <div className="value">{metrics.memory_mb?.toFixed(1)} MB</div>
                </div>
                <div className="metric-box large">
                  <label>HEAP_OBJECTS</label>
                  <div className="value" style={{ fontSize: '1rem' }}>{metrics.heap_objects?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="side-by-side-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', pointerEvents: 'auto' }}>
            {/* CLUSTER_CONSTELLATION (Holographic Array) */}
            <div className="glass-card" style={{ borderTop: '2px solid #00f0ff', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>NODE_CONSTELLATION</h3>
                <div style={{ fontSize: '0.6rem', color: '#00f0ff', letterSpacing: '2px' }}>[ MULTI_CORE_ARRAY ]</div>
              </div>
              <div className="node-grid-expanded" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem' }}>
                {(metrics.cluster || []).slice(0, 5).map((node, i) => (
                  <div key={node.id ?? i} className={`holographic-node-card ${(node.role || 'FOLLOWER').toLowerCase()}`}>
                    <div className="holographic-header">
                      <span className="node-label">NODE_0{i}</span>
                      <div className="ping-container">
                        <div className={`ping-circle ${(node.role || 'FOLLOWER').toLowerCase()}`} />
                        <div className={`status-dot ${(node.role || 'FOLLOWER').toLowerCase()}`} />
                      </div>
                    </div>
                    <div className="node-type" style={{ fontSize: '0.6rem' }}>{node.role || 'FOLLOWER'}</div>
                    <div className="node-telemetry">
                      <div className="telemetry-bar">
                        <div className="telemetry-fill" style={{ width: (node.role || '') === 'DEAD' ? '0%' : '100%', background: (node.role || '') === 'LEADER' ? '#ffaa00' : '#00f0ff' }} />
                      </div>
                    </div>
                    <div className="node-actions-holographic">
                      {(node.role || '') === 'DEAD' ? (
                        <button onClick={() => controlNode(node.id, 'recover')} className="holo-btn cyan">RESYNC</button>
                      ) : (
                        <button onClick={() => controlNode(node.id, 'fail')} className="holo-btn red">SEVER</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OMEGA_COMMAND */}
            <div className="glass-card">
              <h3>OMEGA_PROTOCOL_COMMAND</h3>
              <Terminal isConnected={isConnected} />
            </div>
          </div>
        </div>

        {/* 3D_LAYER (Background) - Always visible behind UI */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: 'transparent',
          pointerEvents: 'none'
        }}>
          <MemoizedScene
            health={metrics.health_status || 'HEALTHY'}
            anomaly={metrics.anomaly_score || 0}
            pulse={metrics.signal_pulse || 0}
            depth={metrics.fractal_depth || 0}
            temp={metrics.system_temp || 0}
            cluster={metrics.cluster}
            shattered={metrics.shatter_state}
            rps={metrics.requests_per_sec}
            overload_state={metrics.overload_state}
            evolve_state={metrics.evolve_state}
            blackout_state={metrics.blackout_state}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
