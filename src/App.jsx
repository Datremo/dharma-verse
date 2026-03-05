import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Billboard, Cylinder, Torus, Cone, Sphere } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useVelocity, useMotionValue } from 'framer-motion';import * as THREE from 'three';

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
// 👇 REPLACE THE ENTIRE ScrollExperience COMPONENT WITH THIS 👇
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
// 👆 END REPLACED SECTION 👆



// ==========================================
// 🏛️ NEW COMPONENT: THE COSMIC HUB SKELETON
// ==========================================
const CosmicHub = ({ guide, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
      className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center text-white"
    >
      <h1 className="text-4xl font-serif tracking-widest uppercase mb-8">Welcome to the Hub</h1>
      <p className="text-white/50 tracking-widest uppercase text-sm mb-12">Under construction by my genius founder 🚧</p>
      <button onClick={onBack} className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-all">
        Go Back
      </button>
    </motion.div>
  );
};
// 👆 END REPLACED SECTION 👆
// ==========================================
// 🎬 REBUILT INTRO CONTROLLER 
// ==========================================

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