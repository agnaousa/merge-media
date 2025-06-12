# Merge Media Workflow

A GitHub Actions workflow for merging audio and video files with support for background sound, captions, and AI-generated speech.

## Features

- 🎥 Merge video with audio tracks
- 🤖 **NEW: Generate speech from text using ElevenLabs TTS**
- 🎵 Add background sound/music
- 📝 Add text captions with customizable styling and positioning
- 🔄 Multiple audio handling modes (replace, mix, keep original)
- 📤 Support for URLs and base64 encoded files
- 🧹 Automatic cleanup of old files

## Usage

1. Go to the **Actions** tab in your repository
2. Select **Merge Audio and Video with Background Sound & Captions**
3. Click **Run workflow**
4. Fill in the parameters:

### Basic Parameters

- **Video Path**: Path to video file or URL
- **Audio Path**: Path to audio file or URL (ignored if using TTS or base64)
- **Audio Base64**: Base64 encoded audio data (for direct uploads)
- **Output Path**: Where to save the merged file

### 🤖 ElevenLabs TTS (Text-to-Speech) - NEW!

Generate high-quality speech from text using ElevenLabs AI:

- **TTS Text**: Text to convert to speech (takes priority over audio files when provided)
- **Voice ID**: ElevenLabs voice ID (default: `BtWabtumIemAotTjP5sk`)
- **Model**: AI model to use (default: `eleven_flash_v2_5`)
- **API Key**: Your ElevenLabs API key (**required** when using TTS)

**Audio Priority Order:**
1. **TTS-generated audio** (highest priority)
2. Base64 encoded audio
3. URL-based audio download
4. Local file path

### Audio Handling Options

- **replace**: Replace video's original audio with new audio
- **mix**: Mix video's original audio with new audio
- **keep_video**: Keep only the video's original audio

### Background Sound (Optional)

- **Background Sound Path**: Path to background music file or URL
- **Background Sound Base64**: Base64 encoded background sound
- **Background Volume**: Volume level (0.0 to 1.0, default: 0.3)

### Captions (Optional)

- **Caption Text**: Text to display on video
- **Caption Style**: FFmpeg drawtext style options (default: white text with black box)
- **Caption Position**: Where to place captions (9 positions available)

## Caption Positions

- `top_left`, `top_center`, `top_right`
- `center_left`, `center`, `center_right`
- `bottom_left`, `bottom_center`, `bottom_right`

## Caption Styling

Default style: `fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5`

You can customize with FFmpeg drawtext options:
- `fontsize=30` - Font size
- `fontcolor=yellow` - Text color
- `box=1` - Enable background box
- `boxcolor=blue@0.7` - Box color with transparency
- `fontfile=/path/to/font.ttf` - Custom font (if available)

## Examples

### Basic Video + Audio Merge
- Video: `input/video.mp4`
- Audio: `input/audio.mp3`
- Audio Handling: `replace`

### 🤖 AI-Generated Speech (TTS)
- Video: `input/video.mp4`
- TTS Text: `Welcome to our comprehensive tutorial on artificial intelligence!`
- Voice ID: `BtWabtumIemAotTjP5sk`
- Model: `eleven_flash_v2_5`
- API Key: `sk_your_elevenlabs_api_key_here`
- Audio Handling: `replace`

### TTS + Background Music
- Video: `input/video.mp4`
- TTS Text: `Learn about machine learning in this exciting video series.`
- Voice ID: `BtWabtumIemAotTjP5sk`
- API Key: `sk_your_elevenlabs_api_key_here`
- Background Sound: `input/ambient-music.mp3`
- Background Volume: `0.15`
- Audio Handling: `replace`

### With Background Music
- Video: `input/video.mp4`
- Audio: `input/narration.mp3`
- Background Sound: `input/music.mp3`
- Background Volume: `0.2`
- Audio Handling: `replace`

### With Captions
- Video: `input/video.mp4`
- Audio: `input/audio.mp3`
- Caption Text: `Welcome to our tutorial!`
- Caption Position: `bottom_center`
- Caption Style: `fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.8`

### Full Featured Example with TTS
- Video: `https://example.com/video.mp4`
- TTS Text: `Discover the future of technology with our innovative solutions!`
- Voice ID: `BtWabtumIemAotTjP5sk`
- Model: `eleven_flash_v2_5`
- API Key: `sk_your_elevenlabs_api_key_here`
- Background Sound: `https://example.com/background.mp3`
- Background Volume: `0.25`
- Caption Text: `Learn something new today!`
- Caption Position: `top_center`
- Audio Handling: `replace`

### Traditional Full Featured Example
- Video: `https://example.com/video.mp4`
- Audio: [base64 encoded audio]
- Background Sound: `https://example.com/background.mp3`
- Background Volume: `0.25`
- Caption Text: `Learn something new today!`
- Caption Position: `top_center`
- Audio Handling: `mix`

## Output

The workflow will:
1. **Generate AI speech** (if TTS text provided) or process audio files
2. Process your media files
3. Generate a unique filename with timestamp
4. Upload the result as an artifact
5. Commit the file to your repository
6. Provide direct download URLs
7. Clean up temporary files and old outputs (30+ days)

## File Support

### Video Formats
- MP4, AVI, MOV, MKV, WebM, FLV

### Audio Formats
- MP3, WAV, AAC, OGG, M4A, FLAC

### TTS Voices
- Supports all ElevenLabs voice IDs
- Default voice: `BtWabtumIemAotTjP5sk` (professional male voice)
- Default model: `eleven_flash_v2_5` (fast, high-quality generation)

## Notes

- **TTS audio takes priority** over other audio sources when text is provided
- Background sound automatically loops to match the main audio duration
- Captions support basic text styling through FFmpeg drawtext filter
- Old output files are automatically cleaned up after 30 days
- All processing is done server-side using FFmpeg
- **ElevenLabs API key is required** for TTS functionality
- TTS-generated audio is cached during workflow execution
