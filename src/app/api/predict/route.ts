import { NextRequest, NextResponse } from 'next/server';
import { predictAbundance } from '@/lib/protein-model';
import { ProteinFeature } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { features } = body as { features: ProteinFeature[] };

    if (!features || !Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No features provided. Please upload protein feature data.' },
        { status: 400 }
      );
    }

    // Validate features
    const validFeatures: ProteinFeature[] = [];
    const errors: string[] = [];

    features.forEach((feature, index) => {
      if (!feature.proteinName) {
        errors.push(`Feature ${index + 1}: Missing protein name`);
        return;
      }
      if (!feature.peptideSequence || feature.peptideSequence.length < 5) {
        errors.push(`Feature ${index + 1}: Invalid peptide sequence`);
        return;
      }
      if (typeof feature.mzRatio !== 'number' || feature.mzRatio < 100 || feature.mzRatio > 5000) {
        errors.push(`Feature ${index + 1}: Invalid m/z ratio`);
        return;
      }
      if (typeof feature.intensity !== 'number' || feature.intensity < 0) {
        errors.push(`Feature ${index + 1}: Invalid intensity`);
        return;
      }
      validFeatures.push({
        id: feature.id || `pep_${Date.now()}_${index}`,
        proteinName: feature.proteinName,
        peptideSequence: feature.peptideSequence.toUpperCase(),
        mzRatio: feature.mzRatio,
        intensity: feature.intensity,
        retentionTime: feature.retentionTime || 30,
        chargeState: feature.chargeState || 2,
        fragmentType: feature.fragmentType || 'b-ion'
      });
    });

    if (validFeatures.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid features found', details: errors },
        { status: 400 }
      );
    }

    // Run prediction using transformer model
    const startTime = Date.now();
    const predictions = await predictAbundance(validFeatures);
    const processingTime = Date.now() - startTime;

    // Calculate summary statistics
    const summary = {
      totalProteins: predictions.length,
      totalPeptides: validFeatures.length,
      averageAbundance: predictions.reduce((sum, p) => sum + p.abundanceScore, 0) / predictions.length,
      averageConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
      highConfidenceCount: predictions.filter(p => p.confidence > 0.85).length,
      processingTimeMs: processingTime
    };

    return NextResponse.json({
      success: true,
      predictions,
      summary,
      warnings: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process prediction request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to return demo predictions
export async function GET() {
  try {
    const { getDemoData } = await import('@/lib/sample-data');
    const { predictions, statistics } = getDemoData();

    return NextResponse.json({
      success: true,
      predictions: predictions.slice(0, 10),
      summary: {
        totalProteins: statistics.totalProteins,
        totalPeptides: statistics.totalPeptides,
        averageAbundance: statistics.averageAbundance,
        averageConfidence: statistics.averageConfidence,
        highConfidenceCount: statistics.highConfidencePredictions,
        processingTimeMs: statistics.processingTime
      },
      isDemo: true
    });
  } catch (error) {
    console.error('Demo data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load demo data' },
      { status: 500 }
    );
  }
}
