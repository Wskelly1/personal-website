'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaGithub, FaFilePdf, FaFileArchive, FaExternalLinkAlt } from 'react-icons/fa';
import React from 'react';

interface ProjectCardProps {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  link: string;
  pdfUrl?: string;
  zipUrl?: string;
  githubUrl?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

const ProjectCard = ({ title, startDate, endDate, description, link, pdfUrl, zipUrl, githubUrl, status }: ProjectCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const previewRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [preview, setPreview] = useState('');
  const [isClamped, setIsClamped] = useState(false);

  // Allow more words/characters in the preview (for a longer description)
  const MAX_CHARS = 150;
  const READ_MORE_LENGTH = 9;

  useEffect(() => {
    if (!measureRef.current) return;
    const words = (description || '').split(' ');
    let low = 0, high = words.length, best = '';
    let fits = false;
    // Try to fit as many words as possible in 3 lines
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const test = words.slice(0, mid).join(' ') + (mid < words.length ? '... Read more' : '');
      measureRef.current.innerHTML = test.replace('Read more', '<span id="measure-link">Read more</span>');
      // Get line height and max height for 3 lines
      const lineHeight = parseFloat(getComputedStyle(measureRef.current).lineHeight || '0');
      const maxHeight = lineHeight * 3 + 1; // fudge for rounding
      if (measureRef.current.offsetHeight > maxHeight) {
        high = mid - 1;
      } else {
        best = test;
        low = mid + 1;
      }
    }
    setPreview(best);
    setIsClamped(best.endsWith('... Read more'));
  }, [description]);

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center justify-center text-yellow-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const statusColors: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800 border-green-400',
    'in-progress': 'bg-blue-100 text-primary-600 border-primary-600',
    'upcoming': 'bg-yellow-100 text-yellow-800 border-yellow-400',
  };

  return (
    <div 
      className="relative w-full h-[300px] group perspective transition-transform duration-300 hover:-translate-y-2 shadow hover:shadow-2xl rounded-2xl overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Container */}
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-2xl shadow-md flex flex-col backface-hidden group">
          {/* Status Badge */}
          <div className={`flex items-center justify-end h-10 px-4 pt-4 pb-2 mb-3`}> 
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]} max-w-[120px] truncate`}>{status.replace('-', ' ')}</div>
          </div>
          {/* Title */}
          <div className="flex items-center justify-center h-16 px-4">
            <h3 className="text-2xl font-bold text-center leading-tight w-full line-clamp-2 text-[#2E2F35] dark:text-white" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>{title}</h3>
          </div>
          {/* Description */}
          <div className="flex flex-col items-center justify-center h-20 px-4 relative">
            <span className="text-base text-neutral-700 text-center w-full line-clamp-3 break-words" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}>
              {description}
            </span>
          </div>
          {/* Read more link below description area, appears on card hover */}
          {!isFlipped && (
            <div className="relative h-6 w-full flex items-center justify-center">
              <button
                className="text-primary-600 text-sm transition-opacity underline cursor-pointer z-10"
                style={{ marginTop: '-0.5rem' }}
                onClick={() => setIsFlipped(true)}
                tabIndex={-1}
              >
                Read more
              </button>
            </div>
          )}
          {/* Date Pill */}
          <div className="flex items-center justify-center h-10 px-4 mt-auto mb-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-primary-600 text-base font-semibold shadow min-w-[140px] min-h-[32px] max-w-full truncate" style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}>
              <FaCalendarAlt className="mr-2 text-lg" />
              <span className="truncate">
                {new Date(startDate).toLocaleDateString()} - {endDate ? new Date(endDate).toLocaleDateString() : 'Present'}
              </span>
            </span>
          </div>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-lg shadow-md p-6 rotate-y-180 backface-hidden">
          <div className="flex flex-col h-full">
            <div className="mb-1 flex-grow overflow-auto max-h-[190px]">
              <p className="text-gray-600 rounded-md p-3 text-base bg-white mb-4 text-[#2E2F35] dark:text-neutral-200">
                {description}
              </p>
            </div>
            <div className="mt-auto space-y-1">
              <div className="flex gap-4 justify-center items-center mt-2">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repository">
                    <FaGithub className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
                  </a>
                )}
                {pdfUrl && (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
                    <FaFilePdf className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
                  </a>
                )}
                {zipUrl && (
                  <a href={zipUrl} target="_blank" rel="noopener noreferrer" title="Download ZIP">
                    <FaFileArchive className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
                  </a>
                )}
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer" title="External Link">
                    <FaExternalLinkAlt className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 