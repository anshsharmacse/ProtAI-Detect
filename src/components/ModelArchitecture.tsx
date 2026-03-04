'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Network, 
  Activity,
  ChevronRight,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LayerInfo {
  name: string;
  type: string;
  params: string;
  outputShape: string;
  description: string;
}

const MODEL_LAYERS: LayerInfo[] = [
  {
    name: 'Input Embedding',
    type: 'Embedding',
    params: '2,097,152',
    outputShape: '[batch, 512, 512]',
    description: 'Encodes peptide sequences with amino acid embeddings and positional encoding'
  },
  {
    name: 'Multi-Head Attention',
    type: 'Attention',
    params: '1,052,672',
    outputShape: '[batch, 512, 512]',
    description: '8 attention heads for capturing peptide-fragment relationships'
  },
  {
    name: 'Feed-Forward Network',
    type: 'Dense',
    params: '1,049,600',
    outputShape: '[batch, 512, 2048]',
    description: 'Two-layer MLP with GELU activation for non-linear transformations'
  },
  {
    name: 'Transformer Block ×6',
    type: 'Transformer',
    params: '6,291,456',
    outputShape: '[batch, 512, 512]',
    description: 'Stacked transformer layers with residual connections'
  },
  {
    name: 'Global Average Pooling',
    type: 'Pooling',
    params: '0',
    outputShape: '[batch, 512]',
    description: 'Aggregates sequence representations into protein-level features'
  },
  {
    name: 'Prediction Head',
    type: 'Dense',
    params: '513',
    outputShape: '[batch, 1]',
    description: 'Final MLP for abundance score prediction with sigmoid activation'
  }
];

const PERFORMANCE_METRICS = [
  { label: 'Training Accuracy', value: '94.2%', color: 'cyan' },
  { label: 'Validation Accuracy', value: '87.3%', color: 'purple' },
  { label: 'Test Accuracy', value: '87.0%', color: 'blue' },
  { label: 'AUC-ROC', value: '0.923', color: 'green' },
];

const FEATURE_ENCODINGS = [
  { feature: 'm/z Ratio', method: 'Min-Max Normalization', range: '100-5000 Da' },
  { feature: 'Intensity', method: 'Log10 Transform', range: '10^5 - 10^10' },
  { feature: 'Retention Time', method: 'Linear Scaling', range: '0-300 min' },
  { feature: 'Charge State', method: 'One-Hot Encoding', range: '1-10' },
  { feature: 'Amino Acid Seq', method: 'Learned Embedding', range: '20 AA types' },
];

export function ModelArchitecture() {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          Transformer Model Architecture
          <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
            11.5M Parameters
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Model Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Network className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-white">Attention Heads</span>
              </div>
              <p className="text-2xl font-bold text-cyan-400">8</p>
              <p className="text-xs text-slate-500 mt-1">Parallel attention mechanisms</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Layers className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-white">Transformer Layers</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">6</p>
              <p className="text-xs text-slate-500 mt-1">Stacked encoder blocks</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Brain className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-white">Hidden Size</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">512</p>
              <p className="text-xs text-slate-500 mt-1">Embedding dimension</p>
            </motion.div>
          </div>

          {/* Layer Architecture */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-400" />
              Layer Architecture
            </h4>
            <div className="space-y-2">
              {MODEL_LAYERS.map((layer, index) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 
                    hover:border-cyan-500/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                      flex items-center justify-center text-xs font-bold text-cyan-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm">{layer.name}</span>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {layer.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                          {layer.params} params
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{layer.description}</p>
                      <code className="text-xs text-purple-400/80 mt-1 block">
                        Output: {layer.outputShape}
                      </code>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feature Encodings */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Feature Encoding Pipeline
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-left py-2 px-3">Feature</th>
                    <th className="text-left py-2 px-3">Encoding Method</th>
                    <th className="text-left py-2 px-3">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ENCODINGS.map((encoding, index) => (
                    <motion.tr
                      key={encoding.feature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30"
                    >
                      <td className="py-2 px-3 text-cyan-300 font-medium">{encoding.feature}</td>
                      <td className="py-2 px-3 text-slate-400">{encoding.method}</td>
                      <td className="py-2 px-3 text-purple-400 font-mono">{encoding.range}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Performance Metrics (Benchmark Datasets)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PERFORMANCE_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center"
                >
                  <p className="text-lg font-bold text-white">{metric.value}</p>
                  <p className="text-xs text-slate-500">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technical Notes */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <h4 className="text-sm font-medium text-white mb-2">Technical Implementation</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Scaled dot-product attention with learnable temperature parameter</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Layer normalization with pre-norm architecture for stable training</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Dropout regularization (0.1) on attention weights and feed-forward layers</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Adam optimizer with cosine learning rate decay (lr=1e-4, warmup=1000 steps)</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
