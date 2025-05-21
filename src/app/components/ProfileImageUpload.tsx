import { useState } from 'react';
import Image from 'next/image';

export default function ProfileImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess('Profile picture updated successfully');
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src="/profile.jpg"
            alt="Profile picture"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <label className="btn-primary cursor-pointer">
            <span>{isUploading ? 'Uploading...' : 'Upload New Picture'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Recommended size: 256x256 pixels
          </p>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </div>
  );
} 