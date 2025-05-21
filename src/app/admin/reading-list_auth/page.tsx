'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import BookImageUpload from '@/app/components/BookImageUpload';
import { getApiUrl } from '@/lib/apiUrl';

interface ReadingListItem {
  _id: string;
  title: string;
  author: string;
  link?: string;
  imageUrl?: string;
  notes?: string;
  status: 'Reading' | 'Completed' | 'Want to Read';
  dateAdded: string;
  dateCompleted?: string;
  isTopRead: boolean;
}

export default function AdminReadingList() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });
  const router = useRouter();
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newItem, setNewItem] = useState({
    title: '',
    author: '',
    link: '',
    imageUrl: '',
    notes: '',
    status: 'Want to Read' as const,
    isTopRead: false,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<ReadingListItem>>({});

  // Fetch reading list items
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl('/api/reading-list'));
      if (!res.ok) {
        throw new Error('Failed to fetch reading list');
      }
      const data = await res.json();
      setItems(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch reading list');
      console.error('Failed to fetch reading list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchItems();
    }
  }, [status]);

  // Add new item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(getApiUrl('/api/reading-list'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create item');
      }

      setNewItem({
        title: '',
        author: '',
        link: '',
        imageUrl: '',
        notes: '',
        status: 'Want to Read',
        isTopRead: false,
      });
      
      setSuccess('Item added successfully');
      fetchItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create item');
      console.error('Failed to create item:', error);
    }
  };

  // Update item
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setError('');
      const item = items.find(item => item._id === id);
      if (!item) return;

      const res = await fetch(getApiUrl(`/api/reading-list/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          isTopRead: item.isTopRead,
          ...(newStatus === 'Completed' ? { dateCompleted: new Date() } : {})
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update item');
      }
      
      setSuccess('Status updated successfully');
      fetchItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update item');
      console.error('Failed to update item:', error);
    }
  };

  // Toggle top read status
  const handleTopReadToggle = async (id: string, currentStatus: boolean) => {
    try {
      setError('');
      const item = items.find(item => item._id === id);
      if (!item) return;

      const res = await fetch(getApiUrl(`/api/reading-list/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...item,
          isTopRead: !currentStatus
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update item');
      }
      
      setSuccess('Top read status updated successfully');
      fetchItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update item');
      console.error('Failed to update item:', error);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setError('');
      const res = await fetch(getApiUrl(`/api/reading-list/${id}`), {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete item');
      }
      
      setSuccess('Item deleted successfully');
      fetchItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete item');
      console.error('Failed to delete item:', error);
    }
  };

  // Save edited item
  const handleEditSave = async () => {
    if (!editId) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(getApiUrl(`/api/reading-list/${editId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update item');
      }
      setEditId(null);
      setEditItem({});
      setSuccess('Book updated successfully');
      fetchItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update item');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditItem({});
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Reading List</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Add new item form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              required
              value={newItem.author}
              onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Cover Image
            </label>
            <BookImageUpload onUpload={(filename) => setNewItem({ ...newItem, imageUrl: `/book-images/${filename}` })} />
            {newItem.imageUrl && (
              <div className="mt-2">
                <img src={newItem.imageUrl} alt="Book Cover Preview" className="h-24 rounded shadow" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Want to Read">Want to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isTopRead"
              checked={newItem.isTopRead}
              onChange={(e) => setNewItem({ ...newItem, isTopRead: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isTopRead" className="ml-2 block text-sm text-gray-900">
              Mark as Top Read
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full btn-primary"
        >
          Add Book
        </button>
      </form>

      {/* List of items */}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No items in reading list yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex gap-6">
                {item.imageUrl && item.imageUrl.startsWith('/book-images/') && (
                  <div className="flex-shrink-0 w-32 h-48 relative">
                    <Image
                      src={editId === item._id && editItem.imageUrl ? editItem.imageUrl : item.imageUrl}
                      alt={`Cover of ${item.title}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow flex justify-between">
                  <div>
                    {editId === item._id ? (
                      <>
                        <input
                          type="text"
                          value={editItem.title ?? item.title}
                          onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm mb-2"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={editItem.author ?? item.author}
                          onChange={e => setEditItem({ ...editItem, author: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm mb-2"
                          placeholder="Author"
                        />
                        <BookImageUpload onUpload={filename => setEditItem({ ...editItem, imageUrl: `/book-images/${filename}` })} />
                        <input
                          type="url"
                          value={editItem.link ?? item.link ?? ''}
                          onChange={e => setEditItem({ ...editItem, link: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm mb-2"
                          placeholder="Link"
                        />
                        <textarea
                          value={editItem.notes ?? item.notes ?? ''}
                          onChange={e => setEditItem({ ...editItem, notes: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm mb-2"
                          placeholder="Notes"
                          rows={2}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-gray-600">by {item.author}</p>
                        {item.notes && (
                          <p className="text-gray-600 mt-2">{item.notes}</p>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                          >
                            View Book →
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-start space-x-4">
                    {editId === item._id ? (
                      <>
                        <select
                          value={editItem.status ?? item.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditItem({ ...editItem, status: e.target.value as 'Reading' | 'Completed' | 'Want to Read' })}
                          className="rounded-md border-gray-300 shadow-sm"
                        >
                          <option value="Want to Read">Want to Read</option>
                          <option value="Reading">Reading</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`top-read-edit-${item._id}`}
                            checked={editItem.isTopRead ?? item.isTopRead}
                            onChange={e => setEditItem({ ...editItem, isTopRead: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`top-read-edit-${item._id}`} className="ml-2 text-sm text-gray-900">
                            Top Read
                          </label>
                        </div>
                        <button onClick={handleEditSave} className="text-green-600 hover:text-green-800 font-semibold">Save</button>
                        <button onClick={handleEditCancel} className="text-gray-600 hover:text-gray-800 ml-2">Cancel</button>
                      </>
                    ) : (
                      <>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm"
                        >
                          <option value="Want to Read">Want to Read</option>
                          <option value="Reading">Reading</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`top-read-${item._id}`}
                            checked={item.isTopRead}
                            onChange={() => handleTopReadToggle(item._id, item.isTopRead)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`top-read-${item._id}`} className="ml-2 text-sm text-gray-900">
                            Top Read
                          </label>
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => { setEditId(item._id); setEditItem(item); }}
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 