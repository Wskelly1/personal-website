import ProjectCard from '../components/ProjectCard';

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return res.json();
}

export default async function Projects() {
  const projects = await getProjects();

  // Sort: currents (no endDate) first by startDate desc, then rest by endDate desc
  const sortedProjects = [...projects].sort((a, b) => {
    const aIsCurrent = !a.endDate;
    const bIsCurrent = !b.endDate;
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    if (aIsCurrent && bIsCurrent) {
      // Both current: sort by startDate desc
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    // Both not current: sort by endDate desc
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });

  return (
    <div className="page-container">
      <h1>My Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project: any) => (
          <div key={project._id}>
            <ProjectCard
              title={project.title}
              startDate={project.startDate}
              endDate={project.endDate}
              description={project.description}
              link={project.link}
              status={project.status}
              pdfUrl={project.pdfUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 