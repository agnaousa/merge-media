# Make.com Integration Guide for Merge Media Workflow

This guide shows how to integrate your GitHub Actions merge-media workflow with Make.com (formerly Integromat) to automatically merge audio and video files based on various triggers.

## Overview

The GitHub Actions workflow supports three trigger methods that work well with Make.com:

1. **Repository Dispatch** (Webhook) - Direct API calls
2. **Push to webhook-trigger.json** - File-based triggers
3. **Workflow Dispatch** - Manual triggers (for testing)

## ⚠️ Important: Understanding Asynchronous Processing

**GitHub Actions workflows are asynchronous!** When you trigger a workflow via Make.com, you will NOT get the output file immediately. Instead, you get a confirmation that the workflow was triggered successfully.

The response you're seeing (`Buffer (length: 0, codepage: binary, checksum: da39a3ee5e6b4b0d3255bfef95601890afd80709)`) is normal - it's just an empty response confirming the workflow was triggered.

To get the actual output file, you need to:
1. Trigger the workflow
2. Wait for it to complete (2-5 minutes typically)
3. Fetch the output file from the repository or download artifacts

See the **"Getting the Output File"** section below for detailed solutions.

## Prerequisites

1. GitHub Personal Access Token with `repo` permissions
2. Make.com account
3. Your GitHub repository URL: `https://github.com/agnaousa/merge-media`

## Quick Setup

For immediate use with your repository:
- **GitHub Token:** `YOUR_GITHUB_TOKEN_HERE`
- **Repository:** `https://github.com/agnaousa/merge-media`

## Method 1: Repository Dispatch (Recommended)

This method uses GitHub's repository dispatch API to trigger the workflow directly.

### Setup Steps:

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Create a token with `repo` scope
   - Save the token securely

2. **In Make.com, create a new scenario with these modules:**

### Make.com Scenario Structure:

```
Trigger → HTTP Request → (Optional) Error Handling
```

### HTTP Request Module Configuration:

- **URL:** `https://api.github.com/repos/agnaousa/merge-media/dispatches`
- **Method:** POST
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "event_type": "merge-media",
    "client_payload": {
      "video_path": "{{video_url}}",
      "audio_path": "{{audio_url}}",
      "output_path": "output/merged_{{timestamp}}.mp4",
      "audio_handling": "replace"
    }
  }
  ```

## Method 2: Push to webhook-trigger.json

This method creates/updates a JSON file in the repository to trigger the workflow.

### Make.com Scenario Structure:

```
Trigger → Create JSON → HTTP Request (Create/Update File) → (Optional) Cleanup
```

### HTTP Request Module Configuration:

- **URL:** `https://api.github.com/repos/agnaousa/merge-media/contents/webhook-trigger.json`
- **Method:** PUT
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "message": "Trigger media merge from Make.com",
    "content": "{{base64_encoded_json}}"
  }
  ```

Where `base64_encoded_json` is the base64 encoding of:
```json
{
  "video_path": "{{video_url}}",
  "audio_path": "{{audio_url}}",
  "output_path": "output/merged_{{timestamp}}.mp4",
  "audio_handling": "replace"
}
```

## Getting the Output File

Since GitHub Actions workflows are asynchronous, you need additional steps in Make.com to retrieve the processed video file. Here are three approaches:

### Option 1: Poll for Workflow Completion + Download Artifacts (Recommended)

Add these modules after your trigger HTTP request:

#### 1. Sleep Module
- **Duration:** 30 seconds (initial wait)

#### 2. HTTP Request - Check Workflow Status
- **URL:** `https://api.github.com/repos/agnaousa/merge-media/actions/runs?event=repository_dispatch&per_page=1`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  ```

#### 3. Repeater Module (Loop until completion)
- **Maximum iterations:** 10
- **Condition:** `{{workflow_runs[0].status}}` not equal to "completed"

#### 4. Sleep Module (Inside repeater)
- **Duration:** 30 seconds

#### 5. HTTP Request - Get Artifacts (After workflow completes)
- **URL:** `https://api.github.com/repos/agnaousa/merge-media/actions/runs/{{workflow_runs[0].id}}/artifacts`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  ```

#### 6. HTTP Request - Download Artifact
- **URL:** `{{artifacts[0].archive_download_url}}`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  ```

### Option 2: Use GitHub Webhooks (Advanced)

Configure a webhook in your repository to notify Make.com when the workflow completes:

1. **Repository Settings > Webhooks > Add webhook**
2. **Payload URL:** Your Make.com webhook URL
3. **Events:** Select "Workflow runs"
4. **Create webhook to capture completion events**

### Option 3: Download from Repository (If using commit method)

If the workflow commits the file to the repository:

#### HTTP Request - Get Repository Contents
- **URL:** `https://api.github.com/repos/agnaousa/merge-media/contents/output`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  ```

#### Filter for Your File
Use Make.com's filter to find your specific output file by timestamp or name.

#### Download File
- **URL:** `{{download_url}}` (from the contents API response)
- **Method:** GET

## Complete Make.com Scenario Structure (Recommended)

```
Trigger (Webhook)
    ↓
HTTP Request (Trigger Workflow)
    ↓
Sleep (30 seconds)
    ↓
Repeater (Check Status Loop)
    ├── HTTP Request (Check Workflow Status)
    ├── Filter (Status = "completed")
    └── Sleep (30 seconds if not completed)
    ↓
HTTP Request (Get Artifacts)
    ↓
HTTP Request (Download Artifact)
    ↓
[Your next action - upload to Google Drive, send email, etc.]
```

## Example Use Cases

### Use Case 1: Google Drive + YouTube Integration

**Scenario:** Automatically merge YouTube audio with Google Drive videos

**Trigger:** New file in Google Drive folder
**Steps:**
1. Google Drive - Watch Files
2. YouTube - Get Audio URL (using yt-dlp or similar service)
3. HTTP - Trigger GitHub Action with repository dispatch

### Use Case 2: Webhook from External Service

**Scenario:** Process media files from a form submission or API

**Trigger:** Webhook from external service
**Steps:**
1. Webhooks - Custom Webhook
2. Data Transformation - Format URLs
3. HTTP - Trigger GitHub Action

### Use Case 3: Scheduled Processing

**Scenario:** Process queued media files on a schedule

**Trigger:** Schedule (every hour)
**Steps:**
1. Schedule - Every Hour
2. Database/API - Get Pending Jobs
3. Iterator - Process Each Job
4. HTTP - Trigger GitHub Action for each job

## Parameters Reference

| Parameter | Description | Required | Default | Example |
|-----------|-------------|----------|---------|---------|
| `video_path` | Video file URL or path | Yes | `input/video.mp4` | `https://example.com/video.mp4` |
| `audio_path` | Audio file URL or path | Yes | `input/audio.mp3` | `https://example.com/audio.mp3` |
| `output_path` | Output file path | Yes | `output/merged.mp4` | `output/my_video.mp4` |
| `audio_handling` | How to handle audio | No | `replace` | `replace`, `mix`, `keep_video` |

### Audio Handling Options:

- **`replace`**: Replace video audio with new audio track
- **`mix`**: Mix video audio with new audio track
- **`keep_video`**: Keep only video audio, ignore new audio

## Error Handling

Add error handling modules in Make.com to handle:

- GitHub API rate limits
- Invalid file URLs
- Authentication errors
- Workflow failures

### Example Error Handler:

```json
{
  "error_type": "{{error.type}}",
  "error_message": "{{error.message}}",
  "timestamp": "{{now}}",
  "payload": "{{original_payload}}"
}
```

## Monitoring Workflow Status

To monitor the workflow status, you can add additional HTTP requests:

1. **Get Workflow Runs:**
   - URL: `https://api.github.com/repos/agnaousa/merge-media/actions/runs`
   - Method: GET

2. **Get Specific Run:**
   - URL: `https://api.github.com/repos/agnaousa/merge-media/actions/runs/{{run_id}}`
   - Method: GET

## Best Practices

1. **Use meaningful output filenames** with timestamps or unique IDs
2. **Validate URLs** before sending to GitHub Actions
3. **Implement retry logic** for failed requests
4. **Log all operations** for debugging
5. **Use webhook secrets** for security when possible
6. **Monitor GitHub Actions quotas** to avoid rate limits

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check GitHub token permissions
2. **404 Not Found**: Verify repository name and token scope
3. **Workflow not triggering**: Check event type matches `merge-media`
4. **File download failures**: Ensure URLs are publicly accessible
5. **Empty buffer response**: This is normal! The workflow was triggered successfully but runs asynchronously
6. **Workflow takes too long**: Video processing can take 2-5 minutes depending on file sizes

### Specific Make.com Issues:

#### Getting Empty Buffer Response
- **Problem:** Make.com shows `Buffer (length: 0, codepage: binary, checksum: da39a3ee5e6b4b0d3255bfef95601890afd80709)`
- **Solution:** This is expected! It means the workflow was triggered successfully. You need to add polling steps to wait for completion and download the output file.

#### Workflow Status Check
To check if your workflow is running:
```bash
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN_HERE" \
     https://api.github.com/repos/agnaousa/merge-media/actions/runs?per_page=5
```

#### Download Artifacts Directly
```bash
# Get the latest run ID
RUN_ID=$(curl -s -H "Authorization: Bearer YOUR_GITHUB_TOKEN_HERE" \
    https://api.github.com/repos/agnaousa/merge-media/actions/runs?per_page=1 | jq -r '.workflow_runs[0].id')

# Get artifacts for that run
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN_HERE" \
     https://api.github.com/repos/agnaousa/merge-media/actions/runs/$RUN_ID/artifacts
```
