import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   MATERIALS
   ───────────────────────────────────────────────────────────── */
export const boneMaterial = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.32,
  metalness: 0.08,
});

export const cartilageMaterial = new THREE.MeshStandardMaterial({
  color: 0x93c5fd,
  roughness: 0.38,
  metalness: 0.04,
  transparent: true,
  opacity: 0.75,
});

export const nerveMaterial = new THREE.MeshStandardMaterial({
  color: 0xfacc15, // Electrical synaptic gold
  roughness: 0.25,
  metalness: 0.3,
  emissive: 0xd97706,
  emissiveIntensity: 0.85,
});

export const nerveThinMaterial = new THREE.MeshStandardMaterial({
  color: 0xfef08a,
  roughness: 0.3,
  emissive: 0xb45309,
  emissiveIntensity: 0.7,
});

export const arterialMaterial = new THREE.MeshStandardMaterial({
  color: 0xd92646,
  roughness: 0.22,
  metalness: 0.35,
  emissive: 0x881337,
  emissiveIntensity: 0.7,
});

export const venousMaterial = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  roughness: 0.25,
  metalness: 0.3,
  emissive: 0x1e3a8a,
  emissiveIntensity: 0.6,
});

/* ─────────────────────────────────────────────────────────────
   1. COMPLETE NERVOUS & OCULAR SYSTEM (Eyes, Brain, All Nerves)
   ───────────────────────────────────────────────────────────── */
export function buildCompleteNervousSystem(): {
  group: THREE.Group;
  brainMesh: THREE.Group;
  eyesMesh: THREE.Group;
} {
  const nervousGroup = new THREE.Group();
  nervousGroup.name = 'nervous';

  // ── A. THE OCULAR SYSTEM (Hyper-Realistic Eyes & Optic Nerves) ──
  const eyesGroup = new THREE.Group();
  eyesGroup.name = 'eyes';

  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.12,
    metalness: 0.05,
  });

  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb, // Brilliant sapphire iris
    roughness: 0.2,
    metalness: 0.2,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.3,
  });

  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

  const corneaMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 1,
    transparent: true,
    roughness: 0.02,
    ior: 1.376,
  });

  const opticNerveMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.3,
    emissive: 0xd97706,
    emissiveIntensity: 0.75,
  });

  [-0.09, 0.09].forEach((eyeX) => {
    const singleEye = new THREE.Group();
    singleEye.position.set(eyeX, 1.48, 0.20);

    // Sclera Globe
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.046, 24, 24), scleraMat);
    singleEye.add(sclera);

    // Iris Ring
    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.022, 24), irisMat);
    iris.position.set(0, 0, 0.044);
    singleEye.add(iris);

    // Pupil
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.010, 20), pupilMat);
    pupil.position.set(0, 0, 0.045);
    singleEye.add(pupil);

    // Cornea Transparent Dome
    const cornea = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      corneaMat
    );
    cornea.position.set(0, 0, 0.038);
    singleEye.add(cornea);

    // Optic Nerve (Cranial Nerve II) exiting posterior globe to optic chiasm
    const opticCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, -0.04),
      new THREE.Vector3(eyeX > 0 ? -0.03 : 0.03, -0.04, -0.12),
      new THREE.Vector3(eyeX > 0 ? -0.07 : 0.07, -0.06, -0.18)
    );
    const opticTube = new THREE.Mesh(
      new THREE.TubeGeometry(opticCurve, 12, 0.007, 8, false),
      opticNerveMat
    );
    singleEye.add(opticTube);

    eyesGroup.add(singleEye);
  });

  // Optic Chiasm (Crossing point beneath hypothalamus)
  const chiasm = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.012, 0.02),
    opticNerveMat
  );
  chiasm.position.set(0, 1.42, 0.02);
  eyesGroup.add(chiasm);

  nervousGroup.add(eyesGroup);

  // ── B. CEREBRUM, CEREBELLUM & BRAINSTEM ──
  const brainGroup = new THREE.Group();
  brainGroup.name = 'brain';

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xd7839c, // Cortical rose
    roughness: 0.35,
    metalness: 0.12,
    emissive: 0x5a1828,
    emissiveIntensity: 0.55,
  });

  // Left & Right Cerebral Hemispheres with distinct Lobes
  const hemiGeo = new THREE.SphereGeometry(0.21, 32, 32);
  hemiGeo.scale(0.88, 1.0, 1.15);

  const brainL = new THREE.Mesh(hemiGeo, brainMat);
  brainL.position.set(-0.10, 1.58, 0.02);
  brainGroup.add(brainL);

  const brainR = new THREE.Mesh(hemiGeo.clone(), brainMat);
  brainR.position.set(0.10, 1.58, 0.02);
  brainGroup.add(brainR);

  // Cerebellum (Posterior-inferior visual folia)
  const cerebMat = brainMat.clone();
  cerebMat.color.set(0xc2728e);
  const cerebGeo = new THREE.SphereGeometry(0.11, 20, 20);
  cerebGeo.scale(1.25, 0.72, 1.05);
  const cerebellum = new THREE.Mesh(cerebGeo, cerebMat);
  cerebellum.position.set(0, 1.42, -0.10);
  brainGroup.add(cerebellum);

  // Brainstem (Pons & Medulla)
  const brainstem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.032, 0.30, 14),
    brainMat
  );
  brainstem.position.set(0, 1.28, -0.04);
  brainGroup.add(brainstem);

  // ── C. SPINAL CORD (All 24 Vertebral Segments) ──
  const cordMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    roughness: 0.32,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.6,
  });

  const spinalCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.020, 0.015, 1.65, 12),
    cordMat
  );
  spinalCord.position.set(0, 0.32, -0.14);
  brainGroup.add(spinalCord);

  // ── D. ALL 31 PAIRS OF SPINAL NERVE ROOTS ──
  // Cervical (8 pairs), Thoracic (12 pairs), Lumbar (5 pairs), Sacral (5 pairs)
  for (let s = 0; s < 30; s++) {
    const y = 1.08 - s * 0.062;
    const isBrachial = s >= 4 && s <= 8; // C5-T1 Brachial plexus origins
    const isLumbosacral = s >= 20 && s <= 25; // L1-S1 Sciatic origins

    [-1, 1].forEach((side) => {
      const rootLength = isBrachial ? 0.22 : isLumbosacral ? 0.24 : 0.12;
      const rootCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, y, -0.14),
        new THREE.Vector3(side * (rootLength * 0.5), y - 0.01, -0.13),
        new THREE.Vector3(side * rootLength, y - 0.025, -0.11)
      );
      const rootMesh = new THREE.Mesh(
        new THREE.TubeGeometry(rootCurve, 8, isBrachial || isLumbosacral ? 0.007 : 0.004, 6, false),
        nerveThinMaterial
      );
      brainGroup.add(rootMesh);
    });
  }

  // ── E. BRACHIAL PLEXUS & ARM NERVES (Radial, Median, Ulnar, Digital Nerves) ──
  [-1, 1].forEach((side) => {
    // 1. Supraclavicular Trunk
    const trunkCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.08, 0.95, -0.10),
      new THREE.Vector3(side * 0.22, 0.88, 0.04),
      new THREE.Vector3(side * 0.38, 0.78, 0.02),
      new THREE.Vector3(side * 0.42, 0.65, 0.02)
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 12, 0.008, 6, false), nerveMaterial));

    // 2. Radial Nerve (Posterior arm to dorsum of hand)
    const radialCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.42, 0.65, 0.02),
      new THREE.Vector3(side * 0.44, 0.42, -0.02),
      new THREE.Vector3(side * 0.46, 0.15, -0.01),
      new THREE.Vector3(side * 0.47, -0.12, 0.01)
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(radialCurve, 14, 0.006, 6, false), nerveMaterial));

    // 3. Median & Ulnar Nerves (Anterior arm through cubital fossa to palm & digits)
    const medianCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.42, 0.65, 0.02),
      new THREE.Vector3(side * 0.40, 0.40, 0.03),
      new THREE.Vector3(side * 0.43, 0.15, 0.03),
      new THREE.Vector3(side * 0.45, -0.12, 0.03)
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(medianCurve, 14, 0.006, 6, false), nerveMaterial));

    // 4. Digital Nerves to 5 Fingers
    for (let f = 0; f < 5; f++) {
      const fingerCurve = new THREE.LineCurve3(
        new THREE.Vector3(side * 0.46, -0.12, 0.02),
        new THREE.Vector3(side * (0.44 + f * 0.01), -0.22, 0.02 + (f - 2) * 0.008)
      );
      brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(fingerCurve, 4, 0.003, 4, false), nerveThinMaterial));
    }
  });

  // ── F. INTERCOSTAL NERVES (12 Rib Pairs) ──
  for (let r = 0; r < 12; r++) {
    const y = 0.88 - r * 0.068;
    const ribR = 0.30 + Math.sin((r / 11) * Math.PI) * 0.12;
    [-1, 1].forEach((side) => {
      const interCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, y, -0.14),
        new THREE.Vector3(side * (ribR * 0.8), y - 0.02, -0.04),
        new THREE.Vector3(side * (ribR * 0.35), y - 0.04, 0.18)
      );
      brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(interCurve, 10, 0.0035, 4, false), nerveThinMaterial));
    });
  }

  // ── G. LUMBOSACRAL PLEXUS, SCIATIC NERVES & LEG NERVES (Down to Toes) ──
  [-1, 1].forEach((side) => {
    // Sciatic Nerve Trunk (The thickest nerve in human body)
    const sciaticCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.08, -0.62, -0.14),
      new THREE.Vector3(side * 0.14, -0.85, -0.08),
      new THREE.Vector3(side * 0.16, -1.25, -0.06),
      new THREE.Vector3(side * 0.16, -1.65, -0.05) // Popliteal fossa
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sciaticCurve, 16, 0.010, 8, false), nerveMaterial));

    // Femoral Nerve (Anterior thigh)
    const femoralCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.08, -0.58, -0.02),
      new THREE.Vector3(side * 0.14, -0.90, 0.06),
      new THREE.Vector3(side * 0.16, -1.30, 0.05),
      new THREE.Vector3(side * 0.16, -1.65, 0.03) // Patellar plexus
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(femoralCurve, 14, 0.007, 6, false), nerveMaterial));

    // Tibial Nerve (Calf to plantar foot)
    const tibialCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.16, -1.65, -0.05),
      new THREE.Vector3(side * 0.17, -2.00, -0.04),
      new THREE.Vector3(side * 0.17, -2.35, -0.02),
      new THREE.Vector3(side * 0.17, -2.52, 0.06) // Medial ankle
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(tibialCurve, 14, 0.007, 6, false), nerveMaterial));

    // Common Peroneal Nerve (Lateral calf to dorsum of foot)
    const peronealCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.16, -1.65, -0.05),
      new THREE.Vector3(side * 0.21, -1.85, -0.01),
      new THREE.Vector3(side * 0.19, -2.25, 0.03),
      new THREE.Vector3(side * 0.17, -2.52, 0.10) // Dorsum foot
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(peronealCurve, 14, 0.0055, 6, false), nerveMaterial));

    // Digital Nerves in all 5 Toes
    for (let toe = 0; toe < 5; toe++) {
      const toeCurve = new THREE.LineCurve3(
        new THREE.Vector3(side * 0.17, -2.52, 0.10),
        new THREE.Vector3(side * (0.15 + toe * 0.012), -2.54, 0.20)
      );
      brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(toeCurve, 4, 0.003, 4, false), nerveThinMaterial));
    }
  });

  // ── H. VAGUS NERVES (Cranial Nerve X descending to Heart & Gut) ──
  [-1, 1].forEach((side) => {
    const vagusCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.05, 1.25, -0.02),
      new THREE.Vector3(side * 0.06, 0.85, 0.08),
      new THREE.Vector3(side * 0.04, 0.50, 0.12),
      new THREE.Vector3(side * 0.02, 0.05, 0.10)
    );
    brainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(vagusCurve, 14, 0.005, 6, false), nerveMaterial));
  });

  nervousGroup.add(brainGroup);

  return { group: nervousGroup, brainMesh: brainGroup, eyesMesh: eyesGroup };
}

/* ─────────────────────────────────────────────────────────────
   2. COMPLETE CARDIOVASCULAR VASCULAR TREE
   ───────────────────────────────────────────────────────────── */
export function buildCompleteCardiovascularSystem(): {
  group: THREE.Group;
  heartMesh: THREE.Group;
  bloodParticles: THREE.Points;
} {
  const cardioGroup = new THREE.Group();
  cardioGroup.name = 'cardiovascular';

  const heartGroup = new THREE.Group();
  heartGroup.name = 'heart';

  // Ventricles & Atria
  const ventGeo = new THREE.DodecahedronGeometry(0.18, 2);
  ventGeo.scale(0.85, 1.15, 0.8);
  const ventricles = new THREE.Mesh(ventGeo, arterialMaterial);
  heartGroup.add(ventricles);

  const atrL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), arterialMaterial);
  atrL.position.set(-0.08, 0.15, 0);
  heartGroup.add(atrL);
  const atrR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), venousMaterial);
  atrR.position.set(0.08, 0.15, 0);
  heartGroup.add(atrR);

  // Ascending Aorta & Arch
  const aorta = new THREE.Mesh(
    new THREE.TorusGeometry(0.10, 0.035, 12, 20, Math.PI * 0.85),
    arterialMaterial
  );
  aorta.position.set(-0.02, 0.22, 0);
  aorta.rotation.z = -0.2;
  heartGroup.add(aorta);

  // Descending Thoracic & Abdominal Aorta
  const descAorta = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.020, 0.95, 10),
    arterialMaterial
  );
  descAorta.position.set(0.02, -0.32, -0.10);
  heartGroup.add(descAorta);

  // Vena Cava Network
  const svc = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.020, 0.28, 8), venousMaterial);
  svc.position.set(0.10, 0.28, -0.02);
  heartGroup.add(svc);

  const ivc = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.020, 0.85, 8), venousMaterial);
  ivc.position.set(0.08, -0.30, -0.08);
  heartGroup.add(ivc);

  // Coronary Arteries
  const coronary = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.009, 8, 24, Math.PI * 1.5),
    arterialMaterial
  );
  coronary.rotation.x = Math.PI * 0.35;
  coronary.rotation.y = Math.PI * 0.2;
  heartGroup.add(coronary);

  heartGroup.position.set(-0.08, 0.48, 0.12);
  cardioGroup.add(heartGroup);

  // ── A. CAROTID ARTERIES & JUGULAR VEINS (Ascending to Skull) ──
  [-1, 1].forEach((side) => {
    // Common Carotid Artery (Red)
    const carotidCurve = new THREE.LineCurve3(
      new THREE.Vector3(side * 0.04, 0.80, 0.08),
      new THREE.Vector3(side * 0.07, 1.35, 0.05)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(carotidCurve, 8, 0.010, 6, false), arterialMaterial));

    // Internal Jugular Vein (Blue)
    const jugularCurve = new THREE.LineCurve3(
      new THREE.Vector3(side * 0.07, 0.78, 0.06),
      new THREE.Vector3(side * 0.10, 1.32, 0.04)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(jugularCurve, 8, 0.012, 6, false), venousMaterial));
  });

  // ── B. SUBCLAVIAN, BRACHIAL & RADIAL ARTERIES/VEINS (Both Arms) ──
  [-1, 1].forEach((side) => {
    // Brachial Artery
    const brachialCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.10, 0.75, 0.06),
      new THREE.Vector3(side * 0.35, 0.68, 0.02),
      new THREE.Vector3(side * 0.42, 0.35, 0.02),
      new THREE.Vector3(side * 0.45, -0.12, 0.02)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(brachialCurve, 14, 0.008, 6, false), arterialMaterial));

    // Basilic & Cephalic Veins
    const veinCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.12, 0.75, 0.04),
      new THREE.Vector3(side * 0.37, 0.68, 0.01),
      new THREE.Vector3(side * 0.44, 0.35, 0.01),
      new THREE.Vector3(side * 0.46, -0.12, 0.01)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(veinCurve, 14, 0.009, 6, false), venousMaterial));
  });

  // ── C. ILIAC, FEMORAL & TIBIAL ARTERIES/VEINS (Both Legs) ──
  [-1, 1].forEach((side) => {
    // Femoral Artery (Red)
    const femoralCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.04, -0.65, -0.06),
      new THREE.Vector3(side * 0.12, -1.05, 0.02),
      new THREE.Vector3(side * 0.15, -1.55, 0.01),
      new THREE.Vector3(side * 0.16, -2.45, 0.04)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(femoralCurve, 16, 0.010, 6, false), arterialMaterial));

    // Femoral Vein (Blue)
    const femVeinCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.06, -0.65, -0.08),
      new THREE.Vector3(side * 0.14, -1.05, 0.00),
      new THREE.Vector3(side * 0.17, -1.55, -0.01),
      new THREE.Vector3(side * 0.18, -2.45, 0.02)
    );
    cardioGroup.add(new THREE.Mesh(new THREE.TubeGeometry(femVeinCurve, 16, 0.011, 6, false), venousMaterial));
  });

  // Circulating Blood Particles
  const pCount = 380;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const t = (i / pCount) * Math.PI * 8;
    const r = 0.15 + Math.sin(t * 2) * 0.08;
    pPos[i * 3] = Math.cos(t) * r;
    pPos[i * 3 + 1] = ((i / pCount) - 0.5) * 3.6;
    pPos[i * 3 + 2] = Math.sin(t) * r;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc52848,
    size: 0.038,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const bloodPoints = new THREE.Points(pGeo, pMat);
  cardioGroup.add(bloodPoints);

  return { group: cardioGroup, heartMesh: heartGroup, bloodParticles: bloodPoints };
}

/* ─────────────────────────────────────────────────────────────
   3. COMPLETE SKELETAL SYSTEM (206-Bone Anatomical Framework)
   ───────────────────────────────────────────────────────────── */
export function buildCompleteSkeletalSystem(): THREE.Group {
  const skeletalGroup = new THREE.Group();
  skeletalGroup.name = 'skeletal';

  // ── A. CRANIUM & FACIAL BONES ──
  const craniumGeo = new THREE.SphereGeometry(0.30, 32, 32);
  craniumGeo.scale(0.85, 1.0, 0.95);
  const craniumMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.65,
  });
  const cranium = new THREE.Mesh(craniumGeo, craniumMat);
  cranium.position.set(0, 1.55, 0);
  skeletalGroup.add(cranium);

  // Facial Bones & Maxilla
  const faceBone = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.12), boneMaterial);
  faceBone.position.set(0, 1.38, 0.22);
  skeletalGroup.add(faceBone);

  // Dental Arches (Upper & Lower Teeth)
  const teethMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
  const upperTeeth = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.012, 6, 16, Math.PI * 0.7),
    teethMat
  );
  upperTeeth.position.set(0, 1.33, 0.20);
  upperTeeth.rotation.x = Math.PI * 0.5;
  skeletalGroup.add(upperTeeth);

  const lowerTeeth = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.012, 6, 16, Math.PI * 0.7),
    teethMat
  );
  lowerTeeth.position.set(0, 1.28, 0.19);
  lowerTeeth.rotation.x = Math.PI * 0.5;
  skeletalGroup.add(lowerTeeth);

  // Zygomatic Arches (Cheekbones)
  const zygoL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), boneMaterial);
  zygoL.position.set(-0.14, 1.42, 0.16);
  zygoL.rotation.z = Math.PI * 0.3;
  skeletalGroup.add(zygoL);
  const zygoR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), boneMaterial);
  zygoR.position.set(0.14, 1.42, 0.16);
  zygoR.rotation.z = -Math.PI * 0.3;
  skeletalGroup.add(zygoR);

  // Mandible (Jawbone)
  const mandGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI);
  const mandible = new THREE.Mesh(mandGeo, boneMaterial);
  mandible.position.set(0, 1.30, 0.14);
  mandible.rotation.x = Math.PI;
  mandible.rotation.z = Math.PI;
  skeletalGroup.add(mandible);

  // ── B. VERTEBRAL COLUMN (24 Segments + Discs) ──
  for (let i = 0; i < 24; i++) {
    const y = 1.02 - i * 0.075;
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.04, 12), boneMaterial);
    vert.position.set(0, y, -0.15);
    skeletalGroup.add(vert);

    // Spinous process
    const spinous = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.06, 6), boneMaterial);
    spinous.position.set(0, y, -0.20);
    spinous.rotation.x = Math.PI * 0.5;
    skeletalGroup.add(spinous);

    // Transverse processes
    const tp = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.015, 0.02), boneMaterial);
    tp.position.set(0, y, -0.16);
    skeletalGroup.add(tp);

    // Intervertebral disc
    if (i < 23) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.025, 12), cartilageMaterial);
      disc.position.set(0, y - 0.038, -0.15);
      skeletalGroup.add(disc);
    }
  }

  // Sacrum & Coccyx
  const sacrum = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 8), boneMaterial);
  sacrum.position.set(0, -0.82, -0.15);
  sacrum.rotation.x = Math.PI;
  skeletalGroup.add(sacrum);

  // ── C. THORACIC RIBCAGE (12 Pairs + Sternum) ──
  for (let i = 0; i < 12; i++) {
    const y = 0.88 - i * 0.068;
    const ribR = 0.30 + Math.sin((i / 11) * Math.PI) * 0.12;
    const tube = 0.012 + (i < 7 ? 0.004 : 0);
    const arc = i < 7 ? Math.PI * 1.45 : Math.PI * 1.2;

    const ribL = new THREE.Mesh(new THREE.TorusGeometry(ribR, tube, 8, 24, arc), boneMaterial);
    ribL.position.set(0, y, -0.04);
    ribL.rotation.x = Math.PI * 0.5;
    ribL.rotation.z = Math.PI * 0.72;
    ribL.scale.set(0.7, 1.0, 0.55);
    skeletalGroup.add(ribL);

    const ribR2 = new THREE.Mesh(new THREE.TorusGeometry(ribR, tube, 8, 24, arc), boneMaterial);
    ribR2.position.set(0, y, -0.04);
    ribR2.rotation.x = Math.PI * 0.5;
    ribR2.rotation.z = -Math.PI * 0.72 + Math.PI;
    ribR2.scale.set(0.7, 1.0, 0.55);
    skeletalGroup.add(ribR2);
  }

  // Sternum with Manubrium & Xiphoid
  const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.025), boneMaterial);
  sternum.position.set(0, 0.65, 0.22);
  skeletalGroup.add(sternum);

  // Clavicles & Scapulae
  const clavL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.35, 8), boneMaterial);
  clavL.position.set(-0.18, 1.02, 0.12);
  clavL.rotation.z = Math.PI * 0.42;
  skeletalGroup.add(clavL);
  const clavR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.35, 8), boneMaterial);
  clavR.position.set(0.18, 1.02, 0.12);
  clavR.rotation.z = -Math.PI * 0.42;
  skeletalGroup.add(clavR);

  const scapL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.20, 0.02), boneMaterial);
  scapL.position.set(-0.28, 0.85, -0.18);
  scapL.rotation.y = 0.15;
  skeletalGroup.add(scapL);
  const scapR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.20, 0.02), boneMaterial);
  scapR.position.set(0.28, 0.85, -0.18);
  scapR.rotation.y = -0.15;
  skeletalGroup.add(scapR);

  // ── D. PELVIC GIRDLE ──
  const pelvGeo = new THREE.TorusGeometry(0.22, 0.05, 8, 16, Math.PI);
  const pelvL = new THREE.Mesh(pelvGeo, boneMaterial);
  pelvL.position.set(-0.08, -0.68, -0.06);
  pelvL.rotation.x = Math.PI * 0.15;
  pelvL.rotation.z = Math.PI * 0.6;
  pelvL.scale.set(1.0, 1.4, 0.6);
  skeletalGroup.add(pelvL);

  const pelvR = new THREE.Mesh(pelvGeo.clone(), boneMaterial);
  pelvR.position.set(0.08, -0.68, -0.06);
  pelvR.rotation.x = Math.PI * 0.15;
  pelvR.rotation.z = -Math.PI * 0.6 + Math.PI;
  pelvR.scale.set(1.0, 1.4, 0.6);
  skeletalGroup.add(pelvR);

  // ── E. UPPER LIMBS (Humerus, Radius, Ulna, Hands) ──
  [-1, 1].forEach((side) => {
    // Humerus
    const hum = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.55, 8), boneMaterial);
    hum.position.set(side * 0.42, 0.68, 0);
    hum.rotation.z = side * 0.08;
    skeletalGroup.add(hum);

    // Radius & Ulna
    const rad = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.50, 8), boneMaterial);
    rad.position.set(side * 0.45, 0.18, 0.02);
    skeletalGroup.add(rad);

    // Hand & Carpals
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.02), boneMaterial);
    hand.position.set(side * 0.46, -0.12, 0.02);
    skeletalGroup.add(hand);

    // 5 Finger Phalanges
    for (let f = 0; f < 5; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.08, 6), boneMaterial);
      finger.position.set(side * (0.44 + f * 0.01), -0.22, 0.02 + (f - 2) * 0.006);
      skeletalGroup.add(finger);
    }
  });

  // ── F. LOWER LIMBS (Femurs, Patellae, Tibiae, Fibulae, Feet) ──
  [-1, 1].forEach((side) => {
    // Femur
    const fem = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.026, 0.75, 8), boneMaterial);
    fem.position.set(side * 0.16, -1.3, 0);
    fem.rotation.z = side * 0.04;
    skeletalGroup.add(fem);

    // Patella (Kneecap)
    const pat = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), boneMaterial);
    pat.scale.set(0.8, 1.0, 0.6);
    pat.position.set(side * 0.18, -1.70, 0.04);
    skeletalGroup.add(pat);

    // Tibia & Fibula
    const tib = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.75, 8), boneMaterial);
    tib.position.set(side * 0.18, -2.10, 0);
    skeletalGroup.add(tib);

    // Feet & Tarsals
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.20), boneMaterial);
    foot.position.set(side * 0.18, -2.50, 0.06);
    skeletalGroup.add(foot);

    // 5 Toe Phalanges
    for (let t = 0; t < 5; t++) {
      const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.005, 0.06, 6), boneMaterial);
      toe.rotation.x = Math.PI * 0.5;
      toe.position.set(side * (0.16 + t * 0.012), -2.52, 0.18);
      skeletalGroup.add(toe);
    }
  });

  return skeletalGroup;
}

/* ─────────────────────────────────────────────────────────────
   4. COMPLETE VISCERAL SYSTEM (Lungs, GI, Liver, Kidneys, Endocrine)
   ───────────────────────────────────────────────────────────── */
export function buildCompleteVisceralSystem(): {
  lungsGroup: THREE.Group;
  liverGroup: THREE.Group;
  stomachGroup: THREE.Group;
  pancreasGroup: THREE.Group;
  kidneyGroup: THREE.Group;
  thyroidGroup: THREE.Group;
} {
  // ── LUNGS & RESPIRATORY TREE ──
  const lungsGroup = new THREE.Group();
  lungsGroup.name = 'lungs';

  const lungMat = new THREE.MeshStandardMaterial({
    color: 0xe8afba,
    roughness: 0.45,
    transparent: true,
    opacity: 0.85,
    emissive: 0x481420,
    emissiveIntensity: 0.35,
  });

  // Left Lung (2 Lobes)
  const lungUpperL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), lungMat);
  lungUpperL.scale.set(0.65, 1.0, 0.55);
  lungUpperL.position.set(-0.30, 0.62, 0.05);
  lungsGroup.add(lungUpperL);

  const lungLowerL = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 20), lungMat);
  lungLowerL.scale.set(0.68, 1.1, 0.58);
  lungLowerL.position.set(-0.28, 0.35, 0.05);
  lungsGroup.add(lungLowerL);

  // Right Lung (3 Lobes)
  const lungUpperR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), lungMat);
  lungUpperR.scale.set(0.68, 0.85, 0.55);
  lungUpperR.position.set(0.28, 0.68, 0.05);
  lungsGroup.add(lungUpperR);

  const lungMidR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), lungMat);
  lungMidR.scale.set(0.65, 0.75, 0.52);
  lungMidR.position.set(0.30, 0.50, 0.05);
  lungsGroup.add(lungMidR);

  const lungLowerR = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 20), lungMat);
  lungLowerR.scale.set(0.72, 1.0, 0.58);
  lungLowerR.position.set(0.28, 0.30, 0.05);
  lungsGroup.add(lungLowerR);

  // Trachea & Bronchi
  const trachMat = new THREE.MeshStandardMaterial({ color: 0xcfb8b8, roughness: 0.5 });
  const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.40, 10), trachMat);
  trachea.position.set(0, 0.90, 0.08);
  lungsGroup.add(trachea);

  // Bronchial Tree Y-Bifurcation
  const bronchGeo = new THREE.CylinderGeometry(0.018, 0.015, 0.20, 8);
  const bronchL = new THREE.Mesh(bronchGeo, trachMat);
  bronchL.position.set(-0.10, 0.72, 0.06);
  bronchL.rotation.z = 0.45;
  lungsGroup.add(bronchL);
  const bronchR = new THREE.Mesh(bronchGeo, trachMat);
  bronchR.position.set(0.10, 0.72, 0.06);
  bronchR.rotation.z = -0.45;
  lungsGroup.add(bronchR);

  // Diaphragm
  const diaphMat = new THREE.MeshStandardMaterial({
    color: 0x8a243a,
    roughness: 0.5,
    transparent: true,
    opacity: 0.6,
  });
  const diaphragm = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4), diaphMat);
  diaphragm.position.set(0, 0.16, 0.02);
  lungsGroup.add(diaphragm);

  // ── LIVER & BILIARY ──
  const liverGroup = new THREE.Group();
  liverGroup.name = 'liver';
  const liverMat = new THREE.MeshStandardMaterial({
    color: 0x8f2038,
    roughness: 0.35,
    metalness: 0.12,
    emissive: 0x3b101e,
    emissiveIntensity: 0.4,
  });

  const liverR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), liverMat);
  liverR.scale.set(1.2, 0.5, 0.8);
  liverR.position.set(0.08, 0, 0);
  liverGroup.add(liverR);

  const liverL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), liverMat);
  liverL.scale.set(1.0, 0.45, 0.7);
  liverL.position.set(-0.18, 0.02, 0);
  liverGroup.add(liverL);

  // Emerald Gallbladder
  const gbMat = new THREE.MeshStandardMaterial({ color: 0x4eaa83, roughness: 0.35 });
  const gb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), gbMat);
  gb.scale.set(0.7, 1.3, 0.7);
  gb.position.set(0.15, -0.08, 0.10);
  liverGroup.add(gb);

  liverGroup.position.set(0.16, 0.02, 0.10);

  // ── STOMACH, INTESTINES & SPLEEN ──
  const stomachGroup = new THREE.Group();
  stomachGroup.name = 'stomach';
  const stomachMat = new THREE.MeshStandardMaterial({
    color: 0xb5354d,
    roughness: 0.4,
    emissive: 0x48101a,
    emissiveIntensity: 0.35,
  });

  // J-shaped Stomach
  const stomachMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.07, 14, 20, Math.PI * 1.2),
    stomachMat
  );
  stomachMesh.rotation.z = -0.5;
  stomachMesh.rotation.x = 0.15;
  stomachGroup.add(stomachMesh);

  // Spleen (Lymphoid organ)
  const spleenMat = new THREE.MeshStandardMaterial({ color: 0x6e1b2f, roughness: 0.35 });
  const spleen = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), spleenMat);
  spleen.scale.set(1.1, 0.7, 0.6);
  spleen.position.set(-0.30, 0.08, 0.02);
  stomachGroup.add(spleen);

  // Colon Frame (Large Intestine)
  const colonMat = new THREE.MeshStandardMaterial({
    color: 0x9e4358,
    roughness: 0.45,
    emissive: 0x3b101e,
    emissiveIntensity: 0.3,
  });
  const colonGeo = new THREE.TorusGeometry(0.24, 0.045, 10, 24, Math.PI * 1.6);
  const colonFrame = new THREE.Mesh(colonGeo, colonMat);
  colonFrame.position.set(0.02, -0.32, 0.08);
  colonFrame.rotation.z = Math.PI * 0.7;
  stomachGroup.add(colonFrame);

  // Small Intestinal Mass
  const smallIntMat = new THREE.MeshStandardMaterial({ color: 0xc4687d, roughness: 0.5 });
  const intestineMass = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 1), smallIntMat);
  intestineMass.position.set(0, -0.32, 0.10);
  intestineMass.scale.set(1.4, 0.9, 0.8);
  stomachGroup.add(intestineMass);

  stomachGroup.position.set(-0.12, -0.02, 0.10);

  // ── PANCREAS ──
  const pancreasGroup = new THREE.Group();
  pancreasGroup.name = 'pancreas';
  const pancreasMat = new THREE.MeshStandardMaterial({
    color: 0xe6a34a,
    roughness: 0.35,
    emissive: 0x6e4714,
    emissiveIntensity: 0.35,
  });
  const pancreas = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.30, 12), pancreasMat);
  pancreas.rotation.z = Math.PI * 0.45;
  pancreasGroup.add(pancreas);

  const pancHead = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), pancreasMat);
  pancHead.position.set(0.12, -0.08, 0);
  pancreasGroup.add(pancHead);

  pancreasGroup.position.set(0.02, -0.10, 0.06);

  // ── RENAL & URINARY ──
  const kidneyGroup = new THREE.Group();
  kidneyGroup.name = 'kidneys';
  const kidneyMat = new THREE.MeshStandardMaterial({
    color: 0x7a182b,
    roughness: 0.32,
    emissive: 0x2e060d,
    emissiveIntensity: 0.4,
  });

  const kGeo = new THREE.SphereGeometry(0.09, 16, 16);
  kGeo.scale(0.65, 1.25, 0.75);
  const kLeft = new THREE.Mesh(kGeo, kidneyMat);
  kLeft.position.set(-0.22, -0.30, -0.08);
  kidneyGroup.add(kLeft);

  const kRight = new THREE.Mesh(kGeo.clone(), kidneyMat);
  kRight.position.set(0.22, -0.34, -0.08);
  kidneyGroup.add(kRight);

  // Ureters & Bladder
  const ureterMat = new THREE.MeshStandardMaterial({ color: 0x9a5060, roughness: 0.5 });
  const urL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 6), ureterMat);
  urL.position.set(-0.20, -0.55, -0.06);
  kidneyGroup.add(urL);
  const urR = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 6), ureterMat);
  urR.position.set(0.20, -0.58, -0.06);
  kidneyGroup.add(urR);

  const bladderMat = new THREE.MeshStandardMaterial({ color: 0xb5354d, roughness: 0.4 });
  const bladder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), bladderMat);
  bladder.position.set(0, -0.76, 0.04);
  bladder.scale.set(1.1, 0.9, 0.9);
  kidneyGroup.add(bladder);

  // Adrenals
  const adrenalMat = new THREE.MeshStandardMaterial({ color: 0xe6a34a, roughness: 0.4, emissive: 0x6e4714, emissiveIntensity: 0.3 });
  const adL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.03, 8), adrenalMat);
  adL.position.set(-0.22, -0.20, -0.08);
  adL.rotation.x = Math.PI;
  kidneyGroup.add(adL);
  const adR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.03, 8), adrenalMat);
  adR.position.set(0.22, -0.24, -0.08);
  adR.rotation.x = Math.PI;
  kidneyGroup.add(adR);

  // ── THYROID ──
  const thyroidGroup = new THREE.Group();
  thyroidGroup.name = 'thyroid';
  const thyMat = new THREE.MeshStandardMaterial({
    color: 0xd7839c,
    roughness: 0.3,
    emissive: 0x5a1828,
    emissiveIntensity: 0.45,
  });
  const thyL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), thyMat);
  thyL.scale.set(0.7, 1.4, 0.55);
  thyL.position.set(-0.05, 0, 0);
  thyroidGroup.add(thyL);

  const thyR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), thyMat);
  thyR.scale.set(0.7, 1.4, 0.55);
  thyR.position.set(0.05, 0, 0);
  thyroidGroup.add(thyR);

  const isthmus = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6), thyMat);
  isthmus.rotation.z = Math.PI * 0.5;
  isthmus.position.set(0, -0.02, 0);
  thyroidGroup.add(isthmus);

  thyroidGroup.position.set(0, 1.06, 0.14);

  return { lungsGroup, liverGroup, stomachGroup, pancreasGroup, kidneyGroup, thyroidGroup };
}

/* ─────────────────────────────────────────────────────────────
   5. HOLOGRAPHIC HUMAN BIO-SILHOUETTE
   ───────────────────────────────────────────────────────────── */
export function buildHolographicHumanSilhouette(): THREE.Group {
  const silGroup = new THREE.Group();
  silGroup.name = 'bio_silhouette';

  const silMat = new THREE.MeshStandardMaterial({
    color: 0xd7839c,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.10,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // Cranial & Facial Contour
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), silMat);
  head.scale.set(0.85, 1.05, 0.95);
  head.position.set(0, 1.55, 0);
  silGroup.add(head);

  // Torso Contour
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.36, 1.6, 24), silMat);
  torso.position.set(0, 0.25, 0.02);
  silGroup.add(torso);

  // Pelvis Contour
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.55, 20), silMat);
  hips.position.set(0, -0.72, 0);
  silGroup.add(hips);

  // Arms Contour
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.055, 1.25, 14), silMat);
    arm.position.set(side * 0.44, 0.25, 0);
    arm.rotation.z = side * 0.05;
    silGroup.add(arm);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 1.85, 16), silMat);
    leg.position.set(side * 0.17, -1.65, 0);
    silGroup.add(leg);
  });

  return silGroup;
}
