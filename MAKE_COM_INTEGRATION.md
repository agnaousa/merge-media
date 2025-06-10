# How to Use This Audio/Video Merger in Make.com

This guide explains how to integrate the GitHub Actions workflow for merging audio and video files with Make.com scenarios.

## Overview

This workflow can:
- Merge audio files with video files
- Handle URLs or base64-encoded media
- Replace, mix, or keep original video audio
- Generate timestamped output files
- Return downloadable URLs

## Prerequisites

1. A GitHub repository with this workflow: `https://github.com/agnaousa/merge-media`
2. A GitHub Personal Access Token with `repo` permissions
3. Make.com account

## Quick Start for agnaousa/merge-media Repository

### Ready-to-Use HTTP Module Configuration

**Workflow URL**: `https://api.github.com/repos/agnaousa/merge-media/actions/workflows/merge-media.yml/dispatches`

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_GITHUB_TOKEN",
  "Accept": "application/vnd.github.v3+json",
  "Content-Type": "application/json"
}
```

**Example Request Body**:
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://your-video-url.com/video.mp4",
    "audio_path": "https://your-audio-url.com/audio.mp3",
    "output_path": "output/merged.mp4",
    "audio_handling": "replace"
  }
}
```

## Prerequisites

1. A GitHub repository with this workflow
2. A GitHub Personal Access Token with `repo` permissions
3. Make.com account

## Make.com Integration Methods

### Method 1: HTTP Module (Recommended)

Use Make.com's HTTP module to trigger the GitHub Actions workflow via GitHub's REST API.

#### Step 1: Set up HTTP Module
```
Module: HTTP > Make a Request
URL: https://api.github.com/repos/agnaousa/merge-media/actions/workflows/merge-media.yml/dispatches
Method: POST
Headers:
  - Authorization: Bearer {your_github_token}
  - Accept: application/vnd.github.v3+json
  - Content-Type: application/json
```

#### Step 2: Configure Request Body
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "{{video_url_or_path}}",
    "audio_path": "{{audio_url_or_path}}",
    "audio_base64": "{{base64_audio_data}}",
    "output_path": "output/merged.mp4",
    "audio_handling": "replace"
  }
}
```

### Method 2: GitHub Module

Use Make.com's built-in GitHub modules for a more integrated approach.

#### Configuration
```
Module: GitHub > Custom API Call
URL: /repos/agnaousa/merge-media/actions/workflows/merge-media.yml/dispatches
Method: POST
Body: {same as above}
```

## Input Parameters Explained

### Required Parameters
- `video_path`: URL to video file or local path
- `output_path`: Where to save the merged file

### Optional Parameters
- `audio_path`: URL to audio file (ignored if audio_base64 is provided)
- `audio_base64`: Base64 encoded audio data for multipart uploads
- `audio_handling`: How to handle existing video audio
  - `"replace"`: Replace video audio with new audio
  - `"mix"`: Mix video audio with new audio
  - `"keep_video"`: Keep original video audio only

## Common Make.com Scenarios

### Scenario 1: Process Form Uploads
```
Trigger: Webhook (form submission)
↓
HTTP Module: Upload files to temporary storage
↓
Data Transformer: Convert audio to base64
↓
HTTP Module: Trigger GitHub workflow
↓
Delay: Wait for processing
↓
HTTP Module: Check workflow status
↓
Email: Send download link
```

### Scenario 2: Social Media Content Creation
```
Trigger: Google Drive (new file)
↓
Google Drive: Get file content
↓
Data Transformer: Prepare inputs
↓
HTTP Module: Trigger merge workflow
↓
Slack: Notify team with result
```

### Scenario 3: Automated Podcast Processing
```
Trigger: RSS Feed (new episode)
↓
HTTP Module: Download audio
↓
AI Module: Generate video background
↓
HTTP Module: Trigger merge workflow
↓
YouTube: Upload merged video
```

## Sample Make.com HTTP Configuration

### Basic Setup
```json
{
  "url": "https://api.github.com/repos/agnaousa/merge-media/actions/workflows/merge-media.yml/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_TOKEN",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
    "ref": "main",
    "inputs": {
      "video_path": "https://example.com/video.mp4",
      "audio_path": "https://example.com/audio.mp3",
      "output_path": "output/merged.mp4",
      "audio_handling": "replace"
    }
  }
}
```

### With Base64 Audio Upload
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://example.com/video.mp4",
    "audio_base64": "{{base64(bundle.inputData.audioFile)}}",
    "output_path": "output/merged_{{formatDate(now; 'YYYYMMDD_HHmmss')}}.mp4",
    "audio_handling": "mix"
  }
}
```

## Workflow Status Monitoring

To monitor the workflow status in Make.com:

### Check Workflow Run Status
```
URL: https://api.github.com/repos/agnaousa/merge-media/actions/runs
Method: GET
Headers: Authorization: Bearer {token}
```

Filter results by:
- `workflow_id`: The ID of your workflow
- `created`: Recent runs
- `status`: "completed", "in_progress", "queued"

### Get Workflow Results
Once completed, the workflow:
1. Uploads the merged file as an artifact
2. Commits the file to the repository
3. Provides download URLs in the workflow logs

## Error Handling in Make.com

Add error handling to your scenarios:

```
Error Handler Module
↓
Condition: If HTTP status ≠ 204
↓
Email/Slack: Send error notification
```

## Advanced Features

### Dynamic File Naming
Use Make.com functions to create unique filenames:
```
"output_path": "output/merged_{{formatDate(now; 'YYYYMMDD_HHmmss')}}_{{random}}.mp4"
```

### Conditional Audio Handling
Use Make.com routers to determine audio handling based on content:
```
Router → 
  Route 1: If music file → "mix"
  Route 2: If voice file → "replace"
  Route 3: If no audio → "keep_video"
```

### File Size Validation
Add data validation before triggering:
```
Filter: bundle.inputData.fileSize < 100000000  // 100MB limit
```

## Output and Results

The workflow provides:
- **Artifact**: Downloadable merged video file
- **Committed File**: File stored in repository
- **URLs**: Direct links to access the file
- **Metadata**: File size, processing time, etc.

## Tips for Make.com Integration

1. **Rate Limiting**: GitHub API has rate limits - add delays between calls
2. **File Size**: Large files may timeout - consider chunked uploads
3. **Error Recovery**: Implement retry logic for failed workflows
4. **Caching**: Store results to avoid reprocessing identical requests
5. **Webhooks**: Set up GitHub webhooks to notify Make.com when processing completes

## Example Webhook Payload

When the workflow completes, you can receive this data:
```json
{
  "action": "completed",
  "workflow_run": {
    "id": 123456789,
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/user/repo/actions/runs/123456789"
  }
}
```

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check GitHub token permissions
2. **404 Not Found**: Verify repository and workflow file names
3. **422 Validation Error**: Check input parameter formats
4. **Workflow Failed**: Check GitHub Actions logs for FFmpeg errors

### Debug Mode
Add debug logging to your Make.com scenario:
```
Data Store: Log all API requests and responses
Filter: Only process successful responses (status 204)
```

This integration allows you to leverage GitHub's powerful computing resources for media processing while maintaining the flexibility of Make.com's automation platform.
