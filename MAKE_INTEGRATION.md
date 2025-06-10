# Make.com Integration Guide

This guide explains how to integrate the Merge Audio and Video workflow with Make.com (formerly Integromat). The workflow now supports both **direct URLs** and **file uploads**.

## ✨ NEW: URL Support

You can now provide direct URLs to video and audio files instead of uploading them to the repository first. This makes integration much simpler!

## Integration Methods

### Method 1: Direct URLs (Recommended)

This is the simplest method - just provide URLs to your video and audio files.

#### Setup Steps:

1. **Create a Personal Access Token (PAT)** (same as before)

2. **Configure Make.com Scenario**
   - Add an HTTP module in Make.com
   - Set URL: `https://api.github.com/repos/agnaousa/merge-media/dispatches`
   - Set Method: `POST`
   - Set Headers:
     ```
     Authorization: Bearer {your_pat_token}
     Accept: application/vnd.github.v3+json
     Content-Type: application/json
     ```
   - Set Body (JSON):
     ```json
     {
       "event_type": "merge-media",
       "client_payload": {
         "video_path": "https://example.com/video.mp4",
         "audio_path": "https://example.com/audio.mp3",
         "output_path": "output/merged.mp4",
         "audio_handling": "replace"
       }
     }
     ```

### Method 2: Repository Dispatch (Local Files)

Use this method if your files are already in the repository.

#### Parameters:
- `video_path`: URL or path to the video file
- `audio_path`: URL or path to the audio file  
- `output_path`: Desired output path (timestamp and run ID will be appended)
- `audio_handling`: How to handle audio (options: "replace", "mix", "keep_video")

### Method 3: File Upload + Processing

This method uploads files to the repository first, then processes them.

#### Setup Steps:

1. **Create a Personal Access Token** (same as Method 1)

2. **Configure Make.com Scenario**
   - Add an HTTP module to update the webhook-trigger.json file
   - Set URL: `https://api.github.com/repos/agnaousa/merge-media/contents/webhook-trigger.json`
   - Set Method: `PUT`
   - Set Headers:
     ```
     Authorization: Bearer {your_pat_token}
     Accept: application/vnd.github.v3+json
     Content-Type: application/json
     ```
   - Set Body (JSON):
     ```json
     {
       "message": "Trigger merge workflow from Make.com",
       "content": "{base64_encoded_json}",
       "sha": "{current_file_sha}"
     }
     ```

   Where `{base64_encoded_json}` is your parameters JSON encoded in Base64:
   ```json
   {
     "video_path": "input/video.mp4",
     "audio_path": "input/audio.mp3",
     "output_path": "output/merged.mp4",
     "audio_handling": "replace"
   }
   ```

## File Upload to Repository

Before triggering the workflow, you need to upload your video and audio files to the repository.

### Upload Files via GitHub API (for Make.com)

Use these endpoints to upload files:

#### Upload Video File:
```
PUT https://api.github.com/repos/agnaousa/merge-media/contents/input/video.mp4
```

#### Upload Audio File:
```
PUT https://api.github.com/repos/agnaousa/merge-media/contents/input/audio.mp3
```

#### Request Body for File Upload:
```json
{
  "message": "Upload media file for processing",
  "content": "{base64_encoded_file_content}"
}
```

## Make.com Scenario Example

Here's a complete Make.com scenario structure:

1. **Trigger Module** (Webhook, Google Drive, Dropbox, etc.)
2. **File Upload Module** (HTTP - Upload video)
3. **File Upload Module** (HTTP - Upload audio)
4. **Workflow Trigger Module** (HTTP - Repository Dispatch)
5. **Monitor Module** (Optional - Check workflow status)

## Monitoring Workflow Status

You can monitor the workflow execution using GitHub's API:

```
GET https://api.github.com/repos/agnaousa/merge-media/actions/runs
```

Filter by the workflow file name to get specific runs.

## Audio Handling Options

- **"replace"**: Replaces the video's audio track with the new audio
- **"mix"**: Mixes the video's existing audio with the new audio
- **"keep_video"**: Keeps only the video's original audio (ignores new audio)

## Example Make.com HTTP Modules

### Repository Dispatch Trigger:
```json
{
  "url": "https://api.github.com/repos/agnaousa/merge-media/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer ghp_your_token_here",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
    "event_type": "merge-media",
    "client_payload": {
      "video_path": "input/{{filename}}.mp4",
      "audio_path": "input/{{audioname}}.mp3",
      "output_path": "output/merged_{{timestamp}}.mp4",
      "audio_handling": "replace"
    }
  }
}
```

### File Upload:
```json
{
  "url": "https://api.github.com/repos/agnaousa/merge-media/contents/input/video.mp4",
  "method": "PUT",
  "headers": {
    "Authorization": "Bearer ghp_your_token_here",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
    "message": "Upload video from Make.com",
    "content": "{{base64(data)}}"
  }
}
```

## Error Handling

The workflow includes validation steps that will fail if:
- Video file doesn't exist at the specified path
- Audio file doesn't exist at the specified path
- FFmpeg processing fails

Monitor the workflow logs in GitHub Actions for debugging.

## Output

The processed video will be:
1. Uploaded as a GitHub Actions artifact
2. Committed to the repository in the specified output directory
3. Available for download or further processing

The output filename will include a timestamp and run ID for uniqueness.
