"use client";
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

interface CurrentReadsPhoneProps {
  books: Book[];
  onBookClick?: (id: string) => void;
}

export default function CurrentReadsPhone({ books, onBookClick }: CurrentReadsPhoneProps) {
  const [index, setIndex] = useState(0);
  const visibleCount = 1; // Show one book at a time on mobile
  const maxIndex = Math.max(0, books.length - visibleCount);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const imageRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (imageRef.current) observer.observe(imageRef.current);
    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, [index]);

  // Read More animation logic
  const [showReadMore, setShowReadMore] = useState(false);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShowReadMore(false);
    setPulse(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pulseRef.current) clearInterval(pulseRef.current);
    if (!isVisible) return;
    timerRef.current = setTimeout(() => {
      setShowReadMore(true);
      setPulse(true);
      pulseRef.current = setInterval(() => {
        setPulse((prev) => !prev);
      }, 1200);
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pulseRef.current) clearInterval(pulseRef.current);
    };
  }, [index, isVisible]);

  return (
    <div className="relative w-full min-h-[26rem] flex flex-col items-center justify-center px-4">
      <div className="flex items-center justify-center w-full min-w-0" style={{height: '360px'}}>
        {/* Left Arrow or Placeholder */}
        {canPrev ? (
          <button
            className="h-16 w-8 flex-shrink-0 flex items-center justify-center transition-colors z-50 mr-3 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:mr-0 md:ml-0"
            aria-label="Previous books"
            style={{marginLeft: 0}}
            onClick={() => setIndex(index - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#034ed2] hover:text-[#02358a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <span className="h-16 w-8 flex-shrink-0 mr-3 md:mr-0 md:ml-0 opacity-0 pointer-events-none" />
        )}
        {/* Book Image */}
        {books.slice(index, index + visibleCount).map((item, i) => (
          <div
            key={item._id}
            ref={i === 0 ? imageRef : undefined}
            className="group relative w-[90vw] max-w-[240px] min-w-[180px] h-[360px] rounded-lg overflow-hidden flex-shrink flex items-center justify-center border-4 border-[#e9f1ff] dark:border-[#5f6c89] cursor-pointer"
            onClick={() => onBookClick?.(item._id)}
          >
            {item.imageUrl && item.imageUrl.startsWith('/book-images/') ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={item.imageUrl}
                  alt={`Cover of ${item.title}`}
                  width={240}
                  height={360}
                  className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center">
                  <span
                    className={`text-white text-lg font-medium transition-opacity duration-700 ${showReadMore ? (pulse ? 'opacity-100' : 'opacity-40') : 'opacity-0'}`}
                  >
                    Read More
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{height: '360px'}}>
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        ))}
        {/* Right Arrow or Placeholder */}
        {canNext ? (
          <button
            className="h-16 w-8 flex-shrink-0 flex items-center justify-center transition-colors z-50 ml-3 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:ml-0 md:mr-0"
            aria-label="Next books"
            style={{marginRight: 0}}
            onClick={() => setIndex(index + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#034ed2] hover:text-[#02358a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="h-16 w-8 flex-shrink-0 ml-3 md:ml-0 md:mr-0 opacity-0 pointer-events-none" />
        )}
      </div>
    </div>
  );
} 