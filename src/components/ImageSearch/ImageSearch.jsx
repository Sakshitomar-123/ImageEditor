// components/ImageSearch/ImageSearch.jsx
import React, { useState } from 'react';
import { searchImages, getMockImages } from '../../services/api';
import './ImageSearch.css';

function ImageSearch({ setImages, setLoading, setError }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate search query
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Attempt to fetch images from API
      const results = await searchImages(searchQuery);
      setImages(results);
      
      if (results.length === 0) {
        setError('No images found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message);
      
      // If API fails, provide option to use mock data
      if (err.message.includes('API') || err.message.includes('key')) {
        setTimeout(() => {
          const useMockData = window.confirm(
            'Would you like to use sample images instead of API data?'
          );
          
          if (useMockData) {
            const mockResults = getMockImages();
            setImages(mockResults);
            setError(null);
          }
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="image-search">
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for images..."
            className="search-input"
            aria-label="Search for images"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
        <div className="search-examples">
          Try: nature, city, abstract, food, animals
        </div>
      </form>
    </div>
  );
}

export default ImageSearch;