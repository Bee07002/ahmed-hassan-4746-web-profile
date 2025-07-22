const express = require('express');
const cors = require('cors');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to yt-dlp executable
const YT_DLP_PATH = path.join(__dirname, '../yt-dlp');

// Endpoint to extract video information
app.post('/api/extract-info', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Use yt-dlp to get video information
    const ytDlp = spawn(YT_DLP_PATH, [
      '--dump-json',
      '--no-playlist',
      url
    ]);

    let stdout = '';
    let stderr = '';

    ytDlp.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ytDlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytDlp.on('close', (code) => {
      if (code !== 0) {
        console.error('yt-dlp error:', stderr);
        return res.status(400).json({ error: 'Failed to extract video information' });
      }

      try {
        const videoInfo = JSON.parse(stdout);
        
        // Extract relevant information
        const response = {
          title: videoInfo.title,
          duration: videoInfo.duration,
          thumbnail: videoInfo.thumbnail,
          formats: videoInfo.formats || [],
          uploader: videoInfo.uploader,
          view_count: videoInfo.view_count
        };

        // Filter and organize formats
        const videoFormats = videoInfo.formats
          .filter(format => format.vcodec !== 'none' && format.acodec !== 'none')
          .map(format => ({
            format_id: format.format_id,
            ext: format.ext,
            resolution: format.resolution || `${format.width}x${format.height}`,
            filesize: format.filesize,
            quality: format.height || 0
          }))
          .sort((a, b) => b.quality - a.quality);

        const audioFormats = videoInfo.formats
          .filter(format => format.vcodec === 'none' && format.acodec !== 'none')
          .map(format => ({
            format_id: format.format_id,
            ext: format.ext,
            abr: format.abr,
            filesize: format.filesize
          }))
          .sort((a, b) => (b.abr || 0) - (a.abr || 0));

        response.video_formats = videoFormats;
        response.audio_formats = audioFormats;

        res.json(response);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse video information' });
      }
    });

  } catch (error) {
    console.error('Extract info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to download video/audio
app.post('/api/download', (req, res) => {
  const { url, format_id, type } = req.body;
  
  if (!url || !format_id || !type) {
    return res.status(400).json({ error: 'URL, format_id, and type are required' });
  }

  try {
    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment');

    // Prepare yt-dlp arguments
    const args = [
      '--format', format_id,
      '--output', '-',
      url
    ];

    if (type === 'audio') {
      args.push('--extract-audio');
      args.push('--audio-format', 'mp3');
    }

    const ytDlp = spawn(YT_DLP_PATH, args);

    // Stream the output directly to the response
    ytDlp.stdout.pipe(res);

    ytDlp.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString());
    });

    ytDlp.on('error', (error) => {
      console.error('yt-dlp spawn error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

    ytDlp.on('close', (code) => {
      if (code !== 0) {
        console.error('yt-dlp exited with code:', code);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SnapFetch API is running' });
});

app.listen(PORT, () => {
  console.log(`SnapFetch backend server running on port ${PORT}`);
});