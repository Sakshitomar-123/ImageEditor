// hooks/useCanvas.js
import { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function useCanvas(selectedImage) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [layers, setLayers] = useState([]);
  
  // Initialize fabric canvas
  useEffect(() => {
    // Create canvas only once
    if (!canvas) {
      const fabricCanvas = new fabric.Canvas('fabric-canvas', {
        width: 800,
        height: 600,
        preserveObjectStacking: true
      });
      
      setCanvas(fabricCanvas);
      
      // Cleanup on unmount
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);
  
  // Load selected image when it changes
  useEffect(() => {
    if (canvas && selectedImage && selectedImage.urls) {
      // Clear canvas before adding new image
      canvas.clear();
      setLayers([]);
      
      fabric.Image.fromURL(selectedImage.urls.regular, (img) => {
        // Calculate the scaling to fit the canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.9; // 90% of the available space
        
        img.scale(scale);
        
        // Center the image on canvas
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          selectable: false, // Make base image unselectable
          hasControls: false,
          crossOrigin: 'anonymous' // Add crossOrigin attribute
        });
        
        canvas.add(img);
        canvas.renderAll();
        
        // Store the image as a background layer
        setLayers(prev => [...prev, { type: 'image', object: img }]);
      }, { crossOrigin: 'anonymous' }); // Add crossOrigin to options
    }
  }, [canvas, selectedImage]);
  
  // Add text to canvas
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.IText('Edit this text', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontFamily: 'Arial',
      fontSize: 30,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    
    setLayers(prev => [...prev, { type: 'text', object: text }]);
  };
  
  // Add shape to canvas
  const addShape = (type) => {
    if (!canvas) return;
    
    let shape;
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    
    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: center.x,
          top: center.y,
          width: 100,
          height: 80,
          fill: 'rgba(255, 0, 0, 0.5)',
          originX: 'center',
          originY: 'center'
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: center.x,
          top: center.y,
          radius: 50,
          fill: 'rgba(0, 255, 0, 0.5)',
          originX: 'center',
          originY: 'center'
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: center.x,
          top: center.y,
          width: 100,
          height: 100,
          fill: 'rgba(0, 0, 255, 0.5)',
          originX: 'center',
          originY: 'center'
        });
        break;
      case 'polygon':
        // Create a star shape
        const points = [
          { x: 0, y: 0 },
          { x: 30, y: -50 },
          { x: 60, y: 0 },
          { x: 110, y: -10 },
          { x: 70, y: 30 },
          { x: 85, y: 80 },
          { x: 30, y: 50 },
          { x: -25, y: 80 },
          { x: -10, y: 30 },
          { x: -50, y: -10 }
        ];
        
        shape = new fabric.Polygon(points, {
          left: center.x,
          top: center.y,
          fill: 'rgba(255, 255, 0, 0.5)',
          originX: 'center',
          originY: 'center'
        });
        break;
      default:
        return;
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    setLayers(prev => [...prev, { type: 'shape', object: shape }]);
  };
  
  // Download image - completely revised approach
  const downloadImage = () => {
    if (!canvas) return;
    
    try {
      // Temporarily store active object if any
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
      
      // Get the actual DOM canvas element
      const canvasElement = document.getElementById('fabric-canvas');
      
      // Try a different approach using the DOM canvas
      if (canvasElement) {
        // Create a new canvas with the same dimensions
        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = canvas.width;
        downloadCanvas.height = canvas.height;
        const ctx = downloadCanvas.getContext('2d');
        
        // Draw a white background (optional)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the actual canvas content
        ctx.drawImage(canvasElement, 0, 0);
        
        // Use this canvas for download
        try {
          // Use toBlob for better cross-browser compatibility
          downloadCanvas.toBlob((blob) => {
            if (blob) {
              // Create object URL
              const url = URL.createObjectURL(blob);
              
              // Create download link
              const link = document.createElement('a');
              link.download = `edited-image-${Date.now()}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              
              // Clean up
              document.body.removeChild(link);
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }
          }, 'image/png');
        } catch (e) {
          console.error('Blob creation failed, trying data URL approach', e);
          // Fallback to dataURL approach
          const dataURL = downloadCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `edited-image-${Date.now()}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // Fallback to original approach if DOM canvas not found
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1.0
        });
        
        const link = document.createElement('a');
        link.download = `edited-image-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Restore active object if needed
      if (activeObject) {
        canvas.setActiveObject(activeObject);
        canvas.renderAll();
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('There was an error downloading your image. Please try again.');
    }
  };
  
  // Layer ordering functions
  const bringToFront = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.bringToFront();
      canvas.renderAll();
      updateLayersOrder();
    }
  };
  
  const sendToBack = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Ensure it doesn't go behind the background image
      activeObject.sendToBack();
      
      // If there's a background image, bring it to the very back
      const objects = canvas.getObjects();
      if (objects.length > 1 && objects[0].type === 'image') {
        objects[0].sendToBack();
      }
      
      canvas.renderAll();
      updateLayersOrder();
    }
  };
  
  // Delete selected object
  const deleteSelected = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Remove from canvas
      canvas.remove(activeObject);
      canvas.renderAll();
      
      // Remove from layers state
      setLayers(prev => 
        prev.filter(layer => layer.object !== activeObject)
      );
    }
  };
  
  // Helper to update layers array after reordering
  const updateLayersOrder = () => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    setLayers(objects.map(obj => {
      let type = 'other';
      if (obj.type === 'i-text' || obj.type === 'text') type = 'text';
      else if (obj.type === 'image') type = 'image';
      else type = 'shape';
      
      return { type, object: obj };
    }));
  };
  
  return {
    canvasRef,
    canvas,
    layers,
    addText,
    addShape,
    downloadImage,
    bringToFront,
    sendToBack,
    deleteSelected
  };
}