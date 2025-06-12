# How to Use This Audio/Video Merger with TTS, Background Sound & Captions in Make.com

This guide explains how to integrate the GitHub Actions workflow for merging audio and video files with **ElevenLabs Text-to-Speech**, background sound, and caption support using Make.com scenarios.

## 🆕 New Features

- **🤖 ElevenLabs TTS Integration**: Generate high-quality speech from text
- **🎵 Background Sound Control**: Add ambient music with volume control  
- **📝 Dynamic Captions**: Customizable text overlays with positioning
- **🔄 Smart Audio Priority**: TTS → Base64 → URL → Local file

## Overview

This workflow can:
- **Generate AI speech** from text using ElevenLabs TTS
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
3. **ElevenLabs API key** (for TTS functionality)
4. Make.com account

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

## 🤖 TTS Examples

### Example 1: Basic TTS Video Generation
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://your-video-url.com/video.mp4",
    "elevenlabs_config": "{\"text\":\"Welcome to our comprehensive tutorial on artificial intelligence and machine learning.\",\"voice_id\":\"BtWabtumIemAotTjP5sk\",\"model\":\"eleven_flash_v2_5\",\"api_key\":\"sk_your_elevenlabs_api_key_here\"}",
    "output_path": "output/ai_tutorial.mp4",
    "audio_handling": "replace"
  }
}
```

### Example 2: TTS + Background Music + Captions
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://your-video-url.com/video.mp4",
    "elevenlabs_config": "{\"text\":\"Discover the future of technology with our innovative AI solutions that will transform your business.\",\"voice_id\":\"BtWabtumIemAotTjP5sk\",\"model\":\"eleven_flash_v2_5\",\"api_key\":\"sk_your_elevenlabs_api_key_here\"}",
    "background_sound_config": "{\"path\":\"https://your-music-url.com/ambient.mp3\",\"base64\":\"\",\"volume\":\"0.15\"}",
    "caption_config": "{\"text\":\"AI Innovation 2025\",\"style\":\"fontsize=32:fontcolor=ffffff:box=1:boxcolor=000000@0.8:boxborderw=2\",\"position\":\"top_center\"}",
    "output_path": "output/ai_promo.mp4",
    "audio_handling": "replace"
  }
}
```

### Example 3: Traditional Audio (No TTS)
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "https://your-video-url.com/video.mp4",
    "audio_path": "https://your-audio-url.com/audio.mp3",
    "background_sound_config": "{\"path\":\"https://your-music-url.com/background.mp3\",\"base64\":\"\",\"volume\":\"0.3\"}",
    "caption_config": "{\"text\":\"Welcome to our tutorial!\",\"style\":\"fontsize=40:fontcolor=ffffff:box=1:boxcolor=000000@0.8:boxborderw=1\",\"position\":\"bottom_center\"}",
    "output_path": "output/merged.mp4",
    "audio_handling": "mix"
  }
}
```
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

#### Step 2: Configure Request Body with TTS
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "{{video_url_or_path}}",
    "elevenlabs_config": "{\"text\":\"{{tts_text_content}}\",\"voice_id\":\"{{voice_id_or_default}}\",\"model\":\"{{model_or_default}}\",\"api_key\":\"{{elevenlabs_api_key}}\"}",
    "audio_path": "{{fallback_audio_url}}",
    "audio_base64": "{{base64_audio_data}}",
    "background_sound_config": "{\"path\":\"{{background_music_url}}\",\"base64\":\"{{base64_background_data}}\",\"volume\":\"{{background_volume_level}}\"}",
    "caption_config": "{\"text\":\"{{caption_text}}\",\"style\":\"{{caption_style}}\",\"position\":\"{{caption_position}}\"}",
    "output_path": "output/{{output_filename}}.mp4",
    "audio_handling": "replace"
  }
}
```

## 🎯 Complete Input Parameters

### **🤖 ElevenLabs TTS Configuration (NEW)**
- `elevenlabs_config`: JSON string containing all TTS parameters:
  ```json
  {
    "text": "Text to convert to speech (takes priority over other audio)",
    "voice_id": "BtWabtumIemAotTjP5sk",
    "model": "eleven_flash_v2_5",
    "api_key": "sk_your_elevenlabs_api_key_here"
  }
  ```

### **📹 Core Parameters**
- `video_path`: URL to video file or local path (**required**)
- `output_path`: Where to save the merged file (**required**)
- `audio_path`: URL to audio file (ignored if TTS is used)
- `audio_base64`: Base64 encoded audio data
- `audio_handling`: `"replace"`, `"mix"`, or `"keep_video"`

### **🎵 Background Sound Configuration (JSON String)**
```json
{
  "path": "URL to background music file",
  "base64": "Base64 encoded background sound",
  "volume": "Volume level (0.0 to 1.0, default: 0.3)"
}
```

### **📝 Caption Configuration (JSON String)**
```json
{
  "text": "Text to display on the video",
  "style": "FFmpeg drawtext style options",
  "position": "Caption position (top_left, center, etc.)"
}
```

## 🎬 Advanced Make.com Scenarios

### Scenario 1: AI Content Creation Pipeline
```
Trigger: Webhook (content request)
↓
OpenAI: Generate script from topic
↓
Data Transformer: Prepare TTS text
↓
HTTP Module: Trigger GitHub workflow with TTS
↓
Delay: Wait for processing (2-5 minutes)
↓
GitHub: Check workflow status
↓
Slack: Send download link when complete
```

**Make.com HTTP Configuration:**
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "{{bundle.inputData.videoTemplate}}",
    "elevenlabs_config": "{\"text\":\"{{openai_generated_script}}\",\"voice_id\":\"BtWabtumIemAotTjP5sk\",\"model\":\"eleven_flash_v2_5\",\"api_key\":\"{{connection.elevenlabs_key}}\"}",
    "background_sound_config": "{\"path\":\"{{bundle.inputData.backgroundMusic}}\",\"volume\":\"0.2\"}",
    "caption_config": "{\"text\":\"{{bundle.inputData.title}}\",\"style\":\"fontsize=28:fontcolor=white:box=1:boxcolor=black@0.8\",\"position\":\"top_center\"}",
    "output_path": "output/ai_content_{{formatDate(now; 'YYYYMMDD_HHmmss')}}.mp4",
    "audio_handling": "replace"
  }
}
```

### Scenario 2: Multi-Language Video Generation
```
Trigger: Google Sheets (new row with content)
↓
Google Translate: Translate text to target language
↓
Text Processing: Select appropriate voice for language
↓
HTTP Module: Generate TTS video
↓
Google Drive: Save to language-specific folder
↓
Email: Notify content team
```

**Dynamic Voice Selection:**
```json
{
  "elevenlabs_config": "{\"text\":\"{{translated_text}}\",\"voice_id\":\"{{if(bundle.inputData.language = 'en'; 'BtWabtumIemAotTjP5sk'; if(bundle.inputData.language = 'es'; 'spanish_voice_id'; 'default_voice_id'))}}\",\"model\":\"eleven_flash_v2_5\",\"api_key\":\"{{connection.elevenlabs_key}}\"}"
}
```

### Scenario 3: E-Learning Content Automation
```
Trigger: Airtable (new lesson record)
↓
Airtable: Get lesson details
↓
HTTP Module: Download lesson template video
↓
Text Processing: Format lesson script
↓
HTTP Module: Generate TTS lesson video
↓
Vimeo: Upload processed video
↓
Airtable: Update record with video link
```

**Lesson Video Configuration:**
```json
{
  "ref": "main",
  "inputs": {
    "video_path": "{{bundle.lesson.template_video_url}}",
    "elevenlabs_config": "{\"text\":\"{{bundle.lesson.full_script}}\",\"voice_id\":\"{{bundle.lesson.instructor_voice_id}}\",\"model\":\"eleven_flash_v2_5\",\"api_key\":\"{{connection.elevenlabs_key}}\"}",
    "background_sound_config": "{\"path\":\"{{bundle.lesson.background_music}}\",\"volume\":\"0.15\"}",
    "caption_config": "{\"text\":\"{{bundle.lesson.title}} - {{bundle.lesson.chapter}}\",\"style\":\"fontsize=24:fontcolor=white:box=1:boxcolor=blue@0.8\",\"position\":\"bottom_center\"}",
    "output_path": "output/lesson_{{bundle.lesson.id}}_{{formatDate(now; 'YYYYMMDD')}}.mp4",
    "audio_handling": "replace"
  }
}
```

### Scenario 4: Social Media Content with Brand Voice
```
Trigger: Instagram (new post idea)
↓
ChatGPT: Generate engaging script
↓
HTTP Module: Create branded video with TTS
↓
Image Processing: Generate thumbnail
↓
Multiple Social Platforms: Cross-post content
```

**Branded Content Configuration:**
```json
{
  "elevenlabs_tts_text": "{{chatgpt_generated_script}}",
  "elevenlabs_voice_id": "{{company_brand_voice_id}}",
  "background_sound_config": "{\"path\":\"{{brand_background_music}}\",\"volume\":\"0.25\"}",
  "caption_config": "{\"text\":\"{{company_name}} - {{formatDate(now; 'MMM YYYY')}}\",\"style\":\"fontsize=20:fontcolor=#FF6B35:box=1:boxcolor=#FFFFFF@0.9\",\"position\":\"bottom_right\"}"
}
```

## 🔧 Advanced Make.com Functions

### Dynamic TTS Text Generation
```javascript
// In Make.com Text Processing Module
const script = `
Welcome to ${bundle.inputData.companyName}! 
Today we're excited to share ${bundle.inputData.productName}, 
which ${bundle.inputData.productDescription}. 
This ${bundle.inputData.contentType} will show you exactly how to get started.
`;

return {
  tts_text: script,
  duration_estimate: Math.ceil(script.length / 10) // rough estimate
}
```

### Voice Selection Logic
```javascript
// Voice selection based on content type
const voiceMap = {
  'professional': 'BtWabtumIemAotTjP5sk',
  'friendly': 'friendly_voice_id',
  'energetic': 'energetic_voice_id',
  'calm': 'calm_voice_id'
};

return {
  voice_id: voiceMap[bundle.inputData.tone] || 'BtWabtumIemAotTjP5sk'
}
```

### Dynamic Background Music Selection
```javascript
// Background music based on video type
const musicMap = {
  'tutorial': 'https://assets.example.com/calm-tutorial.mp3',
  'promotional': 'https://assets.example.com/upbeat-promo.mp3',
  'corporate': 'https://assets.example.com/professional-bg.mp3'
};

const volumeMap = {
  'tutorial': '0.15',  // Low volume for voice content
  'promotional': '0.4', // Higher volume for energy
  'corporate': '0.2'   // Moderate volume
};

return {
  background_config: JSON.stringify({
    path: musicMap[bundle.inputData.videoType],
    volume: volumeMap[bundle.inputData.videoType]
  })
}
```

## 📊 Workflow Monitoring and Results

### Check Workflow Status
```
Module: HTTP > Make a Request
URL: https://api.github.com/repos/agnaousa/merge-media/actions/runs
Method: GET
Headers: Authorization: Bearer {token}
Query Parameters:
  - workflow_id: merge-media.yml
  - per_page: 10
  - sort: created
  - direction: desc
```

### Get Processing Results
Once completed, check for:
- **Artifact Download URL**: For immediate access
- **Repository File URL**: For permanent storage
- **Raw File URL**: For direct embedding
- **Processing Logs**: For debugging

## 🚨 Error Handling & Troubleshooting

### Common TTS Issues
1. **Invalid API Key**: Verify ElevenLabs API key
2. **Voice ID Not Found**: Check voice ID exists in your account
3. **Text Too Long**: ElevenLabs has character limits
4. **Rate Limiting**: Implement delays between requests

### Make.com Error Handler Setup
```
Error Handler Module
↓
Condition: Check error type
  - 401: API key issue → Send admin alert
  - 422: Invalid parameters → Log and retry
  - 429: Rate limit → Wait and retry
  - 500: Server error → Escalate to support
↓
Response Action: Notify user with appropriate message
```

## 💡 Sample Complete Make.com Scenario

Here's a complete Make.com scenario template for TTS video generation:

```json
{
  "name": "AI Video Generator with TTS",
  "modules": [
    {
      "id": 1,
      "module": "webhook",
      "type": "trigger",
      "data": {
        "webhook_name": "video_generation_request"
      }
    },
    {
      "id": 2,
      "module": "text-parser",
      "data": {
        "text": "{{1.data.script}}",
        "max_length": 5000
      }
    },
    {
      "id": 3,
      "module": "http",
      "data": {
        "url": "https://api.github.com/repos/agnaousa/merge-media/actions/workflows/merge-media.yml/dispatches",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{connection.github_token}}",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        "body": {
          "ref": "main",
          "inputs": {
            "video_path": "{{1.data.video_url}}",
            "elevenlabs_tts_text": "{{2.parsed_text}}",
            "elevenlabs_voice_id": "{{1.data.voice_id}}",
            "elevenlabs_model": "eleven_flash_v2_5",
            "elevenlabs_api_key": "{{connection.elevenlabs_key}}",
            "background_sound_config": "{{1.data.background_config}}",
            "caption_config": "{{1.data.caption_config}}",
            "output_path": "output/generated_{{formatDate(now; 'YYYYMMDD_HHmmss')}}.mp4",
            "audio_handling": "replace"
          }
        }
      }
    },
    {
      "id": 4,
      "module": "tools-sleep",
      "data": {
        "delay": 180
      }
    },
    {
      "id": 5,
      "module": "http",
      "data": {
        "url": "https://api.github.com/repos/agnaousa/merge-media/actions/runs",
        "method": "GET",
        "headers": {
          "Authorization": "Bearer {{connection.github_token}}"
        }
      }
    },
    {
      "id": 6,
      "module": "email",
      "data": {
        "to": "{{1.data.email}}",
        "subject": "Your AI video is ready!",
        "html": "Your video has been processed successfully. Download it here: {{5.data.download_url}}"
      }
    }
  ]
}
```

This comprehensive integration allows you to leverage both GitHub's computing power and ElevenLabs' AI voice generation within Make.com's flexible automation platform, creating a powerful pipeline for automated video content creation.
