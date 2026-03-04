'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Maximize2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeatmapData {
  proteins: string[];
  samples: string[];
  values: number[][];
  confidence: number[][];
}

interface AbundanceHeatmapProps {
  data: HeatmapData | null;
}

const COLOR_SCALE = [
  { threshold: 0, color: 'rgb(15, 23, 42)', glow: 'rgba(15, 23, 42, 0)' },
  { threshold: 0.2, color: 'rgb(30, 58, 138)', glow: 'rgba(30, 58, 138, 0.5)' },
  { threshold: 0.4, color: 'rgb(37, 99, 235)', glow: 'rgba(37, 99, 235, 0.5)' },
  { threshold: 0.6, color: 'rgb(124, 58, 237)', glow: 'rgba(124, 58, 237, 0.5)' },
  { threshold: 0.8, color: 'rgb(168, 85, 247)', glow: 'rgba(168, 85, 247, 0.5)' },
  { threshold: 1, color: 'rgb(236, 72, 153)', glow: 'rgba(236, 72, 153, 0.5)' },
];

function getColorForValue(value: number): { color: string; glow: string } {
  for (let i = COLOR_SCALE.length - 1; i >= 0; i--) {
    if (value >= COLOR_SCALE[i].threshold) {
      return { color: COLOR_SCALE[i].color, glow: COLOR_SCALE[i].glow };
    }
  }
  return { color: COLOR_SCALE[0].color, glow: COLOR_SCALE[0].glow };
}

export function AbundanceHeatmap({ data }: AbundanceHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ protein: number; sample: number } | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);

  const { displayProteins, displaySamples, displayValues, displayConfidence } = useMemo(() => {
    if (!data) return { displayProteins: [], displaySamples: [], displayValues: [], displayConfidence: [] };
    
    const maxProteins = 15;
    return {
      displayProteins: data.proteins.slice(0, maxProteins),
      displaySamples: data.samples,
      displayValues: data.values.slice(0, maxProteins),
      displayConfidence: data.confidence.slice(0, maxProteins)
    };
  }, [data]);

  if (!data || data.proteins.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl" />
        <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Grid3X3 className="h-5 w-5 text-purple-400" />
              </div>
              Protein Abundance Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-16">
            <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 mb-4">
              <Grid3X3 className="h-12 w-12 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-white">No heatmap data</p>
            <p className="text-sm text-slate-500 mt-2">Load data to visualize abundance heatmap</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl" />
      <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Grid3X3 className="h-5 w-5 text-purple-400" />
              </div>
              Protein Abundance Heatmap
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                {data.proteins.length} × {data.samples.length}
              </Badge>
            </CardTitle>
            
            {/* Color Scale Legend */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Low</span>
              <div className="flex h-3 w-28 rounded-full overflow-hidden shadow-inner">
                {COLOR_SCALE.map((c, i) => (
                  <div 
                    key={i} 
                    className="flex-1 transition-all duration-300" 
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">High</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <TooltipProvider delayDuration={100}>
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-full">
                {/* Sample Headers */}
                <div className="flex mb-3">
                  <div className="w-32 shrink-0" />
                  {displaySamples.map((sample, i) => (
                    <motion.div
                      key={sample}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="w-14 text-center shrink-0"
                    >
                      <span className="text-xs text-slate-400 transform -rotate-45 origin-center block whitespace-nowrap font-medium">
                        {sample.replace('Sample ', 'S')}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="space-y-1.5">
                  {displayProteins.map((protein, proteinIndex) => (
                    <motion.div 
                      key={protein} 
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: proteinIndex * 0.03 }}
                    >
                      {/* Protein Name */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-32 shrink-0 text-right pr-3 cursor-pointer transition-all ${
                              selectedProtein === protein ? 'text-purple-400' : 'text-slate-300'
                            }`}
                            onClick={() => setSelectedProtein(
                              selectedProtein === protein ? null : protein
                            )}
                          >
                            <span className="text-xs truncate block font-medium">
                              {protein.length > 14 ? protein.slice(0, 14) + '...' : protein}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                          <p className="font-medium">{protein}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Heatmap Cells */}
                      {displaySamples.map((sample, sampleIndex) => {
                        const value = displayValues[proteinIndex]?.[sampleIndex] ?? 0;
                        const confidence = displayConfidence[proteinIndex]?.[sampleIndex] ?? 0;
                        const { color, glow } = getColorForValue(value);
                        const isHovered = hoveredCell?.protein === proteinIndex && 
                                         hoveredCell?.sample === sampleIndex;
                        
                        return (
                          <Tooltip key={sample}>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={`relative w-14 h-9 shrink-0 rounded-lg cursor-pointer transition-all ${
                                  isHovered ? 'ring-2 ring-white/50 z-10 scale-110' : ''
                                } ${selectedProtein === protein ? 'ring-1 ring-purple-500/50' : ''}`}
                                style={{ backgroundColor: color }}
                                onMouseEnter={() => setHoveredCell({ protein: proteinIndex, sample: sampleIndex })}
                                onMouseLeave={() => setHoveredCell(null)}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                  delay: (proteinIndex * displaySamples.length + sampleIndex) * 0.005,
                                  duration: 0.2
                                }}
                                whileHover={{ scale: 1.15, zIndex: 20 }}
                              >
                                {isHovered && (
                                  <div 
                                    className="absolute inset-0 rounded-lg animate-pulse"
                                    style={{ boxShadow: `0 0 20px ${glow}` }}
                                  />
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
                              <div className="space-y-1.5">
                                <p className="font-medium text-white">{protein}</p>
                                <p className="text-xs text-slate-400">{sample}</p>
                                <div className="flex gap-4 text-xs pt-1">
                                  <span className="text-cyan-400">
                                    Abundance: {(value * 100).toFixed(1)}%
                                  </span>
                                  <span className="text-purple-400">
                                    Conf: {(confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span>Low abundance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-pink-500" />
                <span>High abundance</span>
              </div>
            </div>
            {data.proteins.length > 15 && (
              <Badge variant="outline" className="border-white/10 text-slate-400 bg-white/5">
                <Maximize2 className="h-3 w-3 mr-1.5" />
                Showing 15 of {data.proteins.length} proteins
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
