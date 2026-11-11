import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  User,
  Layers,
  Heart,
  Brain,
  Wind,
  AlertTriangle,
  Sliders,
  Compass
} from 'lucide-react';
import {
  buildCompleteSkeletalSystem,
  buildCompleteNervousSystem,
  buildCompleteCardiovascularSystem,
  buildCompleteVisceralSystem,
  buildHolographicHumanSilhouette,
} from './anatomyEngine';
import './HumanTwin3D.css';

export type TwinMode = 'avatar' | 'anatomy';
export type AnatomicalSystem =
  | 'all'
  | 'cardiovascular'
  | 'respiratory'
  | 'nervous'
  | 'digestive'
  | 'renal'
  | 'skeletal'
  | 'muscular'
  | 'endocrine';

interface HumanTwin3DProps {
  mode?: TwinMode;
  onModeChange?: (mode: TwinMode) => void;
  selectedOrganId?: string | null;
  onSelectOrgan?: (organId: string | null) => void;
  initialSystem?: AnatomicalSystem;
  compact?: boolean;
}

/* ───────────────────────────────────────────────
   Anatomical Pin Definitions (Normalized Viewport %)
   ─────────────────────────────────────────────── */
interface PinDef {
  id: string;
  label: string;
  worldY: number; // 0 = top, 1 = bottom
  worldX: number; // -1 = left, 0 = center, 1 = right
  system: AnatomicalSystem;
}

const ANATOMY_PINS: PinDef[] = [
  { id: 'brain', label: 'Cerebrum & Cranial Nerves', worldY: 0.08, worldX: 0.10, system: 'nervous' },
  { id: 'eyes', label: 'Eyes & Optic Pathway', worldY: 0.12, worldX: -0.10, system: 'nervous' },
  { id: 'thyroid', label: 'Thyroid Gland', worldY: 0.18, worldX: 0.14, system: 'endocrine' },
  { id: 'heart', label: 'Heart & Great Vessels', worldY: 0.31, worldX: -0.10, system: 'cardiovascular' },
  { id: 'lungs', label: 'Bilateral Lungs', worldY: 0.28, worldX: 0.24, system: 'respiratory' },
  { id: 'liver', label: 'Liver & Biliary Tree', worldY: 0.39, worldX: 0.18, system: 'digestive' },
  { id: 'stomach', label: 'Stomach & Intestines', worldY: 0.43, worldX: -0.16, system: 'digestive' },
  { id: 'pancreas', label: 'Endocrine Pancreas', worldY: 0.46, worldX: 0.04, system: 'endocrine' },
  { id: 'kidneys', label: 'Kidneys & Adrenals', worldY: 0.49, worldX: -0.26, system: 'renal' },
  { id: 'skeletal', label: 'Spine & 12 Rib Pairs', worldY: 0.35, worldX: -0.32, system: 'skeletal' },
  { id: 'nervous', label: 'Sciatic Nerve & Peripheral Plexus', worldY: 0.65, worldX: 0.20, system: 'nervous' },
];

export const HumanTwin3D: React.FC<HumanTwin3DProps> = ({
  mode: propMode,
  onModeChange,
  selectedOrganId: propSelectedOrganId,
  onSelectOrgan,
  initialSystem = 'all',
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [internalMode, setInternalMode] = useState<TwinMode>(propMode || 'avatar');
  const currentMode = propMode !== undefined ? propMode : internalMode;

  const [activeSystem, setActiveSystem] = useState<AnatomicalSystem>(initialSystem);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showDisease, setShowDisease] = useState(false);
  const [explodedView, setExplodedView] = useState(0); // 0 to 100%
  const [opacityLevel, setOpacityLevel] = useState(100); // 20 to 100%
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const avatarMeshGroupRef = useRef<THREE.Group | null>(null);
  const anatomyGroupRef = useRef<THREE.Group | null>(null);
  const organGroupsRef = useRef<Record<string, THREE.Group>>({});

  // Dynamic mesh animation references
  const heartMeshRef = useRef<THREE.Group | null>(null);
  const lungsMeshRef = useRef<THREE.Group | null>(null);
  const brainMeshRef = useRef<THREE.Group | null>(null);
  const bloodParticlesRef = useRef<THREE.Points | null>(null);
  const pathologyGroupRef = useRef<THREE.Group | null>(null);

  // Exploded original positions map
  const basePositionsRef = useRef<Map<THREE.Object3D, THREE.Vector3>>(new Map());

  // Camera & Orbit state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationAnglesRef = useRef({ x: 0, y: 0 });
  const zoomLevelRef = useRef(compact ? 4.8 : 4.2);
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.3, zoomLevelRef.current));

  const handleToggleMode = (newMode: TwinMode) => {
    setInternalMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  const handleSelect = useCallback(
    (id: string) => {
      if (onSelectOrgan) onSelectOrgan(id);
    },
    [onSelectOrgan]
  );

  /* ─────────────────────────────────────────────────────────────
     PRESET CAMERA ORIENTATIONS
     ───────────────────────────────────────────────────────────── */
  const setCameraAngle = (view: 'coronal' | 'sagittal-left' | 'sagittal-right' | 'posterior' | 'superior') => {
    if (!modelGroupRef.current) return;
    setIsRotating(false);
    switch (view) {
      case 'coronal': // Front
        rotationAnglesRef.current = { x: 0, y: 0 };
        break;
      case 'posterior': // Back
        rotationAnglesRef.current = { x: 0, y: Math.PI };
        break;
      case 'sagittal-left': // Left lateral
        rotationAnglesRef.current = { x: 0, y: Math.PI * 0.5 };
        break;
      case 'sagittal-right': // Right lateral
        rotationAnglesRef.current = { x: 0, y: -Math.PI * 0.5 };
        break;
      case 'superior': // Top down
        rotationAnglesRef.current = { x: 0.5, y: 0 };
        break;
    }
    modelGroupRef.current.rotation.x = rotationAnglesRef.current.x;
    modelGroupRef.current.rotation.y = rotationAnglesRef.current.y;
  };

  /* ═════════════════════════════════════════════════════════════
     MASTER 3D SCENE INITIALIZATION (Three.js)
     ═════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, zoomLevelRef.current);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 3. Crisp High-Exposure Medical Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.3);
    fillLight.position.set(-4, -1, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 1.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffffff, 1.2, 10);
    topLight.position.set(0, 3, 2);
    scene.add(topLight);

    const bottomLight = new THREE.PointLight(0xffffff, 0.6, 8);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // 4. Master Model Pivot Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // ═════════════════════════════════════════════════════════════
    //  A. PERSONAL AVATAR LAYER (sarah_mitchell.glb / human_body.glb)
    // ═════════════════════════════════════════════════════════════
    const avatarGroup = new THREE.Group();
    avatarGroup.name = 'personal_avatar';
    modelGroup.add(avatarGroup);
    avatarMeshGroupRef.current = avatarGroup;

    const loader = new GLTFLoader();
    loader.load(
      '/models/sarah_mitchell.glb',
      (gltf) => {
        const s = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(s);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const scale = 3.8 / (size.y || 1);
        s.scale.set(scale, scale, scale);
        s.position.set(-center.x * scale, -center.y * scale - 0.1, -center.z * scale);
        s.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            if (m.material) {
              const mat = m.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.45, mat.roughness || 0.5);
              mat.metalness = Math.min(0.15, mat.metalness || 0.05);
            }
          }
        });
        avatarGroup.add(s);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        else setLoadingProgress(85);
      },
      () => {
        loader.load('/models/human_body.glb', (gltf2) => {
          const s = gltf2.scene;
          const bbox = new THREE.Box3().setFromObject(s);
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          const scale = 3.8 / (size.y || 1);
          s.scale.set(scale, scale, scale);
          s.position.set(-center.x * scale, -center.y * scale - 0.1, -center.z * scale);
          avatarGroup.add(s);
          setIsLoading(false);
        });
      }
    );

    // ═════════════════════════════════════════════════════════════
    //  B. INTERNAL ANATOMICAL ENGINE (Full Scientific Geometry)
    // ═════════════════════════════════════════════════════════════
    const anatomyGroup = new THREE.Group();
    anatomyGroup.name = 'internal_anatomy';
    modelGroup.add(anatomyGroup);
    anatomyGroupRef.current = anatomyGroup;
    const organs: Record<string, THREE.Group> = {};

    // 1. Skeletal System (206-Bone Anatomical Framework)
    const skeletalGroup = buildCompleteSkeletalSystem();
    anatomyGroup.add(skeletalGroup);
    organs['skeletal'] = skeletalGroup;

    // 2. Nervous & Ocular System (Eyes, Optic Pathway, Brain, Spinal Cord, 31 Nerve Roots, Brachial & Sciatic Plexuses)
    const { group: nervousGroup, brainMesh, eyesMesh } = buildCompleteNervousSystem();
    anatomyGroup.add(nervousGroup);
    organs['nervous'] = nervousGroup;
    organs['brain'] = brainMesh;
    organs['eyes'] = eyesMesh;
    brainMeshRef.current = brainMesh;

    // 3. Cardiovascular & Great Vessels (Heart, Aorta, Carotids, Jugular, Brachials, Femorals, Circulating Particles)
    const { group: cardioGroup, heartMesh, bloodParticles } = buildCompleteCardiovascularSystem();
    anatomyGroup.add(cardioGroup);
    organs['cardiovascular'] = cardioGroup;
    organs['heart'] = heartMesh;
    heartMeshRef.current = heartMesh;
    bloodParticlesRef.current = bloodParticles;

    // 4. Visceral Organs (Lungs, GI, Liver, Kidneys, Spleen, Pancreas, Endocrine)
    const { lungsGroup, liverGroup, stomachGroup, pancreasGroup, kidneyGroup, thyroidGroup } = buildCompleteVisceralSystem();
    anatomyGroup.add(lungsGroup);
    organs['lungs'] = lungsGroup;
    lungsMeshRef.current = lungsGroup;

    anatomyGroup.add(liverGroup);
    organs['liver'] = liverGroup;

    anatomyGroup.add(stomachGroup);
    organs['stomach'] = stomachGroup;

    anatomyGroup.add(pancreasGroup);
    organs['pancreas'] = pancreasGroup;

    anatomyGroup.add(kidneyGroup);
    organs['kidneys'] = kidneyGroup;

    anatomyGroup.add(thyroidGroup);
    organs['thyroid'] = thyroidGroup;

    // 5. Holographic Cyber-Medical Bio-Silhouette
    const bioSilhouette = buildHolographicHumanSilhouette();
    anatomyGroup.add(bioSilhouette);

    // ─────────────────────────────────────────────────────────────
    // 9. DISEASE PATHOLOGY LAYER
    // ─────────────────────────────────────────────────────────────
    const pathologyGroup = new THREE.Group();
    pathologyGroup.name = 'pathology';
    pathologyGroup.visible = false;

    // 1. Coronary Atheroma Plaque (Amber lesion on LAD)
    const plaqueMat = new THREE.MeshStandardMaterial({
      color: 0xe6a34a,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x996515,
      emissiveIntensity: 0.85,
    });
    const plaque = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), plaqueMat);
    plaque.position.set(-0.06, 0.42, 0.26);
    plaque.name = 'plaque_lesion';
    pathologyGroup.add(plaque);

    // 2. L4-L5 Lumbar Disc Herniation
    const herniaMat = new THREE.MeshStandardMaterial({
      color: 0xc52848,
      roughness: 0.3,
      emissive: 0xff1040,
      emissiveIntensity: 0.95,
    });
    const hernia = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), herniaMat);
    hernia.position.set(0.04, -0.42, -0.16);
    hernia.name = 'hernia_lesion';
    pathologyGroup.add(hernia);

    // 3. Hepatic Steatosis Mottle
    const steatMat = new THREE.MeshStandardMaterial({
      color: 0xcca030,
      roughness: 0.45,
      emissive: 0x553e08,
      emissiveIntensity: 0.65,
    });
    const steatosis = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), steatMat);
    steatosis.position.set(0.24, -0.02, 0.18);
    steatosis.name = 'steatosis_lesion';
    pathologyGroup.add(steatosis);

    // 4. Antral Gastritis Hyperemia
    const gastrMat = new THREE.MeshStandardMaterial({
      color: 0xd93856,
      roughness: 0.3,
      emissive: 0x8a1528,
      emissiveIntensity: 0.8,
    });
    const gastritis = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), gastrMat);
    gastritis.position.set(-0.08, -0.12, 0.14);
    gastritis.name = 'gastritis_lesion';
    pathologyGroup.add(gastritis);

    anatomyGroup.add(pathologyGroup);
    pathologyGroupRef.current = pathologyGroup;

    organGroupsRef.current = organs;

    // Record base positions for exploded view
    Object.values(organs).forEach((grp) => {
      basePositionsRef.current.set(grp, grp.position.clone());
    });

    // ═════════════════════════════════════════════════════════════
    //  ANIMATION LOOP (Physiological Heartbeat & Respiration)
    // ═════════════════════════════════════════════════════════════
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // 72 BPM Ventricular Systolic Contraction
      if (heartMeshRef.current) {
        const beat = 1.0 + Math.pow(Math.sin(t * 7.5), 10) * 0.16;
        heartMeshRef.current.scale.set(beat, beat, beat);
      }

      // Respiratory Alveolar Expansion
      if (lungsMeshRef.current) {
        const breath = 1.0 + Math.sin(t * 1.4) * 0.065;
        lungsMeshRef.current.scale.set(breath, breath, breath);
      }

      // Cognitive Alpha Rhythm Glow
      if (brainMeshRef.current) {
        const wave = 1.0 + Math.sin(t * 2.8) * 0.022;
        brainMeshRef.current.scale.set(wave, wave, wave);
      }

      // Circulatory Blood Flow Velocity
      if (bloodParticlesRef.current) {
        bloodParticlesRef.current.rotation.y = t * 0.55;
      }

      // Disease Lesion Pulsation
      if (pathologyGroupRef.current && pathologyGroupRef.current.visible) {
        const pulse = 1.0 + Math.sin(t * 5.0) * 0.22;
        pathologyGroupRef.current.children.forEach((lesion) => {
          lesion.scale.set(pulse, pulse, pulse);
        });
      }

      // Auto-Orbit Rotation when idle
      if (isRotating && !isDraggingRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.003;
      }

      // Camera Smooth Gliding Transition
      camera.position.lerp(targetCameraPosRef.current, 0.06);
      camera.lookAt(0, 0.3, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // ═════════════════════════════════════════════════════════════
    //  MOUSE ORBIT & RAYCAST SELECTION
    // ═════════════════════════════════════════════════════════════
    const canvas = canvasRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      rotationAnglesRef.current.y += dx * 0.007;
      rotationAnglesRef.current.x += dy * 0.007;
      rotationAnglesRef.current.x = Math.max(-0.55, Math.min(0.55, rotationAnglesRef.current.x));
      modelGroupRef.current.rotation.y = rotationAnglesRef.current.y;
      modelGroupRef.current.rotation.x = rotationAnglesRef.current.x;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomLevelRef.current = Math.max(2.0, Math.min(8.0, zoomLevelRef.current + e.deltaY * 0.004));
      targetCameraPosRef.current.z = zoomLevelRef.current;
    };

    // Direct 3D Mesh Click Raycasting
    const onClick = (e: MouseEvent) => {
      if (!canvas || !anatomyGroupRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(anatomyGroupRef.current.children, true);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        const validOrgans = ['heart', 'lungs', 'brain', 'eyes', 'nervous', 'cardiovascular', 'liver', 'kidneys', 'skeletal', 'stomach', 'pancreas', 'thyroid', 'muscular'];
        while (parent && parent !== anatomyGroupRef.current && !validOrgans.includes(parent.name)) {
          parent = parent.parent;
        }
        if (parent && validOrgans.includes(parent.name) && onSelectOrgan) {
          onSelectOrgan(parent.name);
        }
      }
    };

    const onResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (canvas) {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('wheel', onWheel);
        canvas.removeEventListener('click', onClick);
      }
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact]);

  /* ── MODE VISIBILITY ── */
  useEffect(() => {
    if (avatarMeshGroupRef.current && anatomyGroupRef.current) {
      avatarMeshGroupRef.current.visible = currentMode === 'avatar';
      anatomyGroupRef.current.visible = currentMode === 'anatomy';
    }
  }, [currentMode]);

  /* ── SYSTEM LAYER ISOLATION ── */
  useEffect(() => {
    const groups = organGroupsRef.current;
    const systemMap: Record<string, AnatomicalSystem[]> = {
      skeletal: ['all', 'skeletal'],
      muscular: ['all', 'muscular'],
      cardiovascular: ['all', 'cardiovascular'],
      heart: ['all', 'cardiovascular'],
      nervous: ['all', 'nervous'],
      brain: ['all', 'nervous'],
      eyes: ['all', 'nervous'],
      lungs: ['all', 'respiratory'],
      liver: ['all', 'digestive'],
      stomach: ['all', 'digestive'],
      kidneys: ['all', 'renal'],
      pancreas: ['all', 'endocrine', 'digestive'],
      thyroid: ['all', 'endocrine'],
    };

    Object.entries(groups).forEach(([name, group]) => {
      const systems = systemMap[name] || ['all'];
      if (name === 'muscular') {
        group.visible = activeSystem === 'muscular' || (activeSystem === 'all' && false);
      } else {
        group.visible = systems.includes(activeSystem);
      }
    });
  }, [activeSystem]);

  /* ── EXPLODED VIEW TRANSFORMATION ── */
  useEffect(() => {
    const factor = explodedView / 100;
    const groups = organGroupsRef.current;

    // Displace outward along radial anatomical vectors
    const offsets: Record<string, [number, number, number]> = {
      heart: [-0.6 * factor, 0.2 * factor, 0.8 * factor],
      lungs: [0.8 * factor, 0.2 * factor, 0.6 * factor],
      brain: [0, 0.9 * factor, 0.2 * factor],
      eyes: [0, 0.8 * factor, 0.7 * factor],
      nervous: [0, 0, -0.2 * factor],
      cardiovascular: [-0.3 * factor, 0.1 * factor, 0.4 * factor],
      liver: [0.9 * factor, -0.1 * factor, 0.7 * factor],
      stomach: [-0.8 * factor, -0.1 * factor, 0.7 * factor],
      pancreas: [0, -0.3 * factor, 0.9 * factor],
      kidneys: [0, -0.4 * factor, -0.8 * factor],
      skeletal: [0, 0, -0.4 * factor],
      thyroid: [0, 0.6 * factor, 0.6 * factor],
    };

    Object.entries(groups).forEach(([name, grp]) => {
      const base = basePositionsRef.current.get(grp);
      const off = offsets[name];
      if (base && off) {
        grp.position.set(base.x + off[0], base.y + off[1], base.z + off[2]);
      }
    });
  }, [explodedView]);

  /* ── X-RAY OPACITY SLIDER ── */
  useEffect(() => {
    const alpha = opacityLevel / 100;
    const groups = organGroupsRef.current;

    Object.values(groups).forEach((grp) => {
      grp.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.transparent = alpha < 0.98;
            mat.opacity = alpha;
          }
        }
      });
    });
  }, [opacityLevel]);

  /* ── CAMERA FOCUS ON SELECTION ── */
  useEffect(() => {
    if (!propSelectedOrganId) {
      targetCameraPosRef.current.set(0, 0.3, zoomLevelRef.current);
      return;
    }
    const camFocus: Record<string, [number, number, number]> = {
      brain: [0, 1.6, 2.2],
      eyes: [0, 1.48, 1.6],
      nervous: [0, 0.4, 2.8],
      cardiovascular: [-0.05, 0.4, 2.4],
      heart: [-0.1, 0.5, 2.2],
      lungs: [0, 0.5, 2.6],
      liver: [0.2, 0.05, 2.3],
      kidneys: [0, -0.3, 2.4],
      skeletal: [0, 0.3, 3.4],
      stomach: [-0.15, 0, 2.2],
      pancreas: [0, -0.1, 2.1],
      thyroid: [0, 1.05, 1.8],
      muscular: [0, 0.3, 3.6],
    };
    const pos = camFocus[propSelectedOrganId];
    if (pos) targetCameraPosRef.current.set(...pos);
  }, [propSelectedOrganId]);

  /* ── HIGHLIGHT SELECTED ORGAN GLOW ── */
  useEffect(() => {
    const groups = organGroupsRef.current;
    Object.entries(groups).forEach(([name, group]) => {
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = name === propSelectedOrganId
              ? (mat.userData?.baseEmissive || 0.5) + 0.65
              : (mat.userData?.baseEmissive || 0.5);
          }
        }
      });
    });
  }, [propSelectedOrganId]);

  /* ── PATHOLOGY VISIBILITY ── */
  useEffect(() => {
    if (pathologyGroupRef.current) {
      pathologyGroupRef.current.visible = showDisease;
    }
  }, [showDisease]);

  const handleResetCamera = () => {
    targetCameraPosRef.current.set(0, 0.3, compact ? 4.8 : 4.2);
    zoomLevelRef.current = compact ? 4.8 : 4.2;
    if (modelGroupRef.current) modelGroupRef.current.rotation.set(0, 0, 0);
    rotationAnglesRef.current = { x: 0, y: 0 };
    setExplodedView(0);
    setOpacityLevel(100);
    if (onSelectOrgan) onSelectOrgan(null);
  };

  const handleZoom = (delta: number) => {
    zoomLevelRef.current = Math.max(2.0, Math.min(8.0, zoomLevelRef.current + delta));
    targetCameraPosRef.current.z = zoomLevelRef.current;
  };

  const visiblePins = currentMode === 'anatomy' && explodedView === 0
    ? ANATOMY_PINS.filter((p) => activeSystem === 'all' || p.system === activeSystem)
    : [];

  return (
    <div className="crimson-twin-wrapper" ref={containerRef} style={{ height: compact ? '380px' : '100%' }}>
      <canvas ref={canvasRef} className="crimson-twin-canvas" />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(24, 9, 15, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 30, color: 'var(--color-warm-white)'
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3px solid rgba(197, 40, 72, 0.2)', borderTopColor: 'var(--color-heart-red)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-heart-red)' }}>
            SYNCHRONIZING 3D ANATOMICAL ENGINE...
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.35rem' }}>
            Compiling Skeletal, Visceral & Circulatory Geometry ({loadingProgress}%)
          </div>
        </div>
      )}

      {/* Coordinate HUD Brackets & Subtle Grid */}
      <div className="crimson-twin-hud-grid" />
      <div className="crimson-hud-bracket crimson-hud-bracket--tl" />
      <div className="crimson-hud-bracket crimson-hud-bracket--tr" />
      <div className="crimson-hud-bracket crimson-hud-bracket--bl" />
      <div className="crimson-hud-bracket crimson-hud-bracket--br" />

      {/* ── INTERACTIVE FLOATING ANATOMICAL CALLOUT PINS ── */}
      {visiblePins.map((pin) => (
        <div
          key={pin.id}
          className={`crimson-pin ${propSelectedOrganId === pin.id ? 'crimson-pin--active' : ''}`}
          style={{
            top: `${pin.worldY * 100}%`,
            left: `${50 + pin.worldX * 50}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(pin.id);
          }}
        >
          <div className="crimson-pin-dot" />
          <span className="crimson-pin-label">{pin.label}</span>
        </div>
      ))}

      {/* ── PATHOLOGY LESION PINS ── */}
      {showDisease && currentMode === 'anatomy' && [
        { id: 'heart', label: '⚠ CAD Atheroma (I25.10)', worldY: 0.36, worldX: -0.06 },
        { id: 'skeletal', label: '⚠ L4-L5 Disc Bulge (M54.5)', worldY: 0.52, worldX: 0.08 },
        { id: 'liver', label: '⚠ Hepatic Steatosis (R74.01)', worldY: 0.44, worldX: 0.22 },
        { id: 'stomach', label: '⚠ Antral Gastritis (K29.70)', worldY: 0.46, worldX: -0.16 },
      ].map((p) => (
        <div
          key={`pathology-${p.id}`}
          className={`crimson-pin crimson-pin--pathology ${propSelectedOrganId === p.id ? 'crimson-pin--active' : ''}`}
          style={{
            top: `${p.worldY * 100}%`,
            left: `${50 + p.worldX * 50}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(p.id);
          }}
        >
          <div className="crimson-pin-dot" style={{ background: 'var(--color-warning)', borderColor: '#FFF7F7', boxShadow: '0 0 12px var(--color-warning)' }} />
          <span className="crimson-pin-label" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)', fontWeight: 700 }}>
            {p.label}
          </span>
        </div>
      ))}

      {/* Top Floating Controls Bar */}
      <div className="crimson-twin-header">
        {/* Mode Toggle: Personal Avatar vs Anatomy Mode */}
        <div className="crimson-twin-mode-toggle">
          <button
            className={`crimson-twin-mode-btn ${currentMode === 'avatar' ? 'active' : ''}`}
            onClick={() => handleToggleMode('avatar')}
          >
            <User size={14} /> Personal Avatar
          </button>
          <button
            className={`crimson-twin-mode-btn ${currentMode === 'anatomy' ? 'active' : ''}`}
            onClick={() => handleToggleMode('anatomy')}
          >
            <Layers size={14} /> Anatomy Mode
          </button>
        </div>

        {/* System Layer Selectors */}
        {currentMode === 'anatomy' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="crimson-twin-system-bar">
              {(['all', 'skeletal', 'muscular', 'cardiovascular', 'respiratory', 'nervous', 'digestive', 'renal', 'endocrine'] as AnatomicalSystem[]).map((sys) => (
                <button
                  key={sys}
                  className={`crimson-twin-sys-btn ${activeSystem === sys ? 'active' : ''}`}
                  onClick={() => setActiveSystem(sys)}
                >
                  {sys.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className={`crimson-twin-mode-btn ${showDisease ? 'active' : ''}`}
              onClick={() => setShowDisease(!showDisease)}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
              title="Highlight verified diseases on 3D organs"
            >
              <AlertTriangle size={12} /> Pathology
            </button>

            <button
              className={`crimson-twin-mode-btn ${showAdvancedTools ? 'active' : ''}`}
              onClick={() => setShowAdvancedTools(!showAdvancedTools)}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
              title="Exploded View & X-Ray Sliders"
            >
              <Sliders size={12} /> Tools
            </button>
          </div>
        )}
      </div>

      {/* Advanced Anatomical Controls Drawer (Exploded View & X-Ray Sliders) */}
      {showAdvancedTools && currentMode === 'anatomy' && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            right: '20px',
            background: 'rgba(34, 13, 22, 0.92)',
            border: '1px solid rgba(143, 32, 56, 0.45)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            backdropFilter: 'blur(16px)',
            zIndex: 25,
            width: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warm-white)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Compass size={14} color="var(--color-heart-red)" /> Anatomical Tools
            </span>
            <button
              onClick={() => setShowAdvancedTools(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-muted-pink)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          </div>

          {/* Exploded View Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted-pink)', marginBottom: '0.2rem' }}>
              <span>Exploded Radial View</span>
              <span>{explodedView}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={explodedView}
              onChange={(e) => setExplodedView(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-heart-red)' }}
            />
          </div>

          {/* X-Ray Transparency Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted-pink)', marginBottom: '0.2rem' }}>
              <span>Tissue Opacity (X-Ray)</span>
              <span>{opacityLevel}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={opacityLevel}
              onChange={(e) => setOpacityLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-heart-red)' }}
            />
          </div>

          {/* Camera Orientation Presets */}
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)', display: 'block', marginBottom: '0.35rem' }}>
              Camera Presets
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setCameraAngle('coronal')} style={{ fontSize: '0.65rem', padding: '0.25rem' }}>
                Front
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setCameraAngle('posterior')} style={{ fontSize: '0.65rem', padding: '0.25rem' }}>
                Back
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setCameraAngle('sagittal-left')} style={{ fontSize: '0.65rem', padding: '0.25rem' }}>
                Lateral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD Bar */}
      <div className="crimson-twin-footer-hud">
        {/* Fast Organ Telemetry Cards */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div
            className={`crimson-twin-vital-card ${propSelectedOrganId === 'heart' ? 'selected' : ''}`}
            onClick={() => handleSelect('heart')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--color-muted-pink)', textTransform: 'uppercase' }}>
              <Heart size={13} color="var(--color-heart-red)" />
              <span>Cardiovascular Core</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-white)', marginTop: '0.2rem' }}>
              72 BPM <span className="badge badge-crimson" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>Sinus</span>
            </div>
          </div>

          <div
            className={`crimson-twin-vital-card ${propSelectedOrganId === 'lungs' ? 'selected' : ''}`}
            onClick={() => handleSelect('lungs')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--color-muted-pink)', textTransform: 'uppercase' }}>
              <Wind size={13} color="var(--color-brain-rose)" />
              <span>Pulmonary SpO2</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-white)', marginTop: '0.2rem' }}>
              98.5% <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>Optimal</span>
            </div>
          </div>

          <div
            className={`crimson-twin-vital-card ${propSelectedOrganId === 'brain' ? 'selected' : ''}`}
            onClick={() => handleSelect('brain')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--color-muted-pink)', textTransform: 'uppercase' }}>
              <Brain size={13} color="var(--color-soft-tissue)" />
              <span>Cerebral / EEG</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-white)', marginTop: '0.2rem' }}>
              9.8 Hz <span className="badge badge-rose" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>Alpha</span>
            </div>
          </div>
        </div>

        {/* Viewport Control Buttons */}
        <div className="crimson-twin-controls">
          <button
            className="crimson-twin-ctrl-btn"
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause Orbit' : 'Resume Auto-Rotate'}
          >
            <RotateCw size={15} style={{ animation: isRotating ? 'cardiacPulse 3s infinite' : 'none' }} />
          </button>
          <button className="crimson-twin-ctrl-btn" onClick={() => handleZoom(-0.8)} title="Zoom In">
            <ZoomIn size={15} />
          </button>
          <button className="crimson-twin-ctrl-btn" onClick={() => handleZoom(0.8)} title="Zoom Out">
            <ZoomOut size={15} />
          </button>
          <button className="crimson-twin-ctrl-btn" onClick={handleResetCamera} title="Reset Viewport">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanTwin3D;
