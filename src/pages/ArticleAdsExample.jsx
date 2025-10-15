import React, { useState } from "react";
import VideoComponent from "../components/VideoComponent";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import { PostApi } from "../ApiClient/PostApi";

// Example component showing how to integrate VideoComponent into your existing forms
export default function ArticleAdsExample() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle video selection from VideoComponent
  const handleVideoSelect = (videoFile) => {
    setFormData(prev => ({
      ...prev,
      videoFile: videoFile
    }));
  };

  // Handle other form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission with video
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      error_toaster("Please fill in all required fields");
      return;
    }

    if (!formData.videoFile) {
      error_toaster("Please select a video file");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for upload (following the same pattern as WriterManagement)
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("video", formData.videoFile);

      // Replace this with your actual API endpoint
      // const response = await PostApi("/api/article-ads", formDataToSend, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // For demo purposes, simulate successful submission
      setTimeout(() => {
        success_toaster("Article with video saved successfully!");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          videoFile: null,
        });
        
        setIsSubmitting(false);
      }, 1500);

      // Uncomment when you have real API
      // if (response?.data?.status === "1") {
      //   success_toaster("Article ads saved successfully!");
      //   // Reset form or redirect
      // } else {
      //   error_toaster(response?.data?.message || "Failed to save article ads");
      // }

    } catch (error) {
      console.error("Submission error:", error);
      error_toaster("Error saving article ads");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Article Ads with Video</h5>
              <p className="text-muted mb-0">Example of integrating VideoComponent into your forms</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter article title"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Video Upload Component */}
                <VideoComponent 
                  onVideoSelect={handleVideoSelect}
                  maxSizeMB={5}
                />

                {/* Form Actions */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setFormData({
                        title: "",
                        description: "",
                        videoFile: null,
                      });
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Article Ads"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="card-title mb-0">How to Use VideoComponent</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Basic Usage:</h6>
                  <pre className="bg-light p-3 rounded">
{`<VideoComponent 
  onVideoSelect={handleVideoSelect}
  maxSizeMB={5}
/>`}
                  </pre>
                </div>
                <div className="col-md-6">
                  <h6>Props:</h6>
                  <ul className="list-unstyled">
                    <li><strong>onVideoSelect:</strong> Callback function called when video is selected</li>
                    <li><strong>maxSizeMB:</strong> Maximum file size in MB (default: 5)</li>
                  </ul>
                  
                  <h6 className="mt-3">Features:</h6>
                  <ul className="list-unstyled">
                    <li>✅ 5MB file size limit</li>
                    <li>✅ Video format validation</li>
                    <li>✅ Drag & drop support</li>
                    <li>✅ Video preview</li>
                    <li>✅ File information display</li>
                    <li>✅ Progress indication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}