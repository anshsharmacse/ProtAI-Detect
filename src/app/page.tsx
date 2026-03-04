'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FileUpload } from '@/components/FileUpload';
import { PredictionPanel } from '@/components/PredictionPanel';
import { AbundanceHeatmap } from '@/components/AbundanceHeatmap';
import { AttentionVisualization } from '@/components/AttentionVisualization';
import { TemporalChart } from '@/components/TemporalChart';
import { StatisticsPanel } from '@/components/StatisticsPanel';
import { ModelArchitecture } from '@/components/ModelArchitecture';
import { ProteinBackground, AlphaHelix, BetaSheet, ProteinFolding } from '@/components/ProteinAnimation';
import { ProteinFeature, PredictionResult } from '@/types';
import { getDemoData } from '@/lib/sample-data';
import { Dna, Heart, Sparkles } from 'lucide-react';

export default function Home() {
  const [features, setFeatures] = useState<ProteinFeature[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [heatmapData, setHeatmapData] = useState<ReturnType<typeof getDemoData>['heatmapData'] | null>(null);
  const [statistics, setStatistics] = useState<ReturnType<typeof getDemoData>['statistics'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadRef = useRef<HTMLDivElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const attentionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      upload: uploadRef,
      predictions: predictionsRef,
      heatmap: heatmapRef,
      attention: attentionRef
    };
    
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleFileProcessed = useCallback(async (newFeatures: ProteinFeature[]) => {
    setFeatures(newFeatures);
    setIsLoading(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: newFeatures })
      });

      const data = await response.json();

      if (data.success) {
        setPredictions(data.predictions);
        setStatistics({
          totalProteins: data.summary.totalProteins,
          totalPeptides: data.summary.totalPeptides,
          averageAbundance: data.summary.averageAbundance,
          averageConfidence: data.summary.averageConfidence,
          highConfidencePredictions: data.summary.highConfidenceCount,
          modelAccuracy: 0.87,
          processingTime: data.summary.processingTimeMs,
          lastUpdated: new Date().toISOString()
        });

        const { generateHeatmapData } = await import('@/lib/sample-data');
        setHeatmapData(generateHeatmapData(data.predictions));
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDemoData = useCallback(async () => {
    setIsLoading(true);

    try {
      const { features: demoFeatures, predictions: demoPredictions, heatmapData: demoHeatmap, statistics: demoStats } = getDemoData();
      
      setFeatures(demoFeatures);
      setPredictions(demoPredictions);
      setHeatmapData(demoHeatmap);
      setStatistics(demoStats);
    } catch (error) {
      console.error('Demo load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 animated-bg" />
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30" />
      
      {/* Aurora Effect */}
      <div className="fixed inset-0 aurora pointer-events-none" />
      
      {/* Protein Animations Background */}
      <ProteinBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Header onNavigate={scrollToSection} />
        
        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Upload Section */}
            <motion.div
              ref={uploadRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileUpload
                onFileProcessed={handleFileProcessed}
                onLoadDemo={loadDemoData}
                isLoading={isLoading}
              />
            </motion.div>

            {/* Statistics Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatisticsPanel statistics={statistics} />
            </motion.div>

            {/* Model Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <ModelArchitecture />
            </motion.div>

            {/* Protein Structure Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-3xl p-8 border-white/5"
            >
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Protein Structure Visualization
                </h3>
                <p className="text-slate-500 text-sm">Interactive 3D protein structure animations</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Alpha Helix */}
                <div className="text-center">
                  <div className="inline-block p-6 rounded-2xl bg-slate-800/30 mb-4">
                    <AlphaHelix size={180} color="cyan" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">α-Helix</h4>
                  <p className="text-xs text-slate-500">Right-handed coiled structure</p>
                </div>
                
                {/* Beta Sheet */}
                <div className="text-center">
                  <div className="inline-block p-6 rounded-2xl bg-slate-800/30 mb-4">
                    <BetaSheet size={180} color="purple" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">β-Sheet</h4>
                  <p className="text-xs text-slate-500">Extended strand conformation</p>
                </div>
                
                {/* Protein Folding */}
                <div className="text-center">
                  <div className="inline-block p-6 rounded-2xl bg-slate-800/30 mb-4">
                    <ProteinFolding size={180} />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">Protein Folding</h4>
                  <p className="text-xs text-slate-500">Tertiary structure dynamics</p>
                </div>
              </div>
            </motion.div>

            {/* Main Grid: Predictions and Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                ref={predictionsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PredictionPanel predictions={predictions} isLoading={isLoading} />
              </motion.div>

              <motion.div
                ref={heatmapRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <AbundanceHeatmap data={heatmapData} />
              </motion.div>
            </div>

            {/* Attention Visualization */}
            <motion.div
              ref={attentionRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AttentionVisualization predictions={predictions} />
            </motion.div>

            {/* Temporal Dynamics Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <TemporalChart predictions={predictions} />
            </motion.div>

            {/* Footer */}
            <footer className="mt-16 relative">
              {/* Gradient Separator */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="glass-card rounded-3xl p-8 mt-8">
                <div className="flex flex-col items-center space-y-8">
                  {/* Logo Section */}
                  <motion.div 
                    className="flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 blur-lg opacity-50" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
                        <Dna className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ProtAI-Detect
                      </span>
                      <p className="text-sm text-slate-500">
                        Deep Learning for Protein Analysis
                      </p>
                    </div>
                  </motion.div>

                  {/* Developer Credit */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <p className="text-sm text-slate-400 mb-2">Developed by</p>
                    <p className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Ansh Sharma
                    </p>
                    <p className="text-xs text-slate-500 mt-1">AI/ML Research</p>
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center justify-center gap-3"
                  >
                    {[
                      { label: 'Python', color: 'cyan' },
                      { label: 'PyTorch', color: 'purple' },
                      { label: 'Transformers', color: 'pink' },
                      { label: 'Next.js', color: 'blue' },
                      { label: 'TypeScript', color: 'emerald' },
                    ].map((tech) => (
                      <span
                        key={tech.label}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          tech.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          tech.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          tech.color === 'pink' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                          tech.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {tech.label}
                      </span>
                    ))}
                  </motion.div>

                  {/* Model Specs */}
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      <span>8 Attention Heads</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="flex items-center gap-2 text-slate-400">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span>512 Hidden Size</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="flex items-center gap-2 text-slate-400">
                      <Sparkles className="h-4 w-4 text-pink-400" />
                      <span>6 Transformer Layers</span>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-4 border-t border-white/5 w-full justify-center">
                    <span>Made with</span>
                    <Heart className="h-3 w-3 text-pink-500 fill-pink-500 animate-pulse" />
                    <span>using Transformer Architecture</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
