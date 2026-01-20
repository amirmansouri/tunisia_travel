import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Programs template sheet
    const templateData = [
      ['title', 'description', 'price', 'start_date', 'end_date', 'location', 'images', 'published'],
      [
        'Sahara Desert Adventure',
        'Experience the magic of the Tunisian Sahara. Explore golden dunes, ride camels, and sleep under the stars in traditional Bedouin tents.',
        1500,
        '2026-03-01',
        '2026-03-05',
        'Douz, Tozeur',
        'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200',
        'TRUE',
      ],
      [
        'Coastal Mediterranean Escape',
        'Discover Tunisia\'s beautiful Mediterranean coastline. Visit historic Carthage, relax on pristine beaches, and explore charming seaside towns.',
        1200,
        '2026-04-10',
        '2026-04-14',
        'Hammamet, Sousse',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
        'FALSE',
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // title
      { wch: 50 }, // description
      { wch: 10 }, // price
      { wch: 12 }, // start_date
      { wch: 12 }, // end_date
      { wch: 25 }, // location
      { wch: 60 }, // images
      { wch: 10 }, // published
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Programs');

    // Instructions sheet
    const instructionsData = [
      ['Column', 'Description', 'Required', 'Format'],
      ['title', 'Program title', 'Yes', 'Text'],
      ['description', 'Full program description', 'Yes', 'Text (can be multiple paragraphs)'],
      ['price', 'Price in TND', 'Yes', 'Number (e.g., 1500)'],
      ['start_date', 'Program start date', 'Yes', 'YYYY-MM-DD (e.g., 2026-03-01)'],
      ['end_date', 'Program end date', 'Yes', 'YYYY-MM-DD (e.g., 2026-03-05)'],
      ['location', 'Program location', 'Yes', 'Text (e.g., Douz, Tozeur)'],
      ['images', 'Image URLs separated by comma', 'No', 'URL1, URL2, URL3'],
      ['published', 'Whether to publish immediately', 'No', 'TRUE or FALSE (default: FALSE)'],
    ];
    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
    instructionsSheet['!cols'] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
      { wch: 40 },
    ];
    XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="programs_template.xlsx"',
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
