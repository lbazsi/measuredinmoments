import React, { useState, useEffect } from 'react';
import { File, ExternalLink, CheckCircle2, Download, Loader2 } from 'lucide-react';

function ProjectsPage({ t }) {
  const [projects, setProjects] = useState([]);
  const [featuredFiles, setFeaturedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    attachments: []
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  // GitHub repository configuration
  const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'lbazsi';
  const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'measuredinmoments';
  const GITHUB_FOLDER_PATH = import.meta.env.VITE_GITHUB_FOLDER || 'animation-materials';

  // Fetch files from GitHub for featured project
  const fetchFeaturedFiles = async () => {
    setLoadingFiles(true);
    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FOLDER_PATH}?ref=main`;
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data) ? data : [data];
        
        const fileList = items
          .filter(item => item && item.type === 'file' && item.name !== '.gitkeep')
          .map(item => {
            let downloadUrl = item.download_url;
            if (!downloadUrl && item.git_url) {
              downloadUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_FOLDER_PATH}/${item.name}`;
            }
            
            return {
              name: item.name,
              size: item.size,
              downloadUrl: downloadUrl || item.html_url,
              type: item.name.split('.').pop() || 'file'
            };
          });
        
        setFeaturedFiles(fileList);
      } else {
        setFeaturedFiles([]);
      }
    } catch (error) {
      console.error('Error fetching featured files:', error);
      setFeaturedFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Load projects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('communityProjects');
    if (stored) {
      setProjects(JSON.parse(stored));
    }
    fetchFeaturedFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileData]
    }));
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    // Create new project
    const newProject = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      link: formData.link.trim() || undefined,
      attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
      createdAt: Date.now()
    };

    // Save to localStorage
    const updated = [...projects, newProject];
    localStorage.setItem('communityProjects', JSON.stringify(updated));
    setProjects(updated);

    // Reset form
    setFormData({
      title: '',
      description: '',
      link: '',
      attachments: []
    });
    setFileInputKey(prev => prev + 1);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="pt-24">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-light mb-12 text-center text-beige-900">
          {t.projects?.title || 'Projects'}
        </h2>

        {/* Featured Project */}
        <div className="bg-beige-50 rounded-2xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-light mb-4 text-beige-900">
            {t.projects?.featuredTitle || 'Featured Project'}
          </h3>
          <h4 className="text-xl font-medium mb-3 text-beige-800">
            {t.projects?.featuredName || 'Measured in Moments'}
          </h4>
          <p className="text-beige-700 mb-6 leading-relaxed">
            {t.projects?.featuredDescription || 'An animated exploration of AI safety and the responsibilities we face in developing artificial intelligence.'}
          </p>
          
          {/* Attachments */}
          {loadingFiles ? (
            <div className="flex items-center gap-2 text-beige-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading materials...</span>
            </div>
          ) : featuredFiles.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-beige-800 mb-3">
                {t.projects?.attachments || 'Attachments'}:
              </p>
              <div className="space-y-2">
                {featuredFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-beige-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <File className="w-4 h-4 text-beige-600 flex-shrink-0" />
                      <span className="text-sm text-beige-800 truncate">{file.name}</span>
                      <span className="text-xs text-beige-600 flex-shrink-0">({formatFileSize(file.size)})</span>
                    </div>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 px-3 py-1 bg-beige-700 text-white rounded text-sm hover:bg-beige-800 transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      {t.projects?.download || 'Download'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Community Projects Section */}
        <div className="space-y-12">
          {/* Submission Form */}
          <div className="bg-beige-50 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-light mb-4 text-beige-900">
              {t.projects?.formTitle || 'Submit Your Project'}
            </h3>
            <p className="text-beige-700 mb-6">
              {t.projects?.formDescription || 'Share your project with the community. All submissions are welcome.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="project-title" className="block text-sm font-medium text-beige-800 mb-2">
                  {t.projects?.formTitleLabel || 'Project Title'} <span className="text-beige-600">*</span>
                </label>
                <input
                  type="text"
                  id="project-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-400 bg-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-beige-800 mb-2">
                  {t.projects?.formDescriptionLabel || 'Description'} <span className="text-beige-600">*</span>
                </label>
                <textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-beige-400 bg-white"
                  required
                />
              </div>

              {/* External Link */}
              <div>
                <label htmlFor="project-link" className="block text-sm font-medium text-beige-800 mb-2">
                  {t.projects?.formLinkLabel || 'External Link'} <span className="text-beige-600 text-xs">({t.projects?.optional || 'optional'})</span>
                </label>
                <input
                  type="url"
                  id="project-link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-400 bg-white"
                />
              </div>

              {/* Attachments */}
              <div>
                <label htmlFor="project-attachments" className="block text-sm font-medium text-beige-800 mb-2">
                  {t.projects?.formAttachmentsLabel || 'Attachments'} <span className="text-beige-600 text-xs">({t.projects?.optional || 'optional'})</span>
                </label>
                <input
                  key={fileInputKey}
                  type="file"
                  id="project-attachments"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-400 bg-white"
                />
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-beige-200">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-beige-600" />
                          <span className="text-sm text-beige-800">{file.name}</span>
                          <span className="text-xs text-beige-600">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-beige-600 hover:text-beige-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-beige-700 text-white rounded-lg hover:bg-beige-800 transition-colors font-medium"
              >
                {t.projects?.submit || 'Submit Project'}
              </button>

              {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 text-sm">
                    {t.projects?.submitSuccess || 'Project submitted successfully!'}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Projects List */}
          <div>
            <h3 className="text-2xl font-light mb-6 text-beige-900">
              {t.projects?.listTitle || 'Community Projects'}
            </h3>

            {projects.length === 0 ? (
              <div className="text-center py-12 bg-beige-50 rounded-2xl">
                <p className="text-beige-600">
                  {t.projects?.empty || 'No projects yet. Be the first to share your project!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-beige-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-xl font-medium mb-2 text-beige-900">
                      {project.title}
                    </h4>
                    <p className="text-beige-700 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-beige-700 hover:text-beige-900 underline mb-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t.projects?.viewLink || 'View Project'}
                      </a>
                    )}
                    {project.attachments && project.attachments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-beige-800 mb-2">
                          {t.projects?.attachments || 'Attachments'}:
                        </p>
                        <div className="space-y-1">
                          {project.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-beige-600">
                              <File className="w-3 h-3" />
                              <span>{file.name}</span>
                              <span className="text-xs">({formatFileSize(file.size)})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-beige-600 mt-4">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;

