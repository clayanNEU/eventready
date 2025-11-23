'use client';

import { useState, useEffect } from 'react';
import { Flyer } from '@/types';

export default function FlyerGenerator() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    time: '',
    location: '',
    theme: '',
    referenceFlyerId: '',
  });

  useEffect(() => {
    fetchFlyers();
  }, []);

  const fetchFlyers = async () => {
    try {
      const res = await fetch('/api/flyers');
      const data = await res.json();
      setFlyers(data);
    } catch (error) {
      console.error('Error fetching flyers:', error);
    }
  };

  const handleGenerate = async () => {
    if (!formData.eventName || !formData.date || !formData.time || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to generate flyer');
      }

      const result = await res.json();

      // Extract image URL from fal.ai response
      if (result.data?.images?.[0]?.url) {
        setGeneratedImage(result.data.images[0].url);
      } else if (result.images?.[0]?.url) {
        setGeneratedImage(result.images[0].url);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error: any) {
      console.error('Error generating flyer:', error);
      alert(error.message || 'Failed to generate flyer. Please check your FAL_API_KEY in .env.local');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!generatedImage) return;

    try {
      await fetch('/api/flyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: generatedImage,
          eventName: formData.eventName,
          date: formData.date,
          notes: `Generated for ${formData.eventName}`,
          isFavorite: false,
        }),
      });

      alert('Flyer saved to library!');
      setGeneratedImage(null);
      setFormData({
        eventName: '',
        date: '',
        time: '',
        location: '',
        theme: '',
        referenceFlyerId: '',
      });
      await fetchFlyers();
    } catch (error) {
      console.error('Error saving flyer:', error);
      alert('Failed to save flyer');
    }
  };

  const favoriteFlyers = flyers.filter(f => f.isFavorite);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Generate New Flyer</h2>
        <p className="text-gray-600">
          Create a brand-consistent flyer using your favorite designs as reference.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Tuesday Night Run"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Central Park"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Theme/Vibe</label>
            <textarea
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
              placeholder="Energetic, fun, community vibes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reference Flyer (Optional)</label>
            <select
              value={formData.referenceFlyerId}
              onChange={(e) => setFormData(prev => ({ ...prev, referenceFlyerId: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">None - Generate from scratch</option>
              <optgroup label="Favorite Flyers">
                {favoriteFlyers.map(flyer => (
                  <option key={flyer.id} value={flyer.id}>
                    {flyer.eventName} ({new Date(flyer.date).toLocaleDateString()})
                  </option>
                ))}
              </optgroup>
              {flyers.filter(f => !f.isFavorite).length > 0 && (
                <optgroup label="Other Flyers">
                  {flyers.filter(f => !f.isFavorite).map(flyer => (
                    <option key={flyer.id} value={flyer.id}>
                      {flyer.eventName} ({new Date(flyer.date).toLocaleDateString()})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {favoriteFlyers.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                💡 Tip: Mark flyers as favorites in the library to use them as references!
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {generating ? 'Generating with FLUX...' : '✨ Generate Flyer'}
          </button>
        </div>

        {/* Preview */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[400px]">
          {generating ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your flyer...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
            </div>
          ) : generatedImage ? (
            <div className="w-full space-y-4">
              <img src={generatedImage} alt="Generated flyer" className="w-full rounded-lg shadow-lg" />
              <div className="flex gap-2">
                <a
                  href={generatedImage}
                  download={`${formData.eventName}-flyer.png`}
                  className="flex-1 px-4 py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Download
                </a>
                <button
                  onClick={handleSaveToLibrary}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save to Library
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Your generated flyer will appear here</p>
              <p className="text-sm">Fill in the event details and click Generate!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
