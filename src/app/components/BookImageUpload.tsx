import { useState } from 'react';

interface BookImageUploadProps {
  onUpload: (filename: string) => void;
}

export default function BookImageUpload({ onUpload }: BookImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/reading-list/image-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onUpload(data.filename);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="btn-primary cursor-pointer">
        <span>{isUploading ? 'Uploading...' : 'Upload Book Image'}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
} 