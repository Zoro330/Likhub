import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { inventionsService, forumService, cloudinaryService } from "../services/api";

const CreatePost = ({ onPostCreated, onClose }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    destination: 'inventions' // Default to inventions
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    // Only require image for inventions posts
    if (formData.destination === "inventions" && !formData.image) {
      newErrors.image = "An image is required for inventions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrors(prev => ({ ...prev, image: null }));
    
    try {
      const imageUrl = await cloudinaryService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("❌ Error uploading image:", error.message);
      setErrors(prev => ({ ...prev, image: error.message || "Failed to upload image. Please try again." }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        setErrors(prev => ({ ...prev, submit: "Please log in to create a post" }));
        return;
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        userId: user._id,
        userName: user.userName || user.name,
        userProfilePic: user.profilePic || ""
      };

      // Only include image if it exists
      if (formData.image) {
        postData.image = formData.image;
      }

      console.log(`Attempting to create ${formData.destination} post with data:`, postData);

      let data;
      try {
        if (formData.destination === "inventions") {
          data = await inventionsService.createInvention(postData);
        } else {
          data = await forumService.createPost(postData);
        }
      } catch (apiError) {
        console.error(`API error creating ${formData.destination}:`, apiError);
        throw new Error(`Failed to create ${formData.destination} post: ${apiError.message}`);
      }

      console.log("Post created successfully:", data);
      onPostCreated();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: null,
        destination: 'inventions'
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating post:", error);
      setErrors(prev => ({ ...prev, submit: error.message || "Error creating post. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {formData.destination === "inventions" ? "Create New Invention Post" : "Create New Forum Post"}
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.destinationSelector}>
          <label style={styles.destinationLabel}>Post to:</label>
          <div style={styles.destinationButtons}>
            <button
              type="button"
              style={{
                ...styles.destinationButton,
                backgroundColor: formData.destination === "inventions" ? "#007bff" : "#f8f9fa",
                color: formData.destination === "inventions" ? "#fff" : "#666"
              }}
              onClick={() => setFormData({ ...formData, destination: "inventions" })}
            >
              Inventions
            </button>
            <button
              type="button"
              style={{
                ...styles.destinationButton,
                backgroundColor: formData.destination === "forum" ? "#007bff" : "#f8f9fa",
                color: formData.destination === "forum" ? "#fff" : "#666"
              }}
              onClick={() => setFormData({ ...formData, destination: "forum" })}
            >
              Forum
            </button>
          </div>
        </div>
        <div style={styles.editorContainer}>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors(prev => ({ ...prev, title: null }));
            }}
            style={{
              ...styles.titleInput,
              borderColor: errors.title ? '#dc3545' : '#ddd'
            }}
          />
          {errors.title && <div style={styles.errorMessage}>{errors.title}</div>}
          
          <textarea
            placeholder="Description.."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors(prev => ({ ...prev, description: null }));
            }}
            style={{
              ...styles.descriptionInput,
              borderColor: errors.description ? '#dc3545' : '#ddd'
            }}
          />
          {errors.description && <div style={styles.errorMessage}>{errors.description}</div>}
          
          <div style={styles.uploadSection}>
            <label style={styles.uploadButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
              />
              <img src="/images/image-icon.png" alt="Upload" style={styles.uploadIcon} />
              <span style={styles.uploadText}>Add image</span>
            </label>
          </div>
          {errors.image && <div style={styles.errorMessage}>{errors.image}</div>}
          
          {formData.image && (
            <div style={styles.imagePreviewContainer}>
              <img src={formData.image} alt="Preview" style={styles.imagePreview} />
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, image: null });
                  setErrors(prev => ({ ...prev, image: null }));
                }}
                style={styles.removeImageButton}
              >
                ×
              </button>
            </div>
          )}
        </div>
        {errors.submit && <div style={styles.errorMessage}>{errors.submit}</div>}
        <div style={styles.actionBar}>
          <div style={styles.postButtons}>
            <button 
              type="button" 
              onClick={onClose}
              style={styles.discardButton}
            >
              Discard
            </button>
            <button 
              type="submit"
              style={styles.postButton}
              disabled={isUploading || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#007bff',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  editorContainer: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  titleInput: {
    width: '100%',
    padding: '20px',
    fontSize: '24px',
    border: 'none',
    borderBottom: '1px solid #eee',
    outline: 'none',
    color: '#333',
    '::placeholder': {
      color: '#999',
    },
  },
  descriptionInput: {
    width: '100%',
    minHeight: '300px',
    padding: '20px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    color: '#666',
    '::placeholder': {
      color: '#999',
    },
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '20px',
  },
  postButtons: {
    display: 'flex',
    gap: '12px',
    marginLeft: 'auto',
  },
  discardButton: {
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  postButton: {
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#333',
    },
  },
  imagePreviewContainer: {
    position: 'relative',
    padding: '20px',
    borderTop: '1px solid #eee',
  },
  imagePreview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  removeImageButton: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(0, 0, 0, 0.7)',
    },
  },
  uploadSection: {
    display: 'flex',
    padding: '12px 20px',
    borderTop: '1px solid #eee',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #eee',
    ':hover': {
      backgroundColor: '#e9ecef',
      borderColor: '#007bff',
    },
  },
  uploadIcon: {
    width: '18px',
    height: '18px',
    objectFit: 'contain',
  },
  uploadText: {
    color: '#666',
    fontSize: '14px',
  },
  fileInput: {
    display: 'none',
  },
  destinationSelector: {
    marginBottom: '20px',
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
  },
  destinationLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    display: 'block',
  },
  destinationButtons: {
    display: 'flex',
    gap: '12px',
  },
  destinationButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #eee',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  errorMessage: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '4px',
    marginLeft: '20px',
    marginRight: '20px',
    padding: '8px 12px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    animation: 'fadeIn 0.3s ease',
  },
};

export default CreatePost;
