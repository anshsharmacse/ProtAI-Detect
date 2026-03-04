import { NextRequest, NextResponse } from 'next/server';
import { parseCSV, validateRawData, rawToFeatures } from '@/lib/data-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    const isJSON = fileName.endsWith('.json');

    if (!isCSV && !isJSON) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a CSV or JSON file.' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const content = await file.text();
    let rawData: unknown[];

    if (isCSV) {
      rawData = parseCSV(content);
    } else {
      // Parse JSON
      try {
        const jsonData = JSON.parse(content);
        rawData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON format' },
          { status: 400 }
        );
      }
    }

    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Transform and validate data
    const transformedData = rawData.map((row: unknown) => {
      const r = row as Record<string, unknown>;
      return {
        protein_name: String(r.protein_name || r.proteinName || r.protein || ''),
        peptide_sequence: String(r.peptide_sequence || r.peptideSequence || r.sequence || ''),
        mz_ratio: Number(r.mz_ratio || r.mzRatio || r.mz || 0),
        intensity: Number(r.intensity || 0),
        retention_time: Number(r.retention_time || r.retentionTime || r.rt || 30),
        charge_state: Number(r.charge_state || r.chargeState || r.charge || 2),
        fragment_type: String(r.fragment_type || r.fragmentType || 'b-ion')
      };
    });

    const { valid, invalid } = validateRawData(transformedData);
    const features = rawToFeatures(valid);

    // Get unique proteins
    const uniqueProteins = new Set(features.map(f => f.proteinName));

    // Generate warnings
    const warnings: string[] = [];
    if (invalid.length > 0) {
      warnings.push(`${invalid.length} records were skipped due to validation errors`);
    }
    if (features.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid records found after validation',
          details: invalid.slice(0, 5).map(i => i.reason)
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${features.length} records from ${uniqueProteins.size} proteins`,
      data: {
        totalRecords: rawData.length,
        uniqueProteins: uniqueProteins.size,
        validRecords: valid.length,
        invalidRecords: invalid.length,
        preview: features.slice(0, 10),
        allFeatures: features,
        warnings: warnings.length > 0 ? warnings : undefined
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process uploaded file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to return CSV template
export async function GET() {
  const template = `protein_name,peptide_sequence,mz_ratio,intensity,retention_time,charge_state,fragment_type
Albumin,ALVLIAFAQYLQQC,445.234,1250000,45.67,2,b-ion
Hemoglobin,VNVDEVGGEALGR,671.845,890000,32.15,3,y-ion
Insulin,FVNQHLCGSHLVEA,512.678,2100000,28.90,2,b-ion
Myosin,KQELEEEVSQEVK,523.456,560000,55.23,3,y-ion
Actin,DDDIAALVVDNGSGMCK,678.234,1450000,41.05,2,b-ion`;

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="protein_data_template.csv"'
    }
  });
}
