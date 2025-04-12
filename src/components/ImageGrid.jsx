// components/ImageGrid/ImageGrid.jsx
import React, { memo, useMemo } from 'react';


function ImageGrid({ images, loading, error, onSelectImage }) {
  // Use useMemo to memoize the rendered content based on dependencies
  const renderedContent = useMemo(() => {
    if (loading) {
      return <div className="loading">Loading images...</div>;
    }
    
    if (error) {
      return <div className="error">{error}</div>;
    }
    
    if (images.length === 0) {
      return <div className="no-results">No images to display. Try searching for something!</div>;
    }
    
    console.log("render")
    return (
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img
              src={image.urls.small}
              alt={image.alt_description || 'Unsplash image'}
              className="image-thumbnail"
              loading="lazy" // Add lazy loading for better performance
            />
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
        ))}
      </div>
    );
  }, [images, loading, error, onSelectImage]); // Dependencies for useMemo

  return renderedContent;
}

// Define a comparison function for memo that uses stable identity checks
const areEqual = (prevProps, nextProps) => {
  // Check if images arrays have the same length and ids
  if (prevProps.images.length !== nextProps.images.length) {
    return false;
  }
  
  // Check if image ids are the same (assumes sorted arrays)
  const prevIds = prevProps.images.map(img => img.id);
  const nextIds = nextProps.images.map(img => img.id);
  const idsEqual = prevIds.every((id, index) => id === nextIds[index]);
  
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    idsEqual &&
    prevProps.onSelectImage === nextProps.onSelectImage
  );
};

// Export memoized component with more robust comparison
export default memo(ImageGrid, areEqual);