'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, BarChart2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PredictionResult } from '@/types';

interface AttentionVisualizationProps {
  predictions: PredictionResult[];
}

export function AttentionVisualization({ predictions }: AttentionVisualizationProps) {
  const [selectedProtein, setSelectedProtein] = useState<string>(
    predictions[0]?.proteinId || ''
  );

  const selectedPrediction = useMemo(() => {
    return predictions.find(p => p.proteinId === selectedProtein);
  }, [predictions, selectedProtein]);

  const sortedWeights = useMemo(() => {
    if (!selectedPrediction) return [];
    return [...selectedPrediction.attentionWeights]
      .sort((a, b) => b.weight - a.weight);
  }, [selectedPrediction]);

  if (predictions.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            Attention Weights Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Eye className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Load data to visualize attention weights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            Attention Weights
            <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
              Interpretable AI
            </Badge>
          </CardTitle>
          
          <Select value={selectedProtein} onValueChange={setSelectedProtein}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select protein" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {predictions.slice(0, 20).map(p => (
                <SelectItem 
                  key={p.proteinId} 
                  value={p.proteinId}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  {p.proteinName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedPrediction && (
          <div className="space-y-6">
            {/* Protein Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{selectedPrediction.proteinName}</p>
                <p className="text-sm text-slate-500">
                  {selectedPrediction.attentionWeights.length} peptides analyzed
                </p>
              </div>
              <div className="text-right">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Abundance</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {(selectedPrediction.abundanceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="text-lg font-bold text-purple-400">
                      {(selectedPrediction.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attention Bar Chart */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-400">Top Contributing Peptides</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {sortedWeights.slice(0, 15).map((weight, index) => (
                    <motion.div
                      key={weight.peptideId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                        <div className="w-6 text-center">
                          <span className="text-xs text-slate-500">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs text-cyan-300 bg-slate-800 px-2 py-0.5 rounded font-mono">
                              {weight.peptideSequence.length > 10 
                                ? weight.peptideSequence.slice(0, 10) + '...' 
                                : weight.peptideSequence}
                            </code>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                weight.importance === 'high' 
                                  ? 'border-green-500/30 text-green-400' 
                                  : weight.importance === 'medium'
                                  ? 'border-yellow-500/30 text-yellow-400'
                                  : 'border-slate-600 text-slate-400'
                              }`}
                            >
                              {weight.importance}
                            </Badge>
                          </div>
                          
                          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`absolute inset-y-0 left-0 rounded-full ${
                                weight.importance === 'high'
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                  : weight.importance === 'medium'
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                                  : 'bg-gradient-to-r from-slate-500 to-slate-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${weight.weight * 100}%` }}
                              transition={{ delay: index * 0.05 + 0.1, duration: 0.5 }}
                            />
                          </div>
                        </div>
                        
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium text-white">
                            {(weight.weight * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Importance Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {selectedPrediction.attentionWeights.filter(w => w.importance === 'high').length}
                </p>
                <p className="text-xs text-slate-500">High Importance</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {selectedPrediction.attentionWeights.filter(w => w.importance === 'medium').length}
                </p>
                <p className="text-xs text-slate-500">Medium</p>
              </div>
              <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-400">
                  {selectedPrediction.attentionWeights.filter(w => w.importance === 'low').length}
                </p>
                <p className="text-xs text-slate-500">Low</p>
              </div>
            </div>

            {/* Biomarker Insight */}
            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <ChevronRight className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Biomarker Insight</p>
                  <p className="text-xs text-slate-400">
                    {sortedWeights[0] && (
                      <>
                        Peptide <code className="text-cyan-300 bg-slate-800 px-1 rounded">
                          {sortedWeights[0].peptideSequence}
                        </code> contributes most significantly to {selectedPrediction.proteinName} 
                        {' '}abundance prediction with {(sortedWeights[0].weight * 100).toFixed(1)}% attention weight.
                        {sortedWeights[0].importance === 'high' && 
                          ' This peptide is a potential biomarker candidate.'}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
