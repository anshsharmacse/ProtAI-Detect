import { ProteinFeature, PredictionResult, AttentionWeight, TemporalDataPoint, ModelConfig } from '@/types';

// Default model configuration
const DEFAULT_CONFIG: ModelConfig = {
  attentionHeads: 8,
  hiddenSize: 512,
  numLayers: 6,
  dropout: 0.1,
  sequenceLength: 512
};

// Simulate transformer attention mechanism
function attentionMechanism(
  query: number[],
  keys: number[][],
  values: number[][]
): { output: number[]; attentionWeights: number[] } {
  const numKeys = keys.length;
  const weights: number[] = [];
  
  // Calculate attention scores (scaled dot-product attention)
  for (let i = 0; i < numKeys; i++) {
    let score = 0;
    for (let j = 0; j < query.length; j++) {
      score += query[j] * keys[i][j];
    }
    weights.push(score / Math.sqrt(query.length));
  }
  
  // Apply softmax
  const maxWeight = Math.max(...weights);
  const expWeights = weights.map(w => Math.exp(w - maxWeight));
  const sumExp = expWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = expWeights.map(w => w / sumExp);
  
  // Calculate weighted sum of values
  const output: number[] = new Array(values[0].length).fill(0);
  for (let i = 0; i < numKeys; i++) {
    for (let j = 0; j < values[i].length; j++) {
      output[j] += normalizedWeights[i] * values[i][j];
    }
  }
  
  return { output, attentionWeights: normalizedWeights };
}

// Encode peptide features into embedding vector
function encodePeptideFeatures(feature: ProteinFeature): number[] {
  const embedding: number[] = [];
  
  // Encode m/z ratio (normalized to 0-1)
  embedding.push((feature.mzRatio - 100) / 4900);
  
  // Encode intensity (log-transformed)
  embedding.push(Math.log10(feature.intensity + 1) / 8);
  
  // Encode retention time (normalized)
  embedding.push(feature.retentionTime / 300);
  
  // Encode charge state (normalized)
  embedding.push(feature.chargeState / 10);
  
  // Encode peptide sequence features
  const sequence = feature.peptideSequence.toUpperCase();
  const aminoAcidCounts: Record<string, number> = {};
  for (const aa of sequence) {
    aminoAcidCounts[aa] = (aminoAcidCounts[aa] || 0) + 1;
  }
  
  // One-hot encode amino acid composition (simplified)
  const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY';
  for (const aa of aminoAcids) {
    embedding.push((aminoAcidCounts[aa] || 0) / sequence.length);
  }
  
  // Add some learned positional embeddings (simulated)
  for (let i = 0; i < 28; i++) {
    embedding.push(Math.sin(i * 0.1 + sequence.length * 0.05));
  }
  
  return embedding;
}

// Simulate multi-head attention
function multiHeadAttention(
  embeddings: number[][],
  numHeads: number
): { output: number[][]; attentionWeights: number[][] } {
  const headSize = Math.floor(embeddings[0].length / numHeads);
  const outputs: number[][] = [];
  const allWeights: number[][] = [];
  
  for (let h = 0; h < numHeads; h++) {
    const queries = embeddings.map(e => e.slice(h * headSize, (h + 1) * headSize));
    const keys = embeddings.map(e => e.slice(h * headSize, (h + 1) * headSize));
    const values = embeddings.map(e => e.slice(h * headSize, (h + 1) * headSize));
    
    const headOutputs: number[][] = [];
    const headWeights: number[] = [];
    
    for (let i = 0; i < embeddings.length; i++) {
      const { output, attentionWeights } = attentionMechanism(
        queries[i],
        keys,
        values
      );
      headOutputs.push(output);
      if (i === 0) {
        headWeights.push(...attentionWeights);
      }
    }
    
    outputs.push(...headOutputs);
    allWeights.push(headWeights);
  }
  
  return { output: outputs, attentionWeights: allWeights };
}

// Simulate feed-forward layer
function feedForward(x: number[], hiddenSize: number): number[] {
  const output: number[] = [];
  
  // First linear layer + ReLU
  const hidden: number[] = [];
  for (let i = 0; i < hiddenSize; i++) {
    let sum = 0;
    for (let j = 0; j < x.length; j++) {
      sum += x[j] * Math.sin(i * j * 0.1); // Simulated weights
    }
    hidden.push(Math.max(0, sum));
  }
  
  // Second linear layer
  for (let i = 0; i < x.length; i++) {
    let sum = 0;
    for (let j = 0; j < hidden.length; j++) {
      sum += hidden[j] * Math.cos(i * j * 0.1); // Simulated weights
    }
    output.push(sum + x[i]); // Residual connection
  }
  
  return output;
}

// Layer normalization
function layerNorm(x: number[]): number[] {
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((a, b) => a + (b - mean) ** 2, 0) / x.length;
  const std = Math.sqrt(variance + 1e-6);
  
  return x.map(v => (v - mean) / std);
}

// Main transformer encoder block
function transformerBlock(
  embeddings: number[][],
  config: ModelConfig
): { output: number[][]; attentionWeights: number[][] } {
  // Multi-head attention
  const { output: attnOutput, attentionWeights } = multiHeadAttention(
    embeddings.map(e => layerNorm(e)),
    config.attentionHeads
  );
  
  // Add residual connection
  const afterAttention = embeddings.map((e, i) => 
    e.map((v, j) => v + (attnOutput[i]?.[j] || 0))
  );
  
  // Feed-forward with residual
  const output = afterAttention.map(e => {
    const normalized = layerNorm(e);
    const ff = feedForward(normalized, config.hiddenSize);
    return e.map((v, i) => v + ff[i]);
  });
  
  return { output, attentionWeights };
}

// Predict protein abundance from features
export async function predictAbundance(
  features: ProteinFeature[],
  config: ModelConfig = DEFAULT_CONFIG
): Promise<PredictionResult[]> {
  const predictions: PredictionResult[] = [];
  
  // Group features by protein
  const proteinGroups = new Map<string, ProteinFeature[]>();
  features.forEach(f => {
    if (!proteinGroups.has(f.proteinName)) {
      proteinGroups.set(f.proteinName, []);
    }
    proteinGroups.get(f.proteinName)!.push(f);
  });
  
  // Process each protein
  for (const [proteinName, peptides] of proteinGroups) {
    const proteinId = `prot_${proteinName.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Encode all peptides
    const embeddings = peptides.map(p => encodePeptideFeatures(p));
    
    // Pass through transformer layers
    let currentEmbeddings = embeddings;
    let allAttentionWeights: number[][] = [];
    
    for (let layer = 0; layer < config.numLayers; layer++) {
      const { output, attentionWeights } = transformerBlock(currentEmbeddings, config);
      currentEmbeddings = output;
      if (layer === config.numLayers - 1) {
        allAttentionWeights = attentionWeights;
      }
    }
    
    // Pool embeddings (mean pooling)
    const pooledEmbedding: number[] = [];
    const embeddingSize = currentEmbeddings[0]?.length || 0;
    for (let i = 0; i < embeddingSize; i++) {
      const sum = currentEmbeddings.reduce((acc, e) => acc + (e[i] || 0), 0);
      pooledEmbedding.push(sum / currentEmbeddings.length);
    }
    
    // Final prediction head (simulated)
    const abundanceScore = sigmoid(pooledEmbedding.reduce((acc, v, i) => 
      acc + v * Math.sin(i * 0.5) * 0.1, 0.5
    ));
    
    const confidence = sigmoid(pooledEmbedding.reduce((acc, v, i) => 
      acc + Math.abs(v) * 0.05, 0.5
    ));
    
    // Calculate attention weights for each peptide
    const peptideWeights: AttentionWeight[] = peptides.map((p, i) => {
      // Use the first head's attention weights
      const avgWeight = allAttentionWeights.reduce((sum, head) => 
        sum + (head[i] || 0), 0
      ) / allAttentionWeights.length;
      
      return {
        peptideId: p.id,
        peptideSequence: p.peptideSequence,
        weight: Math.max(0.01, Math.min(1, avgWeight)),
        importance: avgWeight > 0.3 ? 'high' : avgWeight > 0.1 ? 'medium' : 'low'
      };
    });
    
    // Normalize weights
    const totalWeight = peptideWeights.reduce((sum, w) => sum + w.weight, 0);
    peptideWeights.forEach(w => w.weight = w.weight / totalWeight);
    
    // Sort by weight
    peptideWeights.sort((a, b) => b.weight - a.weight);
    
    // Generate temporal dynamics
    const temporalData: TemporalDataPoint[] = generateTemporalData(abundanceScore, confidence);
    
    predictions.push({
      proteinId,
      proteinName,
      abundanceScore: Math.round(abundanceScore * 1000) / 1000,
      confidence: Math.round(confidence * 1000) / 1000,
      attentionWeights: peptideWeights,
      temporalData,
      peptideContributions: peptides.slice(0, 5).map((p, i) => ({
        peptideId: p.id,
        peptideSequence: p.peptideSequence,
        contribution: Math.round((peptideWeights[i]?.weight || 0) * 100),
        mzRatio: p.mzRatio,
        intensity: p.intensity
      }))
    });
  }
  
  return predictions;
}

// Sigmoid activation function
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Generate temporal dynamics data
function generateTemporalData(
  baseAbundance: number,
  confidence: number
): TemporalDataPoint[] {
  const data: TemporalDataPoint[] = [];
  const trend = Math.random() > 0.5 ? 1 : -1;
  const noiseLevel = 0.1 * (1 - confidence);
  
  for (let t = 0; t <= 24; t += 4) {
    const trendEffect = trend * (t / 24) * 0.3;
    const noise = (Math.random() - 0.5) * noiseLevel * 2;
    const cyclicEffect = Math.sin(t * Math.PI / 12) * 0.1;
    
    data.push({
      time: t,
      abundance: Math.max(0, Math.min(1, baseAbundance + trendEffect + noise + cyclicEffect)),
      confidence: Math.max(0.5, confidence - Math.abs(noise))
    });
  }
  
  return data;
}

// Get attention visualization data
export function getAttentionVisualization(
  prediction: PredictionResult
): {
  peptideSequences: string[];
  weights: number[];
  importance: string[];
} {
  return {
    peptideSequences: prediction.attentionWeights.map(w => w.peptideSequence),
    weights: prediction.attentionWeights.map(w => w.weight),
    importance: prediction.attentionWeights.map(w => w.importance)
  };
}

// Analyze protein dynamics
export function analyzeDynamics(
  predictions: PredictionResult[]
): {
  upregulated: PredictionResult[];
  downregulated: PredictionResult[];
  stable: PredictionResult[];
  significantChanges: PredictionResult[];
} {
  const upregulated: PredictionResult[] = [];
  const downregulated: PredictionResult[] = [];
  const stable: PredictionResult[] = [];
  const significantChanges: PredictionResult[] = [];
  
  predictions.forEach(pred => {
    const temporalData = pred.temporalData;
    if (temporalData.length < 2) {
      stable.push(pred);
      return;
    }
    
    const startAbundance = temporalData[0].abundance;
    const endAbundance = temporalData[temporalData.length - 1].abundance;
    const change = endAbundance - startAbundance;
    
    if (Math.abs(change) > 0.2 && pred.confidence > 0.7) {
      significantChanges.push(pred);
    }
    
    if (change > 0.1) {
      upregulated.push(pred);
    } else if (change < -0.1) {
      downregulated.push(pred);
    } else {
      stable.push(pred);
    }
  });
  
  return { upregulated, downregulated, stable, significantChanges };
}
