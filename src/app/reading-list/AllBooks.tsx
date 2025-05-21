'use client';
import Image from 'next/image';

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
  notes?: string;
  status: string;
  isTopRead?: boolean;
  link?: string;
}

export default function AllBooks({ items }: { items: Book[] }) {
  return (
    <div className="relative w-[52rem] flex-1 min-h-[26rem] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#2E2F35]">My Library</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-[#2E2F35] opacity-70">No items in reading list yet.</p>
      ) : (
        <div className="grid gap-6 w-full">
          {items.map((item) => (
            <div
              key={item._id}
              id={`book-${item._id}`}
              className="bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <div className="flex flex-row-reverse gap-6">
                {item.imageUrl && item.imageUrl.startsWith('/book-images/') && (
                  <div className="flex-shrink-0 w-32 h-48 relative">
                    <Image
                      src={item.imageUrl}
                      alt={`Cover of ${item.title}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-[#2E2F35]">
                        {item.title}
                        {item.isTopRead && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Top Read
                          </span>
                        )}
                      </h3>
                      <p className="text-[#2E2F35] mb-2">by {item.author}</p>
                      {item.notes && (
                        <p className="text-[#2E2F35] mt-4">{item.notes}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm text-[#2E2F35] ${
                      item.status === 'Completed'
                        ? 'bg-green-100'
                        : item.status === 'Reading'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                    >
                      View Book →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 