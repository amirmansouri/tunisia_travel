'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import {
  galleryImages,
  getGoogleDriveUrl,
  categoryLabels,
  GalleryCategory,
} from '@/lib/galleryData';

type FilterCategory = GalleryCategory | 'all';

const tabs: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: categoryLabels.all },
  { value: 'hammamet', label: categoryLabels.hammamet },
  { value: 'tamaghza', label: categoryLabels.tamaghza },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const imageModalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});

  // Filter images based on active category
  const filteredImages = galleryImages.filter((image) => {
    // Skip placeholder images (those containing _FILE_ID_)
    if (image.fileId.includes('_FILE_ID_')) return false;
    if (activeFilter === 'all') return true;
    return image.category === activeFilter;
  });

  // Lightbox handlers
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  }, [filteredImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  }, [filteredImages.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    },
    [closeLightbox, goToPrevious, goToNext]
  );

  const handleImageLoad = (id: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [id]: true }));
  };

  const currentImage = filteredImages[currentImageIndex];

  return (
    <section className="py-16 bg-tunisia-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Galerie
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez les plus beaux paysages de la Tunisie à travers notre collection de photos
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-md">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === tab.value
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {activeFilter === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-tunisia-red rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Image count */}
        <div className="text-center mb-6">
          <span className="text-sm text-gray-500">
            {filteredImages.length} photo{filteredImages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 cursor-pointer shadow-md"
                onClick={() => openLightbox(index)}
              >
                {/* Loading skeleton */}
                {!imageLoadingStates[image.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}

                <Image
                  src={getGoogleDriveUrl(image.fileId)}
                  alt={image.alt}
                  fill
                  unoptimized
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    imageLoadingStates[image.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => handleImageLoad(image.id)}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="h-6 w-6 text-tunisia-red" />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700 capitalize">
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">
              Aucune photo disponible dans cette catégorie
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 text-white/80 text-sm">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>

            {/* Category label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm capitalize">
                {currentImage.category}
              </span>
            </div>

            {/* Previous button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Next button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Main image */}
            <motion.div
              key={currentImage.id}
              variants={imageModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getGoogleDriveUrl(currentImage.fileId)}
                alt={currentImage.alt}
                fill
                unoptimized
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Thumbnail strip */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getGoogleDriveUrl(image.fileId)}
                      alt={image.alt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
