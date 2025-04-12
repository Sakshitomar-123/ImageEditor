// components/Editor/Editor.jsx
import React, { useEffect, useRef, useState } from 'react';
import Toolbar from '../Toolbar/Toolbar';
import Canvas from '../canvas/canvas';
import { useCanvas } from '../../hooks/useCanvas';
import './Editor.css';

function Editor({ selectedImage, onBackToSearch }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Make sure we have a valid selectedImage before initialization
  if (!selectedImage || !selectedImage.urls) {
    return (
      <div className="editor">
        <div className="editor-header">
          <h2>Image Editor</h2>
          <button className="back-button" onClick={onBackToSearch}>
            Back to Search
          </button>
        </div>
        <div className="editor-content">
          <div className="editor-error">
            No image selected or image data is invalid. Please go back and select an image.
          </div>
        </div>
      </div>
    );
  }
  
  const {
    canvasRef,
    canvas,
    layers,
    addText,
    addShape,
    downloadImage,
    bringToFront,
    sendToBack,
    deleteSelected,
  } = useCanvas(selectedImage);
  
  const editorContentRef = useRef(null);
  
  // Check for mobile/tablet breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle canvas resizing when the editor container size changes
  useEffect(() => {
    if (!canvas || !editorContentRef.current) return;
    
    const updateCanvasSize = () => {
      const container = editorContentRef.current;
      
      // Different calculations based on layout (mobile vs desktop)
      let canvasWidth, canvasHeight;
      
      if (isMobile) {
        // On mobile, use nearly full container width
        canvasWidth = Math.min(container.clientWidth - 20, 1200);
        canvasHeight = Math.min(300, window.innerHeight * 0.5);
      } else {
        // On desktop, account for toolbar
        const toolbarWidth = 220; // Approximate toolbar width
        canvasWidth = Math.min(container.clientWidth - toolbarWidth - 20, 1200);
        canvasHeight = Math.min(container.clientHeight - 20, 800);
      }
      
    };
    
    // Initial resize with slight delay to ensure DOM is ready
    const initialTimer = setTimeout(updateCanvasSize, 300);
    
    // Set up resize observer for container size changes
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(initialTimer);
      setTimeout(updateCanvasSize, 200);
    });
    
    resizeObserver.observe(editorContentRef.current);
    
    // Also listen for window resize
    const handleWindowResize = () => {
      setTimeout(updateCanvasSize, 200);
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [canvas, isMobile]);
  
  return (
    <div className="editor">
      <div className="editor-header">
        <h2>Image Editor</h2>
        <button className="back-button" onClick={onBackToSearch}>
          Back to Search
        </button>
      </div>
      
      <div className="editor-content" ref={editorContentRef}>
        <Toolbar
          onAddText={addText}
          onAddShape={addShape}
          onDownload={downloadImage}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onDeleteSelected={deleteSelected}
          layers={layers}
        />
        
        <Canvas canvasRef={canvasRef} fabricCanvas={canvas} />
      </div>
      
      <div className="editor-info">
        <p>
          Currently editing: {selectedImage?.alt_description || 'Unsplash image'}
        </p>
        <p className="editor-credit">
          Photo by {selectedImage?.user?.name || 'Unknown'} on Unsplash
        </p>
      </div>
    </div>
  );
}

export default Editor;