'use client';

import { motion } from 'framer-motion';
import { Dna, Sparkles, Zap, Target, Brain, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4 min-h-[600px]">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg" />
      
      {/* Aurora Effect */}
      <div className="absolute inset-0 aurora" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Dotted Pattern */}
      <div className="absolute inset-0 dotted-pattern opacity-30" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] morph-blob" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] morph-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] morph-blob" style={{ animationDelay: '4s' }} />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Author Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-medium text-cyan-300">Ansh Sharma</span>
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-400">AI/ML Research</span>
              </div>
            </motion.div>

            {/* Transformer Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Badge className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-cyan-300 border border-cyan-500/30 px-5 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Transformer-Based Deep Learning
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Deep Learning for</span>
              <br />
              <span className="gradient-text neon-text">
                Protein Abundance
              </span>
              <br />
              <span className="text-white">Prediction</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Advanced AI-powered analysis of mass spectrometry data with 
              <span className="text-cyan-400"> interpretable attention mechanisms</span>. 
              Identify biomarkers and understand protein dynamics with cutting-edge 
              <span className="text-purple-400"> transformer architecture</span>.
            </motion.p>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              {[
                { icon: Zap, label: 'Real-time Analysis', color: 'cyan', desc: 'Instant predictions' },
                { icon: Target, label: '87% Accuracy', color: 'purple', desc: 'Benchmark tested' },
                { icon: Brain, label: 'Interpretable AI', color: 'pink', desc: 'Attention weights' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-card cursor-pointer">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${
                      item.color === 'cyan' ? 'from-cyan-500/20 to-cyan-600/20' :
                      item.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                      'from-pink-500/20 to-pink-600/20'
                    }`}>
                      <item.icon className={`h-5 w-5 ${
                        item.color === 'cyan' ? 'text-cyan-400' :
                        item.color === 'purple' ? 'text-purple-400' :
                        'text-pink-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
              {/* Outer Glow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.3), transparent, rgba(139, 92, 246, 0.3), transparent)',
                }}
              />
              
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-cyan-500/30"
                style={{
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(6, 182, 212, 0.1)',
                }}
              />
              
              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border-2 border-dashed border-purple-500/30"
              />
              
              {/* Inner Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-16 rounded-full border-2 border-pink-500/20"
              />

              {/* Innermost Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-24 rounded-full border border-cyan-500/20"
              />

              {/* Center DNA Helix */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 6, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="relative"
                >
                  {/* Glow Behind DNA */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl rounded-full scale-150" />
                  
                  <Dna className="h-28 w-28 md:h-36 md:w-36 text-transparent relative z-10" strokeWidth={1.5}
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
                    <Dna className="h-28 w-28 md:h-36 md:w-36 text-cyan-400" strokeWidth={1.5} />
                  </div>
                </motion.div>
              </div>

              {/* Orbiting Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    transformOrigin: `${50 + (i % 2 === 0 ? 150 : -150)}px center`,
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    i % 3 === 0 ? 'bg-cyan-400 shadow-lg shadow-cyan-500/50' :
                    i % 3 === 1 ? 'bg-purple-400 shadow-lg shadow-purple-500/50' :
                    'bg-pink-400 shadow-lg shadow-pink-500/50'
                  }`} />
                </motion.div>
              ))}

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <div className="glass-card rounded-2xl px-8 py-4 glow-border">
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-bold gradient-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        87%
                      </motion.div>
                      <div className="text-xs text-slate-500 mt-1">Accuracy</div>
                    </div>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-bold gradient-text-alt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        8
                      </motion.div>
                      <div className="text-xs text-slate-500 mt-1">Attention Heads</div>
                    </div>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-bold gradient-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        6
                      </motion.div>
                      <div className="text-xs text-slate-500 mt-1">Layers</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
