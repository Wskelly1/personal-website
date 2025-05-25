"use client";
import Image from 'next/image';
import { useState } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
  notes?: string;
  link?: string;
  isTopRead?: boolean;
  status?: string;
}

interface MyLibraryPhoneProps {
  items: Book[];
  onBookClick?: (id: string) => void;
}

export default function MyLibraryPhone({ items, onBookClick }: MyLibraryPhoneProps) {
  const [modalBook, setModalBook] = useState<Book | null>(null);
  return (
    <div className="w-full max-w-md mx-auto py-4 px-2">
      <h2 className="font-semibold text-[clamp(1.2rem,5vw,2rem)] mb-4 text-center truncate whitespace-nowrap w-full min-w-0">My Library</h2>
      <div className="flex flex-col gap-4">
        {items.map((book) => (
          <div
            key={book._id}
            className="flex items-center gap-4 bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-lg shadow-sm border border-[#e9f1ff] dark:border-[#5f6c89] p-2 cursor-pointer hover:bg-primary-100 transition-colors relative"
            onClick={() => onBookClick?.(book._id)}
            id={`book-${book._id}`}
          >
            {/* Pills in top right */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              {book.isTopRead && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">Top Read</span>
              )}
              {book.status === 'Completed' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">Completed</span>
              )}
              {book.status === 'Want to Read' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Upcoming</span>
              )}
              {book.status === 'Reading' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">Current</span>
              )}
            </div>
            <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
              {book.imageUrl && book.imageUrl.startsWith('/book-images/') ? (
                <Image
                  src={book.imageUrl}
                  alt={`Cover of ${book.title}`}
                  width={64}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0 pt-6">
              <span className="font-semibold text-base truncate" title={book.title}>{book.title}</span>
              <span className="text-sm text-gray-600 truncate" title={book.author}>{book.author}</span>
              <div className="flex flex-row items-center justify-between mt-2">
                {book.notes && book.notes.trim() !== '' ? (
                  <button
                    className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-semibold self-start hover:bg-primary-700 transition-colors"
                    onClick={e => { e.stopPropagation(); setModalBook(book); }}
                  >
                    My Thoughts
                  </button>
                ) : (
                  <span />
                )}
                {book.link && (
                  <a
                    href={book.link}
                    className="ml-4 text-primary-600 hover:text-primary-700 text-xs font-semibold whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    View Online
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for My Thoughts */}
      {modalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-[#23263a] rounded-lg shadow-lg max-w-sm w-[90vw] p-6 relative flex flex-col">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setModalBook(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="font-bold text-lg mb-2 text-center">My Thoughts on {modalBook.title}</h3>
            <div className="text-base text-gray-700 dark:text-gray-100 mb-4 whitespace-pre-line max-h-60 overflow-y-auto">{modalBook.notes}</div>
            {modalBook.link && (
              <a
                href={modalBook.link}
                className="mt-auto px-4 py-2 bg-primary-600 text-white rounded-lg text-center font-semibold hover:bg-primary-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 