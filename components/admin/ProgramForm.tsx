'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X, MapPin, Trash2, ImageIcon, FolderOpen } from 'lucide-react';
import { Program, ProgramCategory, ItineraryDay } from '@/types/database';
import SmartImage from '@/components/SmartImage';
import GoogleDriveModal from '@/components/admin/GoogleDriveModal';

const categories: { value: ProgramCategory; label: string }[] = [
  { value: 'adventure', label: 'Aventure' },
  { value: 'beach', label: 'Plage' },
  { value: 'cultural', label: 'Culturel' },
  { value: 'desert', label: 'Désert' },
  { value: 'city', label: 'Ville' },
  { value: 'nature', label: 'Nature' },
];

interface ProgramFormProps {
  program?: Program;
  mode: 'create' | 'edit';
}

export default function ProgramForm({ program, mode }: ProgramFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // Google Drive Modal state
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [dayDriveModalIndex, setDayDriveModalIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: program?.title || '',
    description: program?.description || '',
    price: program?.price ?? '',
    start_date: program?.start_date || '',
    end_date: program?.end_date || '',
    location: program?.location || '',
    images: program?.images || [],
    published: program?.published || false,
    category: program?.category || '' as ProgramCategory | '',
    itinerary: program?.itinerary || [] as ItineraryDay[],
  });

  const [showItinerary, setShowItinerary] = useState((program?.itinerary?.length || 0) > 0);
  const [dayImageUrls, setDayImageUrls] = useState<{ [key: number]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }));
    setError(null);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addImageUrl = () => {
    if (imageUrl && imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const addImagesFromDrive = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
  };

  // Itinerary functions
  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      location: '',
      title: '',
      description: '',
      activities: [],
      meals: { breakfast: false, lunch: false, dinner: false },
      accommodation: '',
      images: [],
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: ItineraryDay[keyof ItineraryDay]) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      ),
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  const addActivity = (dayIndex: number) => {
    const activity = prompt('Enter activity:');
    if (activity) {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((day, i) =>
          i === dayIndex
            ? { ...day, activities: [...(day.activities || []), activity] }
            : day
        ),
      }));
    }
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities?.filter((_, ai) => ai !== activityIndex) }
          : day
      ),
    }));
  };

  const addDayImage = (dayIndex: number) => {
    const url = dayImageUrls[dayIndex];
    if (url && url.trim()) {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((day, i) =>
          i === dayIndex
            ? { ...day, images: [...(day.images || []), url.trim()] }
            : day
        ),
      }));
      setDayImageUrls((prev) => ({ ...prev, [dayIndex]: '' }));
    }
  };

  const removeDayImage = (dayIndex: number, imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, images: day.images?.filter((_, ii) => ii !== imageIndex) }
          : day
      ),
    }));
  };

  const addDayImagesFromDrive = (dayIndex: number, urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, images: [...(day.images || []), ...urls] }
          : day
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url =
        mode === 'create'
          ? '/api/programs'
          : `/api/programs/${program?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} program`);
      }

      router.push('/admin/programs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="label">
              Program Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., Sahara Desert Adventure"
            />
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={10}
              className="input resize-none"
              placeholder="Describe the program in detail. You can use multiple paragraphs separated by blank lines."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="location" className="label">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Douz, Tozeur, Tataouine"
              />
            </div>

            <div>
              <label htmlFor="price" className="label">
                Price (TND)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input"
                placeholder="e.g., 1850"
              />
            </div>

            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="label">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="label">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Program Images
        </h2>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group aspect-video">
              <SmartImage
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Add Image URL */}
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste Google Drive link or image URL"
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addImageUrl}
            disabled={!imageUrl.trim()}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add
          </button>
        </div>

        {/* Google Drive Button */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setDriveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="h-5 w-5" />
            Google Drive Links
          </button>
          <span className="text-sm text-gray-500">
            Add multiple Google Drive links at once
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          The first image will be used as the cover.
        </p>
      </div>

      {/* Itinerary Builder */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Program Itinerary
            </h2>
            <p className="text-sm text-gray-500">
              Add day-by-day details for multi-destination programs
            </p>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showItinerary}
              onChange={(e) => setShowItinerary(e.target.checked)}
              className="w-5 h-5 text-tunisia-red rounded border-gray-300 focus:ring-tunisia-red"
            />
            <span className="text-sm font-medium text-gray-700">Enable Itinerary</span>
          </label>
        </div>

        {showItinerary && (
          <div className="space-y-4">
            {formData.itinerary.map((day, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-tunisia-red text-white rounded-full font-bold text-lg flex-shrink-0">
                    {day.day}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label text-sm">Location *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={day.location}
                            onChange={(e) => updateItineraryDay(index, 'location', e.target.value)}
                            placeholder="e.g., Hammamet"
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label text-sm">Day Title *</label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                          placeholder="e.g., Beach & Medina Tour"
                          className="input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label text-sm">Description</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                        placeholder="Describe what happens on this day..."
                        rows={2}
                        className="input resize-none"
                      />
                    </div>

                    <div>
                      <label className="label text-sm">Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation || ''}
                        onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                        placeholder="e.g., Hotel Hammamet Beach 4*"
                        className="input"
                      />
                    </div>

                    {/* Meals */}
                    <div>
                      <label className="label text-sm mb-2">Meals Included</label>
                      <div className="flex gap-4">
                        {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                          <label key={meal} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={day.meals?.[meal] || false}
                              onChange={(e) =>
                                updateItineraryDay(index, 'meals', {
                                  ...day.meals,
                                  [meal]: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-tunisia-red rounded border-gray-300 focus:ring-tunisia-red"
                            />
                            <span className="text-sm capitalize">{meal}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <label className="label text-sm mb-2">Activities</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {day.activities?.map((activity, ai) => (
                          <span
                            key={ai}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-tunisia-blue/10 text-tunisia-blue rounded-full text-sm"
                          >
                            {activity}
                            <button
                              type="button"
                              onClick={() => removeActivity(index, ai)}
                              className="hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addActivity(index)}
                        className="text-sm text-tunisia-blue hover:underline"
                      >
                        + Add Activity
                      </button>
                    </div>

                    {/* Day Images */}
                    <div>
                      <label className="label text-sm mb-2">
                        <ImageIcon className="h-4 w-4 inline mr-1" />
                        Day Images
                        <span className="ml-2 text-xs text-gray-500">
                          ({day.images?.length || 0} image{(day.images?.length || 0) !== 1 ? 's' : ''})
                        </span>
                      </label>
                      {/* Image thumbnails */}
                      {day.images && day.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {day.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group w-20 h-14">
                              <SmartImage
                                src={img}
                                alt={`Day ${day.day} image ${imgIndex + 1}`}
                                fill
                                className="object-cover rounded"
                                sizes="80px"
                              />
                              <button
                                type="button"
                                onClick={() => removeDayImage(index, imgIndex)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Add image URL input */}
                      <div className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={dayImageUrls[index] || ''}
                          onChange={(e) =>
                            setDayImageUrls((prev) => ({ ...prev, [index]: e.target.value }))
                          }
                          placeholder="Paste Google Drive link or image URL"
                          className="input flex-1 text-sm py-1"
                        />
                        <button
                          type="button"
                          onClick={() => addDayImage(index)}
                          disabled={!dayImageUrls[index]?.trim()}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        {/* Google Drive Button for Day */}
                        <button
                          type="button"
                          onClick={() => setDayDriveModalIndex(index)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                          <FolderOpen className="h-4 w-4" />
                          Drive
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove day"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItineraryDay}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-tunisia-red hover:text-tunisia-red transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Day {formData.itinerary.length + 1}
            </button>
          </div>
        )}
      </div>

      {/* Publishing Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Publishing
        </h2>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 text-tunisia-red rounded border-gray-300 focus:ring-tunisia-red"
          />
          <span className="font-medium text-gray-700">
            Publish this program
          </span>
        </label>
        <p className="text-sm text-gray-500 mt-2 ml-8">
          Published programs will be visible to all visitors on the website.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : mode === 'create' ? (
            'Create Program'
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Google Drive Modal for Program Images */}
      <GoogleDriveModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        onAddImages={addImagesFromDrive}
      />

      {/* Google Drive Modal for Day Images */}
      <GoogleDriveModal
        isOpen={dayDriveModalIndex !== null}
        onClose={() => setDayDriveModalIndex(null)}
        onAddImages={(urls) => {
          if (dayDriveModalIndex !== null) {
            addDayImagesFromDrive(dayDriveModalIndex, urls);
          }
          setDayDriveModalIndex(null);
        }}
      />
    </form>
  );
}
