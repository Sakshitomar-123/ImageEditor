// components/Canvas/Canvas.jsx
import React, { useEffect, useRef } from 'react';
import './canvas.css';

function Canvas({ canvasRef, fabricCanvas }) {
  const containerRef = useRef(null);
  
  // Adjust canvas size based on container size on resize
  useEffect(() => {
    if (!fabricCanvas || !containerRef.current) return;
    
    const resizeCanvas = () => {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // More responsive dimensions with better minimum sizes
      const maxWidth = Math.min(containerWidth, 1200);
      const maxHeight = Math.min(containerHeight, 800);
      
      // Set dimensions with no padding that could cause overflow
      fabricCanvas.setDimensions({
        width: maxWidth,
        height: maxHeight
      });
      
      // Center and resize all objects to fit the new canvas dimensions
      const objects = fabricCanvas.getObjects();
      if (objects.length > 0) {
        const bgImage = objects[0];
        if (bgImage.type === 'image') {
          // Recalculate scale to fit the canvas
          const scale = Math.min(
            maxWidth / bgImage.width,
            maxHeight / bgImage.height
          ) * 0.9;
          
          bgImage.scale(scale);
          bgImage.set({
            left: maxWidth / 2,
            top: maxHeight / 2
          });
        }
      }
      
      fabricCanvas.renderAll();
    };
    
    // Initial resize with a slight delay to ensure proper rendering
    setTimeout(resizeCanvas, 100);
    
    // Add resize listener with debounce for better performance
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [fabricCanvas]);
  
  return (
    <div className="canvas-container" ref={containerRef}>
      <canvas ref={canvasRef} id="fabric-canvas"></canvas>
    </div>
  );
}

export default Canvas;