# How to Use This Audio/Video Merger with Background Sound & Captions in Make.com

This guide explains how to integrate the GitHub Actions workflow for merging audio and video files with background sound and caption support using Make.com scenarios.

## Overview

This workflow can:
- Merge audio files with video files
- Add background sound/music with volume control
- Add text captions with customizable positioning and styling
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

**Example Request Body** (Basic):
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

**Example Request Body** (With Background Sound & Captions):
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://your-video-url.com/video.mp4",
    "audio_path": "https://your-audio-url.com/audio.mp3",
    "background_sound_config": "{\"path\":\"https://your-music-url.com/background.mp3\",\"base64\":\"\",\"volume\":\"0.3\"}",
    "caption_config": "{\"text\":\"Welcome to our tutorial!\",\"style\":\"fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.8\",\"position\":\"bottom_center\"}",
    "output_path": "output/merged.mp4",
    "audio_handling": "mix"
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
    "background_sound_config": "{\"path\":\"{{background_music_url}}\",\"base64\":\"{{base64_background_data}}\",\"volume\":\"{{background_volume_level}}\"}",
    "caption_config": "{\"text\":\"{{caption_text}}\",\"style\":\"{{caption_style}}\",\"position\":\"{{caption_position}}\"}",
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

## Working with JSON Configuration in Make.com

Since the workflow now uses JSON strings for background sound and caption configuration, you'll need to construct these properly in Make.com.

### Building JSON Strings in Make.com

#### Method 1: Direct String Construction
```
"background_sound_config": "{\"path\":\"{{bundle.inputData.musicUrl}}\",\"base64\":\"\",\"volume\":\"{{bundle.inputData.volume}}\"}"
```

#### Method 2: Using Make.com's JSON Module
1. Add a "Tools > Set Variable" module
2. Set variable name: `background_config`
3. Set variable value: 
   ```json
   {
     "path": "{{bundle.inputData.musicUrl}}",
     "base64": "",
     "volume": "{{bundle.inputData.volume}}"
   }
   ```
4. In the HTTP module, reference: `{{background_config}}`

#### Method 3: Using Make.com's Text Aggregator
Combine multiple data points into a JSON string using text aggregation.

### JSON Escaping in Make.com
When constructing JSON strings manually, remember to:
- Escape quotes: `\"` instead of `"`
- Escape backslashes: `\\` instead of `\`
- Use Make.com's `escapeJSON()` function for dynamic text

### Example with Make.com Functions
```
"caption_config": "{\"text\":\"{{escapeJSON(bundle.inputData.title)}}\",\"style\":\"fontsize={{bundle.inputData.fontSize}}:fontcolor={{bundle.inputData.color}}\",\"position\":\"{{bundle.inputData.position}}\"}"
```

## Input Parameters Explained

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

### Background Sound Configuration (JSON String)
- `background_sound_config`: JSON string containing background sound settings
  ```json
  {
    "path": "URL to background music file or local path",
    "base64": "Base64 encoded background sound data",
    "volume": "Volume level (0.0 to 1.0, default: 0.3)"
  }
  ```

### Caption Configuration (JSON String)
- `caption_config`: JSON string containing caption settings
  ```json
  {
    "text": "Text to display on the video",
    "style": "FFmpeg drawtext style options",
    "position": "Caption position (top_left, top_center, etc.)"
  }
  ```
  
#### Caption Position Options
- `top_left`, `top_center`, `top_right`
- `center_left`, `center`, `center_right` 
- `bottom_left`, `bottom_center`, `bottom_right`

#### Caption Style Examples
- Default: `fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5`
- Custom: `fontsize=30:fontcolor=yellow`, `fontcolor=red:box=1:boxcolor=blue@0.7`

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

### Scenario 4: Educational Content Creation
```
Trigger: Google Sheets (new row with lesson data)
↓
HTTP Module: Download lesson video and audio
↓
Data Transformer: Generate captions from lesson title
↓
HTTP Module: Trigger merge workflow with background music
↓
Google Drive: Save processed video
↓
Email: Send download link to instructor
```

### Scenario 5: Social Media Content with Branding
```
Trigger: Webhook (content upload)
↓
AI Module: Generate captions from content
↓
HTTP Module: Add brand background music
↓
HTTP Module: Trigger merge workflow
↓
Multiple Social Media: Post to platforms
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

### With Background Sound & Captions
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://example.com/video.mp4",
    "audio_path": "https://example.com/narration.mp3",
    "background_sound_config": "{\"path\":\"https://example.com/background-music.mp3\",\"base64\":\"\",\"volume\":\"0.25\"}",
    "caption_config": "{\"text\":\"{{bundle.inputData.title}}\",\"style\":\"fontsize=32:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=3\",\"position\":\"bottom_center\"}",
    "output_path": "output/branded_{{formatDate(now; 'YYYYMMDD_HHmmss')}}.mp4",
    "audio_handling": "mix"
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
    "background_sound_config": "{\"path\":\"\",\"base64\":\"{{base64(bundle.inputData.backgroundMusic)}}\",\"volume\":\"0.2\"}",
    "caption_config": "{\"text\":\"{{bundle.inputData.videoTitle}}\",\"style\":\"fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5\",\"position\":\"top_center\"}",
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

### Dynamic Caption Generation
Use AI or text processing to generate captions:
```
"caption_config": "{\"text\":\"{{trim(bundle.inputData.description; 50)}}...\",\"style\":\"fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5\",\"position\":\"{{if(bundle.inputData.isTitle; 'top_center'; 'bottom_center')}}\"}"
```

### Background Music Selection
Use conditional logic for background music:
```
"background_sound_config": "{\"path\":\"{{if(bundle.inputData.mood = 'upbeat'; 'https://example.com/upbeat.mp3'; 'https://example.com/calm.mp3')}}\",\"base64\":\"\",\"volume\":\"{{if(bundle.inputData.hasVoiceover; '0.2'; '0.5')}}\"}"
```

## Advanced Caption and Background Sound Features

### Caption Styling Examples

#### Corporate Branding
```json
"caption_config": "{\"text\":\"Your Company Name\",\"style\":\"fontsize=36:fontcolor=#003366:box=1:boxcolor=#FFFFFF@0.9:boxborderw=2\",\"position\":\"bottom_center\"}"
```

#### Gaming/Fun Style
```json
"caption_config": "{\"text\":\"GAME OVER!\",\"style\":\"fontsize=28:fontcolor=yellow:box=1:boxcolor=red@0.7:boxborderw=3\",\"position\":\"center\"}"
```

#### Subtle/Professional
```json
"caption_config": "{\"text\":\"Professional Training\",\"style\":\"fontsize=24:fontcolor=white:box=1:boxcolor=black@0.3:boxborderw=1\",\"position\":\"bottom_right\"}"
```

### Background Sound Volume Guidelines

- **0.1-0.2**: Subtle ambient background
- **0.2-0.3**: Gentle background music with voiceover
- **0.3-0.4**: Moderate background music
- **0.4-0.6**: Prominent background music without voiceover
- **0.6-1.0**: Dominant background music (use sparingly)

### Multi-Language Caption Support

Use Make.com's translation modules:
```
Text Translator Module
↓
"caption_config": "{\"text\":\"{{translated_text}}\",\"style\":\"fontsize=28:fontcolor=white:box=1:boxcolor=blue@0.8\",\"position\":\"bottom_center\"}"
```

## File Size Validation
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
