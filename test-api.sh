#!/bin/bash

# Test script to verify GitHub API access and repository dispatch
# Usage: ./test-api.sh YOUR_GITHUB_TOKEN

if [ -z "$1" ]; then
    echo "Usage: $0 <github_token>"
    echo "Example: $0 ghp_your_token_here"
    exit 1
fi

TOKEN="$1"
REPO="agnaousa/merge-media"

echo "Testing GitHub API access..."
echo "Repository: $REPO"
echo "Token (first 10 chars): ${TOKEN:0:10}..."

echo ""
echo "1. Testing authentication and repo access:"
curl -s -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/$REPO" | jq -r '.name // .message'

echo ""
echo "2. Testing repository dispatch API call:"
curl -s -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Content-Type: application/json" \
     -d '{
       "event_type": "merge-media",
       "client_payload": {
         "video_path": "input/video.mp4",
         "audio_path": "input/audio.mp3",
         "output_path": "output/test_merge.mp4",
         "audio_handling": "replace",
         "return_url": "true"
       }
     }' \
     "https://api.github.com/repos/$REPO/dispatches"

echo ""
echo "3. Checking recent workflow runs:"
curl -s -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/$REPO/actions/runs?per_page=3" | \
     jq -r '.workflow_runs[]? | "\(.created_at) - \(.name) - \(.conclusion // "running")"'
