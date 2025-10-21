# Frontend App (React) — Document Analyzer MVP

## Overview
This is a lightweight React frontend for uploading documents, sending them to the backend for parsing, and downloading a generated Excel report. The UI supports drag-and-drop uploads, progress indication, and an “Export to Excel” action. The app is designed to connect to a FastAPI backend running on port 3001.

## Quick Start
Prerequisites:
- Node.js 16+ and npm
- Backend API running on http://localhost:3001 (see backend README)

Install dependencies and run:
```bash
npm install
npm start
```
The app will be available at:
- Local: http://localhost:3000

## Running via Preview System
If you are using the Kavia preview environment:
- Frontend preview URL: provided by the preview system, typically on port 3000
- Backend preview URL: ensure the backend is running on port 3001

This frontend expects the backend at http://localhost:3001 by default (see src/api/client.js). If the preview system exposes a different backend URL, update the base URL accordingly.

## Environment Variables (if any)
No `.env` file is required for the frontend in this MVP. The backend API base URL is currently hardcoded as:
- File: `src/api/client.js`
- Value: `const BASE_URL = 'http://localhost:3001';`

If you need to point to a different backend URL in a preview or remote environment, modify `src/api/client.js` and rebuild or restart the app.

## How to Use
1. Open http://localhost:3000 in your browser.
2. Drag-and-drop files into the upload area or click “Browse Files” to select them.
3. Supported file types: PDF, DOCX, PPTX, XLSX, CSV.
4. Click “Generate Excel”.
5. Wait for processing to complete. The Excel download starts automatically.

## Supported File Types
- pdf
- docx
- pptx
- xlsx
- csv

Images are not supported for text extraction in this MVP. They will be marked as unsupported.

## Troubleshooting
- Download not starting:
  - Check your browser’s download/pop-up permissions.
- Network error:
  - Verify the backend is running and accessible at http://localhost:3001.
  - Confirm CORS is allowed from http://localhost:3000 (default backend setting allows this).
- Unsupported file:
  - Ensure the file is one of the supported types (PDF/DOCX/PPTX/XLSX/CSV).
- Large file issues:
  - Files larger than the backend’s limit (default 25 MB) will be rejected.

## Notes and Next Steps
- This MVP does not use a database.
- The backend generates Excel on the fly and streams it back.
- Consider externalizing the API base URL into environment variables for different deployment environments.
