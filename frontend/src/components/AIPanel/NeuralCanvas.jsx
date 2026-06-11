import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Neural network particle animation using Three.js.
 * Shows floating nodes connected by lines — pulses when AI is thinking.
 */
export default function NeuralCanvas({ isThinking }) {
  const mountRef = useRef(null)
  const thinkingRef = useRef(isThinking)

  useEffect(() => {
    thinkingRef.current = isThinking
  }, [isThinking])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth
    const H = el.clientHeight

    // Scene
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Nodes
    const NODE_COUNT = 28
    const nodes = []
    const nodePositions = []

    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa })
    const nodeGeo = new THREE.SphereGeometry(0.055, 8, 8)

    for (let i = 0; i < NODE_COUNT; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone())
      const x = (Math.random() - 0.5) * 9
      const y = (Math.random() - 0.5) * 3.5
      const z = (Math.random() - 0.5) * 2
      mesh.position.set(x, y, z)
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
        phase: Math.random() * Math.PI * 2,
      }
      scene.add(mesh)
      nodes.push(mesh)
      nodePositions.push(new THREE.Vector3(x, y, z))
    }

    // Edges between close nodes
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.25,
    })
    const edges = []

    function rebuildEdges() {
      edges.forEach(e => scene.remove(e))
      edges.length = 0
      const DIST = 3.2
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].position.distanceTo(nodes[j].position) < DIST) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position.clone(),
              nodes[j].position.clone(),
            ])
            const line = new THREE.Line(geo, edgeMat.clone())
            scene.add(line)
            edges.push(line)
          }
        }
      }
    }
    rebuildEdges()

    let frame = 0
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      frame++

      const thinking = thinkingRef.current
      const speed = thinking ? 3.5 : 1

      nodes.forEach(n => {
        n.position.x += n.userData.vx * speed
        n.position.y += n.userData.vy * speed

        // Bounce off walls
        if (Math.abs(n.position.x) > 4.5) n.userData.vx *= -1
        if (Math.abs(n.position.y) > 1.8) n.userData.vy *= -1

        // Pulse size when thinking
        const pulse = thinking
          ? 1 + 0.5 * Math.sin(frame * 0.08 + n.userData.phase)
          : 1 + 0.15 * Math.sin(frame * 0.02 + n.userData.phase)
        n.scale.setScalar(pulse)

        // Color shift when thinking
        n.material.color.setHex(thinking ? 0xf0abfc : 0xa78bfa)
      })

      // Rebuild edges every 4 frames (cheap enough)
      if (frame % 4 === 0) rebuildEdges()

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  )
}
