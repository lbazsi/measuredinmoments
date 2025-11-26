import React, { useState, useEffect } from 'react';
import { Upload, Download, File, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function AnimationDetailsPage({ t }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [githubRepo, setGithubRepo] = useState('');
  const [githubFolder, setGithubFolder] = useState('animation-materials');

  // GitHub repository configuration
  // These can be set via environment variables or updated directly
  const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'your-username'; // Replace with your GitHub username
  const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'measuredinmoments'; // Replace with your repository name
  const GITHUB_FOLDER_PATH = import.meta.env.VITE_GITHUB_FOLDER || 'animation-materials'; // Folder in GitHub where files are stored

  // Fetch files from GitHub
  const fetchFilesFromGitHub = async () => {
    setLoading(true);
    
    // Check if GitHub is configured
    if (GITHUB_OWNER === 'your-username' || !GITHUB_OWNER) {
      setLoading(false);
      setUploadError('Please configure your GitHub repository information. See GITHUB_SETUP.md for instructions.');
      return;
    }

    try {
      // Using GitHub API to list files in the folder
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FOLDER_PATH}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out directories and get only files
        const fileList = data
          .filter(item => item.type === 'file')
          .map(item => ({
            name: item.name,
            size: item.size,
            downloadUrl: item.download_url,
            sha: item.sha,
            url: item.html_url
          }));
        setFiles(fileList);
        setUploadError('');
      } else if (response.status === 404) {
        // Folder doesn't exist yet, that's okay
        setFiles([]);
        setUploadError('');
      } else if (response.status === 403) {
        // Rate limit or access issue
        setUploadError('GitHub API rate limit reached or repository is private. Please try again later.');
        setFiles([]);
      } else {
        console.error('Failed to fetch files:', response.statusText);
        setFiles([]);
        setUploadError(`Failed to fetch files: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
      setUploadError('Error connecting to GitHub. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesFromGitHub();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(false);

    // For GitHub upload, we need to use the GitHub API
    // This requires authentication, so we'll provide instructions
    // and a helper function that can be used with a GitHub token
    
    // Note: Direct upload from browser requires GitHub Personal Access Token
    // For security, this should be done through a backend service
    // For now, we'll show instructions on how to upload manually
    
    alert(
      `To upload files to GitHub:\n\n` +
      `1. Go to your GitHub repository: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}\n` +
      `2. Navigate to the '${GITHUB_FOLDER_PATH}' folder (create it if it doesn't exist)\n` +
      `3. Click "Add file" > "Upload files"\n` +
      `4. Drag and drop or select your file: ${file.name}\n` +
      `5. Commit the changes\n\n` +
      `After uploading, refresh this page to see your file.`
    );
  };

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

        {/* Upload Section */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-light mb-6 text-gray-800">
            {t.animationDetails?.uploadTitle || 'Upload Materials'}
          </h3>
          <p className="text-gray-600 mb-6">
            {t.animationDetails?.uploadDescription || 
              'Upload animation materials and resources. Files will be stored in the GitHub repository.'}
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-700 mb-2">
                {t.animationDetails?.uploadButton || 'Click to select a file or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                {t.animationDetails?.uploadNote || 'Files will be uploaded to GitHub repository'}
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-800 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm">
                {t.animationDetails?.uploadSuccess || 'File uploaded successfully!'}
              </p>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{uploadError}</p>
            </div>
          )}
        </div>

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
                {t.animationDetails?.noFiles || 'No files available yet. Upload your first file to get started.'}
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
        </div>

        {/* Configuration Notice */}
        {(GITHUB_OWNER === 'your-username' || !GITHUB_OWNER) && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-lg font-medium text-yellow-900 mb-2">
              Configuration Required
            </h4>
            <p className="text-sm text-yellow-800 mb-2">
              Please configure your GitHub repository information to enable file uploads and downloads.
            </p>
            <p className="text-sm text-yellow-800">
              See <code className="bg-yellow-100 px-1 rounded">GITHUB_SETUP.md</code> for instructions.
            </p>
          </div>
        )}

        {/* GitHub Instructions */}
        {GITHUB_OWNER !== 'your-username' && GITHUB_OWNER && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-lg font-medium text-blue-900 mb-2">
              {t.animationDetails?.instructionsTitle || 'How to Upload Files'}
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>
                {t.animationDetails?.instruction1 || 
                  `Go to your GitHub repository: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
              </li>
              <li>
                {t.animationDetails?.instruction2 || 
                  `Navigate to or create the '${GITHUB_FOLDER_PATH}' folder`}
              </li>
              <li>
                {t.animationDetails?.instruction3 || 
                  'Click "Add file" > "Upload files"'}
              </li>
              <li>
                {t.animationDetails?.instruction4 || 
                  'Drag and drop or select your files'}
              </li>
              <li>
                {t.animationDetails?.instruction5 || 
                  'Commit the changes and refresh this page'}
              </li>
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}

export default AnimationDetailsPage;

