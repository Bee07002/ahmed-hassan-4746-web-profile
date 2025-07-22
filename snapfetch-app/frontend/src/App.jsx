import { useState } from 'react';
import { Download, Play, Music, Loader2, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(null);

  const extractVideoInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a valid video URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/extract-info`, {
        url: url.trim()
      });
      
      setVideoInfo(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract video information');
      setVideoInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadMedia = async (formatId, type, title, resolution = '') => {
    try {
      setDownloadProgress({
        filename: `${title}${resolution ? `_${resolution}` : ''}.${type === 'audio' ? 'mp3' : 'mp4'}`,
        progress: 0,
        speed: '0 MB/s',
        eta: 'Calculating...'
      });

      const response = await axios.post(`${API_BASE_URL}/download`, {
        url: url.trim(),
        format_id: formatId,
        type: type
      }, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const speed = (progressEvent.loaded / 1024 / 1024).toFixed(1); // MB
            
            setDownloadProgress(prev => ({
              ...prev,
              progress: percentCompleted,
              speed: `${speed} MB/s`,
              eta: percentCompleted < 100 ? `${Math.round((100 - percentCompleted) / 10)}s` : 'Complete'
            }));
          }
        }
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}${resolution ? `_${resolution}` : ''}.${type === 'audio' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      // Clear progress after a short delay
      setTimeout(() => {
        setDownloadProgress(null);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Download failed');
      setDownloadProgress(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen laser-bg">
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              📽️ SnapFetch
            </h1>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Welcome to SnapFetch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Download videos and audio from YouTube, TikTok, Instagram, and Facebook with ease
            </p>
          </div>

          {/* URL Input Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && extractVideoInfo()}
                />
              </div>
              <button
                onClick={extractVideoInfo}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Extract Info
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Video Information */}
          {videoInfo && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {videoInfo.thumbnail && (
                  <div className="md:w-1/3">
                    <img
                      src={videoInfo.thumbnail}
                      alt="Video thumbnail"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {videoInfo.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <span className="font-semibold">Duration:</span> {formatDuration(videoInfo.duration)}
                    </div>
                    <div>
                      <span className="font-semibold">Uploader:</span> {videoInfo.uploader}
                    </div>
                    {videoInfo.view_count && (
                      <div>
                        <span className="font-semibold">Views:</span> {videoInfo.view_count.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Options */}
          {videoInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Downloads */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-6 h-6 text-blue-400" />
                  Video (MP4)
                </h4>
                <div className="space-y-3">
                  {videoInfo.video_formats?.slice(0, 5).map((format, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <div>
                        <div className="font-semibold text-white">
                          {format.resolution || `${format.quality}p`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatFileSize(format.filesize)}
                        </div>
                      </div>
                      <button
                        onClick={() => downloadMedia(format.format_id, 'video', videoInfo.title, format.resolution)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Downloads */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-6 h-6 text-green-400" />
                  Audio (MP3)
                </h4>
                <div className="space-y-3">
                  {videoInfo.audio_formats?.slice(0, 3).map((format, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <div>
                        <div className="font-semibold text-white">
                          {format.abr ? `${format.abr} kbps` : 'Best Quality'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatFileSize(format.filesize)}
                        </div>
                      </div>
                      <button
                        onClick={() => downloadMedia(format.format_id, 'audio', videoInfo.title)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download Progress */}
          {downloadProgress && (
            <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 shadow-2xl border border-gray-600 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Downloading</span>
              </div>
              <div className="text-sm text-gray-300 mb-2 truncate">
                {downloadProgress.filename}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{downloadProgress.progress}%</span>
                <span>{downloadProgress.eta}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            <p className="text-gray-400">
              SnapFetch - Made with ❤️ for seamless video downloads
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
