import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createAdminClient } from '@/lib/supabase';

interface ProgramRow {
  title: string;
  description: string;
  price: number | string;
  start_date: string | number;
  end_date: string | number;
  location: string;
  images?: string;
  published?: string | boolean;
}

function excelDateToString(excelDate: number | string): string {
  if (typeof excelDate === 'string') {
    return excelDate;
  }
  // Excel dates are number of days since 1900-01-01
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
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

    // Get first sheet (Programs)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<ProgramRow>(sheet);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Validate and prepare programs
    const programs: Array<{
      title: string;
      description: string;
      price: number;
      start_date: string;
      end_date: string;
      location: string;
      images: string[];
      published: boolean;
    }> = [];

    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header row and 0-index

      if (!row.title) {
        errors.push(`Row ${rowNum}: Missing title`);
        return;
      }
      if (!row.description) {
        errors.push(`Row ${rowNum}: Missing description`);
        return;
      }
      if (!row.price && row.price !== 0) {
        errors.push(`Row ${rowNum}: Missing price`);
        return;
      }
      if (!row.start_date) {
        errors.push(`Row ${rowNum}: Missing start_date`);
        return;
      }
      if (!row.end_date) {
        errors.push(`Row ${rowNum}: Missing end_date`);
        return;
      }
      if (!row.location) {
        errors.push(`Row ${rowNum}: Missing location`);
        return;
      }

      // Parse price
      const price = typeof row.price === 'string' ? parseFloat(row.price) : row.price;
      if (isNaN(price) || price < 0) {
        errors.push(`Row ${rowNum}: Invalid price`);
        return;
      }

      // Parse dates
      const startDate = excelDateToString(row.start_date);
      const endDate = excelDateToString(row.end_date);

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        errors.push(`Row ${rowNum}: Invalid start_date format (use YYYY-MM-DD)`);
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        errors.push(`Row ${rowNum}: Invalid end_date format (use YYYY-MM-DD)`);
        return;
      }

      // Validate date range
      if (new Date(endDate) < new Date(startDate)) {
        errors.push(`Row ${rowNum}: end_date must be after start_date`);
        return;
      }

      // Parse images (comma-separated URLs)
      const images = row.images
        ? String(row.images)
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        : [];

      // Parse published
      const published =
        row.published === true ||
        row.published === 'TRUE' ||
        row.published === 'true' ||
        row.published === '1';

      programs.push({
        title: String(row.title).trim(),
        description: String(row.description).trim(),
        price,
        start_date: startDate,
        end_date: endDate,
        location: String(row.location).trim(),
        images,
        published,
      });
    });

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation errors found',
          details: errors,
          validCount: programs.length,
          errorCount: errors.length,
        },
        { status: 400 }
      );
    }

    // Insert into database
    const supabase = createAdminClient();

    const { data: inserted, error: insertError } = await supabase
      .from('programs')
      .insert(programs as never[])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to import programs: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported: inserted?.length || programs.length,
      message: `Successfully imported ${inserted?.length || programs.length} programs`,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import file' },
      { status: 500 }
    );
  }
}
