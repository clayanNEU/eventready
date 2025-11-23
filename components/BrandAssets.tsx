'use client';

import { useState, useEffect } from 'react';
import { BrandAssets as BrandAssetsType } from '@/types';

export default function BrandAssets() {
  const [brand, setBrand] = useState<BrandAssetsType>({
    colors: ['#FF6B35', '#004E89'],
    style: '',
    seed: 12345,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      const res = await fetch('/api/brand');
      const data = await res.json();
      setBrand(data);
    } catch (error) {
      console.error('Error fetching brand:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo: data.url }),
      });

      setBrand(prev => ({ ...prev, logo: data.url }));
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      const data = await res.json();
      setBrand(data);
      alert('Brand assets saved!');
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Failed to save brand assets');
    } finally {
      setLoading(false);
    }
  };

  const addColor = () => {
    setBrand(prev => ({ ...prev, colors: [...prev.colors, '#000000'] }));
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...brand.colors];
    newColors[index] = value;
    setBrand(prev => ({ ...prev, colors: newColors }));
  };

  const removeColor = (index: number) => {
    setBrand(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Brand Assets</h2>
        <p className="text-gray-600 mb-6">
          Set up your brand identity to maintain consistency across all flyers.
        </p>
      </div>

      {/* Logo Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Brand Logo</label>
        {brand.logo ? (
          <div className="space-y-2">
            <img src={brand.logo} alt="Brand logo" className="h-24 object-contain" />
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
              Change Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 rounded-lg">
            {uploading ? (
              <span className="text-gray-500">Uploading...</span>
            ) : (
              <>
                <span className="text-gray-500">Click to upload logo</span>
                <span className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Brand Colors */}
      <div>
        <label className="block text-sm font-medium mb-2">Brand Colors</label>
        <div className="space-y-2">
          {brand.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="#000000"
              />
              {brand.colors.length > 1 && (
                <button
                  onClick={() => removeColor(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addColor}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            + Add Color
          </button>
        </div>
      </div>

      {/* Brand Style */}
      <div>
        <label className="block text-sm font-medium mb-2">Brand Style & Vibe</label>
        <textarea
          value={brand.style}
          onChange={(e) => setBrand(prev => ({ ...prev, style: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          placeholder="e.g., bold, energetic, community-focused, minimalist"
        />
        <p className="text-sm text-gray-500 mt-1">
          Describe the visual style and personality of your brand
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Brand Assets'}
      </button>
    </div>
  );
}
