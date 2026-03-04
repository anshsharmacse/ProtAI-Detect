'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PredictionResult } from '@/types';

interface TemporalChartProps {
  predictions: PredictionResult[];
}

const COLORS = [
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#6366f1', // indigo
  '#ef4444', // red
  '#84cc16', // lime
];

export function TemporalChart({ predictions }: TemporalChartProps) {
  const [selectedProteins, setSelectedProteins] = useState<string[]>(
    predictions.slice(0, 5).map(p => p.proteinId)
  );

  const chartData = useMemo(() => {
    if (predictions.length === 0 || selectedProteins.length === 0) return [];
    
    const firstSelected = predictions.find(p => selectedProteins.includes(p.proteinId));
    if (!firstSelected || firstSelected.temporalData.length === 0) return [];
    
    return firstSelected.temporalData.map((dataPoint, index) => {
      const point: Record<string, number> = { time: dataPoint.time };
      
      selectedProteins.forEach(proteinId => {
        const prediction = predictions.find(p => p.proteinId === proteinId);
        if (prediction && prediction.temporalData[index]) {
          point[prediction.proteinName] = prediction.temporalData[index].abundance;
        }
      });
      
      return point;
    });
  }, [predictions, selectedProteins]);

  const toggleProtein = (proteinId: string) => {
    setSelectedProteins(prev => 
      prev.includes(proteinId)
        ? prev.filter(id => id !== proteinId)
        : prev.length < 8 
          ? [...prev, proteinId]
          : prev
    );
  };

  const getTrendStats = (prediction: PredictionResult) => {
    if (prediction.temporalData.length < 2) {
      return { change: 0, direction: 'stable' };
    }
    const start = prediction.temporalData[0].abundance;
    const end = prediction.temporalData[prediction.temporalData.length - 1].abundance;
    const change = ((end - start) / start) * 100;
    return {
      change: change.toFixed(1),
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
    };
  };

  if (predictions.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl blur-xl" />
        <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              Temporal Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-16">
            <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 mb-4">
              <Activity className="h-12 w-12 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-white">No temporal data</p>
            <p className="text-sm text-slate-500 mt-2">Load data to visualize temporal dynamics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upCount = predictions.filter(p => getTrendStats(p).direction === 'up').length;
  const downCount = predictions.filter(p => getTrendStats(p).direction === 'down').length;
  const stableCount = predictions.filter(p => getTrendStats(p).direction === 'stable').length;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl blur-xl" />
      <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              Temporal Dynamics
              <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedProteins.length} proteins
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-5">
            {/* Protein Selection */}
            <div className="flex flex-wrap gap-2">
              {predictions.slice(0, 10).map((prediction, index) => {
                const isSelected = selectedProteins.includes(prediction.proteinId);
                const stats = getTrendStats(prediction);
                
                return (
                  <motion.div
                    key={prediction.proteinId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleProtein(prediction.proteinId)}
                      className={`rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? 'text-white hover:opacity-90 shadow-lg' 
                          : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20'
                      }`}
                      style={isSelected ? { 
                        backgroundColor: COLORS[index % COLORS.length],
                        boxShadow: `0 4px 20px ${COLORS[index % COLORS.length]}40`
                      } : undefined}
                    >
                      <span className="max-w-[100px] truncate">
                        {prediction.proteinName.length > 12 
                          ? prediction.proteinName.slice(0, 12) + '...' 
                          : prediction.proteinName}
                      </span>
                      {stats.direction === 'up' && (
                        <TrendingUp className="ml-1.5 h-3.5 w-3.5 text-emerald-400" />
                      )}
                      {stats.direction === 'down' && (
                        <TrendingDown className="ml-1.5 h-3.5 w-3.5 text-rose-400" />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart */}
            <motion.div 
              className="h-[320px] rounded-2xl bg-slate-800/30 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    label={{ 
                      value: 'Time (hours)', 
                      position: 'insideBottom', 
                      offset: -5,
                      fill: '#64748b',
                      fontSize: 12
                    }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelFormatter={(label) => `Time: ${label}h`}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => (
                      <span className="text-slate-300 text-xs">{value}</span>
                    )}
                  />
                  {selectedProteins.map((proteinId, index) => {
                    const prediction = predictions.find(p => p.proteinId === proteinId);
                    if (!prediction) return null;
                    
                    return (
                      <Line
                        key={proteinId}
                        type="monotone"
                        dataKey={prediction.proteinName}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Trend Summary */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 p-4 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span className="text-2xl font-bold text-emerald-400">{upCount}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Upregulated</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/20 p-4 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <TrendingDown className="h-5 w-5 text-rose-400" />
                    <span className="text-2xl font-bold text-rose-400">{downCount}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Downregulated</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20 p-4 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Activity className="h-5 w-5 text-slate-400" />
                    <span className="text-2xl font-bold text-slate-400">{stableCount}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Stable</p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
