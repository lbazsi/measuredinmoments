# GitHub Setup for Animation Details Page

## Configuration

To enable file uploads and downloads from GitHub, you need to configure your GitHub repository information.

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the root of your project:

```env
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=measuredinmoments
VITE_GITHUB_FOLDER=animation-materials
```

### Option 2: Direct Configuration

Edit `src/components/AnimationDetailsPage.jsx` and update these constants:

```javascript
const GITHUB_OWNER = 'your-github-username';
const GITHUB_REPO = 'measuredinmoments';
const GITHUB_FOLDER_PATH = 'animation-materials';
```

## Setting Up the Folder

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/measuredinmoments`
2. Click "Add file" > "Create new file"
3. Enter `animation-materials/.gitkeep` as the filename
4. Commit the file to create the folder
5. Now you can upload files to this folder

## Uploading Files

### Via GitHub Web Interface (Recommended for now)

1. Navigate to the `animation-materials` folder in your repository
2. Click "Add file" > "Upload files"
3. Drag and drop or select your files
4. Add a commit message and commit the changes
5. Refresh the Animation Details page to see your files

### Future: API-based Upload

For automated uploads via the website, you would need:
- A backend service with GitHub API integration
- GitHub Personal Access Token (stored securely on backend)
- API endpoint to handle file uploads

## File Access

Files uploaded to the `animation-materials` folder will be:
- Listed on the Animation Details page
- Available for download via direct links
- Publicly accessible (if repository is public)

## Notes

- The GitHub API is rate-limited (60 requests/hour for unauthenticated requests)
- For production use, consider implementing a backend service
- Files are served directly from GitHub's CDN via `download_url`

