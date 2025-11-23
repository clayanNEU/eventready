'use client';

import { useState, useEffect } from 'react';
import { Flyer } from '@/types';

export default function FlyerLibrary() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newFlyer, setNewFlyer] = useState({
    eventName: '',
    date: '',
    notes: '',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'flyer');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      // Create flyer entry
      await fetch('/api/flyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: data.url,
          eventName: newFlyer.eventName,
          date: newFlyer.date,
          notes: newFlyer.notes,
          isFavorite: false,
        }),
      });

      await fetchFlyers();
      setShowUploadForm(false);
      setNewFlyer({ eventName: '', date: '', notes: '' });
    } catch (error) {
      console.error('Error uploading flyer:', error);
    } finally {
      setUploading(false);
    }
  };

  const toggleFavorite = async (flyer: Flyer) => {
    try {
      await fetch(`/api/flyers/${flyer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !flyer.isFavorite }),
      });
      await fetchFlyers();
    } catch (error) {
      console.error('Error updating flyer:', error);
    }
  };

  const deleteFlyer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flyer?')) return;

    try {
      await fetch(`/api/flyers/${id}`, { method: 'DELETE' });
      await fetchFlyers();
    } catch (error) {
      console.error('Error deleting flyer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Flyer Library</h2>
          <p className="text-gray-600">
            Store your past flyers and mark favorites to use as references.
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Upload Flyer
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Upload Previous Flyer</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Name</label>
              <input
                type="text"
                value={newFlyer.eventName}
                onChange={(e) => setNewFlyer(prev => ({ ...prev, eventName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Tuesday Night Run"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newFlyer.date}
                onChange={(e) => setNewFlyer(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
              <textarea
                value={newFlyer.notes}
                onChange={(e) => setNewFlyer(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Why did this flyer work well?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading || !newFlyer.eventName || !newFlyer.date}
                className="w-full"
              />
              {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            </div>
          </div>
        </div>
      )}

      {/* Flyer Grid */}
      {flyers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No flyers yet. Upload your first flyer to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flyers.map((flyer) => (
            <div key={flyer.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={flyer.imageUrl} alt={flyer.eventName} className="w-full h-64 object-cover" />
                <button
                  onClick={() => toggleFavorite(flyer)}
                  className="absolute top-2 right-2 text-2xl"
                  title={flyer.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {flyer.isFavorite ? '⭐' : '☆'}
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{flyer.eventName}</h3>
                <p className="text-sm text-gray-600">{new Date(flyer.date).toLocaleDateString()}</p>
                {flyer.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">{flyer.notes}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <a
                    href={flyer.imageUrl}
                    download
                    className="flex-1 px-3 py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => deleteFlyer(flyer.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
