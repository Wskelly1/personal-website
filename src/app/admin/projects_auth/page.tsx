'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/apiUrl';

interface Project {
  _id: string;
  title: string;
  summaryTitle?: string;
  summaryDescription?: string;
  startDate: Date;
  endDate: Date;
  description: string;
  link: string;
  pdfUrl?: string;
  zipUrl?: string;
  githubUrl?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  featured: boolean;
}

export default function AdminProjects() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    summaryTitle: '',
    summaryDescription: '',
    startDate: '',
    endDate: '',
    description: '',
    link: '',
    pdfUrl: '',
    zipUrl: '',
    githubUrl: '',
    status: 'in-progress' as 'completed' | 'in-progress' | 'upcoming',
    featured: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(getApiUrl('/api/projects'));
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Require at least one of link, pdfUrl, zipUrl, or githubUrl
    if (!formData.link && !formData.pdfUrl && !formData.zipUrl && !formData.githubUrl) {
      setError('Please provide at least one of: Project Link, PDF, ZIP file URL, or GitHub repository URL.');
      setIsLoading(false);
      return;
    }

    // Require summary fields if featured is checked
    if (formData.featured && (!formData.summaryTitle.trim() || !formData.summaryDescription.trim())) {
      setError('Summary Title and Summary Description are required for featured projects.');
      setIsLoading(false);
      return;
    }

    try {
      const url = editingProject 
        ? getApiUrl('/api/projects')
        : getApiUrl('/api/projects');
      
      const method = editingProject ? 'PUT' : 'POST';
      let body = editingProject 
        ? { ...formData, id: editingProject._id }
        : { ...formData };

      // Remove endDate if blank
      if (!body.endDate) {
        delete (body as any).endDate;
      }
      // Remove link if blank
      if (!body.link) {
        delete (body as any).link;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccess(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
        setFormData({
          title: '',
          summaryTitle: '',
          summaryDescription: '',
          startDate: '',
          endDate: '',
          description: '',
          link: '',
          pdfUrl: '',
          zipUrl: '',
          githubUrl: '',
          status: 'in-progress',
          featured: false,
        });
        setEditingProject(null);
        fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save project');
      }
    } catch (error) {
      setError('An error occurred while saving the project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      summaryTitle: project.summaryTitle || '',
      summaryDescription: project.summaryDescription || '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      description: project.description || '',
      link: project.link || '',
      pdfUrl: project.pdfUrl || '',
      zipUrl: project.zipUrl || '',
      githubUrl: project.githubUrl || '',
      status: project.status || 'in-progress',
      featured: project.featured || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/projects?id=${projectId}`), {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Project deleted successfully!');
        fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete project');
      }
    } catch (error) {
      setError('An error occurred while deleting the project');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCancel = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      summaryTitle: '',
      summaryDescription: '',
      startDate: '',
      endDate: '',
      description: '',
      link: '',
      pdfUrl: '',
      zipUrl: '',
      githubUrl: '',
      status: 'in-progress',
      featured: false,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch(getApiUrl('/api/projects/upload'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          pdfUrl: `/project-pdfs/${data.filename}`
        }));
        setSuccess('PDF uploaded successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload PDF');
      }
    } catch (error) {
      setError('An error occurred while uploading the PDF');
    } finally {
      setIsUploading(false);
    }
  };

  // Count featured projects
  const featuredCount = projects.filter((p) => p.featured).length;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card p-6 flex flex-col h-full" style={{ minHeight: '600px' }}>
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-500/20 text-error-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-success-50 border border-success-500/20 text-success-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="summaryTitle" className="form-label">
                  Summary Title <span className="text-gray-400">(max 40 chars)</span>
                </label>
                <input
                  type="text"
                  id="summaryTitle"
                  name="summaryTitle"
                  maxLength={40}
                  value={formData.summaryTitle}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter summary title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="summaryDescription" className="form-label">
                  Summary Description <span className="text-gray-400">(max 65 chars)</span>
                </label>
                <input
                  type="text"
                  id="summaryDescription"
                  name="summaryDescription"
                  maxLength={65}
                  value={formData.summaryDescription}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter summary description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    End Date <span className='text-gray-400'>(leave blank for Present)</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your project"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="link" className="form-label">
                  Project Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="pdf" className="form-label">
                  Project PDF
                </label>
                <div className="flex items-center space-x-4">
                  <label className="btn-primary cursor-pointer">
                    <span>{isUploading ? 'Uploading...' : 'Choose PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {formData.pdfUrl && (
                    <a
                      href={formData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="zipUrl" className="form-label">
                  Project ZIP File URL
                </label>
                <input
                  type="text"
                  id="zipUrl"
                  name="zipUrl"
                  value={formData.zipUrl || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter ZIP file URL (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="githubUrl" className="form-label">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter GitHub repository URL (optional)"
                />
              </div>

              <div className="form-group flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  disabled={!formData.featured && featuredCount >= 3}
                />
                <label htmlFor="featured" className="form-label mb-0 cursor-pointer">
                  Featured Project (max 3)
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List Section */}
          <div className="card p-6 flex flex-col h-full" style={{ minHeight: '600px' }}>
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Existing Projects</h2>
            <div className="space-y-4 flex-1 overflow-y-auto" style={{ maxHeight: '600px' }}>
              {projects.length === 0 ? (
                <div className="card p-6 text-center text-neutral-500">
                  No projects yet. Add your first project above!
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="card p-6 group hover:border-primary-500/50 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800">{project.title}</h3>
                        <p className="text-sm text-neutral-500">
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(project)}
                          className="btn-secondary py-1 px-3 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="btn-danger py-1 px-3 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-4 line-clamp-2">{project.description}</p>
                    {project.pdfUrl && (
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 