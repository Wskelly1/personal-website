"use client";

import { useEffect, useState } from 'react';
import CurrentReadCarousel from './CurrentReadCarousel';
import TopReadsCarousel from './TopReadsCarousel';
import BooksOnListCarousel from './BooksOnListCarousel';
import AllBooks from './AllBooks';

export default function ReadingListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const res = await fetch('/api/reading-list');
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
      {/* Top Row: Flex layout for precise spacing */}
      <div className="flex flex-row mb-4 items-start">
        {/* My Top Reads (left-aligned, fixed width) */}
        <div className="max-w-[32rem] flex-shrink-0 ml-12 mr-2">
          {topReads.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-2 whitespace-nowrap">My Top Reads</h2>
              <TopReadsCarousel books={topReads} onBookClick={handleBookClick} />
            </>
          )}
        </div>
        {/* Right group: Currently Reading and Books on My List */}
        <div className="w-80" />
        <div className="flex flex-row gap-6 pr-4">
          {/* Currently Reading */}
          <div className="max-w-[20rem] flex-shrink-0">
            {currentReads.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-2 text-center whitespace-nowrap">Currently Reading</h2>
                <CurrentReadCarousel books={currentReads} onBookClick={handleBookClick} />
              </>
            )}
          </div>
          {/* Books on My List (rightmost) */}
          <div className="max-w-[20rem] flex-shrink-0">
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
    </div>
  );
}