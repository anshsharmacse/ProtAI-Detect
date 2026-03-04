'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Target,
  Zap,
  TrendingUp,
  Dna,
  Activity,
  Layers,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Statistics {
  totalProteins: number;
  totalPeptides: number;
  averageAbundance: number;
  averageConfidence: number;
  highConfidencePredictions: number;
  modelAccuracy: number;
  processingTime: number;
  lastUpdated: string;
}

interface StatisticsPanelProps {
  statistics: Statistics | null;
}

export function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  const defaultStats: Statistics = {
    totalProteins: 0,
    totalPeptides: 0,
    averageAbundance: 0,
    averageConfidence: 0,
    highConfidencePredictions: 0,
    modelAccuracy: 0.87,
    processingTime: 0,
    lastUpdated: new Date().toISOString()
  };

  const stats = statistics || defaultStats;

  const statsItems = [
    {
      label: 'Total Proteins',
      value: stats.totalProteins,
      icon: Dna,
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/10',
      format: 'number',
      description: 'Analyzed'
    },
    {
      label: 'Total Peptides',
      value: stats.totalPeptides,
      icon: Activity,
      gradient: 'from-purple-400 to-violet-500',
      bgGradient: 'from-purple-500/20 to-violet-500/10',
      format: 'number',
      description: 'Processed'
    },
    {
      label: 'Avg Abundance',
      value: stats.averageAbundance,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-green-500',
      bgGradient: 'from-emerald-500/20 to-green-500/10',
      format: 'percent',
      description: 'Score'
    },
    {
      label: 'Avg Confidence',
      value: stats.averageConfidence,
      icon: Target,
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-500/20 to-orange-500/10',
      format: 'percent',
      description: 'Level'
    },
    {
      label: 'High Confidence',
      value: stats.highConfidencePredictions,
      icon: CheckCircle2,
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-pink-500/20 to-rose-500/10',
      format: 'number',
      description: 'Predictions'
    },
    {
      label: 'Model Accuracy',
      value: stats.modelAccuracy,
      icon: Zap,
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-500/20 to-indigo-500/10',
      format: 'percent',
      description: 'Benchmark'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative"
          >
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.bgGradient} 
              border border-white/5 p-5 h-full transition-all duration-300 
              group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-${item.gradient.split('-')[1]}-500/10`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} bg-opacity-20 mb-3`}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </motion.div>
                
                {/* Value */}
                <div className="mt-2">
                  <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.format === 'percent' 
                      ? `${((item.value as number) * 100).toFixed(1)}%`
                      : (item.value as number).toLocaleString()
                    }
                  </p>
                </div>
                
                {/* Label */}
                <p className="text-sm text-slate-400 mt-1">{item.label}</p>
                <p className="text-xs text-slate-600">{item.description}</p>
                
                {/* Progress Bar for Percentages */}
                {item.format === 'percent' && (
                  <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value as number) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Model Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Side - Model Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 blur-xl opacity-50" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500">
                  <Brain className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Transformer Model</h3>
                <p className="text-sm text-slate-400">State-of-the-art attention-based architecture</p>
              </div>
            </div>
            
            {/* Center - Architecture Details */}
            <div className="flex items-center gap-6">
              {[
                { icon: Layers, label: 'Layers', value: '6' },
                { icon: Brain, label: 'Heads', value: '8' },
                { icon: Activity, label: 'Hidden', value: '512' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <item.icon className="h-4 w-4 text-cyan-400" />
                    <span className="text-xl font-bold text-white">{item.value}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Right Side - Processing Time */}
            {stats.processingTime > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Processing Time</p>
                  <p className="text-sm font-medium text-white">
                    {stats.processingTime < 1000 
                      ? `${stats.processingTime}ms`
                      : `${(stats.processingTime / 1000).toFixed(2)}s`
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Last Updated */}
          {stats.lastUpdated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-500 text-center"
            >
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
