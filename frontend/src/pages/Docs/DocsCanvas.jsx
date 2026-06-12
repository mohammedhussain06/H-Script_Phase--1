import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * DocsCanvas — Three.js floating H-Script keyword nodes
 * Renders a knowledge-graph of H-Script keywords in the sidebar header.
 */
const KEYWORDS = [
  'let_him_cook', 'boliye', 'agar', 'pov', 'squad',
  'wapas_karo', 'baar_baar', 'no_cap', 'fraud', 'buzurg',
]

export default function DocsCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth
    const H = el.clientHeight

    const scene    = new THREE.Scene()
    const camera   = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Nodes
    const nodes = []
    const NODE_COUNT = 22
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed })
    const nodeGeo = new THREE.SphereGeometry(2, 8, 8)

    for (let i = 0; i < NODE_COUNT; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone())
      mesh.position.set(
        (Math.random() - 0.5) * W * 0.9,
        (Math.random() - 0.5) * H * 0.9,
        0
      )
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      }
      scene.add(mesh)
      nodes.push(mesh)
    }

    // Edge material
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x5b21b6,
      transparent: true,
      opacity: 0.3,
    })
    const edges = []

    function rebuildEdges() {
      edges.forEach(e => scene.remove(e))
      edges.length = 0
      const DIST = 90
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

      const hw = W / 2
      const hh = H / 2

      nodes.forEach((n, i) => {
        n.position.x += n.userData.vx
        n.position.y += n.userData.vy

        if (n.position.x >  hw) n.userData.vx *= -1
        if (n.position.x < -hw) n.userData.vx *= -1
        if (n.position.y >  hh) n.userData.vy *= -1
        if (n.position.y < -hh) n.userData.vy *= -1

        const pulse = 1 + 0.3 * Math.sin(frame * 0.025 + n.userData.phase)
        n.scale.setScalar(pulse)

        // Alternate colours
        const hue = (i * 25 + frame * 0.2) % 360
        n.material.color.setHSL(hue / 360, 0.7, 0.65)
      })

      if (frame % 3 === 0) rebuildEdges()
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
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}
