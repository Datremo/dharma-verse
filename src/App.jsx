import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial,Icosahedron,TorusKnot , Billboard, Cylinder, Torus, Cone, Sphere, ScrollControls, Scroll, Text, Line, Float } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useVelocity, useMotionValue } from 'framer-motion';
import { EffectComposer, Bloom , Vignette} from '@react-three/postprocessing';
import * as THREE from 'three';

// 🎨 THEMES
const THEMES = {
  core: new THREE.Color("#ffffff"),
  brahma: new THREE.Color("#ffaa00"), 
  vishnu: new THREE.Color("#00ccff"), 
  shiva: new THREE.Color("#ff1100"),  
  kalyug: new THREE.Color("#1a0000") 
};

// 📜 THE LORE MODULES
const DEITY_MODULES = {
  shiva: [
    { id: "01", title: "Ananda Tandava", desc: "The cosmic dance of bliss. Nataraja creates, preserves, and destroys the universe in endless cycles of fiery rhythm." },
    { id: "02", title: "The Third Eye", desc: "The destroyer of illusion. When opened, it reduces ignorance and worldly desire to ashes, revealing raw truth." },
    { id: "03", title: "Conqueror of Time", desc: "Mahakala, the master of eternity. He who drank the Halahala poison to save the cosmos from absolute destruction." }
  ],
  vishnu: [
    { id: "01", title: "Kshira Sagara", desc: "The cosmic ocean of milk. Vishnu dreams the universe into existence while resting on the endless serpent, Shesha." },
    { id: "02", title: "The Dashavatara", desc: "The ten descents. Whenever dharma fades and chaos rises, he incarnates to restore the delicate balance of reality." },
    { id: "03", title: "The Ultimate Maya", desc: "The grand illusion. He weaves the fabric of reality so perfectly that even the gods forget their true, infinite nature." }
  ],
  brahma: [
    { id: "01", title: "Hiranyagarbha", desc: "The golden womb of creation. From a single, unimaginable point of density, he breathed the universe into expansion." },
    { id: "02", title: "The Four Faces", desc: "Looking into every dimension simultaneously. His mind holds the four Vedas, the fundamental source code of the cosmos." },
    { id: "03", title: "The Lotus Seat", desc: "Born from the navel of the infinite. He represents the purest state of intelligence required to architect existence." }
  ]
};
// 👆 END NEW BLOCK 👆

// 🌌 NEBULA GENERATOR
function generateNebulaClouds(numPoints, width, height, depth) {
  const positions = new Float32Array(numPoints * 3);
  const colors = new Float32Array(numPoints * 3);
  for (let i = 0; i < numPoints; i++) {
    positions[i * 3] = (Math.random() - 0.5) * width;
    positions[i * 3 + 1] = (Math.random() - 0.5) * height; 
    positions[i * 3 + 2] = (Math.random() - 0.5) * depth;
    colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
  }
  return { positions, colors };
}

// 👇 REPLACE ALL 3 WEAPONS WITH THIS BLOCK 👇
// ==========================================
// 🔱 THE SCROLL-DRIVEN 3D WEAPONS (Jitter Fixed + Warp Engine!)
// ==========================================

// 👇 REPLACE ALL 3 WEAPONS WITH THIS BLOCK 👇
// ==========================================
// 🔱 THE SCROLL-DRIVEN 3D WEAPONS (Perfectly Centered for Mobile!)
// ==========================================

const AbstractTrishul = ({ smoothScroll, isWarping }) => {
  const groupRef = useRef();
  const t = useRef(0);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const targetScale = isMobile ? 0.45 : 0.9; 

  useFrame((state, delta) => {
    t.current += delta;
    if (!groupRef.current) return;
    const scroll = smoothScroll.get();
    
    if (isWarping) {
      groupRef.current.rotation.y += delta * 20; 
      state.camera.position.lerp(new THREE.Vector3(groupRef.current.position.x, groupRef.current.position.y, 0), delta * 2); 
      return; 
    }
    
    let targetX = 0; 
    // 🔥 FIX: targetY is now 0.2 on mobile! This drops it DEAD CENTER of the screen!
    let targetY = isMobile ? 0.2 : 1.2; 
    if (scroll > 0.75) {
      const p = (scroll - 0.75) * 4; 
      targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : -3.5, p); 
      targetY = THREE.MathUtils.lerp(isMobile ? 0.2 : 1.2, isMobile ? 0.2 : 0, p);  
    }
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(5, 0, Math.min(scroll * 5, 1)); 
    groupRef.current.rotation.y += delta * (0.5 + scroll * 2);
    groupRef.current.rotation.z = Math.sin(t.current) * 0.1;
  });

  return (
    <group ref={groupRef} scale={[targetScale, targetScale, targetScale]}>
      <Cylinder args={[0.05, 0.05, 4]} position={[0, -1, 0]}><meshStandardMaterial color="#ff1100" emissive="#cc0000" emissiveIntensity={2} /></Cylinder>
      <Cylinder args={[0.08, 0.01, 1.5]} position={[0, 1.5, 0]}><meshStandardMaterial color="#ff1100" emissive="#ff4400" emissiveIntensity={3} /></Cylinder>
      <Cylinder args={[0.04, 0.01, 1.2]} position={[-0.4, 1.2, 0]} rotation={[0, 0, 0.4]}><meshStandardMaterial color="#ff1100" emissive="#ff4400" emissiveIntensity={2} /></Cylinder>
      <Cylinder args={[0.04, 0.01, 1.2]} position={[0.4, 1.2, 0]} rotation={[0, 0, -0.4]}><meshStandardMaterial color="#ff1100" emissive="#ff4400" emissiveIntensity={2} /></Cylinder>
      <pointLight color="#ff3300" distance={15} intensity={isWarping ? 50 : 5} />
    </group>
  );
};

const AbstractChakra = ({ smoothScroll, isWarping }) => {
  const groupRef = useRef();
  const t = useRef(0);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const targetScale = isMobile ? 0.4 : 0.8; 
  
  useFrame((state, delta) => {
    t.current += delta;
    if (!groupRef.current) return;
    const scroll = smoothScroll.get();
    
    if (isWarping) {
      groupRef.current.rotation.z -= delta * 30; 
      state.camera.position.lerp(new THREE.Vector3(groupRef.current.position.x, groupRef.current.position.y, 0), delta * 2);
      return;
    }
    
    let targetX = 0; 
    // 🔥 FIX: targetY is now 0.2 on mobile!
    let targetY = isMobile ? 0.2 : 1.2; 
    if (scroll > 0.75) {
      const p = (scroll - 0.75) * 4; 
      targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : -3.5, p); 
      targetY = THREE.MathUtils.lerp(isMobile ? 0.2 : 1.2, isMobile ? 0.2 : 0, p);  
    }
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(5, 0, Math.min(scroll * 5, 1)); 
    groupRef.current.rotation.z -= delta * (2 + scroll * 10); 
    groupRef.current.rotation.x = Math.PI / 2 + (scroll * Math.PI / 4); 
  });

  return (
    <group ref={groupRef} scale={[targetScale, targetScale, targetScale]}>
      <Torus args={[1, 0.1, 16, 100]}><meshStandardMaterial color="#00ccff" emissive="#0088ff" emissiveIntensity={3} /></Torus>
      <Torus args={[0.2, 0.05, 16, 100]}><meshStandardMaterial color="#00ccff" emissive="#0088ff" emissiveIntensity={2} /></Torus>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Cylinder key={i} args={[0.01, 0.1, 2.2]} rotation={[0, 0, (Math.PI / 4) * i]}>
          <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} />
        </Cylinder>
      ))}
      <pointLight color="#00ccff" distance={15} intensity={isWarping ? 50 : 5} />
    </group>
  );
};

const AbstractLotus = ({ smoothScroll, isWarping }) => {
  const groupRef = useRef();
  const t = useRef(0);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const targetScale = isMobile ? 0.35 : 0.7; 
  
  useFrame((state, delta) => {
    t.current += delta;
    if (!groupRef.current) return;
    const scroll = smoothScroll.get();
    
    if (isWarping) {
      groupRef.current.rotation.y += delta * 15;
      groupRef.current.children.forEach((petal, i) => { if (i > 0) petal.rotation.x += delta * 2; }); 
      state.camera.position.lerp(new THREE.Vector3(groupRef.current.position.x, groupRef.current.position.y, 0), delta * 2);
      return;
    }
    
    let targetX = 0; 
    // 🔥 FIX: targetY is now 0.2 on mobile!
    let targetY = isMobile ? 0.2 : 1.2; 
    if (scroll > 0.75) {
      const p = (scroll - 0.75) * 4; 
      targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : -3.5, p); 
      targetY = THREE.MathUtils.lerp(isMobile ? 0.2 : 1.2, isMobile ? 0.2 : 0, p);  
    }
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(5, 0, Math.min(scroll * 5, 1)); 
    groupRef.current.rotation.y += delta * (0.5 + scroll); 
    groupRef.current.children.forEach((petal, i) => {
      if (i > 0) petal.rotation.x = THREE.MathUtils.lerp(0.1, 1.4, scroll); 
    });
  });

  return (
    <group ref={groupRef} scale={[targetScale, targetScale, targetScale]}>
      <pointLight color="#ffaa00" distance={15} intensity={isWarping ? 50 : 5} />
      <Sphere args={[0.3, 32, 32]}><meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} /></Sphere>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <group key={i} rotation={[0, (Math.PI / 4) * i, 0]}>
          <Cone args={[0.4, 2, 16]} position={[0, 0.5, 0.5]} rotation={[0.5, 0, 0]}>
            <meshStandardMaterial color="#ffaa00" emissive="#cc7700" emissiveIntensity={2} wireframe={true} />
          </Cone>
        </group>
      ))}
    </group>
  );
};
// 👆 END WEAPONS BLOCK 👆

// 👇 REPLACE THE LoreCard COMPONENT WITH THIS 👇
// ==========================================
// 🃏 THE INTERACTIVE LORE CARD (Gallery Ratio)
// ==========================================
const LoreCard = ({ mod, themeColor, glowBorder, isShiva, isVishnu, scrollVelocity }) => {
  const skewX = useTransform(scrollVelocity, [-2, 2], [10, -10]);
  const smoothSkew = useSpring(skewX, { stiffness: 200, damping: 30 });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const rotateY = useTransform(mouseX, [0, 1], [-6, 6]);
  const rotateX = useTransform(mouseY, [0, 1], [6, -6]);
  const springRotX = useSpring(rotateX, { stiffness: 400, damping: 30 });
  const springRotY = useSpring(rotateY, { stiffness: 400, damping: 30 });

  const glowX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ skewX: smoothSkew, rotateX: springRotX, rotateY: springRotY }}
      // 🔥 FIX: Made it wider and shorter (35vh) so it fits perfectly on the bottom!
      className={`w-[85vw] md:w-[35vw] h-[40vh] md:h-[35vh] flex-shrink-0 backdrop-blur-3xl bg-black/40 border ${glowBorder} p-8 md:p-10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden pointer-events-auto cursor-crosshair group flex flex-col justify-center`}
    >
       <motion.div 
          style={{ left: glowX, top: glowY, x: "-50%", y: "-50%" }}
          className={`absolute w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0 ${isShiva ? 'bg-[#ff1100]' : isVishnu ? 'bg-[#00ccff]' : 'bg-[#ffaa00]'}`} 
       />
       
       <h4 className={`${themeColor} text-5xl md:text-7xl font-serif opacity-10 absolute -top-2 -right-2 pointer-events-none z-0 select-none`}>
         {mod.id}
       </h4>
       
       <div className="relative z-10">
         <h2 className="text-white text-2xl md:text-3xl font-serif uppercase tracking-widest mb-4 drop-shadow-lg">
           {mod.title}
         </h2>
         <div className={`w-8 h-1 mb-4 ${isShiva ? 'bg-[#ff1100]' : isVishnu ? 'bg-[#00ccff]' : 'bg-[#ffaa00]'}`} />
         <p className="text-white/80 text-sm md:text-base leading-relaxed font-light drop-shadow-md">
           {mod.desc}
         </p>
       </div>
    </motion.div>
  );
};
// 👆 END LORE CARD BLOCK 👆


// 👇 REPLACE THE ScrollExperience COMPONENT WITH THIS 👇
// ==========================================
// 📱 THE HYPER-OS SCROLL CONTAINER (Flawless Mobile Layout!)
// ==========================================
const ScrollExperience = ({ guide, onBack, onEnterHub }) => {
  const [isWarping, setIsWarping] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    document.body.style.overflow = isWarping ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'hidden'; };
  }, [isWarping]);

  const handleBeginJourney = () => {
    setIsWarping(true);
    setTimeout(() => { onEnterHub(); }, 2500);
  };

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });
  const scrollVelocity = useVelocity(smoothScroll);

  // Intro text gracefully vanishes by 15% scroll!
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -100]); 
  const introScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  
  const cardsX = useTransform(scrollYProgress, [0.15, 0.75], isMobile ? ["100vw", "-280vw"] : ["100vw", "-120vw"]);
  
  // CTA only shows up at the absolute bottom (80%+)
  const climaxOpacity = useTransform(scrollYProgress, [0.80, 0.90, 1], [0, 1, 1]);
  const climaxScale = useTransform(scrollYProgress, [0.80, 0.90, 1], [0.8, 1, 1]);
  const climaxY = useTransform(scrollYProgress, [0.80, 0.90, 1], [50, 0, 0]);

  const isShiva = guide === 'shiva';
  const isVishnu = guide === 'vishnu';
  const themeColor = isShiva ? 'text-[#ff1100]' : isVishnu ? 'text-[#00ccff]' : 'text-[#ffaa00]';
  const glowBorder = isShiva ? 'border-[#ff1100]/30' : isVishnu ? 'border-[#00ccff]/30' : 'border-[#ffaa00]/30';
  const deityName = isShiva ? 'Shiva' : isVishnu ? 'Vishnu' : 'Brahma';
  const guideTitle = isShiva ? 'The Destroyer of Illusion' : isVishnu ? 'The Preserver of Dharma' : 'The Creator of Reality';
  const modules = DEITY_MODULES[guide];

  return (
    <div className="relative w-full h-[500vh] bg-[#010101]">
      
      <AnimatePresence>
        {isWarping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="fixed inset-0 z-[100] bg-white" />
        )}
      </AnimatePresence>

      {!isWarping && (
        <button onClick={onBack} className="fixed top-6 left-6 md:top-8 md:left-8 z-50 px-4 md:px-6 py-2 border border-white/20 rounded-full text-white/70 text-[10px] md:text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all backdrop-blur-md cursor-pointer flex items-center shadow-2xl">
          ← Back
        </button>
      )}

      <div className="fixed top-1/2 right-2 md:right-6 -translate-y-1/2 w-[2px] h-32 md:h-64 bg-white/10 z-50 rounded-full overflow-hidden opacity-30">
        <motion.div style={{ scaleY: smoothScroll, originY: 0 }} className={`w-full h-full ${isShiva ? 'bg-[#ff1100]' : isVishnu ? 'bg-[#00ccff]' : 'bg-[#ffaa00]'}`} />
      </div>

      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-1000">
        
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            {isShiva && <AbstractTrishul smoothScroll={smoothScroll} isWarping={isWarping} />}
            {isVishnu && <AbstractChakra smoothScroll={smoothScroll} isWarping={isWarping} />}
            {!isShiva && !isVishnu && <AbstractLotus smoothScroll={smoothScroll} isWarping={isWarping} />}
            <Points positions={generateNebulaClouds(5000, 20, 20, 20).positions} stride={3}>
              <PointMaterial transparent size={0.02} color={isShiva ? "#ff1100" : isVishnu ? "#00ccff" : "#ffaa00"} opacity={0.3} />
            </Points>
          </Canvas>
        </div>

        {/* 🔥 FIX 1: Intro Text - Pulled down to top-[25%] on mobile so it clears the notch beautifully! */}
        <motion.div 
          style={{ opacity: introOpacity, y: introY, scale: introScale }} 
          className="absolute top-[25%] md:top-1/4 left-0 right-0 md:left-auto md:right-32 px-6 md:px-0 w-full max-w-lg z-10 flex flex-col gap-2 md:gap-4 text-center md:text-right pointer-events-none"
        >
          <h3 className="text-white/50 tracking-[0.4em] uppercase text-xs md:text-sm">Your Guide</h3>
          <h1 className={`${themeColor} text-6xl md:text-8xl font-serif uppercase tracking-[0.2em] drop-shadow-[0_0_30px_currentColor] leading-none`}>{deityName}</h1>
          <h2 className="text-white/80 text-sm md:text-2xl font-light tracking-widest uppercase">{guideTitle}</h2>
        </motion.div>

        {/* Bottom Cards Gallery */}
        <div className="absolute bottom-12 w-full flex items-center z-20 pointer-events-none">
          <motion.div style={{ x: cardsX }} className="flex gap-6 md:gap-16 items-center h-full px-[10vw]">
            {modules.map((mod) => (
              <LoreCard key={mod.id} mod={mod} themeColor={themeColor} glowBorder={glowBorder} isShiva={isShiva} isVishnu={isVishnu} scrollVelocity={scrollVelocity} />
            ))}
          </motion.div>
        </div>

        {/* 🔥 FIX 2: Climax CTA - Removed the buggy ternary opacity operator! Pure Framer Motion math now! */}
        <motion.div 
          style={{ opacity: climaxOpacity, scale: climaxScale, y: climaxY }} 
          className={`absolute left-0 right-0 md:left-auto md:right-32 top-[60%] md:top-1/2 -translate-y-1/2 z-30 flex flex-col items-center md:items-end gap-6 md:gap-10 pointer-events-auto text-center md:text-right px-6`}
        >
          <h1 className="text-white text-3xl md:text-6xl font-serif uppercase tracking-[0.2em] md:tracking-[0.3em] drop-shadow-2xl leading-tight">
            Are you ready to <br/>
            <span className={`${themeColor} drop-shadow-[0_0_40px_currentColor] text-5xl md:text-8xl block mt-2 md:mt-4`}>awaken?</span>
          </h1>
          <button 
            onClick={handleBeginJourney}
            className={`px-10 md:px-14 py-4 md:py-6 border border-current ${themeColor} hover:bg-white/10 transition-all uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-base font-bold rounded-full backdrop-blur-md shadow-[0_0_30px_currentColor] hover:shadow-[0_0_60px_currentColor] hover:scale-105 cursor-pointer`}
          >
            Begin The Journey
          </button>
        </motion.div>

      </div>
    </div>
  );
};
// 👆 END REPLACED SECTION 👆

// ==========================================
// 🎥 THE CINEMATIC DRONE CAMERA (Zooms into his presentation!)
// ==========================================
const HubCameraPan = () => {
  const t = useRef(0);
  
  useFrame((state, delta) => {
    t.current += delta;
    
    // 🚁 Fly-In Math: Starts far back (Z:35) and flies rapidly in (Z:12)
    const progress = Math.min(t.current * 0.25, 1); 
    const ease = 1 - Math.pow(1 - progress, 3); // Cubic easing for drama

    const targetZ = THREE.MathUtils.lerp(35, 12, ease);
    
    // Camera rises to look him in the eye as he emerges
    const baseCamY = THREE.MathUtils.lerp(0, 8, ease);
    const camY = baseCamY + Math.cos(t.current * 0.2) * 1.2; // Ocean bobbing
    const camX = Math.sin(t.current * 0.1) * 2; 

    state.camera.position.lerp(new THREE.Vector3(camX, camY, targetZ), delta * 3);
    
    // 🔥 LENS FOCUS: Locked onto his upper torso/face (Y:20). 
    // This perfectly positions his open hands at the bottom behind the UI cards!
    state.camera.lookAt(0, 20, -40); 
  });
  return null;
};
// ==========================================
// 🌊 THE INFINITE OCEAN OF MILK (Scroll Reactive)
// ==========================================
const OceanOfMilk = ({ smoothProgress }) => {
  const pointsRef = useRef();
  const geomRef = useRef();
  const t = useRef(0);

  useFrame((state, delta) => {
    t.current += delta * 0.3; 
    const p = smoothProgress ? smoothProgress.get() : 0;
    
    if (!geomRef.current || !pointsRef.current) return;
    
    // 🔥 SCROLL MAGIC: The ocean sinks into the abyss as you scroll!
    pointsRef.current.position.y = -4 - (p * 40);
    pointsRef.current.material.opacity = Math.max(0, 0.6 - (p * 4));

    const positions = geomRef.current.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.2 + t.current) * 0.6 + Math.cos(y * 0.2 + t.current) * 0.6;
    }
    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -10]}>
      <planeGeometry ref={geomRef} args={[150, 150, 150, 150]} />
      <pointsMaterial size={0.05} color="#6366f1" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
};

// ==========================================
// 🌌 THE COSMIC VISHNU BACKDROP (Flies past camera on scroll!)
// ==========================================
const VishnuBackdrop = ({ smoothProgress }) => {
  const groupRef = useRef();
  const materialRef = useRef();
  const [texture, setTexture] = useState(null);
  const [size, setSize] = useState([16, 9]); 
  const t = useRef(0);

  useEffect(() => {
    new THREE.TextureLoader().load('/kshirsagar.png', 
      (loadedTex) => {
        const imgAspect = loadedTex.image.width / loadedTex.image.height;
        setSize([70 * imgAspect, 70]); 
        setTexture(loadedTex);
      }
    );
  }, []);

  useFrame((state, delta) => {
    t.current += delta;
    const p = smoothProgress ? smoothProgress.get() : 0;
    
    if (materialRef.current) {
      // Base breathing + Scroll fade (Fades out completely by 20% scroll)
      const scrollFade = Math.max(0, 1 - (p * 5));
      materialRef.current.opacity = scrollFade * (0.95 + Math.sin(t.current * 0.5) * 0.05);
    }
    
    if (groupRef.current) {
      // Initial rise from ocean
      const introY = THREE.MathUtils.lerp(-60, 15, Math.min(1, t.current * 0.6));
      
      // 🔥 SCROLL MAGIC: Vishnu flies UP and TOWARDS the camera, swallowing the screen!
      const scrollY = introY + (p * 60);
      const scrollZ = -40 + (p * 150); 
      
      groupRef.current.position.set(0, scrollY, scrollZ);
    }
  });

  return (
    <group ref={groupRef} position={[0, -60, -40]}>
      <Billboard>
        <mesh>
          <planeGeometry args={size} />
{/* 🔥 FIX: Removed AdditiveBlending and added toneMapped={false} so it doesn't turn into a lightbulb! */}
          <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={1} depthWrite={false} />   </mesh>
      </Billboard>
    </group>
  );
};

// ==========================================
// 🎴 THE SLEEK DASHBOARD CARDS
// ==========================================
const HubMonolith = ({ data, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 + (index * 0.3), duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[85vw] md:w-[28vw] h-[20vh] md:h-[22vh] backdrop-blur-2xl bg-[#000a1a]/60 border border-[#fbbf24]/30 rounded-2xl hover:border-[#fbbf24] hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-500 cursor-default group overflow-hidden flex flex-col justify-center px-6 md:px-8 flex-shrink-0"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#fbbf24]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <h3 className="text-[#fbbf24] tracking-[0.3em] uppercase text-[9px] md:text-[10px] mb-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">{data.subtitle}</h3>
      <h2 className="text-white text-xl md:text-2xl font-serif uppercase tracking-widest mb-2 z-10">{data.title}</h2>
      <p className="text-white/60 text-[10px] md:text-xs font-light leading-relaxed z-10 line-clamp-2">{data.desc}</p>
      <div className="absolute top-0 right-8 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent group-hover:scale-x-150 transition-transform duration-700" />
    </motion.div>
  );
};

// ==========================================
// 🌌 THE 3D ARTIFACTS MANAGER (Mapped to bottom 80% of Scroll)
// ==========================================
const CosmicArtifacts = ({ smoothProgress }) => {
  const karmaRef = useRef(); const dharmaRef = useRef();
  const atmanRef = useRef(); const mayaRef = useRef();
  const cameraGroupRef = useRef(); const t = useRef(0);

  useFrame((state, delta) => {
    t.current += delta;
    const p = smoothProgress.get(); 

    if (cameraGroupRef.current) {
      cameraGroupRef.current.position.y = THREE.MathUtils.lerp(1, -1, p);
      cameraGroupRef.current.position.z = THREE.MathUtils.lerp(0, 1.5, p); 
      cameraGroupRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, 0.2, Math.sin(p * Math.PI));
    }

    // --- RECALIBRATED MATH (Vishnu takes 0-20%, Artifacts take 20%-100%) ---

    // Phase 1: Karma (Strictly 0.20 to 0.45)
    const karmaOp = p > 0.20 && p < 0.45 ? Math.sin(((p - 0.20) / 0.25) * Math.PI) : 0;
    if (karmaRef.current) {
      karmaRef.current.visible = karmaOp > 0.01;
      karmaRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.6, (p - 0.2) * 4));
      karmaRef.current.rotation.x = (p * Math.PI * 4) + (t.current * 0.1);
      karmaRef.current.rotation.y = (p * Math.PI * 2) + (t.current * 0.05);
      karmaRef.current.children.forEach(c => { if(c.material) c.material.opacity = Math.max(0, karmaOp); });
    }

    // Phase 2: Dharma (Strictly 0.40 to 0.65)
    const dharmaOp = p > 0.40 && p < 0.65 ? Math.sin(((p - 0.40) / 0.25) * Math.PI) : 0;
    if (dharmaRef.current) {
      dharmaRef.current.visible = dharmaOp > 0.01;
      dharmaRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.5, (p - 0.4) * 4));
      dharmaRef.current.rotation.y = -(p * Math.PI * 4) - (t.current * 0.1);
      dharmaRef.current.children.forEach(c => { if(c.material) c.material.opacity = Math.max(0, dharmaOp); });
    }

    // Phase 3: Atman (Strictly 0.60 to 0.85)
    const atmanOp = p > 0.60 && p < 0.85 ? Math.sin(((p - 0.60) / 0.25) * Math.PI) : 0;
    if (atmanRef.current) {
      atmanRef.current.visible = atmanOp > 0.01;
      atmanRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.5, (p - 0.6) * 4));
      atmanRef.current.rotation.x = (p * Math.PI * 3) + (t.current * 0.1);
      atmanRef.current.children.forEach(c => { if(c.material) c.material.opacity = Math.max(0, atmanOp); });
    }

    // Phase 4: Maya (Strictly 0.80 to 1.0)
    const mayaOp = p > 0.80 ? Math.min(1, (p - 0.80) * 5) : 0;
    if (mayaRef.current) {
      mayaRef.current.visible = mayaOp > 0.01;
      mayaRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.5, (p - 0.8) * 5));
      mayaRef.current.rotation.x = (p * Math.PI * 6) + (t.current * 0.2); 
      mayaRef.current.rotation.z = (p * Math.PI * 4);
      mayaRef.current.children.forEach(c => { if(c.material) c.material.opacity = Math.max(0, mayaOp * 0.8); });
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <group ref={karmaRef} position={[2, 0, 0]}><Torus args={[1.5, 0.02, 16, 100]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2} transparent /></Torus><Torus args={[1.2, 0.05, 16, 100]} rotation={[0, Math.PI/3, 0]}><meshStandardMaterial color="#ff3366" emissive="#cc0044" emissiveIntensity={1} transparent /></Torus><Torus args={[0.9, 0.02, 16, 100]} rotation={[0, 0, Math.PI/4]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} transparent /></Torus></group>
      <group ref={dharmaRef} position={[-2, 0, 0]}><Icosahedron args={[1.2, 0]}><meshStandardMaterial color="#00ccff" emissive="#0088ff" emissiveIntensity={1} wireframe transparent /></Icosahedron><Icosahedron args={[0.6, 0]}><meshStandardMaterial color="#ffffff" emissive="#00ccff" emissiveIntensity={3} transparent /></Icosahedron></group>
      <group ref={atmanRef} position={[2, 0, 0]}><Sphere args={[1, 64, 64]}><meshStandardMaterial color="#000000" roughness={0.1} metalness={1} transparent /></Sphere><Sphere args={[1.05, 32, 32]}><meshBasicMaterial color="#fbbf24" wireframe transparent /></Sphere><Torus args={[1.8, 0.01, 16, 100]} rotation={[Math.PI/2, 0, 0]}><meshBasicMaterial color="#ffffff" transparent /></Torus></group>
      <group ref={mayaRef} position={[-2, 0, 0]}><TorusKnot args={[1, 0.3, 200, 32]}><meshStandardMaterial color="#b026ff" emissive="#6600cc" emissiveIntensity={2} wireframe transparent /></TorusKnot><Sphere args={[0.4, 16, 16]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} transparent /></Sphere></group>
    </group>
  );
};

// 🌌 BACKGROUND DUST
const BackgroundStars = ({ scrollVelocity }) => {
  const [nebula] = useState(() => generateNebulaClouds(3000, 30, 30, 30));
  const ref = useRef(); const materialRef = useRef();

  useFrame((state, delta) => {
    if (ref.current && materialRef.current) {
      ref.current.rotation.y -= delta * 0.02;
      const velocity = Math.abs(scrollVelocity.get());
      materialRef.current.size = THREE.MathUtils.lerp(materialRef.current.size, 0.02 + velocity * 0.4, delta * 5);
      materialRef.current.opacity = THREE.MathUtils.lerp(0.2, Math.min(1, 0.2 + velocity * 2), delta * 5);
    }
  });

  return (
    <Points ref={ref} positions={nebula.positions} stride={3}>
      <PointMaterial ref={materialRef} size={0.02} color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
    </Points>
  );
};

// 📜 LORE DATA
const DHARMA_LORE = [
  { id: "01", phase: "KARMA", title: "The Engine of Consequence", subtitle: "Action is your right, but never the fruit thereof.", desc: "Every thought, every breath, every movement sends an infinite ripple through the cosmic ocean. Karma is not a system of punishment and reward; it is the absolute physics of the soul. For every action, the universe perfectly balances the equation.", color: "#ff3366" },
  { id: "02", phase: "DHARMA", title: "The Cosmic Architecture", subtitle: "Better is one's own path, though imperfect.", desc: "Dharma is the invisible framework that holds reality together. It is your ultimate purpose, encoded into your very being before you were born. When you align with it, the universe flows through you. When you fight it, you encounter the friction of suffering.", color: "#00ccff" },
  { id: "03", phase: "ATMAN", title: "The Indestructible Core", subtitle: "The soul is never born, and it never dies.", desc: "Weapons cannot cut it, fire cannot burn it, water cannot wet it, and wind cannot dry it. Beneath the layers of your ego, your job, your memories, and your pain lies the eternal observer. You are not a drop in the ocean; you are the entire ocean in a drop.", color: "#fbbf24" },
  { id: "04", phase: "MAYA", title: "The Grand Illusion", subtitle: "Everything is an illusion woven by the mind.", desc: "The world you see, touch, and measure is merely a projection. Maya is the divine matrix, a simulation so perfect that even the gods forget their true nature when they step inside it. To awaken is to see the code behind the curtain.", color: "#b026ff" }
];
const VISHNU_HUB_DATA = [
  { id: 'dashavatara', title: 'The Dashavatara', subtitle: 'Evolution of Soul', desc: 'Trace the ten descents of the preserver through the endless cycles of time.' },
  { id: 'dharma', title: 'Web of Dharma', subtitle: 'Cosmic Philosophy', desc: 'Explore the interconnected truths and divine logic of the Bhagavad Gita.' },
  { id: 'balance', title: 'Center of Balance', subtitle: 'Meditation Zone', desc: 'Anchor yourself in the chaos of Kalyug. Release the illusion of control.' }
];

// ==========================================
// 🚀 THE UNIFIED COSMIC EXPERIENCE (Hub + Lore in one continuous scroll!)
// ==========================================
// ==========================================
// 🚀 THE UNIFIED COSMIC EXPERIENCE (Slow, Floating, Zero-Snap Edition!)
// ==========================================
const CosmicHub = ({ guide, onBack }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // 🔥 FIX 1: Heavy, syrupy physics. Less stiffness, more mass!
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 30, mass: 2 });
  const scrollVelocity = useVelocity(smoothProgress);  
  const scaleY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  if (guide !== 'vishnu') {
    return (
      <div className="w-full h-screen bg-[#010101] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl tracking-widest uppercase mb-4">{guide} Hub Coming Soon!</h1>
        <button onClick={onBack} className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-xs">← Go Back</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="relative w-full h-screen bg-[#0a0514] overflow-hidden font-sans">
      
      {/* 🔙 Fixed Navigation */}
      <button onClick={onBack} className="absolute top-6 left-6 z-50 px-4 md:px-6 py-2 border border-[#fbbf24]/50 rounded-full text-[#fbbf24] text-[9px] md:text-xs tracking-widest uppercase hover:bg-[#fbbf24]/20 transition-all backdrop-blur-md cursor-pointer flex items-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
        ← Return
      </button>

      {/* 📊 Fixed Scroll Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 h-1/3 w-[2px] bg-white/10 z-50 rounded-full overflow-hidden hidden md:block">
        <motion.div style={{ height: scaleY }} className="w-full bg-gradient-to-b from-[#fbbf24] via-[#00ccff] to-[#b026ff] origin-top rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>

      {/* 🌌 Fixed 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <fog attach="fog" args={['#0a0514', 10, 80]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 10, -10]} color="#fbbf24" intensity={2} distance={50} />
          
          <EffectComposer disableNormalPass>
            {/* 🔥 FIX: Raised threshold to 1.0! Now the image stays crisp, and ONLY the neon 3D models will glow! */}
            <Bloom luminanceThreshold={1.0} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          <OceanOfMilk smoothProgress={smoothProgress} />
          <React.Suspense fallback={null}>
             <VishnuBackdrop smoothProgress={smoothProgress} />
          </React.Suspense>
          <CosmicArtifacts smoothProgress={smoothProgress} />
          <BackgroundStars scrollVelocity={scrollVelocity} />
        </Canvas>
      </div>

      {/* 🔥 FIX 2: Removed 'snap-y snap-mandatory' so you have 100% control over the scroll speed! */}
      <div ref={containerRef} className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scroll-smooth">
        
        {/* PAGE 1: THE HUB */}
        {/* Increased min-h so the scroll distance to the next section takes longer */}
        <div className="relative w-full min-h-[120vh] flex flex-col justify-end pointer-events-none pb-24">
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.5 }} className="absolute top-[15%] w-full text-center">
             <h1 className="text-[#fbbf24] text-xl md:text-2xl font-serif tracking-[0.6em] uppercase drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
               Kshira Sagara
             </h1>
           </motion.div>

           <div className="w-full flex flex-row gap-4 md:gap-8 justify-start md:justify-center items-end px-6 md:px-12 overflow-x-auto pointer-events-auto">
             {VISHNU_HUB_DATA.map((data, i) => (
               <div key={data.id}>
                  <HubMonolith data={data} index={i} />
               </div>
             ))}
           </div>
           
           <div className="absolute bottom-6 w-full flex justify-center animate-bounce opacity-70">
              <p className="text-white text-[10px] tracking-[0.3em] uppercase drop-shadow-md">Scroll Down Slowly ↓</p>
           </div>
        </div>

        {/* PAGES 2-5: THE DHARMA LORE */}
        {DHARMA_LORE.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={section.id} className="relative w-full min-h-[120vh] flex items-center pointer-events-none py-20">
              {/* 🔥 Moved the comment inside the div! Increased height to 120vh for super slow 3D transitions! */}
              <div className={`w-full max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                <div className={`${isEven ? 'order-2' : 'order-1'} hidden md:block`}></div>

                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50, filter: "blur(15px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, margin: "-40% 0px -40% 0px" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`${isEven ? 'order-1' : 'order-2'} flex flex-col justify-center`}
                >
                  <div className="flex items-center gap-4 mb-8 opacity-60">
                    <span className="text-xs tracking-[0.4em] font-mono text-white">{section.id} // 04</span>
                    <div className="h-[1px] w-12 bg-white/50"></div>
                    <span style={{ color: section.color }} className="text-xs tracking-[0.3em] font-bold uppercase drop-shadow-md">
                      {section.phase}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white uppercase leading-[1.1] mb-6 drop-shadow-2xl">
                    {section.title}
                  </h1>
                  <h3 className="text-lg md:text-2xl italic text-white/80 font-light mb-8 border-l-2 pl-6" style={{ borderColor: section.color }}>
                    "{section.subtitle}"
                  </h3>
                  <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: section.color }}></div>
                    <p className="text-sm md:text-base text-white/60 leading-loose tracking-wide font-light">
                      {section.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}

        <div className="w-full h-[30vh] flex justify-center items-center pointer-events-none">
          <p className="text-white/20 text-xs tracking-[0.5em] uppercase animate-pulse">End of Sequence</p>
        </div>

      </div>
    </motion.div>
  );
};
// 👇 REPLACE SceneController, NebulaClouds, AND DeityFace WITH THIS 👇
// ==========================================
// 🎬 REBUILT INTRO CONTROLLER (Warning Fixed!)
// ==========================================

const SceneController = ({ step, speed }) => {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const fogColor = useRef(new THREE.Color("#ffffff"));
  const t = useRef(0); // ⏱️ CUSTOM CLOCK FIX!

  useFrame((state, delta) => {
    t.current += delta;
    let targetHex = THEMES.core;
    if (step >= 6 && step < 8) targetHex = THEMES.brahma; 
    else if (step >= 8 && step < 10) targetHex = THEMES.vishnu; 
    else if (step >= 10 && step < 12) targetHex = THEMES.shiva; 
    else if (step >= 12 && step < 15) targetHex = THEMES.kalyug; 
    else if (step >= 15) targetHex = new THREE.Color("#111111"); 
    
    fogColor.current.lerp(targetHex, delta * 0.8 * speed);
    state.scene.fog.color.copy(fogColor.current);
    
    let targetPos = new THREE.Vector3(0, 0, 4);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (step === 5) { targetPos.set(0, 0, 1.5); targetLook.set(0, 0, -5); } 
    else if (step >= 6 && step < 8) { targetPos.set(-4, -1.5, 0.5); targetLook.set(-5, 2, -2); } 
    else if (step >= 8 && step < 10) { targetPos.set(0, 2, -2); targetLook.set(0, 2, -6); } 
    else if (step >= 10 && step < 12) { targetPos.set(4, -1.5, -6); targetLook.set(5, 2, -10); } 
    else if (step >= 12 && step < 15) { 
      targetPos.set(Math.sin(t.current) * 0.5, Math.cos(t.current) * 0.5, 5); // 🔥 FIX
      targetLook.set(0, 0, -10); 
    }
    else if (step >= 15) {
      targetPos.set(0, 1, 11); 
      targetLook.set(0, 2, -2); 
    }

    state.camera.position.lerp(targetPos, delta * 0.5 * speed);
    currentLookAt.current.lerp(targetLook, delta * 0.5 * speed);
    state.camera.lookAt(currentLookAt.current);
  });
  return null;
};

const NebulaClouds = ({ speed }) => {
  const ref = useRef();
  const materialRef = useRef();
  const t = useRef(0);
  const softParticleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);
  const [nebula] = useState(() => generateNebulaClouds(10000, 30, 15, 40));

  useFrame((state, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t.current * 0.05) * 0.05; // 🔥 FIX
      ref.current.position.z += delta * 0.4 * speed; 
      if (ref.current.position.z > 10) ref.current.position.z = -10; 
    }
  });

  return (
    <Points ref={ref} positions={nebula.positions} colors={nebula.colors} stride={3} frustumCulled={false}>
      <PointMaterial ref={materialRef} transparent vertexColors={false} map={softParticleTexture} size={0.25} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.2} />
    </Points>
  );
};

const DeityFace = ({ startOffset, targetPos, lineupPos, imgUrl, visible, isLineup, speed }) => {
  const groupRef = useRef();
  const materialRef = useRef();
  const t = useRef(0);
  
  const [texture, setTexture] = useState(null);
  const [size, setSize] = useState([6, 9]); 
  
  const [start] = useState(() => new THREE.Vector3(...startOffset));
  const [target] = useState(() => new THREE.Vector3(...targetPos));
  const [lineup] = useState(() => new THREE.Vector3(...lineupPos));

  useEffect(() => {
    new THREE.TextureLoader().load(imgUrl, (loadedTex) => {
      const imgAspect = loadedTex.image.width / loadedTex.image.height;
      setSize([8 * imgAspect, 8]); 
      setTexture(loadedTex);
    });
  }, [imgUrl]);

  useFrame((state, delta) => {
    t.current += delta;
    if (!groupRef.current || !materialRef.current) return;
    const isMobile = window.innerWidth < 768; 

    const activeLineup = isLineup ? new THREE.Vector3(
      isMobile ? lineup.x * 0.45 : lineup.x, 
      lineup.y, 
      lineup.z
    ) : target;
    
    const activeTarget = isLineup ? activeLineup : target;

    const targetScale = isLineup 
      ? (isMobile ? new THREE.Vector3(0.35, 0.35, 0.35) : new THREE.Vector3(0.65, 0.65, 0.65)) 
      : new THREE.Vector3(1, 1, 1);

    if (visible || isLineup) {
      groupRef.current.position.lerp(activeTarget, delta * 1.5 * speed);
      groupRef.current.scale.lerp(targetScale, delta * 1.5 * speed);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1.0, delta * 1.5 * speed);
    } else {
      groupRef.current.position.lerp(start, delta * 2 * speed);
      groupRef.current.scale.lerp(new THREE.Vector3(0.5, 0.5, 0.5), delta * 2 * speed);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, delta * 2 * speed);
    }
    groupRef.current.position.y += Math.sin(t.current * 0.8 * speed) * 0.005; // 🔥 FIX
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={start} scale={[0.5, 0.5, 0.5]}>
      <Billboard>
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  );
};
// 👆 END INTRO COMPONENTS BLOCK 👆

// ==========================================
// 🚀 THE MASTER APP
// ==========================================
export default function App() {
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);
// 👇 ADD THIS LINE RIGHT BELOW IT 👇
  const [view, setView] = useState('intro'); // Routes: 'intro', 'scroll', 'hub'
  useEffect(() => {
    if (!started || selectedGuide) return;
    const interval = setInterval(() => setTime(prev => prev + (0.1 * speed)), 100);
    return () => clearInterval(interval);
  }, [started, speed, selectedGuide]);

  let step = 0;
  if (time >= 80) step = 15; // LINEUP
  else if (time >= 70) step = 14; 
  else if (time >= 60) step = 13; 
  else if (time >= 50) step = 12; 
  else if (time >= 40) step = 10; 
  else if (time >= 38) step = 9;  
  else if (time >= 32) step = 8;  
  else if (time >= 30) step = 7;  
  else if (time >= 24) step = 6;  
  else if (time >= 22) step = 5;  
  else if (time >= 17) step = 4;  
  else if (time >= 13) step = 3;  
  else if (time >= 7) step = 2;   
  else if (time >= 1) step = 1;   

  const transitionDur = speed === 2 ? 1.5 : 3;
// 👇 ADD THIS NEW ROUTE BLOCK 👇
  if (view === 'dharma') {
    return <WebOfDharma onBack={() => setView('hub')} />;
  }
 // 👇 UPDATE THIS HUB BLOCK 👇
  if (view === 'hub') {
    return <CosmicHub guide={selectedGuide} onBack={() => setView('intro')} />;
  }
  if (selectedGuide && view === 'scroll') {
    return <ScrollExperience guide={selectedGuide} onBack={() => { setSelectedGuide(null); setView('intro'); }} onEnterHub={() => setView('hub')} />;
  }
  return (
    <div className="relative w-full h-screen bg-[#010101] overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[12vh] bg-black z-50 pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
      <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-black z-50 pointer-events-none shadow-[0_-20px_40px_rgba(0,0,0,0.8)]" />

      {/* 👇 REPLACED BLOCK: SPEED & SKIP CONTROLS 👇 */}
      {started && step < 15 && (
        <div className="absolute top-[14vh] right-6 md:right-10 z-50 flex flex-col md:flex-row gap-3 md:gap-4 items-end md:items-center">
          <button 
            onClick={() => setTime(80)} 
            className="px-5 py-2 border border-white/20 rounded-full text-white/70 text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white hover:border-white/50 transition-all backdrop-blur-md cursor-pointer shadow-lg"
          >
            ⏭ Skip Intro
          </button>
          
          <button 
            onClick={() => setSpeed(speed === 1 ? 2 : 1)} 
            className="px-5 py-2 border border-white/20 rounded-full text-white/70 text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white hover:border-white/50 transition-all backdrop-blur-md cursor-pointer shadow-lg"
          >
            {speed === 2 ? '▶▶ 2x Speed' : '▶ 1x Speed'}
          </button>
        </div>
      )}
      {/* 👆 END REPLACED BLOCK 👆 */}

      {/* 🌌 Intro 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          {/* 🌫️ FIX 1: Pushed the fog WAY back from 12 to 30! They won't fade out anymore! */}
          <fog attach="fog" args={['#010101', 5, 30]} />
          <SceneController step={step} speed={speed} />
          <NebulaClouds speed={speed} />
          
          <React.Suspense fallback={null}>
            {/* 📸 FIX 3: Expanded the X-gap from [-6.5, 6.5] to [-7.5, 7.5] and raised the Y to 2! Beautiful separation! */}
            <DeityFace startOffset={[-8, -5, 2]} targetPos={[-5, 2.5, -2]} lineupPos={[-7.5, 2, -2]} imgUrl="/brahma.png" visible={step >= 6 && step < 8} isLineup={step >= 15} speed={speed} />
            <DeityFace startOffset={[0, 8, -2]} targetPos={[0, 2.5, -6]} lineupPos={[0, 2, -2]} imgUrl="/vishnu.png" visible={step >= 8 && step < 10} isLineup={step >= 15} speed={speed} />
            <DeityFace startOffset={[8, -5, -10]} targetPos={[5, 2.5, -10]} lineupPos={[7.5, 2, -2]} imgUrl="/shiva.png" visible={step >= 10 && step < 12} isLineup={step >= 15} speed={speed} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* 🖋️ UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_60%)]">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.button key="start" onClick={() => setStarted(true)} className="pointer-events-auto px-10 py-4 border-[1px] border-white/20 text-white/70 uppercase tracking-[0.5em] text-xs font-light hover:bg-white/10 hover:text-white hover:border-white/50 transition-all backdrop-blur-md cursor-pointer">
              Enter The Experience
            </motion.button>
          )}

          {step === 1 && <motion.h1 key="t1" initial={{ opacity: 0, filter: "blur(20px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="text-white/80 text-3xl uppercase tracking-[0.6em] font-serif">Before time existed</motion.h1>}
          {step === 2 && <motion.h1 key="t2" initial={{ opacity: 0, filter: "blur(20px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="text-white text-5xl uppercase tracking-[0.5em] font-serif flex flex-col gap-6 text-center"><span className="text-white/80">There was only</span><span className="text-[#e6c15c] tracking-[0.8em] text-7xl ml-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Brahman</span></motion.h1>}
          
          {step >= 3 && step < 5 && (
            <motion.div key="om" initial={{ opacity: 0, scale: 0.8, filter: "blur(40px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 2, filter: "blur(40px)" }} transition={{ duration: transitionDur }} className="relative flex flex-col items-center">
              <h1 className="text-[16rem] text-[#ffb700] drop-shadow-[0_0_80px_rgba(255,183,0,0.8)] font-serif leading-none m-0">🕉</h1>
              {step === 4 && <motion.p initial={{ opacity: 0, y: 10, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} className="absolute top-[110%] text-[#e6c15c] text-lg tracking-[0.8em] uppercase font-serif whitespace-nowrap">The primordial vibration</motion.p>}
            </motion.div>
          )}

          {step === 6 && <motion.div key="b" initial={{ opacity: 0, y: 20, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="absolute bottom-32 text-center"><h2 className="text-[#ffb700] text-5xl uppercase tracking-[0.5em] font-serif drop-shadow-[0_0_20px_rgba(255,183,0,0.5)]">Brahma</h2><p className="text-white/70 tracking-widest mt-4 uppercase">God Who Creates</p></motion.div>}
          {step === 8 && <motion.div key="v" initial={{ opacity: 0, y: 20, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="absolute bottom-32 text-center"><h2 className="text-[#00e5ff] text-5xl uppercase tracking-[0.5em] font-serif drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]">Vishnu</h2><p className="text-white/70 tracking-widest mt-4 uppercase">God Who Protects</p></motion.div>}
          {step === 10 && <motion.div key="s" initial={{ opacity: 0, y: 20, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="absolute bottom-32 text-center"><h2 className="text-[#ff2a00] text-5xl uppercase tracking-[0.5em] font-serif drop-shadow-[0_0_20px_rgba(255,42,0,0.5)]">Shiva</h2><p className="text-white/70 tracking-widest mt-4 uppercase">God Who Destroys</p></motion.div>}

          {step === 12 && (
            <motion.h1 key="k1" initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="text-white/90 text-3xl uppercase tracking-[0.4em] font-serif text-center max-w-4xl leading-relaxed drop-shadow-2xl">
              But when everything goes berserk <br/><span className="text-[#ff2a00] font-bold">in this Kalyug...</span>
            </motion.h1>
          )}
          
          {step === 13 && (
            <motion.h1 key="k2" initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(20px)" }} transition={{ duration: transitionDur }} className="text-white/90 text-2xl uppercase tracking-[0.4em] font-serif text-center max-w-4xl leading-relaxed drop-shadow-2xl">
              Our history became a myth <br/><span className="text-white/50">and belief in God started to fade...</span>
            </motion.h1>
          )}

          {step >= 14 && step < 15 && (
            <motion.h1 key="k3" initial={{ opacity: 0, y: 20, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: transitionDur }} className="text-[#e6c15c] text-3xl md:text-5xl uppercase tracking-[0.4em] font-serif text-center max-w-5xl leading-relaxed drop-shadow-[0_0_30px_rgba(230,193,92,0.5)]">
              Who do you take as your Soul Guide <br/>
              <span className="text-white text-xl tracking-widest mt-6 block font-light">
                To dive deep into yourself and discover a power you never imagined you had?
              </span>
            </motion.h1>
          )}

          {/* 👇 REPLACE YOUR BROKEN SELECTION DIV WITH THIS 👇 */}
          {step >= 15 && (
            <motion.div key="selection" initial={{ opacity: 0, y: 50, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 2, duration: 2 }} className="absolute bottom-24 w-full flex justify-center gap-6 md:gap-24 pointer-events-auto">
              
              {/* Notice the curly brackets {} inside the onClick! */}
              <button onClick={() => { setSelectedGuide('brahma'); setView('scroll'); }} className="px-6 py-3 border border-[#ffb700] text-[#ffb700] uppercase tracking-[0.3em] text-xs hover:bg-[#ffb700]/20 transition-all backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(255,183,0,0.2)] hover:shadow-[0_0_30px_rgba(255,183,0,0.6)]">
                Select Brahma
              </button>
              
              <button onClick={() => { setSelectedGuide('vishnu'); setView('scroll'); }} className="px-6 py-3 border border-[#00e5ff] text-[#00e5ff] uppercase tracking-[0.3em] text-xs hover:bg-[#00e5ff]/20 transition-all backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]">
                Select Vishnu
              </button>
              
              <button onClick={() => { setSelectedGuide('shiva'); setView('scroll'); }} className="px-6 py-3 border border-[#ff2a00] text-[#ff2a00] uppercase tracking-[0.3em] text-xs hover:bg-[#ff2a00]/20 transition-all backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(255,42,0,0.2)] hover:shadow-[0_0_30px_rgba(255,42,0,0.6)]">
                Select Shiva
              </button>

            </motion.div>
          )}
          {/* 👆 END REPLACED BLOCK 👆 */}

        </AnimatePresence>
      </div>
    </div>
  );
} 