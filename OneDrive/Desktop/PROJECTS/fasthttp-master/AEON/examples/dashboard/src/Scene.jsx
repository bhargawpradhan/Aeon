import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Float, Sparkles, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, Scanline } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── TRUE 3D EVOLVING TOPOLOGY MESH ──────────────────────────────────────────
// InstancedMesh sphere nodes + live BufferGeometry edges = real network topology
const TopoMesh = ({ nodeCount = 90, zMin = -30, zMax = -90, rotSpeed = 0.02, color = '#00f0ff', overload, evolve, nodeSize = 0.55 }) => {
  const instanceRef = useRef()
  const edgesRef = useRef()
  const groupRef = useRef()

  // Base positions for each node (static seed, animated each frame)
  const bases = useMemo(() => {
    const a = new Float32Array(nodeCount * 3)
    for (let i = 0; i < nodeCount; i++) {
      a[i * 3] = (Math.random() - 0.5) * 220
      a[i * 3 + 1] = (Math.random() - 0.5) * 150
      a[i * 3 + 2] = zMin + Math.random() * (zMax - zMin) * -1
    }
    return a
  }, [nodeCount, zMin, zMax])

  // Unique per-node oscillation parameters
  const phases = useMemo(() => Array.from({ length: nodeCount }, () => ({
    px: Math.random() * Math.PI * 2,
    py: Math.random() * Math.PI * 2,
    pz: Math.random() * Math.PI * 2,
    fx: 0.12 + Math.random() * 0.5,
    fy: 0.10 + Math.random() * 0.4,
    fz: 0.06 + Math.random() * 0.25,
  })), [nodeCount])

  // Build edge index pairs (nearby nodes)
  const edgeIdx = useMemo(() => {
    const idx = []
    for (let i = 0; i < nodeCount; i++) {
      let cnt = 0
      for (let j = i + 1; j < nodeCount && cnt < 4; j++) {
        const dx = bases[i * 3] - bases[j * 3], dy = bases[i * 3 + 1] - bases[j * 3 + 1], dz = bases[i * 3 + 2] - bases[j * 3 + 2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 55) { idx.push(i, j); cnt++ }
      }
    }
    return idx
  }, [bases, nodeCount])

  // Edge geometry (positions filled each frame)
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeIdx.length * 3), 3))
    return g
  }, [edgeIdx])

  // Materials — brighter for visibility
  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [color])

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [color])

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(nodeSize, 8, 8), [nodeSize])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const livePos = useMemo(() => new Float32Array(nodeCount * 3), [nodeCount])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const spd = evolve ? 2.8 : 0.45
    const c = overload ? new THREE.Color('#ff0044') : new THREE.Color(color)

    // Update live node positions and write instance matrices
    const inst = instanceRef.current
    if (inst) {
      inst.material.color.copy(c)
      for (let i = 0; i < nodeCount; i++) {
        const p = phases[i]
        const lx = bases[i * 3] + Math.sin(t * spd * p.fx + p.px) * 13
        const ly = bases[i * 3 + 1] + Math.cos(t * spd * p.fy + p.py) * 10
        const lz = bases[i * 3 + 2] + Math.sin(t * spd * p.fz + p.pz) * 6
        livePos[i * 3] = lx; livePos[i * 3 + 1] = ly; livePos[i * 3 + 2] = lz

        // Scale pulse per node for "breathing" look
        const pulse = nodeSize * (0.6 + Math.sin(t * 2.5 + i * 0.7) * 0.4)
        dummy.position.set(lx, ly, lz)
        dummy.scale.setScalar(pulse)
        dummy.updateMatrix()
        inst.setMatrixAt(i, dummy.matrix)
      }
      inst.instanceMatrix.needsUpdate = true
    }

    // Update edges to track live node positions
    const edgeMesh = edgesRef.current
    if (edgeMesh) {
      edgeMesh.material.color.copy(c)
      edgeMesh.material.opacity = 0.25 + Math.sin(t * 0.5) * 0.1
      const arr = edgeMesh.geometry.attributes.position.array
      for (let k = 0; k < edgeIdx.length; k++) {
        const ni = edgeIdx[k]
        arr[k * 3] = livePos[ni * 3]; arr[k * 3 + 1] = livePos[ni * 3 + 1]; arr[k * 3 + 2] = livePos[ni * 3 + 2]
      }
      edgeMesh.geometry.attributes.position.needsUpdate = true
    }

    // Whole group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += rotSpeed * 0.008
      groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.09
      const breathe = evolve ? 1 + Math.sin(t * 1.4) * 0.10 : 1 + Math.sin(t * 0.28) * 0.03
      groupRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Instanced glowing sphere nodes */}
      <instancedMesh ref={instanceRef} args={[nodeGeo, nodeMat, nodeCount]} frustumCulled={false} />
      {/* Live-tracked connection edges */}
      <lineSegments ref={edgesRef} geometry={edgeGeo} material={edgeMat} frustumCulled={false} />
    </group>
  )
}

// ─── ATMOSPHERIC TOPOLOGY WRAPPER ─────────────────────────────────────────────
// 3 independent TopoMesh layers at different depths / rotations / colors
const AtmosphericTopology = ({ evolve, overload, blackout }) => {
  if (blackout) return null
  const col = overload ? '#ace0e9ff' : '#00f0ff'
  const col2 = overload ? '#7db7dbff' : '#7700ff'

  return (
    <>
      {/* Layer A — front dense cyan topology (primary, most visible) */}
      <TopoMesh nodeCount={100} zMin={-15} zMax={-50} rotSpeed={0.025} color={col} overload={overload} evolve={evolve} nodeSize={0.65} />

      {/* Layer B — mid purple sparser topology (counter-rotates) */}
      <TopoMesh nodeCount={70} zMin={-50} zMax={-90} rotSpeed={-0.018} color={col2} overload={overload} evolve={evolve} nodeSize={0.45} />

      {/* Layer C — deep wide slow topology (parallax background) */}
      <TopoMesh nodeCount={120} zMin={-90} zMax={-160} rotSpeed={0.008} color={col} overload={overload} evolve={evolve} nodeSize={0.28} />

      {/* Three atmospheric orbit rings at different depths */}
      <mesh rotation={[0.1, 0, 0]} position={[0, 0, -40]}>
        <torusGeometry args={[70, 0.22, 8, 240]} />
        <meshBasicMaterial color={col} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]} position={[0, 0, -80]}>
        <torusGeometry args={[115, 0.14, 8, 240]} />
        <meshBasicMaterial color={col2} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 6, -Math.PI / 4, Math.PI / 8]} position={[0, 0, -130]}>
        <torusGeometry args={[175, 0.08, 8, 240]} />
        <meshBasicMaterial color={col} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Ambient sparkle field in the topology zone */}
      <Sparkles
        count={evolve ? 3000 : 900}
        scale={[240, 170, 140]}
        size={evolve ? 5 : 2.2}
        color={col}
        speed={evolve ? 5 : 0.8}
        opacity={0.55}
        position={[0, 0, -50]}
      />
    </>
  )
}

// ─── SIGNAL STREAKS ───────────────────────────────────────────────────────────
const SignalStreaks = () => {
  const streaks = useMemo(() => Array.from({ length: 20 }).map(() => ({
    start: new THREE.Vector3((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 100, -40),
    end: new THREE.Vector3((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 100, -15),
    speed: 0.15 + Math.random() * 0.3,
    offset: Math.random() * 10,
    color: Math.random() > 0.5 ? '#00f0ff' : '#7700ff'
  })), [])

  const refs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    streaks.forEach((s, i) => {
      const mesh = refs.current[i]
      if (mesh) {
        const progress = (t * s.speed + s.offset) % 1
        mesh.position.lerpVectors(s.start, s.end, progress)
        mesh.material.opacity = Math.sin(progress * Math.PI) * 0.9
      }
    })
  })

  return (
    <group>
      {streaks.map((s, i) => (
        <mesh key={i} ref={el => refs.current[i] = el}>
          <sphereGeometry args={[0.25, 6, 6]} />
          <meshBasicMaterial color={s.color} transparent blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}

// ─── FRACTAL CORE ─────────────────────────────────────────────────────────────
const FractalCore = React.forwardRef(({
  scale = 1, health, anomaly, depth = 0, temp = 0, role, spatial,
  shattered, position = [0, 0, 0], isRoot = false, isGhost = false
}, ref) => {
  const meshRef = useRef()
  const shellRef = useRef()
  const ringRef = useRef()
  const innerRef = useRef()
  const localRef = useRef()

  const color = useMemo(() => {
    if (isGhost) return '#003344'
    if (role === 'LEADER') return '#608fa9ff'
    if (shattered) return '#99c1d0ff'
    if (role === 'DEAD') return '#222222'
    if (health === 'CRITICAL') return '#83c7deff'
    if (temp > 80) return '#ff4400'
    return '#00f0ff'
  }, [role, health, temp, shattered, isGhost])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const target = (ref && ref.current) || localRef.current
    if (!target) return

    if (meshRef.current) {
      meshRef.current.rotation.y = t * (isGhost ? 0.04 : 0.4 + depth * 0.15)
      meshRef.current.rotation.z = t * 0.25
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.25
      shellRef.current.rotation.x = t * 0.18
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 1.8
      innerRef.current.rotation.z = -t * 1.3
    }
    if (ringRef.current && isRoot && !isGhost) {
      ringRef.current.rotation.x = t * 0.4
      ringRef.current.rotation.y = -t * 0.6
    }
    const pulse = 1 + Math.sin(t * (role === 'LEADER' ? 4 : 2)) * (role === 'LEADER' ? 0.12 : 0.04)
    target.scale.set(scale * pulse, scale * pulse, scale * pulse)
  })

  const subPositions = [
    [1.8, 1.0, 0], [-1.8, -1.0, 0], [0, 1.8, 1.0], [0, -1.8, -1.0]
  ]
  const subCores = []
  if (depth > 0 && role !== 'DEAD' && !isGhost) {
    const cnt = role === 'LEADER' ? 4 : 2
    for (let i = 0; i < cnt; i++) {
      const p = subPositions[i % subPositions.length].map(v => v * scale * 1.2)
      subCores.push(
        <FractalCore key={i} position={p} scale={scale * 0.4}
          health={health} depth={depth - 1} temp={temp} role={role} shattered={shattered} />
      )
    }
  }

  return (
    <group ref={ref || localRef} position={position}>
      {isRoot && !isGhost && (
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[scale * 1.12, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} wireframe transparent opacity={0.12} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[scale, 0]} />
        <meshStandardMaterial
          color={role === 'DEAD' ? '#222222' : color}
          emissive={role === 'DEAD' ? '#000000' : color}
          emissiveIntensity={isGhost ? 0.6 : (role === 'DEAD' ? 0 : (role === 'LEADER' ? 8 : 5))}
          wireframe={!shattered}
          transparent opacity={isGhost ? 0.08 : (role === 'DEAD' ? 0.15 : 0.9)}
        />
        {!isGhost && !shattered && (
          <mesh ref={innerRef}>
            <octahedronGeometry args={[scale * 0.42, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} />
          </mesh>
        )}
      </mesh>
      {isRoot && !isGhost && role !== 'DEAD' && (
        <mesh ref={ringRef}>
          <torusGeometry args={[scale * 2.0, 0.04, 16, 180]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} transparent opacity={0.35} />
        </mesh>
      )}
      {isRoot && !isGhost && role !== 'DEAD' && (
        <pointLight color={color} distance={scale * 12} intensity={6} />
      )}
      {subCores}
    </group>
  )
})

// ─── CENTRAL CIRCULAR MESH ────────────────────────────────────────────────────
const CentralMesh = ({ accentColor = '#00f0ff', evolve, overload }) => {
  const sphereRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const spd = evolve ? 2.0 : 0.6

    // Slowly rotating wireframe sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * spd * 0.3
      sphereRef.current.rotation.x = t * spd * 0.15
      const breathe = 1 + Math.sin(t * 1.2) * 0.05
      sphereRef.current.scale.setScalar(breathe)
    }

    // Three orbiting rings at different axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * spd * 0.4
      ring1Ref.current.rotation.z = t * spd * 0.2
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * spd * 0.35
      ring2Ref.current.rotation.x = Math.PI / 3 + t * spd * 0.15
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * spd * 0.25
      ring3Ref.current.rotation.y = -Math.PI / 4 + t * spd * 0.1
    }

    // Inner glow pulse
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.08 + Math.sin(t * 1.5) * 0.04
      const gPulse = 0.95 + Math.sin(t * 2) * 0.05
      glowRef.current.scale.setScalar(gPulse)
    }
  })

  const col = overload ? '#fdfefeff' : accentColor

  return (
    <group position={[0, 0, 0]}>
      {/* Wireframe icosphere — the main circular mesh */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[18, 2]} />
        <meshStandardMaterial
          color={col} emissive={col} emissiveIntensity={2}
          wireframe transparent opacity={0.25}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      {/* Inner soft glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial
          color={col} transparent opacity={0.08}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      {/* Orbit ring 1 — equatorial */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[24, 0.08, 16, 200]} />
        <meshBasicMaterial color={col} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Orbit ring 2 — tilted */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[28, 0.06, 16, 200]} />
        <meshBasicMaterial color={overload ? '#ff2200' : '#7700ff'} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Orbit ring 3 — counter-tilted */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[32, 0.04, 16, 200]} />
        <meshBasicMaterial color={col} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Subtle point light from center */}
      <pointLight color={col} distance={60} intensity={4} />
    </group>
  )
}

// ─── PACKET FLOW ──────────────────────────────────────────────────────────────
const PacketFlow = ({ from, to, color, speed = 1.2 }) => {
  const ref = useRef()
  const f = useMemo(() => new THREE.Vector3(...from), [from.join(',')])
  const t = useMemo(() => new THREE.Vector3(...to), [to.join(',')])
  useFrame(({ clock }) => {
    if (ref.current) {
      const progress = (clock.getElapsedTime() * speed) % 1
      ref.current.position.lerpVectors(f, t, progress)
      ref.current.material.opacity = Math.sin(progress * Math.PI) * 0.9
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 8, 8]} />
      <meshBasicMaterial color={color} transparent blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

// ─── MAIN SCENE CONTENT ───────────────────────────────────────────────────────
const SceneContent = ({
  health = 'HEALTHY', anomaly = 0, pulse = 0, depth = 0, temp = 0,
  cluster = [], spatial = {}, shattered = false, rps = 0,
  overload_state = false, evolve_state = false, blackout_state = false
}) => {
  const nodesRef = useRef([])
  const fluxRingRef = useRef()

  const ghostCores = useMemo(() => Array.from({ length: 10 }, () => ({
    pos: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, -60 - Math.random() * 40],
    scale: 3 + Math.random() * 6
  })), [])

  const clusterPositions = useMemo(() => [
    [0, 8, 0], [14, 3, 0], [8.5, -10, 0], [-8.5, -10, 0], [-14, 3, 0]
  ], [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (fluxRingRef.current) {
      fluxRingRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1
      fluxRingRef.current.rotation.y = t * 0.08
    }
  })

  const accentColor = overload_state ? '#8bb8d9ff' : '#a9e5e9ff'

  return (
    <>
      <fog attach="fog" args={['#000010', 180, blackout_state ? 250 : 800]} />
      <ambientLight intensity={blackout_state ? 0.1 : 1.5} color="#88bed5ff" />
      <pointLight position={[0, 0, 80]} intensity={overload_state ? 80 : 30} color={accentColor} />
      <pointLight position={[0, 50, 0]} intensity={20} color="#7700ff" />

      {/* Far star field */}
      <Stars radius={400} depth={200} count={blackout_state ? 2000 : 60000} factor={20} saturation={1} fade speed={6} />

      {/* ★ THE EVOLVING ATMOSPHERIC TOPOLOGY — primary visible background ★ */}
      <AtmosphericTopology evolve={evolve_state} overload={overload_state} blackout={blackout_state} />

      {/* Moving signal streaks in mid-ground */}
      <SignalStreaks />

      {/* Giant ambient flux ring */}
      <mesh ref={fluxRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <torusGeometry args={[45, 0.08, 12, 250]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Ghost cores deep in background */}
      {ghostCores.map((g, i) => (
        <FractalCore key={`ghost-${i}`} position={g.pos} scale={g.scale}
          isGhost role="DEAD" isRoot />
      ))}
      {/* ★ Central Circular Mesh — rotating wireframe sphere + orbit rings */}
      <CentralMesh accentColor={accentColor} evolve={evolve_state} overload={overload_state} />


      {/* Cluster satellite nodes */}
      {cluster.slice(0, 5).map((node, i) => (
        <group key={node.id || i} position={clusterPositions[i] || [0, 0, 0]}>
          <FractalCore
            ref={el => nodesRef.current[i] = el}
            scale={node.role === 'LEADER' ? 3 : 2}
            health={health} anomaly={anomaly} depth={1}
            temp={temp} role={node.role} shattered={shattered} isRoot
          />
          {/* Packet flows between cluster and center */}
          {node.role !== 'DEAD' && (
            <>
              <PacketFlow from={clusterPositions[i]} to={[0, 0, 0]} color={accentColor} speed={1.0 + rps / 80} />
              <PacketFlow from={[0, 0, 0]} to={clusterPositions[i]} color="#ffaa00" speed={1.5 + rps / 80} />
            </>
          )}
        </group>
      ))}

      {/* 3D Evolving Label */}
      <Float speed={3} rotationIntensity={0.3} floatIntensity={1.0}>
        <Text
          position={[0, -22, 5]}
          fontSize={1.8}
          color={accentColor}
          maxWidth={50}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000022"
        >
          {evolve_state
            ? 'EVOLUTIONARY SHIFT AUTHORIZED'
            : overload_state
              ? '⚠ SYSTEM OVERLOAD INITIATED'
              : blackout_state
                ? '[ BLACKOUT ACTIVE ]'
                : ''}
          <meshStandardMaterial emissive={accentColor} emissiveIntensity={25} toneMapped={false} />
        </Text>
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={shattered || overload_state ? 35 : 3.5} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur intensity={overload_state ? 18 : 8} radius={1.0} />
        <Vignette eskil={false} offset={0.1} darkness={blackout_state ? 3.0 : 1.0} />
        <ChromaticAberration offset={shattered || overload_state ? [0.04, 0.04] : [0.006, 0.006]} />
        {(shattered || overload_state) && <Noise opacity={0.6} />}
        {(temp > 90 || overload_state) && <Scanline opacity={0.5} />}
      </EffectComposer>
    </>
  )
}

// ─── CANVAS WRAPPER ───────────────────────────────────────────────────────────
const Scene = (props) => (
  <Canvas
    camera={{ position: [0, 8, 55], fov: 65 }}
    style={{ background: 'transparent', width: '100%', height: '100%' }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <SceneContent {...props} />
  </Canvas>
)

export default Scene
