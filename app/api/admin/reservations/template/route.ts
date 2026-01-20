import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  try {
    // Get programs for the dropdown reference
    const supabase = createAdminClient();
    const { data: programs } = await supabase
      .from('programs')
      .select('id, title')
      .eq('published', true)
      .returns<Array<{ id: string; title: string }>>();

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Reservations template sheet
    const templateData = [
      ['full_name', 'email', 'phone', 'program_id', 'message'],
      ['John Doe', 'john@example.com', '+216 12 345 678', 'PASTE_PROGRAM_ID_HERE', 'Optional message'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // full_name
      { wch: 25 }, // email
      { wch: 18 }, // phone
      { wch: 40 }, // program_id
      { wch: 30 }, // message
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Reservations');

    // Programs reference sheet
    if (programs && programs.length > 0) {
      const programsData = [
        ['Program ID', 'Program Title'],
        ...programs.map((p) => [p.id, p.title]),
      ];
      const programsSheet = XLSX.utils.aoa_to_sheet(programsData);
      programsSheet['!cols'] = [
        { wch: 40 }, // id
        { wch: 40 }, // title
      ];
      XLSX.utils.book_append_sheet(wb, programsSheet, 'Programs Reference');
    }

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reservations_template.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
