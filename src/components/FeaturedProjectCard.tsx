import Link from 'next/link';
import { IProject } from '@/models/Project';
import { FaGithub, FaFilePdf, FaFileArchive, FaExternalLinkAlt } from 'react-icons/fa';

interface FeaturedProjectCardProps {
  project: IProject;
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const handleViewProject = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = project.link || project.pdfUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative p-6 bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-2xl shadow hover:shadow-lg hover:scale-105 transition-transform duration-200 min-h-[220px] pb-12">
      <h3 className="text-xl font-semibold mb-2 text-[#2E2F35] dark:text-white text-center">
        {project.summaryTitle || project.title}
      </h3>
      <p className="mb-4 text-[#2E2F35] dark:text-neutral-200 text-center">
        {project.summaryDescription || project.description}
      </p>
      <div className="absolute bottom-3 left-0 w-full flex justify-center gap-4">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Repository">
            <FaGithub className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
          </a>
        )}
        {project.pdfUrl && (
          <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
            <FaFilePdf className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
          </a>
        )}
        {project.zipUrl && (
          <a href={project.zipUrl} target="_blank" rel="noopener noreferrer" title="Download ZIP">
            <FaFileArchive className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
          </a>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" title="External Link">
            <FaExternalLinkAlt className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
          </a>
        )}
      </div>
    </div>
  );
} 