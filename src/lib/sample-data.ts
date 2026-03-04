import { ProteinFeature, PredictionResult, AttentionWeight, TemporalDataPoint } from '@/types';

// Common protein names in proteomics research
const PROTEIN_NAMES = [
  'Albumin', 'Globulin', 'Hemoglobin', 'Insulin', 'Myosin',
  'Actin', 'Tubulin', 'Keratin', 'Collagen', 'Fibrinogen',
  'Transferrin', 'Ferritin', 'Ceruloplasmin', 'Haptoglobin', 'Alpha-1-antitrypsin',
  'Alpha-2-macroglobulin', 'Complement C3', 'Complement C4', 'Immunoglobulin G', 'Immunoglobulin A',
  'Immunoglobulin M', 'C-reactive protein', 'Fibronectin', 'Vitronectin', 'Apolipoprotein A1',
  'Apolipoprotein B', 'Transthyretin', 'Retinol-binding protein', 'Beta-2-microglobulin', 'Cystatin C',
  'Neutrophil gelatinase-associated lipocalin', 'Kidney injury molecule-1', 'Liver fatty acid-binding protein', 'Glutathione S-transferase', 'N-acetyl-beta-D-glucosaminidase',
  'Glyceraldehyde-3-phosphate dehydrogenase', 'Enolase', 'Pyruvate kinase', 'Lactate dehydrogenase', 'Creatine kinase',
  'Carbonic anhydrase', 'Superoxide dismutase', 'Catalase', 'Glutathione peroxidase', 'Thioredoxin',
  'Heat shock protein 70', 'Heat shock protein 90', 'GRP78', 'Calnexin', 'Calreticulin',
  'Ubiquitin', 'Proteasome subunit', 'Histone H1', 'Histone H2A', 'Histone H2B'
];

// Amino acid single letter codes
const AMINO_ACIDS = 'ACDEFGHIKLMNPQRSTVWY';

// Fragment types in mass spectrometry
const FRAGMENT_TYPES = ['b-ion', 'y-ion', 'a-ion', 'c-ion', 'x-ion', 'z-ion'];

// Generate random peptide sequence
function generatePeptideSequence(minLength: number = 7, maxLength: number = 20): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let sequence = '';
  for (let i = 0; i < length; i++) {
    sequence += AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)];
  }
  return sequence;
}

// Generate unique ID
function generateId(): string {
  return `pep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate realistic m/z ratio based on peptide properties
function calculateMzRatio(sequence: string, chargeState: number): number {
  // Average amino acid mass is ~110 Da
  const baseMass = sequence.length * 110;
  // Add some random variation
  const variation = (Math.random() - 0.5) * 50;
  // m/z = (M + nH) / n where M is mass, n is charge, H is proton mass
  const mzRatio = (baseMass + variation + chargeState * 1.007) / chargeState;
  return Math.round(mzRatio * 1000) / 1000;
}

// Generate realistic intensity based on abundance
function generateIntensity(abundance: number): number {
  const baseIntensity = Math.pow(10, 5 + abundance * 5);
  const variation = (Math.random() - 0.5) * baseIntensity * 0.3;
  return Math.round(baseIntensity + variation);
}

// Generate retention time
function generateRetentionTime(): number {
  // Typical LC gradient: 5-120 minutes
  return Math.round((5 + Math.random() * 115) * 100) / 100;
}

// Generate charge state
function generateChargeState(): number {
  const rand = Math.random();
  if (rand < 0.4) return 2;
  if (rand < 0.7) return 3;
  if (rand < 0.9) return 4;
  return 1;
}

// Generate sample protein features
export function generateSampleProteinFeatures(count: number = 100): ProteinFeature[] {
  const features: ProteinFeature[] = [];
  const proteinsToUse = PROTEIN_NAMES.slice(0, Math.min(Math.ceil(count / 3), PROTEIN_NAMES.length));
  
  for (let i = 0; i < count; i++) {
    const proteinName = proteinsToUse[Math.floor(Math.random() * proteinsToUse.length)];
    const peptideSequence = generatePeptideSequence();
    const chargeState = generateChargeState();
    const mzRatio = calculateMzRatio(peptideSequence, chargeState);
    
    features.push({
      id: generateId(),
      proteinName,
      peptideSequence,
      mzRatio,
      intensity: generateIntensity(Math.random()),
      retentionTime: generateRetentionTime(),
      chargeState,
      fragmentType: FRAGMENT_TYPES[Math.floor(Math.random() * FRAGMENT_TYPES.length)]
    });
  }
  
  return features;
}

// Generate sample prediction results
export function generateSamplePredictions(features: ProteinFeature[]): PredictionResult[] {
  const proteinMap = new Map<string, ProteinFeature[]>();
  
  // Group features by protein
  features.forEach(feature => {
    if (!proteinMap.has(feature.proteinName)) {
      proteinMap.set(feature.proteinName, []);
    }
    proteinMap.get(feature.proteinName)!.push(feature);
  });
  
  const predictions: PredictionResult[] = [];
  
  proteinMap.forEach((peptides, proteinName) => {
    const proteinId = `prot_${proteinName.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Generate abundance based on average intensity of peptides
    const avgIntensity = peptides.reduce((sum, p) => sum + Math.log10(p.intensity), 0) / peptides.length;
    const abundanceScore = Math.min(1, Math.max(0, (avgIntensity - 5) / 5));
    
    // Generate confidence based on number of peptides and their consistency
    const confidence = Math.min(0.99, 0.5 + (peptides.length / 10) * 0.3 + Math.random() * 0.2);
    
    // Generate attention weights for each peptide
    const attentionWeights: AttentionWeight[] = peptides.map(p => {
      const weight = Math.random();
      return {
        peptideId: p.id,
        peptideSequence: p.peptideSequence,
        weight: weight / peptides.length * 2,
        importance: weight > 0.7 ? 'high' : weight > 0.3 ? 'medium' : 'low'
      };
    });
    
    // Normalize attention weights
    const totalWeight = attentionWeights.reduce((sum, a) => sum + a.weight, 0);
    attentionWeights.forEach(a => a.weight = a.weight / totalWeight);
    
    // Generate temporal data
    const temporalData: TemporalDataPoint[] = [];
    const baseAbundance = abundanceScore;
    for (let t = 0; t <= 24; t += 4) {
      const variation = (Math.random() - 0.5) * 0.2;
      temporalData.push({
        time: t,
        abundance: Math.max(0, Math.min(1, baseAbundance + variation)),
        confidence: confidence + (Math.random() - 0.5) * 0.1
      });
    }
    
    predictions.push({
      proteinId,
      proteinName,
      abundanceScore: Math.round(abundanceScore * 1000) / 1000,
      confidence: Math.round(confidence * 1000) / 1000,
      attentionWeights,
      temporalData,
      peptideContributions: peptides.slice(0, 5).map(p => ({
        peptideId: p.id,
        peptideSequence: p.peptideSequence,
        contribution: Math.round(Math.random() * 30 + 10),
        mzRatio: p.mzRatio,
        intensity: p.intensity
      }))
    });
  });
  
  return predictions;
}

// Generate heatmap data for multiple proteins across samples
export function generateHeatmapData(predictions: PredictionResult[]): {
  proteins: string[];
  samples: string[];
  values: number[][];
  confidence: number[][];
} {
  const samples = ['Sample A', 'Sample B', 'Sample C', 'Sample D', 'Sample E', 'Sample F'];
  const proteins = predictions.slice(0, 20).map(p => p.proteinName);
  
  const values: number[][] = [];
  const confidence: number[][] = [];
  
  proteins.forEach(protein => {
    const prediction = predictions.find(p => p.proteinName === protein);
    const baseAbundance = prediction?.abundanceScore || 0.5;
    const baseConfidence = prediction?.confidence || 0.8;
    
    const rowValues: number[] = [];
    const rowConfidence: number[] = [];
    
    samples.forEach(() => {
      const variation = (Math.random() - 0.5) * 0.3;
      rowValues.push(Math.max(0, Math.min(1, baseAbundance + variation)));
      rowConfidence.push(Math.max(0.5, Math.min(1, baseConfidence + (Math.random() - 0.5) * 0.1)));
    });
    
    values.push(rowValues);
    confidence.push(rowConfidence);
  });
  
  return { proteins, samples, values, confidence };
}

// Generate statistics
export function generateStatistics(predictions: PredictionResult[]): {
  totalProteins: number;
  totalPeptides: number;
  averageAbundance: number;
  averageConfidence: number;
  highConfidencePredictions: number;
  modelAccuracy: number;
  processingTime: number;
  lastUpdated: string;
} {
  const totalPeptides = predictions.reduce((sum, p) => sum + p.attentionWeights.length, 0);
  const averageAbundance = predictions.reduce((sum, p) => sum + p.abundanceScore, 0) / predictions.length;
  const averageConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const highConfidencePredictions = predictions.filter(p => p.confidence > 0.85).length;
  
  return {
    totalProteins: predictions.length,
    totalPeptides,
    averageAbundance: Math.round(averageAbundance * 1000) / 1000,
    averageConfidence: Math.round(averageConfidence * 1000) / 1000,
    highConfidencePredictions,
    modelAccuracy: 0.94 + Math.random() * 0.04,
    processingTime: Math.round(50 + Math.random() * 150),
    lastUpdated: new Date().toISOString()
  };
}

// Generate demo data for initial display
export function getDemoData(): {
  features: ProteinFeature[];
  predictions: PredictionResult[];
  heatmapData: ReturnType<typeof generateHeatmapData>;
  statistics: ReturnType<typeof generateStatistics>;
} {
  const features = generateSampleProteinFeatures(150);
  const predictions = generateSamplePredictions(features);
  const heatmapData = generateHeatmapData(predictions);
  const statistics = generateStatistics(predictions);
  
  return { features, predictions, heatmapData, statistics };
}

// CSV template for download
export const CSV_TEMPLATE = `protein_name,peptide_sequence,mz_ratio,intensity,retention_time,charge_state,fragment_type
Albumin,ALVLIAFAQYLQQC,445.234,1250000,45.67,2,b-ion
Hemoglobin,VNVDEVGGEALGR,671.845,890000,32.15,3,y-ion
Insulin,FVNQHLCGSHLVEA,512.678,2100000,28.90,2,b-ion
Myosin,KQELEEEVSQEVK,523.456,560000,55.23,3,y-ion
Actin,DDDIAALVVDNGSGMCK,678.234,1450000,41.05,2,b-ion`;
