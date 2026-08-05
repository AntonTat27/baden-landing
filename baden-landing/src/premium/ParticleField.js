import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

// Lightweight WebGL layer for the hero: slowly-rotating wireframe polyhedra
// plus a few floating glass panes, lit in gold + pine over a transparent
// canvas (the graded photo shows through). Reacts to the pointer
// (parallax) and to scroll (gentle camera dolly). Fully torn down on unmount;
// skipped entirely under prefers-reduced-motion.
export default function ParticleField({ className = '' }) {
  const mountRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return; // WebGL unavailable — hero still works without it
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // Wireframe polyhedra for explicit 3D depth
    const shards = new THREE.Group();
    const shardDefs = [
      { geo: new THREE.IcosahedronGeometry(3.4, 0), color: '#c99a4a', pos: [-9, 3, -4] },
      { geo: new THREE.OctahedronGeometry(2.4, 0), color: '#6fae8c', pos: [10, -3, -2] },
      { geo: new THREE.DodecahedronGeometry(1.8, 0), color: '#2f6b4f', pos: [6, 5, -8] },
      { geo: new THREE.TetrahedronGeometry(2.0, 0), color: '#b8863a', pos: [-8, -5, -6] },
    ];
    const meshes = shardDefs.map((d) => {
      const edges = new THREE.EdgesGeometry(d.geo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: new THREE.Color(d.color), transparent: true, opacity: 0.5 })
      );
      line.position.set(...d.pos);
      shards.add(line);
      return line;
    });
    scene.add(shards);

    // Floating glass panes — solid, lit surfaces (not just wireframe) so the
    // scene reads as glossy/dimensional rather than purely linear. Physical
    // material with transmission gives a frosted-glass refraction; kept
    // sparse (3 panes) and slow so it stays ambient, not busy.
    const glassGroup = new THREE.Group();
    const glassDefs = [
      { w: 5.2, h: 3.2, color: '#c99a4a', pos: [-7, -2, -10], rot: [0.3, 0.5, -0.1] },
      { w: 4.2, h: 5.6, color: '#6fae8c', pos: [9, 4, -13], rot: [-0.2, -0.6, 0.15] },
      { w: 3.4, h: 3.4, color: '#f2ecdf', pos: [1, -6, -9], rot: [0.15, 0.2, 0.3] },
    ];
    const glassMeshes = glassDefs.map((d) => {
      const geoPane = new THREE.PlaneGeometry(d.w, d.h);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(d.color),
        transparent: true,
        opacity: 0.16,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.85,
        thickness: 1.2,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geoPane, mat);
      mesh.position.set(...d.pos);
      mesh.rotation.set(...d.rot);
      glassGroup.add(mesh);
      return mesh;
    });
    scene.add(glassGroup);

    // Rim lighting to catch the glass edges — warm key + cool fill, matching
    // the amber/aqua accent pair used across the site.
    const keyLight = new THREE.PointLight(0xe3b667, 6, 60);
    keyLight.position.set(-8, 6, 6);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xc97a52, 4, 60);
    fillLight.position.set(10, -4, 4);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    // Interaction state
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    const onVis = () => {
      running = !document.hidden;
      if (running) {
        clock.start();
        loop();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      shards.rotation.y = t * 0.05 + pointer.x * 0.4;
      meshes.forEach((m, i) => {
        m.rotation.x = t * (0.15 + i * 0.04);
        m.rotation.y = t * (0.12 + i * 0.05);
      });

      // Glass panes drift slowly on their own axes and bob gently — reads as
      // suspended, weightless architecture rather than spinning geometry.
      glassMeshes.forEach((m, i) => {
        m.rotation.z = Math.sin(t * 0.12 + i) * 0.15 + glassDefs[i].rot[2];
        m.position.y = glassDefs[i].pos[1] + Math.sin(t * 0.18 + i * 1.7) * 0.6;
      });
      keyLight.position.x = -8 + Math.sin(t * 0.1) * 3;
      fillLight.position.x = 10 + Math.cos(t * 0.09) * 3;

      // Gentle scroll dolly + drift
      camera.position.z = 18 + Math.min(scrollY, 900) * 0.006;
      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (-pointer.y * 1.0 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      shardDefs.forEach((d) => d.geo.dispose());
      glassMeshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduce]);

  return <div ref={mountRef} className={className} aria-hidden />;
}
