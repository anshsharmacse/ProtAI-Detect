// Protein Feature Input Types
export interface ProteinFeature {
  id: string;
  proteinName: string;
  peptideSequence: string;
  mzRatio: number;        // mass-to-charge ratio (typically 400-2000)
  intensity: number;       // signal intensity
  retentionTime: number;   // chromatography retention time (minutes)
  chargeState: number;     // ion charge (typically 1-5)
  fragmentType: string;    // b-ion, y-ion, etc.
}

// Raw upload data format (CSV/JSON)
export interface RawProteinData {
  protein_name: string;
  peptide_sequence: string;
  mz_ratio: number;
  intensity: number;
  retention_time: number;
  charge_state: number;
  fragment_type?: string;
}

// Prediction Result Types
export interface PredictionResult {
  proteinId: string;
  proteinName: string;
  abundanceScore: number;  // 0-1 normalized abundance
  confidence: number;      // 0-1 confidence score
  attentionWeights: AttentionWeight[];
  temporalData: TemporalDataPoint[];
  peptideContributions: PeptideContribution[];
}

export interface AttentionWeight {
  peptideId: string;
  peptideSequence: string;
  weight: number;          // 0-1 normalized attention weight
  importance: 'high' | 'medium' | 'low';
}

export interface TemporalDataPoint {
  time: number;            // time point (hours/days)
  abundance: number;       // abundance at this time point
  confidence: number;      // confidence interval
}

export interface PeptideContribution {
  peptideId: string;
  peptideSequence: string;
  contribution: number;    // percentage contribution
  mzRatio: number;
  intensity: number;
}

// Analysis Request/Response Types
export interface AnalyzeRequest {
  proteinIds: string[];
  timeRange?: {
    start: number;
    end: number;
  };
}

export interface AnalyzeResponse {
  proteins: ProteinAnalysis[];
  summary: AnalysisSummary;
}

export interface ProteinAnalysis {
  proteinId: string;
  proteinName: string;
  abundance: number;
  foldChange: number;
  pValue: number;
  significance: boolean;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalysisSummary {
  totalProteins: number;
  significantProteins: number;
  upregulated: number;
  downregulated: number;
  averageAbundance: number;
  analysisDate: string;
}

// Upload Response Types
export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    totalRecords: number;
    uniqueProteins: number;
    validRecords: number;
    invalidRecords: number;
    preview: ProteinFeature[];
    warnings: string[];
  };
}

// Heatmap Data Types
export interface HeatmapCell {
  proteinId: string;
  proteinName: string;
  sample: string;
  abundance: number;
  confidence: number;
}

export interface HeatmapData {
  proteins: string[];
  samples: string[];
  values: number[][];
  confidence: number[][];
}

// Statistics Types
export interface Statistics {
  totalProteins: number;
  totalPeptides: number;
  averageAbundance: number;
  averageConfidence: number;
  highConfidencePredictions: number;
  modelAccuracy: number;
  processingTime: number;
  lastUpdated: string;
}

// Model Configuration
export interface ModelConfig {
  attentionHeads: number;
  hiddenSize: number;
  numLayers: number;
  dropout: number;
  sequenceLength: number;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  confidence?: number;
  fill?: string;
}

export interface LineChartDataPoint {
  time: number;
  [key: string]: number | undefined;
}

// Export Types
export interface ExportData {
  predictions: PredictionResult[];
  statistics: Statistics;
  exportDate: string;
  format: 'csv' | 'json';
}
