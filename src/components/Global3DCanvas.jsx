"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Global3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Ambient Lighting & Dynamic Spotlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x2563eb, 4, 30);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x10b981, 4, 30);
    light2.position.set(-10, -10, 5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0x8b5cf6, 3, 25);
    light3.position.set(0, 15, -5);
    scene.add(light3);

    // 4. Floating 3D Geometry Cluster (Toruses, Spheres, Icosahedrons, Cubes)
    const shapesGroup = new THREE.Group();
    const shapes = [];

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.55,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.5,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.45,
      }),
    ];

    const geometries = [
      new THREE.TorusGeometry(0.8, 0.25, 16, 50),
      new THREE.IcosahedronGeometry(0.7, 1),
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.TorusKnotGeometry(0.5, 0.15, 64, 16),
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
    ];

    // Instantiate 28 floating 3D elements spread across background space
    for (let i = 0; i < 28; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.x = (Math.random() - 0.5) * 36;
      mesh.position.y = (Math.random() - 0.5) * 50;
      mesh.position.z = (Math.random() - 0.5) * 20 - 5;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.8 + 0.4;
      mesh.scale.set(scale, scale, scale);

      shapes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: Math.random() * 0.002 + 0.001,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      });

      shapesGroup.add(mesh);
    }
    scene.add(shapesGroup);

    // 5. Ambient 3D Particle Field (2000+ Floating Dust & Light Particles)
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x10b981),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0xf59e0b),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Scroll & Mouse Tracking Interaction
    let targetScrollY = 0;
    let currentScrollY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 8. Render Loop
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth scroll lerp
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;
      const scrollFactor = currentScrollY * 0.012;

      // Camera smoothly follows scroll position down the page!
      camera.position.y = -scrollFactor * 0.8;
      camera.position.x = Math.sin(time * 0.2) * 0.5 + targetMouseX * 0.8;
      camera.rotation.z = Math.sin(time * 0.1) * 0.02;

      // Animate floating shapes
      shapes.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y =
          item.initialY + Math.sin(time * 1.5 + item.floatOffset) * 0.4;
      });

      // Slowly rotate particle field
      particles.rotation.y = time * 0.02;
      particles.rotation.x = Math.sin(time * 0.01) * 0.05;

      // Move point lights smoothly
      light1.position.x = Math.sin(time * 0.5) * 12;
      light1.position.y = Math.cos(time * 0.3) * 12 - scrollFactor * 0.8;
      light2.position.x = -Math.sin(time * 0.4) * 12;
      light2.position.y = -Math.cos(time * 0.5) * 12 - scrollFactor * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80 dark:opacity-90"
    />
  );
}
