import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import BottomBar from './components/BottomBar';

function App() {
  const [drawingName, setDrawingName] = useState('My Painting');
  const [shapes, setShapes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const idCounter = useRef(0);

  // Add a new shape at (x,y)
  const addShape = (type, x, y) => {
    const newShape = { id: idCounter.current++, type, x, y };
    setShapes(s => [...s, newShape]);
  };

  const onCanvasClick = e => {
    if (!selectedType) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addShape(selectedType, x, y);
  };

  const onDragStart = (e, info) => {
    e.dataTransfer.setData('application/json', JSON.stringify(info));
  };
  const onDragOver = e => e.preventDefault();
  const onDrop = e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (data.id != null) {
      // move existing
      setShapes(s =>
          s.map(sh => (sh.id === data.id ? { ...sh, x, y } : sh))
      );
    } else {
      // new from sidebar
      addShape(data.type, x, y);
    }
  };

  const onShapeDoubleClick = id => {
    setShapes(s => s.filter(sh => sh.id !== id));
  };

  const onExport = () => {
    const payload = { name: drawingName, shapes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drawingName.trim() || 'drawing'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => fileInputRef.current.click();
  const onFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (obj.name && Array.isArray(obj.shapes)) {
          setDrawingName(obj.name);
          setShapes(obj.shapes);
          // reset id counter
          idCounter.current = obj.shapes.reduce((mx, s) => Math.max(mx, s.id), 0) + 1;
        } else {
          alert('Invalid JSON format');
        }
      } catch {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const countOf = type => shapes.filter(s => s.type === type).length;

  return (
      <div className="App">
        <Header
            name={drawingName}
            onNameChange={setDrawingName}
            onExport={onExport}
            onImportClick={onImportClick}
            fileInputRef={fileInputRef}
            onFileChange={onFileChange}
        />

        <div className="Main">
          <Canvas
              canvasRef={canvasRef}
              shapes={shapes}
              onCanvasClick={onCanvasClick}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onShapeDoubleClick={onShapeDoubleClick}
          />

          <Sidebar
              selectedType={selectedType}
              onSelectType={setSelectedType}
              onDragStart={onDragStart}
          />
        </div>

        <BottomBar
            counts={{
              circle: countOf('circle'),
              square: countOf('square'),
              triangle: countOf('triangle')
            }}
        />
      </div>
  );
}

export default App;
