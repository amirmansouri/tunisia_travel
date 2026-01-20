import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createAdminClient } from '@/lib/supabase';

interface ReservationRow {
  full_name: string;
  email: string;
  phone: string;
  program_id: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<ReservationRow>(sheet);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Validate and prepare reservations
    const reservations: Array<{
      full_name: string;
      email: string;
      phone: string;
      program_id: string;
      message: string | null;
    }> = [];

    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header row and 0-index

      if (!row.full_name) {
        errors.push(`Row ${rowNum}: Missing full_name`);
        return;
      }
      if (!row.email) {
        errors.push(`Row ${rowNum}: Missing email`);
        return;
      }
      if (!row.phone) {
        errors.push(`Row ${rowNum}: Missing phone`);
        return;
      }
      if (!row.program_id || row.program_id === 'PASTE_PROGRAM_ID_HERE') {
        errors.push(`Row ${rowNum}: Missing or invalid program_id`);
        return;
      }

      // Basic email validation
      if (!row.email.includes('@')) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        return;
      }

      reservations.push({
        full_name: String(row.full_name).trim(),
        email: String(row.email).trim(),
        phone: String(row.phone).trim(),
        program_id: String(row.program_id).trim(),
        message: row.message ? String(row.message).trim() : null,
      });
    });

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation errors found',
          details: errors,
          validCount: reservations.length,
          errorCount: errors.length,
        },
        { status: 400 }
      );
    }

    // Insert into database
    const supabase = createAdminClient();

    const { data: inserted, error: insertError } = await supabase
      .from('reservations')
      .insert(reservations as never[])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to import reservations: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported: inserted?.length || reservations.length,
      message: `Successfully imported ${inserted?.length || reservations.length} reservations`,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import file' },
      { status: 500 }
    );
  }
}
