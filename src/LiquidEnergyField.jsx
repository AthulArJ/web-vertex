import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   LIQUID INDUSTRIAL ENERGY — 3D Living Backdrop
   
   A sophisticated 3D abstract environment combining:
   - Dark liquid titanium & graphite metal
   - Translucent architectural glass-like surfaces
   - Flowing engineered forms & aerodynamic shrouds
   - Controlled waves of vibrant electric cyan & neon orange energy
   - Cinematic volumetric rim lighting & deep obsidian darkness
   
   Zero particle swarms, zero node networks, zero constellation lines.
   Pure large-scale physical depth and architectural brand presence.
------------------------------------------------------------------ */

// Custom vertex shader with organic liquid micro-flow and surface traveling energy
const liquidVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform float uTime;
  uniform float uDeformAmp;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Subtle, heavy hydrodynamic displacement (fluid metallic undulation)
    vec3 pos = position;
    float wave1 = sin(pos.x * 0.18 + uTime * 0.45) * cos(pos.y * 0.14 + uTime * 0.35);
    float wave2 = cos(pos.z * 0.22 + uTime * 0.3) * sin(pos.x * 0.12 - uTime * 0.25);
    pos += normal * (wave1 + wave2) * uDeformAmp;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Custom fragment shader: Dark liquid metal + fresnel rim + traveling chromatic energy pulse
const liquidFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uCyanColor;
  uniform vec3 uOrangeColor;
  uniform float uPulseOffset;
  uniform float uPulseSpeed;
  uniform float uEnergyType; // 0: Cyan dominant, 1: Orange dominant, 2: Dual energy
  uniform vec3 uFogColor;
  uniform float uFogDensity;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // 1. Fresnel term for glossy liquid titanium reflectivity
    float NdotV = max(0.0, dot(normal, viewDir));
    float fresnel = pow(1.0 - NdotV, 3.2);

    // 2. Dual rim highlights (Cold electric cyan from right, molten orange from left)
    vec3 lightCyanDir = normalize(vec3(1.2, 0.8, 0.6));
    vec3 lightOrangeDir = normalize(vec3(-1.2, -0.7, 0.5));

    float rimCyan = pow(max(0.0, dot(reflect(-lightCyanDir, normal), viewDir)), 16.0) * 1.8;
    float rimOrange = pow(max(0.0, dot(reflect(-lightOrangeDir, normal), viewDir)), 14.0) * 1.5;

    // Diffuse grazing lights
    float diffCyan = max(0.0, dot(normal, lightCyanDir)) * 0.25;
    float diffOrange = max(0.0, dot(normal, lightOrangeDir)) * 0.22;

    // 3. Traveling Energy Wave (controlled chromatic flux across the metallic surface)
    float wavePhase1 = fract(vUv.x * 1.5 - uTime * uPulseSpeed + uPulseOffset);
    float energyWave1 = exp(-pow((wavePhase1 - 0.5) * 8.0, 2.0));

    float wavePhase2 = fract(vUv.y * 1.2 + uTime * (uPulseSpeed * 0.85) + uPulseOffset * 1.3);
    float energyWave2 = exp(-pow((wavePhase2 - 0.5) * 9.0, 2.0));

    // Combine energy pulses based on form assignment
    vec3 energyGlow = vec3(0.0);
    if (uEnergyType < 0.5) {
      // Cyan primary with subtle amber harmonics
      energyGlow = uCyanColor * energyWave1 * 2.2 + uOrangeColor * energyWave2 * 0.6;
    } else if (uEnergyType < 1.5) {
      // Orange primary with electric cyan highlights
      energyGlow = uOrangeColor * energyWave1 * 2.0 + uCyanColor * energyWave2 * 0.8;
    } else {
      // Dual balanced energy streams
      energyGlow = uCyanColor * energyWave1 * 1.5 + uOrangeColor * energyWave2 * 1.5;
    }

    // Add soft fresnel rim glow in accent color
    vec3 rimAccent = mix(uCyanColor * rimCyan, uOrangeColor * rimOrange, 0.5);

    // 4. Base deep graphite tone with metallic reflections
    vec3 base = uBaseColor * (0.35 + diffCyan + diffOrange);
    vec3 specularHighlights = (uCyanColor * rimCyan * 0.9) + (uOrangeColor * rimOrange * 0.8);
    
    vec3 finalColor = base + (specularHighlights * (0.4 + fresnel * 0.6)) + (energyGlow * 1.2) + (rimAccent * fresnel * 0.7);

    // 5. Exponential fog blending into deep obsidian space
    float depth = length(vViewPosition);
    float fogFactor = 1.0 - exp(-depth * depth * uFogDensity * uFogDensity);
    finalColor = mix(finalColor, uFogColor, clamp(fogFactor, 0.0, 0.96));

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export default function LiquidEnergyField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. THREE.JS SCENE SETUP
    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x030406);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(0x030406, 0.016);

    let W = window.innerWidth;
    let H = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 800);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. CINEMATIC STUDIO LIGHTING
    const ambientLight = new THREE.AmbientLight(0x090c12, 0.5);
    scene.add(ambientLight);

    // Cold Electric Cyan Key
    const cyanLight = new THREE.PointLight(0x00e5ff, 3.2, 85);
    cyanLight.position.set(28, 18, 14);
    scene.add(cyanLight);

    // Warm Molten Neon Orange Fill
    const orangeLight = new THREE.PointLight(0xff5500, 2.8, 80);
    orangeLight.position.set(-28, -16, 12);
    scene.add(orangeLight);

    // Subtle Golden Specular Fill
    const goldLight = new THREE.PointLight(0xffaa33, 1.4, 65);
    goldLight.position.set(4, 24, -8);
    scene.add(goldLight);

    // 3. UNIFORMS FOR LIQUID METAL MATERIALS
    const uniforms = {
      uTime: { value: 0 },
      uDeformAmp: { value: reduceMotion ? 0.0 : 0.28 },
      uBaseColor: { value: new THREE.Color(0x07090e) },
      uCyanColor: { value: new THREE.Color(0x00e5ff) },
      uOrangeColor: { value: new THREE.Color(0xff5500) },
      uFogColor: { value: fogColor },
      uFogDensity: { value: 0.016 },
    };

    const forms = [];

    // Helper to create liquid metal material with custom energy parameters
    const createLiquidMaterial = (energyType, pulseSpeed, pulseOffset, deformAmp = 0.28) => {
      return new THREE.ShaderMaterial({
        vertexShader: liquidVertexShader,
        fragmentShader: liquidFragmentShader,
        uniforms: {
          ...uniforms,
          uDeformAmp: { value: reduceMotion ? 0.0 : deformAmp },
          uEnergyType: { value: energyType },
          uPulseSpeed: { value: pulseSpeed },
          uPulseOffset: { value: pulseOffset },
        },
        transparent: true,
        depthWrite: true,
      });
    };

    // FORM 1: Monolithic Flowing Ribbon (Right Flank / Midground)
    // Large, sweeping liquid titanium form framed toward the right periphery
    const geomRibbon = new THREE.TorusKnotGeometry(11.5, 1.8, 140, 36, 2, 3);
    const matRibbon = createLiquidMaterial(0.0, 0.18, 0.0, 0.32);
    const meshRibbon = new THREE.Mesh(geomRibbon, matRibbon);
    meshRibbon.position.set(13, -3, -6);
    meshRibbon.rotation.set(0.4, 0.6, 0.2);
    scene.add(meshRibbon);
    forms.push({
      mesh: meshRibbon,
      rotSpeed: { x: 0.00035, y: 0.00065, z: 0.00025 },
      driftAmp: { x: 1.5, y: 1.2, z: 1.0 },
      basePos: { x: 13, y: -3, z: -6 },
    });

    // FORM 2: Translucent Architectural Glass Fin (Left Periphery)
    // Curved glass structure catching internal refractions and specular glints
    const geomGlass = new THREE.TorusKnotGeometry(13.0, 1.2, 120, 28, 1, 4);
    const matGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x040810),
      metalness: 0.08,
      roughness: 0.12,
      transmission: 0.82,
      thickness: 3.5,
      ior: 1.45,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });
    const meshGlass = new THREE.Mesh(geomGlass, matGlass);
    meshGlass.position.set(-14, 5, -8);
    meshGlass.rotation.set(-0.3, -0.5, 0.4);
    scene.add(meshGlass);
    forms.push({
      mesh: meshGlass,
      rotSpeed: { x: -0.0003, y: 0.0005, z: -0.0002 },
      driftAmp: { x: 1.4, y: 1.5, z: 0.8 },
      basePos: { x: -14, y: 5, z: -8 },
    });

    // FORM 3: Deep Hydrodynamic Contour Ring (Lower / Deep Background)
    // Massive, slow-rolling titanium ring with molten orange energy wave
    const geomRing = new THREE.TorusGeometry(19, 1.5, 32, 100);
    const matRing = createLiquidMaterial(1.0, 0.14, 0.5, 0.22);
    const meshRing = new THREE.Mesh(geomRing, matRing);
    meshRing.position.set(3, -15, -18);
    meshRing.rotation.set(1.1, 0.3, -0.4);
    scene.add(meshRing);
    forms.push({
      mesh: meshRing,
      rotSpeed: { x: 0.0002, y: -0.0004, z: 0.0003 },
      driftAmp: { x: 2.0, y: 1.0, z: 1.5 },
      basePos: { x: 3, y: -15, z: -18 },
    });

    // FORM 4: Architectural Blade / Fluid Sweep (Upper Background)
    // Sculpted aerodynamic shroud framing the top margin
    const geomBlade = new THREE.TorusKnotGeometry(10, 0.9, 90, 24, 3, 2);
    const matBlade = createLiquidMaterial(2.0, 0.22, 0.25, 0.25);
    const meshBlade = new THREE.Mesh(geomBlade, matBlade);
    meshBlade.position.set(-8, 16, -14);
    meshBlade.rotation.set(0.8, -0.6, 0.5);
    scene.add(meshBlade);
    forms.push({
      mesh: meshBlade,
      rotSpeed: { x: 0.0004, y: 0.0003, z: -0.00035 },
      driftAmp: { x: 1.2, y: 1.6, z: 1.0 },
      basePos: { x: -8, y: 16, z: -14 },
    });

    // 4. SCROLL PARALLAX & MOUSE DRIFT
    let targetScrollY = window.scrollY || 0;
    let currentScrollY = targetScrollY;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / W - 0.5) * 2;
      targetMouseY = (e.clientY / H - 0.5) * 2;
    };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    // 5. ANIMATION LOOP
    let raf = 0;
    let running = true;
    let lastTime = performance.now();

    const animate = (time) => {
      if (!running) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update shader uniform time
      uniforms.uTime.value = time * 0.001;

      // Smooth scroll lerp
      currentScrollY += (targetScrollY - currentScrollY) * 0.045;
      const scrollOffset = currentScrollY * 0.0075;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      // Camera parallax
      camera.position.x = currentMouseX * 1.8;
      camera.position.y = -scrollOffset - currentMouseY * 1.2;
      camera.lookAt(currentMouseX * 0.6, -scrollOffset * 0.8, 0);

      // Organic rotation and depth drift of 3D forms
      if (!reduceMotion) {
        const tSec = time * 0.001;
        for (let i = 0; i < forms.length; i++) {
          const item = forms[i];
          const m = item.mesh;

          // Rotation
          m.rotation.x += item.rotSpeed.x;
          m.rotation.y += item.rotSpeed.y;
          m.rotation.z += item.rotSpeed.z;

          // Harmonic floating drift through depth
          m.position.x = item.basePos.x + Math.sin(tSec * 0.22 + i * 1.5) * item.driftAmp.x;
          m.position.y = item.basePos.y + Math.cos(tSec * 0.18 + i * 1.2) * item.driftAmp.y;
          m.position.z = item.basePos.z + Math.sin(tSec * 0.15 + i * 0.9) * item.driftAmp.z;
        }

        // Gentle light orbit for living reflections
        cyanLight.position.x = 28 + Math.sin(tSec * 0.25) * 4;
        cyanLight.position.y = 18 + Math.cos(tSec * 0.2) * 3;
        orangeLight.position.x = -28 - Math.cos(tSec * 0.22) * 4;
        orangeLight.position.y = -16 - Math.sin(tSec * 0.18) * 3;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    // Pause when document is hidden to optimize performance
    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else {
        running = true;
        lastTime = performance.now();
        raf = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // CLEANUP
    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      // Dispose Three.js objects
      forms.forEach(({ mesh }) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      matGlass.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="liquid-energy-container" ref={containerRef} aria-hidden="true" />;
}
