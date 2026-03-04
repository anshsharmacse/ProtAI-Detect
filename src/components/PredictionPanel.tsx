'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PredictionResult } from '@/types';
import { predictionsToCSV, predictionsToJSON } from '@/lib/data-processor';

interface PredictionPanelProps {
  predictions: PredictionResult[];
  isLoading?: boolean;
}

export function PredictionPanel({ predictions, isLoading }: PredictionPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'abundanceScore' | 'confidence'>('abundanceScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedPredictions = [...predictions].sort((a, b) => {
    const multiplier = sortDirection === 'desc' ? -1 : 1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const handleExport = (format: 'csv' | 'json') => {
    const content = format === 'csv' 
      ? predictionsToCSV(predictions)
      : predictionsToJSON(predictions);
    
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTrendIcon = (prediction: PredictionResult) => {
    const temporal = prediction.temporalData;
    if (temporal.length < 2) return <Minus className="h-4 w-4 text-slate-400" />;
    
    const start = temporal[0].abundance;
    const end = temporal[temporal.length - 1].abundance;
    const change = end - start;
    
    if (change > 0.1) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (change < -0.1) return <TrendingDown className="h-4 w-4 text-rose-400" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getTrendLabel = (prediction: PredictionResult) => {
    const temporal = prediction.temporalData;
    if (temporal.length < 2) return 'stable';
    
    const start = temporal[0].abundance;
    const end = temporal[temporal.length - 1].abundance;
    const change = ((end - start) / start * 100).toFixed(1);
    
    if (end > start) return `+${change}%`;
    return `${change}%`;
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl blur-xl" />
        <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
              </div>
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                <Loader2 className="relative h-16 w-16 text-cyan-400 animate-spin" />
              </div>
              <p className="text-lg font-medium text-white mt-6">Running transformer model...</p>
              <p className="text-sm text-slate-500 mt-2">Analyzing protein features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl blur-xl" />
        <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
              </div>
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-16">
            <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 mb-4">
              <BarChart3 className="h-12 w-12 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-white">No predictions yet</p>
            <p className="text-sm text-slate-500 mt-2">Upload data or load demo to see predictions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl blur-xl" />
      <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
              </div>
              Prediction Results
              <Badge className="ml-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                {predictions.length} proteins
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex gap-2 mt-4">
            {[
              { field: 'abundanceScore', label: 'Abundance', color: 'cyan' },
              { field: 'confidence', label: 'Confidence', color: 'purple' },
            ].map((item) => (
              <Button
                key={item.field}
                variant={sortField === item.field ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  if (sortField === item.field) {
                    setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField(item.field as 'abundanceScore' | 'confidence');
                    setSortDirection('desc');
                  }
                }}
                className={`rounded-xl ${
                  sortField === item.field 
                    ? item.color === 'cyan'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
                      : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {sortField === item.field && (
                  sortDirection === 'desc' 
                    ? <ChevronDown className="ml-1 h-4 w-4" /> 
                    : <ChevronUp className="ml-1 h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {sortedPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.proteinId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                    expandedId === prediction.proteinId 
                      ? 'bg-slate-800/70 ring-1 ring-cyan-500/30' 
                      : 'bg-slate-800/30 hover:bg-slate-800/50'
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(
                      expandedId === prediction.proteinId ? null : prediction.proteinId
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          prediction.temporalData[0]?.abundance < prediction.temporalData[prediction.temporalData.length-1]?.abundance
                            ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/10'
                            : prediction.temporalData[0]?.abundance > prediction.temporalData[prediction.temporalData.length-1]?.abundance
                            ? 'bg-gradient-to-br from-rose-500/20 to-red-500/10'
                            : 'bg-gradient-to-br from-slate-500/20 to-slate-500/10'
                        }`}>
                          {getTrendIcon(prediction)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{prediction.proteinName}</p>
                          <p className="text-xs text-slate-500 font-mono">{prediction.proteinId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {(prediction.abundanceScore * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-slate-500">
                            {getTrendLabel(prediction)} trend
                          </p>
                        </div>
                        <div className="w-px h-10 bg-slate-700" />
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-purple-400" />
                            <p className="text-lg font-semibold text-purple-400">
                              {(prediction.confidence * 100).toFixed(0)}%
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">confidence</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20">Abundance</span>
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${prediction.abundanceScore * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.03 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20">Confidence</span>
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${prediction.confidence * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.03 + 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedId === prediction.proteinId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-slate-900/50"
                      >
                        <div className="p-4 space-y-4">
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
                              <Sparkles className="h-3 w-3 text-cyan-400" />
                              Top Peptide Contributions
                            </p>
                            <div className="space-y-2">
                              {prediction.peptideContributions.slice(0, 3).map((pep, i) => (
                                <div key={pep.peptideId} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
                                  <span className="text-xs text-slate-500 w-5">{i + 1}.</span>
                                  <code className="text-xs text-cyan-300 bg-slate-900/50 px-2 py-1 rounded-lg font-mono">
                                    {pep.peptideSequence}
                                  </code>
                                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
                                    {pep.contribution}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                              <p className="text-slate-500 mb-1">m/z Range</p>
                              <p className="text-white font-medium font-mono">
                                {prediction.peptideContributions[0]?.mzRatio.toFixed(2) || 'N/A'}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                              <p className="text-slate-500 mb-1">Peptides</p>
                              <p className="text-white font-medium">
                                {prediction.attentionWeights.length}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                              <p className="text-slate-500 mb-1">High Importance</p>
                              <p className="text-emerald-400 font-medium">
                                {prediction.attentionWeights.filter(w => w.importance === 'high').length}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
