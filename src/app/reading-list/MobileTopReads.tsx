"use client";
import Image from 'next/image';
import { useState } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

interface MobileTopReadsProps {
  books: Book[];
  onBookClick?: (id: string) => void;
}

export default function MobileTopReads({ books, onBookClick }: MobileTopReadsProps) {
  const [index, setIndex] = useState(0);
  const visibleCount = 1; // Show one book at a time on mobile
  const maxIndex = Math.max(0, books.length - visibleCount);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  return (
    <div className="relative w-full min-h-[26rem] flex flex-col items-center justify-center px-4">
      <div className="flex items-center relative w-full">
        {/* Left Arrow */}
        {canPrev && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[360px] w-8 bg-gray-300 bg-opacity-40 hover:bg-opacity-100 flex items-center justify-center transition-colors z-20"
            aria-label="Previous books"
            onClick={() => setIndex(index - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex justify-center w-full">
          {books.slice(index, index + visibleCount).map((item) => (
            <div
              key={item._id}
              className="group relative w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-4 border-[#e9f1ff] dark:border-[#5f6c89]"
              onClick={() => onBookClick?.(item._id)}
            >
              {item.imageUrl && item.imageUrl.startsWith('/book-images/') ? (
                <div className="relative w-full h-full">
                  <Image
                    src={item.imageUrl}
                    alt={`Cover of ${item.title}`}
                    width={192}
                    height={288}
                    className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{height: '288px'}}>
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Right Arrow */}
        {canNext && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 h-[360px] w-8 bg-gray-300 bg-opacity-40 hover:bg-opacity-100 flex items-center justify-center transition-colors z-20"
            aria-label="Next books"
            onClick={() => setIndex(index + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 