// services/api.js
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

/**
 * Search for images on Unsplash
 * @param {string} query - Search query
 * @return {Promise} - Promise containing image results
 */
export const searchImages = async (query) => {
  if (!query || !query.trim()) {
    throw new Error('Please enter a search term');
  }
  
  // Handle missing API key
  if (!UNSPLASH_API_KEY) {
    console.error('Unsplash API key is missing. Please add it to your .env file.');
    throw new Error('API configuration error. Please check console for details.');
  }
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Unsplash API credentials.');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle empty results
    if (data.results.length === 0) {
      throw new Error('No images found for your search. Try different keywords.');
    }
    
    return data.results;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fallback function to use if Unsplash API is not available
 * @return {Array} - Mock image results
 */
export const getMockImages = () => {
  return [
    {
      id: 'mock1',
      urls: {
        regular: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
        small: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400'
      },
      alt_description: 'Mock image 1',
      user: { name: 'Mock User' }
    },
    {
      id: 'mock2',
      urls: {
        regular: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
        small: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400'
      },
      alt_description: 'Mock image 2',
      user: { name: 'Mock User' }
    }
  ];
};