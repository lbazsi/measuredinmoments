import React, { useState, useEffect } from 'react';
import { Download, File, Loader2, AlertCircle } from 'lucide-react';

function AnimationDetailsPage({ t }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // GitHub repository configuration
  // These can be set via environment variables or updated directly
  const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'lbazsi';
  const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'measuredinmoments';
  const GITHUB_FOLDER_PATH = import.meta.env.VITE_GITHUB_FOLDER || 'animation-materials';

  // Fetch files from GitHub
  const fetchFilesFromGitHub = async () => {
    setLoading(true);

    try {
      // Using GitHub API to list files in the folder (specify main branch)
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FOLDER_PATH}?ref=main`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out directories, .gitkeep, and get only files
        const fileList = data
          .filter(item => item.type === 'file' && item.name !== '.gitkeep')
          .map(item => ({
            name: item.name,
            size: item.size,
            downloadUrl: item.download_url,
            sha: item.sha,
            url: item.html_url
          }));
        setFiles(fileList);
        setError('');
      } else if (response.status === 404) {
        // Folder doesn't exist yet or path is incorrect
        const errorData = await response.json().catch(() => ({}));
        console.error('GitHub API 404:', errorData);
        setFiles([]);
        setError('Folder not found. Please check that the animation-materials folder exists in the repository.');
      } else if (response.status === 403) {
        // Rate limit or access issue
        setError('GitHub API rate limit reached or repository is private. Please try again later.');
        setFiles([]);
      } else {
        const errorText = await response.text().catch(() => response.statusText);
        console.error('Failed to fetch files:', response.status, errorText);
        setFiles([]);
        setError(`Failed to fetch files: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
      setError('Error connecting to GitHub. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesFromGitHub();
  }, []);

  // Download file
  const handleDownload = (file) => {
    window.open(file.downloadUrl, '_blank');
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="pt-24">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-light mb-12 text-center text-gray-800">
          {t.animationDetails?.title || 'Animation Details'}
        </h2>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t.animationDetails?.description || 
            'Download animation materials and resources shared on this site.'}
        </p>

        {/* Files List Section */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-light mb-6 text-gray-800">
            {t.animationDetails?.filesTitle || 'Available Materials'}
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="ml-3 text-gray-600">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {t.animationDetails?.noFiles || 'No files available yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <File className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(file)}
                      className="ml-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      {t.animationDetails?.download || 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={fetchFilesFromGitHub}
            className="mt-6 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            {t.animationDetails?.refresh || 'Refresh list'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AnimationDetailsPage;

