"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CheckCircle2, QrCode, Sparkles, ShieldCheck, Zap, RefreshCw, X, User, Edit3, MapPin, Ticket } from "lucide-react";

export default function Eventify3DScene() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("VIP Pass");
  const [scanState, setScanState] = useState("idle"); // 'idle' | 'scanning' | 'verified'
  const [scanProgress, setScanProgress] = useState(0);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Live Customization State
  const [passData, setPassData] = useState({
    name: "Alex Johnson",
    eventTitle: "TECH SUMMIT 2026",
    venue: "Karachi Convention Center",
    seat: "SECTION A • ROW 01 • SEAT 14",
    tier: "VIP ALL-ACCESS PASS",
    id: "EVT-2026-99482-PKR"
  });

  // References for Three.js control outside render loop
  const passMeshRef = useRef(null);
  const passGroupRef = useRef(null);
  const laserMeshRef = useRef(null);
  const targetRotationYRef = useRef(0);
  const speedMultiplierRef = useRef(1);
  const isScanningRef = useRef(false);

  // Helper: Create 3D Ticket Pass Canvas Texture dynamically from current passData
  const createPassTexture = (isBack = false, currentData = passData) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");

    if (!isBack) {
      // --- FRONT SIDE (Customizable Ticket Pass) ---
      const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
      grad.addColorStop(0, "#0b132b");
      grad.addColorStop(0.5, "#1c2541");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1440);

      // Cyber Grid Pattern
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.lineWidth = 2;
      for (let x = 0; x < 1024; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1440);
        ctx.stroke();
      }
      for (let y = 0; y < 1440; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Top Holographic Security Header
      const headerGrad = ctx.createLinearGradient(0, 0, 1024, 0);
      headerGrad.addColorStop(0, "#2563eb");
      headerGrad.addColorStop(0.5, "#06b6d4");
      headerGrad.addColorStop(1, "#10b981");
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, 1024, 110);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EVENTIFY • OFFICIAL ACCESS PASS", 512, 70);

      // Brand Logo
      ctx.fillStyle = "#38bdf8";
      ctx.font = "italic 900 68px sans-serif";
      ctx.fillText("Eventify3D", 512, 220);

      // Event Title (User Customized)
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 52px sans-serif";
      ctx.fillText(currentData.eventTitle.toUpperCase(), 512, 320);

      // Venue City / Location
      ctx.fillStyle = "#94a3b8";
      ctx.font = "700 28px sans-serif";
      ctx.fillText(currentData.venue.toUpperCase(), 512, 380);

      // Separator Bar
      const lineGrad = ctx.createLinearGradient(80, 0, 944, 0);
      lineGrad.addColorStop(0, "#2563eb");
      lineGrad.addColorStop(0.5, "#ec4899");
      lineGrad.addColorStop(1, "#10b981");
      ctx.fillStyle = lineGrad;
      ctx.fillRect(80, 440, 864, 12);

      // Attendee Info Box
      ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
      ctx.fillRect(80, 500, 864, 320);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 500, 864, 320);

      // Attendee Label & Name
      ctx.fillStyle = "#10b981";
      ctx.font = "800 28px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("ATTENDEE:", 120, 560);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 46px sans-serif";
      ctx.fillText(currentData.name, 300, 565);

      // Tier Badge
      ctx.fillStyle = "#38bdf8";
      ctx.font = "800 28px sans-serif";
      ctx.fillText("TIER:", 120, 650);

      const isVip = currentData.tier.includes("VIP");
      ctx.fillStyle = isVip ? "#f59e0b" : "#3b82f6";
      ctx.font = "900 42px sans-serif";
      ctx.fillText(currentData.tier, 230, 655);

      // Seat Details
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 28px sans-serif";
      ctx.fillText(currentData.seat, 120, 750);

      // QR Code Graphic on Front
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(362, 880, 300, 300);
      ctx.fillStyle = "#000000";
      ctx.fillRect(382, 900, 70, 70);
      ctx.clearRect(397, 915, 40, 40);
      ctx.fillRect(407, 925, 20, 20);

      ctx.fillRect(572, 900, 70, 70);
      ctx.clearRect(587, 915, 40, 40);
      ctx.fillRect(597, 925, 20, 20);

      ctx.fillRect(382, 1090, 70, 70);
      ctx.clearRect(397, 1105, 40, 40);
      ctx.fillRect(407, 1115, 20, 20);

      for (let qx = 0; qx < 10; qx++) {
        for (let qy = 0; qy < 10; qy++) {
          if (Math.random() > 0.45) {
            ctx.fillRect(470 + qx * 11, 920 + qy * 11, 9, 9);
          }
        }
      }

      // Barcode Rows
      ctx.fillStyle = "#ffffff";
      const barY = 1240;
      for (let b = 0; b < 45; b++) {
        const barW = Math.random() > 0.5 ? 12 : 6;
        ctx.fillRect(100 + b * 18, barY, barW, 60);
      }

      ctx.fillStyle = "#64748b";
      ctx.font = "600 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`PASS ID: ${currentData.id}`, 512, 1360);
    } else {
      // --- BACK SIDE (ENHANCED QR CODE & VENUE DETAILS) ---
      const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.5, "#1e293b");
      grad.addColorStop(1, "#090d16");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1440);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 52px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SMART CHECK-IN QR PASS", 512, 140);

      // High-res QR code on Back
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(312, 200, 400, 400);
      ctx.fillStyle = "#000000";
      ctx.fillRect(332, 220, 90, 90);
      ctx.clearRect(352, 240, 50, 50);
      ctx.fillRect(367, 255, 20, 20);

      ctx.fillRect(602, 220, 90, 90);
      ctx.clearRect(622, 240, 50, 50);
      ctx.fillRect(637, 255, 20, 20);

      ctx.fillRect(332, 490, 90, 90);
      ctx.clearRect(352, 510, 50, 50);
      ctx.fillRect(367, 525, 20, 20);

      for (let qx = 0; qx < 14; qx++) {
        for (let qy = 0; qy < 14; qy++) {
          if ((qx + qy) % 3 === 0 || Math.random() > 0.5) {
            ctx.fillRect(440 + qx * 12, 240 + qy * 12, 10, 10);
          }
        }
      }

      ctx.fillStyle = "#10b981";
      ctx.font = "700 28px monospace";
      ctx.fillText("SCAN WITH EVENTIFY DESK SCANNER", 512, 650);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 30px sans-serif";
      const rules = [
        "• Instant Gate Verification Enabled",
        "• Encrypted 256-bit Dynamic Hash",
        "• Includes Lounge & Workshop Access",
        "• Support: support@eventify.pk"
      ];
      rules.forEach((rule, idx) => {
        ctx.fillText(rule, 512, 730 + idx * 65);
      });

      // Verified Stamp Ring
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(512, 1150, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      ctx.font = "900 40px sans-serif";
      ctx.fillText("VERIFIED PASS", 512, 1140);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "700 26px sans-serif";
      ctx.fillText("2026 OFFICIAL", 512, 1180);
    }

    return new THREE.CanvasTexture(canvas);
  };

  // Switch Active Tab 3D Actions
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "VIP Pass") {
      targetRotationYRef.current = 0; // Rotate pass to front view
      speedMultiplierRef.current = 1;
      if (laserMeshRef.current) laserMeshRef.current.visible = false;
    } else if (tabName === "QR Check-in") {
      targetRotationYRef.current = Math.PI; // Rotate pass 180° to QR Code back view
      speedMultiplierRef.current = 1;
      if (laserMeshRef.current) laserMeshRef.current.visible = true;
    } else if (tabName === "Live Orbit") {
      speedMultiplierRef.current = 4.5; // High speed stage lighting orbit
      if (laserMeshRef.current) laserMeshRef.current.visible = false;
    }
  };

  // Trigger 3D Pass Scan Test Simulation
  const handleTestScan = () => {
    if (scanState === "scanning") return;

    setScanState("scanning");
    setScanProgress(0);
    setActiveTab("QR Check-in");
    targetRotationYRef.current = Math.PI; // Turn to QR Code
    isScanningRef.current = true;

    if (laserMeshRef.current) laserMeshRef.current.visible = true;

    // Animate scanning progress over 1.8 seconds
    let startTime = Date.now();
    const duration = 1800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(Math.round((elapsed / duration) * 100), 100);
      setScanProgress(progressPercent);

      if (progressPercent >= 100) {
        clearInterval(interval);
        setScanState("verified");
        setShowVerifiedModal(true);
        isScanningRef.current = false;
        setTimeout(() => {
          setScanState("idle");
        }, 5000);
      }
    }, 40);
  };

  // Update 3D Pass Texture when user changes live inputs
  useEffect(() => {
    if (!passMeshRef.current) return;
    const frontTex = createPassTexture(false, passData);
    const backTex = createPassTexture(true, passData);
    passMeshRef.current.material[4].map = frontTex;
    passMeshRef.current.material[4].map.needsUpdate = true;
    passMeshRef.current.material[5].map = backTex;
    passMeshRef.current.material[5].map.needsUpdate = true;
  }, [passData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting System (Stage & Festival Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0x2563eb, 9, 22, Math.PI / 4, 0.5);
    mainSpot.position.set(5, 6, 6);
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const cyanRim = new THREE.PointLight(0x06b6d4, 7, 16);
    cyanRim.position.set(-6, -4, 4);
    scene.add(cyanRim);

    const greenAccent = new THREE.PointLight(0x10b981, 6, 14);
    greenAccent.position.set(6, -5, -3);
    scene.add(greenAccent);

    const goldFill = new THREE.PointLight(0xf59e0b, 5, 12);
    goldFill.position.set(0, 4, -4);
    scene.add(goldFill);

    // 4. Construct 3D VIP Ticket Pass Mesh Materials
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.9,
    });

    const frontTexture = createPassTexture(false, passData);
    const backTexture = createPassTexture(true, passData);

    const passGeometry = new THREE.BoxGeometry(2.4, 3.36, 0.08);

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.15,
      metalness: 0.2,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.15,
      metalness: 0.2,
    });

    const materials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];

    const passMesh = new THREE.Mesh(passGeometry, materials);
    passMesh.castShadow = true;
    passMesh.receiveShadow = true;
    passMeshRef.current = passMesh;

    // Laser Scanning Line Mesh (Green Glowing Beam)
    const laserGeo = new THREE.BoxGeometry(2.5, 0.05, 0.12);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.9,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.set(0, 0, 0.06);
    laserMesh.visible = false;
    laserMeshRef.current = laserMesh;
    passMesh.add(laserMesh);

    // Ticket Pass Parent Group
    const passGroup = new THREE.Group();
    passGroup.add(passMesh);
    passGroupRef.current = passGroup;
    scene.add(passGroup);

    // 5. Orbiting 3D Stage & Event Rings
    const ringGroup = new THREE.Group();

    const ring1Geo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(3.1, 0.025, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ringGroup.add(ring3);

    scene.add(ringGroup);

    // 6. Floating Event Confetti & Star Field
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x10b981),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0x8b5cf6),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Mouse & Touch Interaction Physics (Drag to Rotate 360°)
    let targetRotationX = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const rect = container.getBoundingClientRect();
      mouseX = ((clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / height) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        const deltaY = clientY - previousMouseY;

        targetRotationYRef.current += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        previousMouseX = clientX;
        previousMouseY = clientY;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      previousMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);
    container.addEventListener("touchmove", handlePointerMove);
    container.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("touchend", handlePointerUp);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const mult = speedMultiplierRef.current;

      // Continuous Idle Rotation & Floating Motion
      if (!isDragging && speedMultiplierRef.current === 1) {
        targetRotationX = Math.sin(elapsedTime * 0.8) * 0.15 + mouseY * 0.3;
      } else if (speedMultiplierRef.current > 1) {
        targetRotationYRef.current += 0.03; // Fast spin on Live Orbit
      }

      // Laser scanner animation
      if (laserMesh.visible || isScanningRef.current) {
        laserMesh.visible = true;
        laserMesh.position.y = Math.sin(elapsedTime * 6) * 1.4;
      }

      // Smooth Damped Rotation Interpolation
      passGroup.rotation.y += (targetRotationYRef.current - passGroup.rotation.y) * 0.08;
      passGroup.rotation.x += (targetRotationX - passGroup.rotation.x) * 0.08;
      passGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Orbiting Stage Rings
      ring1.rotation.z = elapsedTime * 0.4 * mult;
      ring1.rotation.y = elapsedTime * 0.2 * mult;
      ring2.rotation.z = -elapsedTime * 0.3 * mult;
      ring2.rotation.x = elapsedTime * 0.35 * mult;
      ring3.rotation.z = elapsedTime * 0.25 * mult;

      // Rotate Particles Constellation
      particleSystem.rotation.y = elapsedTime * 0.05 * mult;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Dynamic SpotLight tracking
      mainSpot.position.x = Math.cos(elapsedTime * 0.6) * 6;
      mainSpot.position.z = Math.sin(elapsedTime * 0.6) * 6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[560px] sm:h-[640px] rounded-3xl overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-[0_25px_70px_rgba(37,99,235,0.25)] flex flex-col justify-between p-5 sm:p-6 select-none group transition-all duration-300">
      
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Overlay Controls */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-bold shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Interactive 3D Ticket Pass Engine</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Customizer Toggle Button */}
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="flex items-center gap-1.5 bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30 border border-brand-blue/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
          >
            <Edit3 size={14} />
            <span>Customize Card</span>
          </button>

          {/* Interactive Tab Switchers */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
            {["VIP Pass", "QR Check-in", "Live Orbit"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-brand-blue text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Rendering Box */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
        title="Click & Drag to rotate 3D Pass in 360°"
      />

      {/* Live Card Customizer Panel Drawer */}
      {showCustomizer && (
        <div className="absolute top-20 left-6 z-30 max-w-sm w-full bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700 p-5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-brand-blue" /> Live 3D Pass Customizer
            </h4>
            <button onClick={() => setShowCustomizer(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Attendee Name</label>
              <input
                type="text"
                value={passData.name}
                onChange={(e) => setPassData({ ...passData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Event Title</label>
              <input
                type="text"
                value={passData.eventTitle}
                onChange={(e) => setPassData({ ...passData, eventTitle: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Venue Location</label>
              <input
                type="text"
                value={passData.venue}
                onChange={(e) => setPassData({ ...passData, venue: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Ticket Tier</label>
              <select
                value={passData.tier}
                onChange={(e) => setPassData({ ...passData, tier: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-blue"
              >
                <option value="VIP ALL-ACCESS PASS">VIP ALL-ACCESS PASS</option>
                <option value="STUDENT PASS">STUDENT PASS</option>
                <option value="EXHIBITOR PASS">EXHIBITOR PASS</option>
                <option value="KEYNOTE DELEGATE">KEYNOTE DELEGATE</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Live Scanning Progress Overlay Banner */}
      {scanState === "scanning" && (
        <div className="absolute top-20 inset-x-6 z-20 bg-slate-900/95 border border-emerald-500/50 backdrop-blur-xl p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                <QrCode size={22} />
              </div>
              <div>
                <p className="text-white font-black text-sm">3D Gate Scanner Active</p>
                <p className="text-emerald-400 text-xs font-semibold">Reading 256-Bit Encrypted Pass QR Code...</p>
              </div>
            </div>
            <span className="text-xl font-black text-emerald-400 font-mono">{scanProgress}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Verified Gate Pass Modal Toast */}
      {showVerifiedModal && (
        <div className="absolute inset-x-4 top-20 z-30 bg-slate-900/95 border-2 border-emerald-400 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/40">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ACCESS GRANTED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{passData.id}</span>
                </div>
                <h4 className="text-white font-black text-lg mt-0.5">{passData.name} • {passData.tier}</h4>
                <p className="text-slate-300 text-xs font-medium">{passData.venue} • {passData.seat}</p>
              </div>
            </div>
            <button
              onClick={() => setShowVerifiedModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Interactive Callout */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl transition-colors duration-300">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-blue bg-brand-blue/20 px-2.5 py-0.5 rounded-full">
              3D Live Pass
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Drag or Move Mouse to Inspect</span>
          </div>
          <p className="text-slate-900 dark:text-white font-black text-base sm:text-lg mt-1 tracking-tight">
            Next-Gen Digital Event Access &amp; Smart Pass
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Pass Security</p>
            <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">256-Bit Encrypted</p>
          </div>
          <button
            onClick={handleTestScan}
            disabled={scanState === "scanning"}
            className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {scanState === "scanning" ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Scanning 3D Pass...
              </>
            ) : (
              <>
                <Zap size={15} />
                Test 3D Pass Scanning
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
