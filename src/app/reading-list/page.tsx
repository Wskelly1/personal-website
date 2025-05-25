"use client";

import { useEffect, useState } from 'react';
import CurrentReadCarousel from './CurrentReadCarousel';
import TopReadsCarousel from './TopReadsCarousel';
import BooksOnListCarousel from './BooksOnListCarousel';
import TopReadsPhone from './TopReadsPhone';
import CurrentReadsPhone from './CurrentReadsPhone';
import BooksOnListPhone from './BooksOnListPhone';
import AllBooks from './AllBooks';
import MyLibraryPhone from './MyLibraryPhone';
import { getApiUrl } from '@/lib/apiUrl';

// Add useIsMobile hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default function ReadingListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/reading-list'));
      const data = await res.json();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const topReads = items.filter((item: any) => item.isTopRead);
  const currentReads = items.filter((item: any) => item.status === 'Reading');
  const booksOnList = items.filter((item: any) => item.status === 'Want to Read');

  // Scroll to book in My Library
  const handleBookClick = (id: string) => {
    const el = document.getElementById(`book-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div>
      {isMobile ? (
        // Mobile Layout
        <div className="flex flex-col space-y-8 px-4">
          {/* Top Reads */}
          {topReads.length > 0 && (
            <div>
              <h2 className="font-semibold text-[clamp(1.5rem,6vw,2.5rem)] mb-4 text-center truncate whitespace-nowrap w-full min-w-0">My Top Reads</h2>
              <TopReadsPhone books={topReads} onBookClick={handleBookClick} />
            </div>
          )}
          {/* Currently Reading */}
          {currentReads.length > 0 && (
            <div>
              <h2 className="font-semibold text-[clamp(1.5rem,6vw,2.5rem)] mb-4 text-center truncate whitespace-nowrap w-full min-w-0">Currently Reading</h2>
              <CurrentReadsPhone books={currentReads} onBookClick={handleBookClick} />
            </div>
          )}
          {/* Books on My List */}
          {booksOnList.length > 0 && (
            <div>
              <h2 className="font-semibold text-[clamp(1.5rem,6vw,2.5rem)] mb-4 text-center truncate whitespace-nowrap w-full min-w-0">On My List</h2>
              <BooksOnListPhone books={booksOnList} onBookClick={handleBookClick} />
            </div>
          )}
          {/* All Books */}
          <div className="mt-8">
            <MyLibraryPhone items={items} onBookClick={handleBookClick} />
          </div>
        </div>
      ) : (
        // Desktop Layout
        <>
          {/* Top Row: Flex layout for precise spacing */}
          <div className="flex flex-row mb-4 items-start overflow-x-auto min-w-0">
            {/* My Top Reads (left-aligned, fixed width) */}
            <div className="max-w-[32rem] min-w-[20rem] flex-shrink-0 ml-12 mr-2">
              {topReads.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-2 whitespace-nowrap">My Top Reads</h2>
                  <TopReadsCarousel books={topReads} onBookClick={handleBookClick} />
                </>
              )}
            </div>
            {/* Right group: Currently Reading and Books on My List */}
            <div className="w-80 min-w-[2rem]" />
            <div className="flex flex-row gap-8 pr-4 min-w-[32rem]">
              {/* Currently Reading */}
              <div className="max-w-[20rem] min-w-[20rem] flex-shrink-0">
                {currentReads.length > 0 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-center whitespace-nowrap">Currently Reading</h2>
                    <CurrentReadCarousel books={currentReads} onBookClick={handleBookClick} />
                  </>
                )}
              </div>
              {/* Books on My List (rightmost) */}
              <div className="max-w-[20rem] min-w-[20rem] flex-shrink-0">
                {booksOnList.length > 0 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-center whitespace-nowrap">On My List</h2>
                    <BooksOnListCarousel books={booksOnList} onBookClick={handleBookClick} />
                  </>
                )}
              </div>
            </div>
          </div>
          {/* All Books below */}
          <div className="flex ml-12 mr-4 max-w-[calc(100vw-7rem)] mx-auto">
            <AllBooks items={items} />
          </div>
        </>
      )}
    </div>
  );
}