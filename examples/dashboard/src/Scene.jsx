import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls, Line, Float, Sparkles, Torus, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, Scanline } from '@react-three/postprocessing'
import * as THREE from 'three'

const BASE_POSITIONS = [
  [0, 8, 0], [7, 3, 0], [4.5, -6, 0], [-4.5, -6, 0], [-7, 3, 0],
  [0, 0, 10], [0, 0, -10], [10, 0, 0], [-10, 0, 0]
]

// Deep Background Topology Structures
const NeuralLattice = () => {
  const points = useMemo(() => {
    const p = []
    for (let i = 0; i < 50; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 100 - 50
      ))
    }
    return p
  }, [])

  const lines = useMemo(() => {
    const l = []
    for (let i = 0; i < points.length; i++) {
      let connections = 0
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 30 && connections < 3) {
          l.push([points[i], points[j]])
          connections++
        }
      }
    }
    return l
  }, [points])

  const group = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.015
      group.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
  })

  return (
    <group ref={group}>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#00f0ff" lineWidth={0.2} transparent opacity={0.15} />
      ))}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

const SignalStreaks = () => {
  const group = useRef()
  const streaks = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      start: new THREE.Vector3((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, -80),
      end: new THREE.Vector3((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, -80),
      speed: 0.1 + Math.random() * 0.2,
      offset: Math.random() * 100
    }))
  }, [])

  const refs = useRef([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    streaks.forEach((s, i) => {
      const mesh = refs.current[i]
      if (mesh) {
        const progress = (t * s.speed * 2.5 + s.offset) % 1 // Much faster
        mesh.position.lerpVectors(s.start, s.end, progress)
        mesh.material.opacity = Math.sin(progress * Math.PI) * 0.9
        mesh.material.emissiveIntensity = 30
      }
    })
  })

  return (
    <group ref={group}>
      {streaks.map((s, i) => (
        <mesh key={i} ref={el => refs.current[i] = el}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={10} transparent />
        </mesh>
      ))}
    </group>
  )
}

const EnergyArc = ({ startPosRef, endPos, color }) => {
  const lineRef = useRef()
  const points = useMemo(() => [new THREE.Vector3(), new THREE.Vector3(...endPos)], [endPos])
  const particles = useRef([])

  useEffect(() => {
    particles.current = Array.from({ length: 5 }).map(() => ({
      pos: new THREE.Vector3(),
      offset: Math.random()
    }))
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (lineRef.current && startPosRef.current) {
      lineRef.current.setPoints([startPosRef.current, endPos])
      lineRef.current.material.dashOffset = -t * 1.5
      lineRef.current.material.opacity = 0.1 + Math.sin(t * 2) * 0.05
    }
  })

  return (
    <group>
      <Line
        ref={lineRef}
        points={[[0, 0, 0], [0, 0, 0]]}
        color={color}
        lineWidth={0.8}
        dashed
        dashScale={6}
        dashSize={0.25}
        gapSize={0.4}
        transparent
        depthWrite={false}
      />
      {particles.current.map((p, i) => (
        <FlowParticle key={i} startPosRef={startPosRef} endPos={endPos} color={color} offset={p.offset} />
      ))}
    </group>
  )
}

const FlowParticle = ({ startPosRef, endPos, color, offset }) => {
  const meshRef = useRef()
  const targetEnd = useMemo(() => new THREE.Vector3(...endPos), [endPos])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current && startPosRef.current) {
      const progress = (t * 1.5 + offset) % 1 // Hyper-fast flow
      meshRef.current.position.lerpVectors(startPosRef.current, targetEnd, progress)
      const pulse = Math.sin(progress * Math.PI)
      meshRef.current.scale.setScalar(pulse * 1.0)
      meshRef.current.material.emissiveIntensity = pulse * 60
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.2, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={20} transparent opacity={0.8} />
    </mesh>
  )
}

const FractalCore = React.forwardRef(({ scale, health, anomaly, depth, temp, role, spatial, shattered, position = [0, 0, 0], isRoot = false, isGhost = false }, ref) => {
  const meshRef = useRef()
  const shellRef = useRef()
  const ringRef1 = useRef()
  const ringRef2 = useRef()
  const innerMesh = useRef()
  const localRef = useRef()
  const lightRef = useRef()

  const color = useMemo(() => {
    if (isGhost) return "#004455"
    if (role === 'LEADER') return "#ffaa00"
    if (shattered) return "#ff0044"
    if (role === 'DEAD') return "#333333"
    if (health === 'CRITICAL') return "#ff0044"
    if (temp > 80) return "#ff4400"
    return "#00f0ff"
  }, [role, health, temp, shattered, isGhost])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const target = (ref && ref.current) || localRef.current
    if (target) {
      // Base rotation
      if (meshRef.current) {
        meshRef.current.rotation.y = t * (isGhost ? 0.05 : 0.5 + depth * 0.2)
        meshRef.current.rotation.z = t * (isGhost ? 0.02 : 0.3)
      }

      if (shellRef.current) {
        shellRef.current.rotation.y = -t * 0.3
        shellRef.current.rotation.x = t * 0.2
      }

      if (innerMesh.current) {
        innerMesh.current.rotation.x = -t * 2
        innerMesh.current.rotation.z = -t * 1.5
      }

      // Orbital Rings (Only for root cores)
      if (isRoot && !isGhost) {
        if (ringRef1.current) {
          ringRef1.current.rotation.x = t * 0.5
          ringRef1.current.rotation.y = t * 0.2
        }
        if (ringRef2.current) {
          ringRef2.current.rotation.y = -t * 0.8
          ringRef2.current.rotation.z = t * 0.4
        }
      }

      const pulse = 1 + (role === 'LEADER' ? Math.sin(t * 5) * 0.15 : Math.sin(t * 2) * 0.05)
      target.scale.set(scale * pulse, scale * pulse, scale * pulse)
      if (lightRef.current) lightRef.current.intensity = pulse * 10
    }
  })

  // Multi-Core Expansion - Enhanced with more sub-cores and interconnects
  const subCores = []
  const subPositions = [
    [1.8, 1.0, 0], [-1.8, -1.0, 0], [0, 1.8, 1.0], [0, -1.8, -1.0],
    [1.0, 0, 1.8], [-1.0, 0, -1.8], [0.8, -1.2, 0.8], [-0.8, 1.2, -0.8]
  ]
  const maxDepth = isGhost ? 0 : (temp > 85 ? depth + 1 : depth)
  if (maxDepth > 0 && role !== 'DEAD') {
    const coreCount = role === 'LEADER' ? 8 : (health === 'CRITICAL' ? 2 : 4)
    for (let i = 0; i < coreCount; i++) {
      const subPos = subPositions[i % subPositions.length].map(v => v * scale * (1.2 + Math.sin(i * 0.5) * 0.2))
      subCores.push(
        <group key={`subgroup-${i}`}>
          {(role === 'LEADER' || i % 2 === 0) && isRoot &&
            <EnergyArc startPosRef={{ current: new THREE.Vector3(0, 0, 0) }} endPos={subPos} color={color} />
          }
          <FractalCore position={subPos} scale={scale * 0.42} health={health} anomaly={anomaly} depth={maxDepth - 1} temp={temp} role={role} spatial={spatial} shattered={shattered} />
        </group>
      )
    }
  }

  return (
    <group ref={ref || localRef} position={position}>
      {/* Central Singularity Shells (Nested) */}
      {isRoot && !isGhost && (
        <>
          <mesh ref={shellRef}>
            <icosahedronGeometry args={[scale * 1.15, 1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={4}
              wireframe
              transparent
              opacity={0.15}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[scale * 1.4, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1}
              wireframe
              transparent
              opacity={0.05}
            />
          </mesh>
        </>
      )}

      {/* Main Core Body */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[scale, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isGhost ? 0.8 : (shattered ? 60 : role === 'LEADER' ? 40 : 15)}
          wireframe={!shattered || isGhost}
          transparent
          opacity={isGhost ? 0.1 : (role === 'DEAD' ? 0.3 : 1.0)}
        />
        {!isGhost && (
          <mesh ref={innerMesh}>
            <octahedronGeometry args={[scale * 0.45, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={80} />
          </mesh>
        )}
      </mesh>

      {/* High-Fidelity Orbital Rings */}
      {isRoot && !isGhost && role !== 'DEAD' && (
        <>
          <mesh ref={ringRef1}>
            <torusGeometry args={[scale * 2.2, 0.03, 24, 200]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={12} transparent opacity={0.5} />
          </mesh>
          <mesh ref={ringRef2}>
            <torusGeometry args={[scale * 2.8, 0.015, 24, 200]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={25} transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[scale * 3.5, 0.005, 12, 180]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} transparent opacity={0.3} />
          </mesh>
          <pointLight ref={lightRef} color={color} distance={scale * 12} intensity={20} />
        </>
      )}

      {subCores}
    </group>
  )
})

const NeuralWeb = ({ cluster }) => {
  const linesRef = useRef([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const getOrbPos = (idx) => {
      const base = BASE_POSITIONS[idx] || [0, 0, 0]
      return [
        base[0] + Math.sin(t * 0.5 + idx) * 1.5,
        base[1] + Math.cos(t * 0.7 + idx) * 1.5,
        base[2] + Math.sin(t * 0.3 + idx) * 2
      ]
    }

    let lineIdx = 0
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        if (lineIdx >= 10) break
        const line = linesRef.current[lineIdx]
        if (line) {
          line.setPoints([getOrbPos(i), getOrbPos(j)])
        }
        lineIdx++
      }
    }
  })

  return (
    <group>
      {Array.from({ length: 20 }).map((_, i) => (
        <Line key={i} ref={el => linesRef.current[i] = el} points={[[0, 0, 0], [0, 0, 0]]} color="#00f0ff" lineWidth={1.2} transparent opacity={0.18} />
      ))}
    </group>
  )
}

const SceneContent = ({ health, anomaly, pulse, depth, temp, cluster = [], spatial = {}, shattered, rps }) => {
  const group = useRef()
  const nodesRef = useRef([])
  const packetsRef = useRef([])
  const loomingRef = useRef()
  const fluxRingRef = useRef()

  const leaderIdx = useMemo(() => cluster.findIndex(n => n.role === 'LEADER'), [cluster])

  // Distant Ghost Topology
  const ghostCores = useMemo(() => {
    const g = []
    for (let i = 0; i < 15; i++) {
      g.push({
        pos: [(Math.random() - 0.5) * 140, (Math.random() - 0.5) * 140, -70 - Math.random() * 50],
        scale: 4 + Math.random() * 8
      })
    }
    return g
  }, [])

  const mouse = useRef(new THREE.Vector2())

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) group.current.rotation.y = t * 0.05
    if (loomingRef.current) {
      loomingRef.current.rotation.y = -t * 0.02
      loomingRef.current.position.y = Math.sin(t * 0.2) * 5
    }
    if (fluxRingRef.current) {
      fluxRingRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1
      fluxRingRef.current.rotation.y = t * 0.1
      fluxRingRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02)
    }

    const getPos = (idx) => {
      const base = BASE_POSITIONS[idx] || [0, 0, 0]
      return new THREE.Vector3(
        base[0] + Math.sin(t * 0.5 + idx) * 1.5 + mouse.current.x * 2,
        base[1] + Math.cos(t * 0.7 + idx) * 1.5 + mouse.current.y * 2,
        base[2] + Math.sin(t * 0.3 + idx) * 2
      )
    }

    const leaderPos = leaderIdx !== -1 ? getPos(leaderIdx) : new THREE.Vector3()

    cluster.slice(0, 5).forEach((node, i) => {
      const pos = getPos(i)
      const nodeEl = nodesRef.current[i]
      if (nodeEl) nodeEl.position.copy(pos)

      if (i !== leaderIdx && node.role !== 'DEAD' && leaderIdx !== -1) {
        const p1 = packetsRef.current[i * 2]
        const p2 = packetsRef.current[i * 2 + 1]
        const speed = 1.2 + (rps / 50) // More aggressive speed
        if (p1) p1.position.lerpVectors(leaderPos, pos, (t * speed) % 1)
        if (p2) p2.position.lerpVectors(leaderPos, pos, (t * speed * 1.8) % 1)
      }
    })
  })

  return (
    <>
      <fog attach="fog" args={['#000000', 100, 500]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={30} color="#00f0ff" distance={150} />
      <pointLight position={[30, 30, 30]} intensity={10} color="#ffaa00" />
      <Stars radius={300} depth={150} count={50000} factor={16} saturation={1} fade speed={12} />
      <Sparkles count={1000} size={8} scale={[200, 200, 200]} color="#00f0ff" opacity={0.6} />

      <NeuralLattice />
      <SignalStreaks />

      {/* Looming Meta-Core (Fixed Depth) */}
      <FractalCore
        ref={loomingRef}
        position={[0, 0, -150]}
        scale={30}
        isGhost={true}
        isRoot={true}
        role="DEAD"
        spatial={spatial}
      />

      {/* Central Flux Ring */}
      <Torus ref={fluxRingRef} args={[50, 0.1, 16, 250]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={20} transparent opacity={0.2} />
      </Torus>

      <group ref={group}>
        {/* Central Singularity Core (The Sovereign Anchor) */}
        <group>
          <FractalCore
            scale={12}
            health="HEALTHY"
            temp={temp}
            role="LEADER"
            isRoot={true}
            position={[0, 0, 0]}
          />
          {/* Internal Plasma Event Horizon */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[11, 32, 32]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} wireframe transparent opacity={0.03} />
          </mesh>
          <Sparkles count={100} scale={20} size={3} color="#00f0ff" speed={1.5} />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[0, -18, 0]}
              fontSize={1.2}
              color="#00f0ff"
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tMe62o-9-Xq9eF8N9pcf_L8.woff"
              maxWidth={30}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              The 3D scene is evolving into a Multi-Core Topology
              <meshStandardMaterial emissive="#00f0ff" emissiveIntensity={5} />
            </Text>
          </Float>
        </group>

        {/* Dynamic Multi-Core Interconnects */}
        {(cluster || []).slice(0, 5).map((node, i) => (
          <EnergyArc
            key={`arc-${i}`}
            startPosRef={{ current: nodesRef.current[i]?.position || new THREE.Vector3(...BASE_POSITIONS[i]) }}
            endPos={[0, 0, 0]}
            color={node.role === 'LEADER' ? '#ffaa00' : '#00f0ff'}
          />
        ))}

        <NeuralWeb cluster={cluster} />

        {/* Active Node Cluster */}
        {(cluster || []).slice(0, 5).map((node, i) => (
          <group key={node.id || i}>
            <FractalCore
              ref={el => nodesRef.current[i] = el}
              scale={node.role === 'LEADER' ? 3.5 : 2.2}
              health={health}
              anomaly={anomaly}
              depth={depth}
              temp={temp}
              role={node.role}
              spatial={spatial}
              shattered={shattered}
              isRoot={true}
            />

            {node.role !== 'LEADER' && node.role !== 'DEAD' && leaderIdx !== -1 && (
              <group>
                <mesh ref={el => packetsRef.current[i * 2] = el}>
                  <sphereGeometry args={[0.2, 12, 12]} />
                  <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={25} />
                </mesh>
                <mesh ref={el => packetsRef.current[i * 2 + 1] = el}>
                  <sphereGeometry args={[0.16, 12, 12]} />
                  <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={25} />
                </mesh>
              </group>
            )}

            {node.role === 'LEADER' && <pointLight intensity={15} color="#ffaa00" distance={60} />}
          </group>
        ))}

        {/* Ghost Topology (Infinite Structural Depth) */}
        {ghostCores.map((g, i) => (
          <FractalCore
            key={`ghost-${i}`}
            position={g.pos}
            scale={g.scale}
            isGhost={true}
            isRoot={true}
            role="DEAD"
            spatial={spatial}
          />
        ))}
      </group>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={shattered ? 40 : 4.5} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur intensity={8} radius={1.1} />
        <Vignette eskil={false} offset={0.1} darkness={1.5} />
        <ChromaticAberration offset={shattered ? [0.04, 0.04] : [0.008, 0.008]} />
        {shattered && <Noise opacity={1.0} />}
        {temp > 90 && <Scanline opacity={0.6} />}
      </EffectComposer>
    </>
  )
}

const Scene = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 12, 60], fov: 60 }}
      style={{ background: 'transparent', width: '100vw', height: '100vh' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}

export default Scene
