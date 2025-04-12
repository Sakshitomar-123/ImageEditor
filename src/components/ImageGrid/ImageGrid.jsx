// components/ImageGrid/ImageGrid.jsx
import React, { memo, useState, useEffect, useRef } from 'react';
import './ImageGrid.css';

function ImageGrid({ images, loading, error, onSelectImage }) {
  // Keep a reference to previously loaded images
  const [loadedImages, setLoadedImages] = useState({});
  const prevImagesRef = useRef([]);
  
  // Track which images have been loaded already
  useEffect(() => {
    // Only update image cache when the image array changes
    if (images !== prevImagesRef.current) {
      const newLoadedImages = { ...loadedImages };
      
      // Add any new images to our cache
      images.forEach(image => {
        if (!newLoadedImages[image.id]) {
          newLoadedImages[image.id] = {
            loaded: false,
            url: image.urls.small
          };
        }
      });
      
      setLoadedImages(newLoadedImages);
      prevImagesRef.current = images;
    }
  }, [images]);
  
  // Handle image load event
  const handleImageLoaded = (imageId) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageId]: {
        ...prev[imageId],
        loaded: true
      }
    }));
  };
  
  if (loading) {
    return <div className="loading">Loading images...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (images.length === 0) {
    return <div className="no-results">No images to display. Try searching for something!</div>;
  }
  
  return (
    <div className="image-grid">
      {images.map((image) => {
        const imageCache = loadedImages[image.id];
        
        return (
          <div key={image.id} className="image-card">
            <div className="image-container">
              {(!imageCache || !imageCache.loaded) && (
                <div className="image-placeholder">Loading...</div>
              )}
              <img
                src={image.urls.small}
                alt={image.alt_description || 'Unsplash image'}
                className={`image-thumbnail ${imageCache?.loaded ? 'loaded' : 'loading'}`}
                loading="lazy"
                onLoad={() => handleImageLoaded(image.id)}
                style={{ display: imageCache?.loaded ? 'block' : 'none' }}
              />
            </div>
            <div className="image-info">
              <p className="image-credit">
                {image.user?.name ? `Photo by ${image.user.name}` : 'Unsplash photo'}
              </p>
              <button
                className="edit-button"
                onClick={() => onSelectImage(image)}
              >
                Add Captions
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Define a deep comparison function that ignores certain properties
const areEqual = (prevProps, nextProps) => {
  // First compare primitive props
  if (
    prevProps.loading !== nextProps.loading ||
    prevProps.error !== nextProps.error ||
    prevProps.onSelectImage !== nextProps.onSelectImage
  ) {
    return false;
  }
  
  // If image array references are the same, no need to check further
  if (prevProps.images === nextProps.images) {
    return true;
  }
  
  // Check if images arrays have different lengths
  if (prevProps.images.length !== nextProps.images.length) {
    return false;
  }
  
  // Check if the IDs are all the same (assumes order doesn't matter)
  const prevIds = new Set(prevProps.images.map(img => img.id));
  const nextIds = new Set(nextProps.images.map(img => img.id));
  
  // If sets have different sizes, some IDs are different
  if (prevIds.size !== nextIds.size) {
    return false;
  }
  
  // Check if every ID in the prev set exists in the next set
  for (const id of prevIds) {
    if (!nextIds.has(id)) {
      return false;
    }
  }
  
  // All IDs match, consider the props equal
  return true;
};

// Use memo with our custom comparison function
export default memo(ImageGrid, areEqual);