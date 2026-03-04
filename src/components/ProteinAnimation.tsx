'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Alpha Helix Animation
export function AlphaHelix({ size = 200, color = 'cyan' }: { size?: number; color?: 'cyan' | 'purple' | 'pink' }) {
  const turns = 8;
  const pointsPerTurn = 12;
  const points = useMemo(() => {
    const result = [];
    for (let i = 0; i < turns * pointsPerTurn; i++) {
      const t = i / pointsPerTurn;
      const angle = (i / pointsPerTurn) * Math.PI * 2;
      const radius = size * 0.15;
      result.push({
        x: Math.cos(angle) * radius,
        y: t * (size / turns) - size / 2,
        z: Math.sin(angle) * radius,
        i
      });
    }
    return result;
  }, [size, turns]);

  const colorMap = {
    cyan: { primary: '#06b6d4', secondary: '#0891b2', glow: 'rgba(6, 182, 212, 0.5)' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139, 92, 246, 0.5)' },
    pink: { primary: '#ec4899', secondary: '#db2777', glow: 'rgba(236, 72, 153, 0.5)' },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotateY: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    >
      {/* Backbone */}
      <svg
        viewBox={`${-size/2} ${-size/2} ${size} ${size}`}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 10px ${colors.glow})` }}
      >
        <motion.path
          d={`M ${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x + size/2} ${p.y + size/2}`).join(' ')}`}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>

      {/* Amino Acid Residues */}
      {points.filter((_, i) => i % 3 === 0).map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 ${size * 0.1}px ${colors.glow}`,
            left: `calc(50% + ${point.x}px - ${size * 0.04}px)`,
            top: `calc(50% + ${point.y}px - ${size * 0.04}px)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

// Beta Sheet Animation
export function BetaSheet({ size = 200, color = 'purple' }: { size?: number; color?: 'cyan' | 'purple' | 'pink' }) {
  const colorMap = {
    cyan: { primary: '#06b6d4', secondary: '#0891b2', glow: 'rgba(6, 182, 212, 0.5)' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139, 92, 246, 0.5)' },
    pink: { primary: '#ec4899', secondary: '#db2777', glow: 'rgba(236, 72, 153, 0.5)' },
  };

  const colors = colorMap[color];
  const strands = 4;
  const residuesPerStrand = 6;

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotateX: [0, 10, 0, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {Array.from({ length: strands }).map((_, strandIndex) => (
        <motion.div
          key={strandIndex}
          className="absolute"
          style={{
            top: `${(strandIndex / strands) * 100}%`,
            left: '10%',
            right: '10%',
            height: `${100 / strands - 2}%`,
          }}
          animate={{
            skewX: strandIndex % 2 === 0 ? [0, 5, 0] : [0, -5, 0],
          }}
          transition={{
            duration: 3,
            delay: strandIndex * 0.2,
            repeat: Infinity,
          }}
        >
          {/* Strand line */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
              boxShadow: `0 0 20px ${colors.glow}`,
            }}
          />
          
          {/* Residues */}
          {Array.from({ length: residuesPerStrand }).map((_, resIndex) => (
            <motion.div
              key={resIndex}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                left: `${(resIndex / (residuesPerStrand - 1)) * 100}%`,
                backgroundColor: resIndex % 2 === 0 ? colors.primary : colors.secondary,
                boxShadow: `0 0 10px ${colors.glow}`,
              }}
              animate={{
                y: [0, -3, 0, 3, 0],
              }}
              transition={{
                duration: 2,
                delay: resIndex * 0.15,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Hydrogen bonds (dashed lines between strands) */}
      {Array.from({ length: strands - 1 }).map((_, bondIndex) => (
        <motion.div
          key={`bond-${bondIndex}`}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${((bondIndex + 0.5) / strands) * 100}%`,
            width: '80%',
            height: '1px',
            background: `repeating-linear-gradient(90deg, ${colors.primary} 0px, ${colors.primary} 4px, transparent 4px, transparent 8px)`,
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

// Protein Folding Animation
export function ProteinFolding({ size = 300 }: { size?: number }) {
  const nodes = useMemo(() => {
    const result = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * 3;
      const radius = size * 0.3 * (1 - i / count * 0.5);
      const wobble = Math.sin(i * 0.5) * size * 0.05;
      result.push({
        x: Math.cos(angle) * radius + wobble,
        y: Math.sin(angle) * radius * 0.5 + (i - count/2) * (size * 0.03),
        i
      });
    }
    return result;
  }, [size]);

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Connection lines */}
      <svg className="absolute inset-0" viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
        <motion.path
          d={`M ${nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ')}`}
          fill="none"
          stroke="url(#proteinGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Amino acid nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            left: `calc(50% + ${node.x}px - ${size * 0.03}px)`,
            top: `calc(50% + ${node.y}px - ${size * 0.03}px)`,
            background: i % 3 === 0 
              ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
              : i % 3 === 1 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'linear-gradient(135deg, #ec4899, #db2777)',
            boxShadow: i % 3 === 0 
              ? '0 0 15px rgba(6, 182, 212, 0.6)'
              : i % 3 === 1 
                ? '0 0 15px rgba(139, 92, 246, 0.6)'
                : '0 0 15px rgba(236, 72, 153, 0.6)',
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            scale: { duration: 2, delay: i * 0.1, repeat: Infinity },
            rotate: { duration: 10, delay: i * 0.1, repeat: Infinity, ease: 'linear' }
          }}
        />
      ))}
    </motion.div>
  );
}

// Floating Protein Molecules
export function FloatingProteins({ count = 6 }: { count?: number }) {
  const proteins = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 40,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      type: i % 3,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {proteins.map((protein) => (
        <motion.div
          key={protein.id}
          className="absolute"
          style={{
            left: `${protein.x}%`,
            top: `${protein.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [0, 360],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            y: { duration: protein.duration, repeat: Infinity, delay: protein.delay },
            x: { duration: protein.duration * 1.5, repeat: Infinity, delay: protein.delay },
            rotate: { duration: protein.duration * 2, repeat: Infinity, delay: protein.delay, ease: 'linear' },
            scale: { duration: protein.duration / 2, repeat: Infinity, delay: protein.delay },
          }}
        >
          {protein.type === 0 ? (
            <MiniHelix size={protein.size} />
          ) : protein.type === 1 ? (
            <MiniSheet size={protein.size} />
          ) : (
            <MiniGlobular size={protein.size} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Mini Helix Component
function MiniHelix({ size }: { size: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotateY: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d="M 20,10 Q 80,30 20,50 Q 80,70 20,90"
          fill="none"
          stroke="url(#miniHelixGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="miniHelixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Residues */}
      {[20, 35, 50, 65, 80].map((y, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
            boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
            left: i % 2 === 0 ? '15%' : '65%',
            top: `${y - 5}%`,
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

// Mini Sheet Component
function MiniSheet({ size }: { size: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotateX: [0, 15, 0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d="M 10,20 L 90,20 M 10,50 L 90,50 M 10,80 L 90,80"
          fill="none"
          stroke="url(#miniSheetGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="miniSheetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Dashed bonds */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px"
        style={{
          background: 'repeating-linear-gradient(to bottom, rgba(236, 72, 153, 0.5) 0px, rgba(236, 72, 153, 0.5) 3px, transparent 3px, transparent 6px)',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Mini Globular Protein
function MiniGlobular({ size }: { size: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
        scale: { duration: 3, repeat: Infinity },
      }}
    >
      {/* Main body */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #06b6d4, #8b5cf6, #ec4899)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
        }}
      />
      
      {/* Inner structure */}
      <motion.div
        className="absolute inset-2 rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle at 60% 60%, transparent 50%, rgba(255,255,255,0.2) 100%)',
        }}
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Surface residues */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#06b6d4' : '#ec4899',
            boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(236, 72, 153, 0.8)'}`,
            left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 40}% - 4px)`,
            top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 40}% - 4px)`,
          }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

// Animated Protein Background
export function ProteinBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating proteins */}
      <FloatingProteins count={12} />
      
      {/* Particle effects */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 
              ? 'rgba(6, 182, 212, 0.6)'
              : i % 3 === 1 
                ? 'rgba(139, 92, 246, 0.6)'
                : 'rgba(236, 72, 153, 0.6)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

export default function ProteinAnimation() {
  return (
    <div className="relative w-full h-full">
      <FloatingProteins />
    </div>
  );
}
