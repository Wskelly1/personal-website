"use client";
import Image from 'next/image';
import { useState } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

interface BooksOnListCarouselProps {
  books: Book[];
  onBookClick?: (id: string) => void;
}

export default function BooksOnListCarousel({ books, onBookClick }: BooksOnListCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasPrev = index > 0;
  const hasNext = index < books.length - 1;

  return (
    <div className="min-h-[26rem] flex flex-col items-center justify-center">
      <div className="relative flex items-center">
        {/* Left Arrow Bar */}
        {hasPrev && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[360px] w-8 bg-gray-300 bg-opacity-40 hover:bg-opacity-100 flex items-center justify-center transition-colors z-20"
            aria-label="Previous book"
            onClick={() => setIndex(index - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div
          className="group relative w-60 max-w-[240px] aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-4 border-[#e9f1ff] dark:border-[#5f6c89]"
          onClick={() => onBookClick?.(books[index]?._id)}
        >
          {books[index]?.imageUrl && books[index].imageUrl.startsWith('/book-images/') ? (
            <div className="relative w-full h-full">
              <Image
                src={books[index].imageUrl}
                alt={`Cover of ${books[index].title}`}
                width={240}
                height={360}
                className="object-cover transition-transform group-hover:scale-105 w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{height: '360px'}}>
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        {/* Right Arrow Bar */}
        {hasNext && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 h-[360px] w-8 bg-gray-300 bg-opacity-40 hover:bg-opacity-100 flex items-center justify-center transition-colors z-20"
            aria-label="Next book"
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