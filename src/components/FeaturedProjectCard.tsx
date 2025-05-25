'use client';

import Link from 'next/link';
import { IProject } from '@/models/Project';
import { FaGithub, FaFilePdf, FaFileArchive, FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
// @ts-expect-error: No types for react-fittext
import FitText from 'react-fittext';

interface FeaturedProjectCardProps {
  project: IProject;
  compact?: boolean;
  mobileSquare?: boolean;
}

export default function FeaturedProjectCard({ project, compact, mobileSquare }: FeaturedProjectCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [titleSize, setTitleSize] = useState('text-lg');
  const [descriptionSize, setDescriptionSize] = useState('text-base');

  useEffect(() => {
    const checkTextFit = () => {
      if (!titleRef.current || !descriptionRef.current) return;
      
      const title = titleRef.current;
      const description = descriptionRef.current;
      
      // Check title fit
      const titleIsOverflowing = title.scrollHeight > title.clientHeight;
      setTitleSize(titleIsOverflowing ? 'text-base' : 'text-lg');
      
      // Check description fit
      const descriptionIsOverflowing = description.scrollHeight > description.clientHeight;
      setDescriptionSize(descriptionIsOverflowing ? 'text-sm' : 'text-base');
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
        relative 
        w-full 
        h-[300px]
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
        pt-4
        pb-3
        px-3
        -mx-[1px]
      `}
    >
      {/* Title Section - Flexible height */}
      <div className="w-full flex-[0.8] flex items-center justify-center min-h-0 mb-0">
        <FitText min={12} max={28} throttle={32} mode="multi">
          <div className="font-semibold text-[#2E2F35] dark:text-white text-center w-full h-full flex items-center justify-center transition-all duration-200">
            {project.summaryTitle || project.title}
          </div>
        </FitText>
      </div>

      {/* Description Section - Flexible height */}
      <div className="w-full flex-[1.2] flex items-center justify-center min-h-0 mt-0">
        <FitText min={10} max={20} throttle={32} mode="multi">
          <div className="text-[#2E2F35] dark:text-neutral-200 text-center w-full h-full flex items-center justify-center transition-all duration-200">
            {project.summaryDescription || project.description}
          </div>
        </FitText>
      </div>

      {/* Icons Section - Fixed height */}
      <div className="w-full h-[25px] flex justify-center items-center gap-2">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repository">
            <FaGithub className="text-primary-600 hover:text-primary-700 transition-colors text-2xl" />
          </a>
        )}
        {project.pdfUrl && (
          <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
            <FaFilePdf className="text-primary-600 hover:text-primary-700 transition-colors text-2xl" />
          </a>
        )}
        {project.zipUrl && (
          <a href={project.zipUrl} target="_blank" rel="noopener noreferrer" title="Download ZIP">
            <FaFileArchive className="text-primary-600 hover:text-primary-700 transition-colors text-2xl" />
          </a>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" title="External Link">
            <FaExternalLinkAlt className="text-primary-600 hover:text-primary-700 transition-colors text-2xl" />
          </a>
        )}
      </div>
    </div>
  );
} 