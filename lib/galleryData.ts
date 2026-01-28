export type GalleryCategory = 'hammamet' | 'tamaghza';

export interface GalleryImage {
  id: string;
  fileId: string;
  category: GalleryCategory;
  alt: string;
}

// Helper function to generate Google Drive direct view URL
export function getGoogleDriveUrl(fileId: string): string {
  return `/api/image-proxy?id=${fileId}`;
}

// Gallery images data
// To add more images, just add the Google Drive file ID
export const galleryImages: GalleryImage[] = [
  // ============ HAMMAMET IMAGES (33 total) ============
  { id: 'h1', fileId: '1EYoocMaUzKCouLXmfoHX-0kuzZUr6_Rd', category: 'hammamet', alt: 'Hammamet 1' },
  { id: 'h2', fileId: 'HAMMAMET_FILE_ID_2', category: 'hammamet', alt: 'Hammamet 2' },
  { id: 'h3', fileId: 'HAMMAMET_FILE_ID_3', category: 'hammamet', alt: 'Hammamet 3' },
  { id: 'h4', fileId: 'HAMMAMET_FILE_ID_4', category: 'hammamet', alt: 'Hammamet 4' },
  { id: 'h5', fileId: 'HAMMAMET_FILE_ID_5', category: 'hammamet', alt: 'Hammamet 5' },
  { id: 'h6', fileId: 'HAMMAMET_FILE_ID_6', category: 'hammamet', alt: 'Hammamet 6' },
  { id: 'h7', fileId: 'HAMMAMET_FILE_ID_7', category: 'hammamet', alt: 'Hammamet 7' },
  { id: 'h8', fileId: 'HAMMAMET_FILE_ID_8', category: 'hammamet', alt: 'Hammamet 8' },
  { id: 'h9', fileId: 'HAMMAMET_FILE_ID_9', category: 'hammamet', alt: 'Hammamet 9' },
  { id: 'h10', fileId: 'HAMMAMET_FILE_ID_10', category: 'hammamet', alt: 'Hammamet 10' },
  { id: 'h11', fileId: 'HAMMAMET_FILE_ID_11', category: 'hammamet', alt: 'Hammamet 11' },
  { id: 'h12', fileId: 'HAMMAMET_FILE_ID_12', category: 'hammamet', alt: 'Hammamet 12' },
  { id: 'h13', fileId: 'HAMMAMET_FILE_ID_13', category: 'hammamet', alt: 'Hammamet 13' },
  { id: 'h14', fileId: 'HAMMAMET_FILE_ID_14', category: 'hammamet', alt: 'Hammamet 14' },
  { id: 'h15', fileId: 'HAMMAMET_FILE_ID_15', category: 'hammamet', alt: 'Hammamet 15' },
  { id: 'h16', fileId: 'HAMMAMET_FILE_ID_16', category: 'hammamet', alt: 'Hammamet 16' },
  { id: 'h17', fileId: 'HAMMAMET_FILE_ID_17', category: 'hammamet', alt: 'Hammamet 17' },
  { id: 'h18', fileId: 'HAMMAMET_FILE_ID_18', category: 'hammamet', alt: 'Hammamet 18' },
  { id: 'h19', fileId: 'HAMMAMET_FILE_ID_19', category: 'hammamet', alt: 'Hammamet 19' },
  { id: 'h20', fileId: 'HAMMAMET_FILE_ID_20', category: 'hammamet', alt: 'Hammamet 20' },
  { id: 'h21', fileId: 'HAMMAMET_FILE_ID_21', category: 'hammamet', alt: 'Hammamet 21' },
  { id: 'h22', fileId: 'HAMMAMET_FILE_ID_22', category: 'hammamet', alt: 'Hammamet 22' },
  { id: 'h23', fileId: 'HAMMAMET_FILE_ID_23', category: 'hammamet', alt: 'Hammamet 23' },
  { id: 'h24', fileId: 'HAMMAMET_FILE_ID_24', category: 'hammamet', alt: 'Hammamet 24' },
  { id: 'h25', fileId: 'HAMMAMET_FILE_ID_25', category: 'hammamet', alt: 'Hammamet 25' },
  { id: 'h26', fileId: 'HAMMAMET_FILE_ID_26', category: 'hammamet', alt: 'Hammamet 26' },
  { id: 'h27', fileId: 'HAMMAMET_FILE_ID_27', category: 'hammamet', alt: 'Hammamet 27' },
  { id: 'h28', fileId: 'HAMMAMET_FILE_ID_28', category: 'hammamet', alt: 'Hammamet 28' },
  { id: 'h29', fileId: 'HAMMAMET_FILE_ID_29', category: 'hammamet', alt: 'Hammamet 29' },
  { id: 'h30', fileId: 'HAMMAMET_FILE_ID_30', category: 'hammamet', alt: 'Hammamet 30' },
  { id: 'h31', fileId: 'HAMMAMET_FILE_ID_31', category: 'hammamet', alt: 'Hammamet 31' },
  { id: 'h32', fileId: 'HAMMAMET_FILE_ID_32', category: 'hammamet', alt: 'Hammamet 32' },
  { id: 'h33', fileId: 'HAMMAMET_FILE_ID_33', category: 'hammamet', alt: 'Hammamet 33' },

  // ============ TAMAGHZA IMAGES (17 total) ============
  { id: 't1', fileId: '1ceigFxxjplhNFlyzMufUpjSzabOdYHnx', category: 'tamaghza', alt: 'Tamaghza 1' },
  { id: 't2', fileId: 'TAMAGHZA_FILE_ID_2', category: 'tamaghza', alt: 'Tamaghza 2' },
  { id: 't3', fileId: 'TAMAGHZA_FILE_ID_3', category: 'tamaghza', alt: 'Tamaghza 3' },
  { id: 't4', fileId: 'TAMAGHZA_FILE_ID_4', category: 'tamaghza', alt: 'Tamaghza 4' },
  { id: 't5', fileId: 'TAMAGHZA_FILE_ID_5', category: 'tamaghza', alt: 'Tamaghza 5' },
  { id: 't6', fileId: 'TAMAGHZA_FILE_ID_6', category: 'tamaghza', alt: 'Tamaghza 6' },
  { id: 't7', fileId: 'TAMAGHZA_FILE_ID_7', category: 'tamaghza', alt: 'Tamaghza 7' },
  { id: 't8', fileId: 'TAMAGHZA_FILE_ID_8', category: 'tamaghza', alt: 'Tamaghza 8' },
  { id: 't9', fileId: 'TAMAGHZA_FILE_ID_9', category: 'tamaghza', alt: 'Tamaghza 9' },
  { id: 't10', fileId: 'TAMAGHZA_FILE_ID_10', category: 'tamaghza', alt: 'Tamaghza 10' },
  { id: 't11', fileId: 'TAMAGHZA_FILE_ID_11', category: 'tamaghza', alt: 'Tamaghza 11' },
  { id: 't12', fileId: 'TAMAGHZA_FILE_ID_12', category: 'tamaghza', alt: 'Tamaghza 12' },
  { id: 't13', fileId: 'TAMAGHZA_FILE_ID_13', category: 'tamaghza', alt: 'Tamaghza 13' },
  { id: 't14', fileId: 'TAMAGHZA_FILE_ID_14', category: 'tamaghza', alt: 'Tamaghza 14' },
  { id: 't15', fileId: 'TAMAGHZA_FILE_ID_15', category: 'tamaghza', alt: 'Tamaghza 15' },
  { id: 't16', fileId: 'TAMAGHZA_FILE_ID_16', category: 'tamaghza', alt: 'Tamaghza 16' },
  { id: 't17', fileId: 'TAMAGHZA_FILE_ID_17', category: 'tamaghza', alt: 'Tamaghza 17' },
];

// Category labels for display
export const categoryLabels: Record<GalleryCategory | 'all', string> = {
  all: 'Tous',
  hammamet: 'Hammamet',
  tamaghza: 'Tamaghza',
};
