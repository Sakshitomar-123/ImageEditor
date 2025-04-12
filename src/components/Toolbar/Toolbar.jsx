// components/Toolbar/Toolbar.jsx
import React from 'react';
import './Toolbar.css';

function Toolbar({ 
  onAddText, 
  onAddShape, 
  onDownload, 
  onBringToFront, 
  onSendToBack, 
  onDeleteSelected,
  layers
}) {
  // Count of each object type for display
  const textCount = layers?.filter(layer => layer.type === 'text').length || 0;
  const shapeCount = layers?.filter(layer => layer.type === 'shape').length || 0;
  
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3 className="toolbar-title">Add Caption</h3>
        <button className="toolbar-button" onClick={onAddText}>
          Add Text Layer {textCount > 0 && <span className="count">({textCount})</span>}
        </button>
      </div>
      
      <div className="toolbar-section">
        <h3 className="toolbar-title">Add Shapes {shapeCount > 0 && <span className="count">({shapeCount})</span>}</h3>
        <div className="toolbar-buttons">
          <button className="toolbar-button shape-button rectangle" onClick={() => onAddShape('rectangle')}>
            Rectangle
          </button>
          <button className="toolbar-button shape-button circle" onClick={() => onAddShape('circle')}>
            Circle
          </button>
          <button className="toolbar-button shape-button triangle" onClick={() => onAddShape('triangle')}>
            Triangle
          </button>
          <button className="toolbar-button shape-button star" onClick={() => onAddShape('polygon')}>
            Star
          </button>
        </div>
      </div>
      
      <div className="toolbar-section">
        <h3 className="toolbar-title">Arrange Layers</h3>
        <div className="toolbar-buttons">
          <button className="toolbar-button" onClick={onBringToFront} title="Bring the selected object to the front">
            Bring to Front
          </button>
          <button className="toolbar-button" onClick={onSendToBack} title="Send the selected object to the back">
            Send to Back
          </button>
          <button className="toolbar-button danger" onClick={onDeleteSelected} title="Delete the selected object">
            Delete Selected
          </button>
        </div>
      </div>
      
      <div className="toolbar-section">
        <h3 className="toolbar-title">Save</h3>
        <div className="toolbar-buttons">
          <button className="toolbar-button primary" onClick={onDownload}>
            Download Image
          </button>
        </div>
      </div>
      
      <div className="toolbar-help">
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Double-click on text to edit</li>
          <li>Click and drag to move objects</li>
          <li>Use corner handles to resize and rotate</li>
          <li>Press Delete key to remove selected objects</li>
        </ul>
      </div>
    </div>
  );
}

export default Toolbar;