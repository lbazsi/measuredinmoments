# GitHub Setup for Animation Details Page

## Configuration

To enable file downloads from GitHub, you need to configure your GitHub repository information.

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

The `animation-materials` folder has already been created in the repository. You can add files to it directly via GitHub's web interface.

## Adding Files (Site Admin Only)

Only site administrators can add files to the repository. To add files:

1. Navigate to the `animation-materials` folder in your repository
2. Click "Add file" > "Upload files"
3. Drag and drop or select your files
4. Add a commit message and commit the changes
5. Files will automatically appear on the Animation Details page

## File Access

Files in the `animation-materials` folder will be:
- Listed on the Animation Details page
- Available for download by visitors via direct links
- Publicly accessible (if repository is public)

## Notes

- The GitHub API is rate-limited (60 requests/hour for unauthenticated requests)
- Files are served directly from GitHub's CDN via `download_url`
- Only site administrators can add files to the repository
- Visitors can only download files, not upload them

