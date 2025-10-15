import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import VideoComponent from "../components/VideoComponent";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import { PostApi } from "../ApiClient/PostApi";
import { FaVideo, FaCloudUploadAlt, FaTrash, FaPlay } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";


export default function VideoUploadDemo() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const { apiData, reFetch } = useFetch("/admin/uploadedVideo");
  console.log(apiData?.data?.video)

  // Handle video selection from VideoComponent
  const handleVideoSelect = (videoFile) => {
    setSelectedVideo(videoFile);
    console.log("Selected video:", videoFile);
  };

  // Handle video upload (similar to WriterManagement upload pattern)
  const handleVideoUpload = async () => {
    if (!selectedVideo) {
      error_toaster("Please select a video first");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData object (following the same pattern as WriterManagement)
      const formData = new FormData();
      formData.append("video", selectedVideo);
      formData.append("title", `Video_${Date.now()}`);
      formData.append("description", "Uploaded video file");

      // This would be your actual API endpoint
      const res = await PostApi("/admin/uploadVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // For demo purposes, simulate a successful upload
      setTimeout(() => {
        const newVideo = {
          id: Date.now(),
          name: selectedVideo.name,
          size: selectedVideo.size,
          type: selectedVideo.type,
          url: URL.createObjectURL(selectedVideo),
          uploadDate: new Date().toLocaleString()
        };

        setUploadedVideos(prev => [newVideo, ...prev]);
        success_toaster("Video uploaded successfully!");
        setSelectedVideo(null);
        setIsUploading(false);
      }, 2000);


      if (res?.data?.status === "1") {
        success_toaster("Video uploaded successfully");
        setUploadedVideos(prev => [res.data.video, ...prev]);
        setSelectedVideo(null);
        reFetch();
      } else {
        error_toaster(res?.data?.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      error_toaster("Error uploading video");
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = (videoId) => {
    setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
    success_toaster("Video deleted successfully");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Video Upload Demo</h4>
              <h6>Upload and manage video files (Max 5MB)</h6>
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaVideo className="me-2" />
                Upload Video
              </h5>
            </div>
            <div className="card-body">
              <VideoComponent
                onVideoSelect={handleVideoSelect}
                maxSizeMB={5}
              />

              {selectedVideo && (
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleVideoUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="me-2" />
                        Upload Video
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedVideo(null)}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Videos List */}
          <div className="card">
            <div className="card-header">

            </div>
            <div className="card-body">
              {!apiData?.data?.video ? (
                <div className="text-center py-4">
                  <FaPlay style={{ fontSize: '3rem', color: '#6c757d' }} />
                  <h6 className="mt-3 text-muted">No videos uploaded yet</h6>
                  <p className="text-muted">Upload your first video using the form above</p>
                </div>
              ) : (
                <div className="row">

                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <video
                        src={apiData?.data?.video?.video}
                        controls
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      >
                        Your browser does not support the video tag.
                      </video>

                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}