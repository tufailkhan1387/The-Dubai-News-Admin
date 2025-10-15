import React, { useState } from "react";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import { FaVideo, FaTrash, FaCheckCircle, FaCloudUploadAlt } from "react-icons/fa";
import { MdPlayCircleFilled } from "react-icons/md";

export default function VideoComponent({ onVideoSelect, maxSizeMB = 5 }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Convert MB to bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      error_toaster("Please select a valid video file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > maxSizeBytes) {
      error_toaster(`File size must be less than ${maxSizeMB}MB. Current file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // Set the selected video
    setSelectedVideo(file);
    
    // Create preview URL
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
    
    // Call parent callback if provided
    if (onVideoSelect) {
      onVideoSelect(file);
    }

    success_toaster("Video selected successfully");
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setUploadProgress(0);
    
    // Clean up the URL to prevent memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    // Reset file input
    const fileInput = document.getElementById('video-upload-input');
    if (fileInput) {
      fileInput.value = '';
    }

    if (onVideoSelect) {
      onVideoSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-component">
      <div className="mb-3">
        <label className="form-label">
          Video Upload <span className="text-muted">(Max {maxSizeMB}MB)</span>
        </label>
        
        {!selectedVideo ? (
          <div 
            className="upload-area border-2 border-dashed rounded p-4 text-center"
            style={{ 
              borderColor: '#dee2e6',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#007bff';
              e.currentTarget.style.backgroundColor = '#e3f2fd';
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#dee2e6';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#dee2e6';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                const fakeEvent = { target: { files } };
                handleVideoChange(fakeEvent);
              }
            }}
            onClick={() => document.getElementById('video-upload-input').click()}
          >
            <div className="mb-3">
              <FaVideo style={{ fontSize: '3rem', color: '#6c757d' }} />
            </div>
            <h6 className="mb-2">Drop your video here, or click to browse</h6>
            <p className="text-muted mb-0">
              Supports: MP4, AVI, MOV, WMV, FLV<br/>
              Maximum file size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="video-preview-container border rounded p-3">
            <div className="row align-items-center">
              <div className="col-md-6">
                {videoPreview && (
                  <video 
                    src={videoPreview} 
                    controls 
                    className="w-100 rounded"
                    style={{ maxHeight: '200px' }}
                    onLoadedMetadata={(e) => {
                      const duration = e.target.duration;
                      console.log('Video duration:', formatDuration(duration));
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="col-md-6">
                <div className="video-info">
                  <h6 className="mb-2">
                    <MdPlayCircleFilled className="me-2" />
                    {selectedVideo.name}
                  </h6>
                  <p className="text-muted mb-1">
                    <strong>Size:</strong> {formatFileSize(selectedVideo.size)}
                  </p>
                  <p className="text-muted mb-1">
                    <strong>Type:</strong> {selectedVideo.type}
                  </p>
                  <p className="text-muted mb-3">
                    <strong>Last Modified:</strong> {new Date(selectedVideo.lastModified).toLocaleDateString()}
                  </p>
                  
                  {isUploading && (
                    <div className="mb-3">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        >
                          {uploadProgress}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleRemoveVideo}
                    disabled={isUploading}
                  >
                    <FaTrash className="me-1" />
                    Remove Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <input
          id="video-upload-input"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Status */}
      {selectedVideo && (
        <div className="upload-status mt-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success">
              <FaCheckCircle className="me-1" />
              Video Ready
            </span>
            <small className="text-muted">
              {formatFileSize(selectedVideo.size)} of {maxSizeMB}MB allowed
            </small>
          </div>
        </div>
      )}
    </div>
  );
}