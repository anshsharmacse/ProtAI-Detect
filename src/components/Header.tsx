'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  Upload, 
  BarChart3, 
  Activity, 
  Settings,
  Menu,
  X,
  Sparkles,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'predictions', label: 'Predictions', icon: BarChart3 },
    { id: 'heatmap', label: 'Heatmap', icon: Activity },
    { id: 'attention', label: 'Attention', icon: Dna },
  ];

  return (
    <motion.header 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl"
    >
      {/* Gradient Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            {/* Logo Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <motion.div 
                className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Dna className="h-7 w-7 text-white" />
              </motion.div>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-xs text-cyan-400 font-medium tracking-wide">Ansh Sharma</span>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ProtAI-Detect
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate?.(item.id)}
                  className="relative text-slate-400 hover:text-white hover:bg-white/5 gap-2 px-4 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <item.icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Model Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-300 hover:border-cyan-500/40 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <Sparkles className="h-3 w-3" />
                Model Active
              </Badge>
            </motion.div>
            
            {/* Settings Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-white/5"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onNavigate?.(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 gap-3 rounded-xl"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
                
                {/* Mobile Model Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  <Brain className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">Transformer Model Active</span>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
