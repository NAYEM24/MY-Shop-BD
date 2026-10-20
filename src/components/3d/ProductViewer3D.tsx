import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Eye, RotateCw, Layers, ShieldCheck, ChevronDown, ChevronUp, Palette } from 'lucide-react';

interface ProductViewer3DProps {
  productType?: 'spectrometer' | 'earbuds' | 'smartwatch';
  title?: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  productType = 'spectrometer',
  title = 'Interactive 3D Product Inspection',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFinish, setActiveFinish] = useState<'midnight' | 'teal' | 'titanium'>('midnight');
  const [explodedAmount, setExplodedAmount] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  // References for live 3D updates without tearing down the WebGL scene
  const paramsRef = useRef({
    exploded: 0,
    finish: 'midnight',
    autoRotate: true,
    wireframe: false,
  });

  useEffect(() => {
    paramsRef.current.exploded = explodedAmount;
    paramsRef.current.finish = activeFinish;
    paramsRef.current.autoRotate = isAutoRotate;
    paramsRef.current.wireframe = wireframe;
  }, [explodedAmount, activeFinish, isAutoRotate, wireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Headless environment detection for automated tests
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (Boolean(navigator.webdriver) || /HeadlessChrome/i.test(navigator.userAgent));

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting rig (Warm key + cool hemisphere fill + rim light)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = !isHeadless;
    if (!isHeadless) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 6. Contact Ground Shadow (Soft radial grounding plane)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // 7. Composite Procedural Model Hierarchy (3-12 parts)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Procedural branding texture
    const brandCanvas = document.createElement('canvas');
    brandCanvas.width = 512;
    brandCanvas.height = 128;
    const bCtx = brandCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#0f172a';
      bCtx.fillRect(0, 0, 512, 128);
      bCtx.fillStyle = '#38bdf8';
      bCtx.font = 'bold 36px sans-serif';
      bCtx.fillText('MY SHOP BD • APEX 800', 30, 75);
    }
    const brandTexture = new THREE.CanvasTexture(brandCanvas);
    brandTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials dictionary with varying roughness and metalness
    const materials = {
      chassisMidnight: new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 0.5,
      }),
      chassisTeal: new THREE.MeshPhysicalMaterial({
        color: 0x0f766e,
        metalness: 0.8,
        roughness: 0.22,
        clearcoat: 0.6,
      }),
      chassisTitanium: new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 0.4,
      }),
      accentGold: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.25,
      }),
      opticalGlass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.52,
        thickness: 0.5,
        depthWrite: false,
      }),
      sensorCore: new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.35,
      }),
      rubberGrip: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.1,
        roughness: 0.85,
      }),
      brandScreen: new THREE.MeshBasicMaterial({
        map: brandTexture,
      }),
    };

    // Sub-assemblies for exploded view animation
    const partChassis = new THREE.Group();
    const partOptics = new THREE.Group();
    const partDisplay = new THREE.Group();
    const partSensor = new THREE.Group();

    if (productType === 'spectrometer') {
      // Part 1: Main Instrument Hull (Primary silhouette)
      const hullGeo = new THREE.BoxGeometry(2.2, 0.7, 1.4);
      const hullMesh = new THREE.Mesh(hullGeo, materials.chassisMidnight);
      hullMesh.position.y = 0.35;
      hullMesh.castShadow = !isHeadless;
      hullMesh.receiveShadow = !isHeadless;
      partChassis.add(hullMesh);

      // Part 2: Rubber shock bumpers (Secondary read)
      const bumperGeo = new THREE.BoxGeometry(2.24, 0.2, 1.44);
      const bumperMesh = new THREE.Mesh(bumperGeo, materials.rubberGrip);
      bumperMesh.position.y = 0.1;
      partChassis.add(bumperMesh);

      // Part 3: Optical Cuvette Chamber Cylinder (Accent detail)
      const chamberGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 32);
      const chamberMesh = new THREE.Mesh(chamberGeo, materials.accentGold);
      chamberMesh.position.set(0.65, 0.8, 0);
      partOptics.add(chamberMesh);

      // Part 4: Optical Glass Window
      const glassGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32);
      const glassMesh = new THREE.Mesh(glassGeo, materials.opticalGlass);
      glassMesh.position.set(0.65, 0.95, 0);
      partOptics.add(glassMesh);

      // Part 5: Top OLED Telemetry Display Screen
      const screenGeo = new THREE.PlaneGeometry(1.0, 0.6);
      const screenMesh = new THREE.Mesh(screenGeo, materials.brandScreen);
      screenMesh.rotation.x = -Math.PI / 2;
      screenMesh.position.set(-0.4, 0.71, 0);
      partDisplay.add(screenMesh);

      // Part 6: Internal CCD Detector Core
      const ccdGeo = new THREE.BoxGeometry(0.6, 0.25, 0.4);
      const ccdMesh = new THREE.Mesh(ccdGeo, materials.sensorCore);
      ccdMesh.position.set(0, 0.4, 0);
      partSensor.add(ccdMesh);
    } else if (productType === 'earbuds') {
      // Procedural Earbuds Charging Case & Pods
      const caseBaseGeo = new THREE.CylinderGeometry(0.8, 0.75, 0.6, 32);
      const caseBase = new THREE.Mesh(caseBaseGeo, materials.chassisMidnight);
      caseBase.position.y = 0.3;
      partChassis.add(caseBase);

      const lidGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const lid = new THREE.Mesh(lidGeo, materials.chassisMidnight);
      lid.position.y = 0.6;
      partDisplay.add(lid);

      const earbudLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.4, 16, 16), materials.accentGold);
      earbudLeft.position.set(-0.35, 0.7, 0);
      partOptics.add(earbudLeft);

      const earbudRight = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.4, 16, 16), materials.accentGold);
      earbudRight.position.set(0.35, 0.7, 0);
      partSensor.add(earbudRight);
    } else {
      // Smartwatch with titanium bezel & AMOLED screen
      const caseGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.3, 32);
      const caseMesh = new THREE.Mesh(caseGeo, materials.chassisMidnight);
      caseMesh.position.y = 0.2;
      partChassis.add(caseMesh);

      const screenGeo = new THREE.CircleGeometry(0.78, 32);
      const screenMesh = new THREE.Mesh(screenGeo, materials.brandScreen);
      screenMesh.rotation.x = -Math.PI / 2;
      screenMesh.position.y = 0.36;
      partDisplay.add(screenMesh);

      const crownGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
      const crownMesh = new THREE.Mesh(crownGeo, materials.accentGold);
      crownMesh.rotation.z = Math.PI / 2;
      crownMesh.position.set(0.95, 0.2, 0);
      partOptics.add(crownMesh);

      const strapGeo = new THREE.BoxGeometry(0.6, 0.1, 2.4);
      const strapMesh = new THREE.Mesh(strapGeo, materials.rubberGrip);
      strapMesh.position.y = 0.1;
      partSensor.add(strapMesh);
    }

    modelGroup.add(partChassis);
    modelGroup.add(partOptics);
    modelGroup.add(partDisplay);
    modelGroup.add(partSensor);

    // 8. OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera clipping through ground
    controls.minDistance = 1.5;
    controls.maxDistance = 8.0;

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 9. Lossless render loop with exponential damping
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentParams = paramsRef.current;

      // Update material finish dynamically
      const activeMat =
        currentParams.finish === 'teal'
          ? materials.chassisTeal
          : currentParams.finish === 'titanium'
          ? materials.chassisTitanium
          : materials.chassisMidnight;

      partChassis.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material !== materials.rubberGrip) {
          child.material = activeMat;
          child.material.wireframe = currentParams.wireframe;
        }
      });

      // Smoothly animate exploded view
      const targetExplode = currentParams.exploded;
      partOptics.position.y = THREE.MathUtils.damp(partOptics.position.y, targetExplode * 0.8, 6, delta);
      partDisplay.position.y = THREE.MathUtils.damp(partDisplay.position.y, targetExplode * 1.4, 6, delta);
      partSensor.position.x = THREE.MathUtils.damp(partSensor.position.x, targetExplode * -0.6, 6, delta);

      // Auto rotation
      if (currentParams.autoRotate) {
        modelGroup.rotation.y += delta * 0.4;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [productType]);

  return (
    <div className="relative w-full h-[480px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Spec & Badge Pill (Static - No pulsating dots) */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-full border border-slate-700 text-xs shadow-md backdrop-blur-sm">
        <ShieldCheck className="w-4 h-4 text-teal-400" />
        <span className="font-semibold">{title}</span>
        <span className="text-slate-400 border-l border-slate-700 pl-2">PBR Studio 3D</span>
      </div>

      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center space-x-1.5 bg-slate-900/90 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 text-xs shadow-md">
        <RotateCw className="w-3.5 h-3.5 text-sky-400" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Viewport Occlusion) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl transition-all duration-300 ease-out`}
      >
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-1.5 bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-t-lg border-t border-x border-slate-700 text-xs font-medium shadow-md transition-colors"
            aria-label={isCollapsed ? 'Show 3D controls' : 'Hide 3D controls'}
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Cinema Mode (Hide HUD)</span>
              </>
            )}
          </button>
        </div>

        {/* The Controls Surface */}
        {!isCollapsed && (
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Exploded View Slider */}
              <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/50">
                <Layers className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                    <span>Assembly Breakdown</span>
                    <span>{Math.round(explodedAmount * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedAmount}
                    onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    aria-label="3D exploded view slider"
                  />
                </div>
              </div>

              {/* Material Finish Swatches */}
              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/50">
                <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
                  <Palette className="w-3.5 h-3.5 text-sky-400" />
                  <span>Finish:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveFinish('midnight')}
                    className={`w-6 h-6 rounded-full bg-slate-900 border-2 transition-all ${
                      activeFinish === 'midnight' ? 'border-sky-400 scale-110' : 'border-slate-600'
                    }`}
                    title="Midnight Navy"
                    aria-label="Select Midnight Navy finish"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveFinish('teal')}
                    className={`w-6 h-6 rounded-full bg-teal-700 border-2 transition-all ${
                      activeFinish === 'teal' ? 'border-teal-300 scale-110' : 'border-slate-600'
                    }`}
                    title="Bangla Emerald Teal"
                    aria-label="Select Teal finish"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveFinish('titanium')}
                    className={`w-6 h-6 rounded-full bg-slate-400 border-2 transition-all ${
                      activeFinish === 'titanium' ? 'border-sky-300 scale-110' : 'border-slate-600'
                    }`}
                    title="Brushed Titanium"
                    aria-label="Select Titanium finish"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                    isAutoRotate ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{isAutoRotate ? 'Rotation On' : 'Paused'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWireframe(!wireframe)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                    wireframe ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Wireframe</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400">Zero-lag WebGL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
