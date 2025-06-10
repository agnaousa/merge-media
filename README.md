# Merge Media - Audio Video Processor

This repository contains a GitHub Actions workflow that merges audio and video files using FFmpeg. It's designed to work with Make.com (formerly Integromat) for automated media processing.

## Features

- **Multiple Audio Handling Options**: Replace, mix, or keep original video audio
- **Multiple Trigger Methods**: Manual dispatch, webhook, or file-based triggers
- **Make.com Integration**: Ready-to-use with Make.com automation scenarios
- **Automatic File Management**: Unique output filenames with timestamps
- **Artifact Storage**: Processed videos are stored as GitHub artifacts and committed to the repo

## Quick Start

### Manual Usage

1. Upload your video file to `input/video.mp4`
2. Upload your audio file to `input/audio.mp3`
3. Go to the Actions tab in GitHub
4. Run the "Merge Audio and Video" workflow
5. Download the result from the artifacts or the `output/` directory

### Make.com Integration

See [MAKE_INTEGRATION.md](MAKE_INTEGRATION.md) for detailed setup instructions.

## Audio Handling Options

- **replace**: Replaces the video's audio track completely with the new audio
- **mix**: Mixes the video's existing audio with the new audio
- **keep_video**: Keeps only the video's original audio (ignores new audio file)

## File Structure

```
├── input/                  # Place your source files here
│   ├── video.mp4          # Your video file
│   └── audio.mp3          # Your audio file
├── output/                # Processed files will be saved here
├── .github/workflows/
│   └── merge-media.yml    # Main workflow file
├── webhook-trigger.json   # Configuration file for webhook triggers
├── test-integration.sh    # Test script for API integration
└── MAKE_INTEGRATION.md    # Detailed Make.com setup guide
```

## Supported Formats

- **Video**: MP4, AVI, MOV, and other formats supported by FFmpeg
- **Audio**: MP3, WAV, AAC, and other formats supported by FFmpeg
- **Output**: MP4 (H.264 video, AAC audio)

## API Endpoints for Make.com

### Repository Dispatch (Recommended)
```
POST https://api.github.com/repos/{owner}/{repo}/dispatches
```

### File Upload
```
PUT https://api.github.com/repos/{owner}/{repo}/contents/input/{filename}
```

## Example Payload

```json
{
  "event_type": "merge-media",
  "client_payload": {
    "video_path": "input/video.mp4",
    "audio_path": "input/audio.mp3",
    "output_path": "output/merged.mp4",
    "audio_handling": "replace"
  }
}
```

## Requirements

- GitHub repository with Actions enabled
- FFmpeg (automatically installed in the workflow)
- Personal Access Token with `repo` permissions (for API access)

## Testing

Use the included test script to verify your integration:

```bash
export GITHUB_TOKEN="your_token_here"
export REPO_OWNER="your_username"
export REPO_NAME="merge-media"
./test-integration.sh
```

## License

This project is open source and available under the MIT License.
