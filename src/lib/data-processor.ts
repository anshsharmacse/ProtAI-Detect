import { ProteinFeature, RawProteinData } from '@/types';

// Parse CSV string to raw data objects
export function parseCSV(csvString: string): RawProteinData[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const requiredColumns = ['protein_name', 'peptide_sequence', 'mz_ratio', 'intensity', 'retention_time', 'charge_state'];
  
  const missingColumns = requiredColumns.filter(col => !header.includes(col));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  const results: RawProteinData[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== header.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }

    try {
      const row: Record<string, string> = {};
      header.forEach((col, idx) => {
        row[col] = values[idx];
      });

      results.push({
        protein_name: row['protein_name'],
        peptide_sequence: row['peptide_sequence'],
        mz_ratio: parseFloat(row['mz_ratio']),
        intensity: parseFloat(row['intensity']),
        retention_time: parseFloat(row['retention_time']),
        charge_state: parseInt(row['charge_state']),
        fragment_type: row['fragment_type'] || 'b-ion'
      });
    } catch {
      errors.push(`Row ${i + 1}: Failed to parse values`);
    }
  }

  if (errors.length > 0) {
    console.warn('CSV parsing warnings:', errors);
  }

  return results;
}

// Validate raw protein data
export function validateRawData(data: RawProteinData[]): {
  valid: RawProteinData[];
  invalid: { row: RawProteinData; reason: string }[];
} {
  const valid: RawProteinData[] = [];
  const invalid: { row: RawProteinData; reason: string }[] = [];

  data.forEach(row => {
    const errors: string[] = [];

    // Validate protein name
    if (!row.protein_name || row.protein_name.length === 0) {
      errors.push('Missing protein name');
    }

    // Validate peptide sequence
    if (!row.peptide_sequence || row.peptide_sequence.length < 5) {
      errors.push('Peptide sequence too short (min 5 amino acids)');
    }
    if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/i.test(row.peptide_sequence)) {
      errors.push('Invalid amino acid in sequence');
    }

    // Validate m/z ratio (typical range: 400-2000)
    if (isNaN(row.mz_ratio) || row.mz_ratio < 100 || row.mz_ratio > 5000) {
      errors.push('m/z ratio out of valid range (100-5000)');
    }

    // Validate intensity
    if (isNaN(row.intensity) || row.intensity < 0) {
      errors.push('Invalid intensity value');
    }

    // Validate retention time
    if (isNaN(row.retention_time) || row.retention_time < 0 || row.retention_time > 300) {
      errors.push('Retention time out of valid range (0-300 min)');
    }

    // Validate charge state
    if (isNaN(row.charge_state) || row.charge_state < 1 || row.charge_state > 10) {
      errors.push('Invalid charge state (1-10)');
    }

    if (errors.length === 0) {
      valid.push(row);
    } else {
      invalid.push({ row, reason: errors.join('; ') });
    }
  });

  return { valid, invalid };
}

// Convert raw data to protein features
export function rawToFeatures(data: RawProteinData[]): ProteinFeature[] {
  return data.map((row, index) => ({
    id: `pep_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
    proteinName: row.protein_name,
    peptideSequence: row.peptide_sequence.toUpperCase(),
    mzRatio: row.mz_ratio,
    intensity: row.intensity,
    retentionTime: row.retention_time,
    chargeState: row.charge_state,
    fragmentType: row.fragment_type || 'b-ion'
  }));
}

// Normalize intensity values (log transformation and scaling)
export function normalizeIntensities(features: ProteinFeature[]): ProteinFeature[] {
  const intensities = features.map(f => f.intensity);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);

  return features.map(f => ({
    ...f,
    intensity: (Math.log10(f.intensity + 1) - Math.log10(minIntensity + 1)) /
               (Math.log10(maxIntensity + 1) - Math.log10(minIntensity + 1))
  }));
}

// Group features by protein
export function groupByProtein(features: ProteinFeature[]): Map<string, ProteinFeature[]> {
  const grouped = new Map<string, ProteinFeature[]>();
  
  features.forEach(feature => {
    if (!grouped.has(feature.proteinName)) {
      grouped.set(feature.proteinName, []);
    }
    grouped.get(feature.proteinName)!.push(feature);
  });
  
  return grouped;
}

// Calculate protein statistics
export function calculateProteinStats(features: ProteinFeature[]): {
  proteinName: string;
  peptideCount: number;
  avgMzRatio: number;
  avgIntensity: number;
  avgRetentionTime: number;
}[] {
  const grouped = groupByProtein(features);
  
  return Array.from(grouped.entries()).map(([proteinName, peptides]) => ({
    proteinName,
    peptideCount: peptides.length,
    avgMzRatio: peptides.reduce((sum, p) => sum + p.mzRatio, 0) / peptides.length,
    avgIntensity: peptides.reduce((sum, p) => sum + p.intensity, 0) / peptides.length,
    avgRetentionTime: peptides.reduce((sum, p) => sum + p.retentionTime, 0) / peptides.length
  }));
}

// Detect outliers using IQR method
export function detectOutliers(features: ProteinFeature[]): {
  outliers: ProteinFeature[];
  normal: ProteinFeature[];
} {
  const intensities = features.map(f => f.intensity).sort((a, b) => a - b);
  const q1 = intensities[Math.floor(intensities.length * 0.25)];
  const q3 = intensities[Math.floor(intensities.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return {
    outliers: features.filter(f => f.intensity < lowerBound || f.intensity > upperBound),
    normal: features.filter(f => f.intensity >= lowerBound && f.intensity <= upperBound)
  };
}

// Export predictions to CSV
export function predictionsToCSV(predictions: {
  proteinId: string;
  proteinName: string;
  abundanceScore: number;
  confidence: number;
}[]): string {
  const header = 'protein_id,protein_name,abundance_score,confidence\n';
  const rows = predictions.map(p => 
    `${p.proteinId},${p.proteinName},${p.abundanceScore},${p.confidence}`
  ).join('\n');
  
  return header + rows;
}

// Export predictions to JSON
export function predictionsToJSON(predictions: unknown): string {
  return JSON.stringify(predictions, null, 2);
}
