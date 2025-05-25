'use client';

import Link from 'next/link';
import { IProject } from '@/models/Project';
import { FaGithub, FaFilePdf, FaFileArchive, FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

interface FeaturedProjectCardProps {
  project: IProject;
  compact?: boolean;
  mobileSquare?: boolean;
}

export default function FeaturedProjectCard({ project, compact, mobileSquare }: FeaturedProjectCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [titleSize, setTitleSize] = useState('text-sm');
  const [descriptionSize, setDescriptionSize] = useState('text-xs');

  useEffect(() => {
    const checkTextFit = () => {
      if (!titleRef.current || !descriptionRef.current) return;
      
      const title = titleRef.current;
      const description = descriptionRef.current;
      
      // Check title fit
      const titleIsOverflowing = title.scrollHeight > title.clientHeight;
      setTitleSize(titleIsOverflowing ? 'text-xs' : 'text-sm');
      
      // Check description fit
      const descriptionIsOverflowing = description.scrollHeight > description.clientHeight;
      setDescriptionSize(descriptionIsOverflowing ? 'text-[10px]' : 'text-xs');
    };

    checkTextFit();
    window.addEventListener('resize', checkTextFit);
    return () => window.removeEventListener('resize', checkTextFit);
  }, [project.summaryTitle, project.title, project.summaryDescription, project.description]);

  const handleViewProject = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = project.link || project.pdfUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div 
      className={`
        w-[300px] mx-auto
        relative
        flex
        flex-col
        justify-between
        items-center
        bg-[#e9f1ff]
        dark:bg-[#5f6c89]
        rounded-2xl
        shadow
        hover:shadow-lg
        hover:scale-105
        transition-transform
        duration-200
        pt-5
        pb-2
        px-3
      `}
    >
      {/* Title Section - Fixed height */}
      <div className="w-full h-[35px] flex items-center justify-center">
        <h3 
          ref={titleRef}
          className={`font-semibold text-[#2E2F35] dark:text-white ${titleSize} transition-all duration-200 text-center`}
        >
          {project.summaryTitle || project.title}
        </h3>
      </div>

      {/* Description Section - Fixed height */}
      <div className="w-full h-[70px] flex items-center justify-center">
        <p 
          ref={descriptionRef}
          className={`text-[#2E2F35] dark:text-neutral-200 ${descriptionSize} transition-all duration-200 text-center`}
        >
          {project.summaryDescription || project.description}
        </p>
      </div>

      {/* Icons Section - Fixed height */}
      <div className="w-full h-[20px] flex justify-center items-center gap-2">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repository">
            <FaGithub className="text-primary-600 hover:text-primary-700 transition-colors text-base" />
          </a>
        )}
        {project.pdfUrl && (
          <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
            <FaFilePdf className="text-primary-600 hover:text-primary-700 transition-colors text-base" />
          </a>
        )}
        {project.zipUrl && (
          <a href={project.zipUrl} target="_blank" rel="noopener noreferrer" title="Download ZIP">
            <FaFileArchive className="text-primary-600 hover:text-primary-700 transition-colors text-base" />
          </a>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" title="External Link">
            <FaExternalLinkAlt className="text-primary-600 hover:text-primary-700 transition-colors text-base" />
          </a>
        )}
      </div>
    </div>
  );
} 