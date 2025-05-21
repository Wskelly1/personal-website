import Link from 'next/link';
import { IProject } from '@/models/Project';

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
      {(project.link || project.pdfUrl) && (
        <div className="absolute bottom-3 left-0 w-full flex justify-center">
          <a
            href={project.link || project.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-[#034ed2] text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Project
          </a>
        </div>
      )}
    </div>
  );
} 