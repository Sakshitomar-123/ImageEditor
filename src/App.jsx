import React, { useState, useCallback } from 'react';
import ImageSearch from './components/ImageSearch';
import ImageGrid from './components/ImageGrid';
import Editor from './components/Editor';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Memoize the callback function to ensure it has stable identity
  const handleSelectImage = useCallback((image) => {
    setSelectedImage(image);
  }, []);
  
  // Memoize the back to search handler
  const handleBackToSearch = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Memoize the state setters for ImageSearch
  const memoizedSetImages = useCallback((newImages) => {
    setImages(newImages);
  }, []);
  
  const memoizedSetLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);
  
  const memoizedSetError = useCallback((err) => {
    setError(err);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Editor App</h1>
      </header>
      
      <main className="app-main">
        {!selectedImage ? (
          <>
            <ImageSearch 
              setImages={memoizedSetImages} 
              setLoading={memoizedSetLoading} 
              setError={memoizedSetError} 
            />
            
            <ImageGrid 
              images={images} 
              loading={loading} 
              error={error} 
              onSelectImage={handleSelectImage} 
            />
          </>
        ) : (
          <Editor 
            selectedImage={selectedImage} 
            onBackToSearch={handleBackToSearch} 
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>Created with Vite & React</p>
      </footer>
    </div>
  );
}

export default App;