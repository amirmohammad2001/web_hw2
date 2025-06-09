# web_hw2
# مستندات App.js و کامپوننت‌های پروژه «نقاشی‌گر تعاملی»

در این مستند، ابتدا یک پاراگراف توضیح کلی دربارهٔ هر کامپوننت ارائه شده است، سپس کد و شرح props و عملکرد آن آمده است.

---

## 1. App.js

این کامپوننت هستهٔ اصلی برنامه است و تمامی stateهای مرکزی (لیست اشکال، عنوان نقاشی و ابزار انتخاب‌شده) را مدیریت می‌کند. تمامی منطق افزودن، جابجایی، حذف اشکال و وارد/صادر کردن فایل JSON در اینجا قرار دارد و با callbackهای خود، جریان داده‌ها را به کامپوننت‌های فرزند می‌فرستد و تغییرات را دریافت می‌کند.

```jsx
function App() {
  // 1. Stateها
  const [drawingName, setDrawingName] = useState('');
  const [shapes, setShapes]       = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const canvasRef = useRef();
  const idCounter = useRef(1);

  // 2. افزودن شکل جدید
  const addShape = (type, x, y) => {
    const newShape = { id: idCounter.current++, type, x, y };
    setShapes(prev => [...prev, newShape]);
  };

  // 3. جابجایی شکل موجود
  const moveShape = (id, x, y) => {
    setShapes(prev =>
      prev.map(s => (s.id === id ? { ...s, x, y } : s))
    );
  };

  // 4. حذف شکل
  const deleteShape = id => {
    setShapes(prev => prev.filter(s => s.id !== id));
  };

  // 5. Export به JSON
  const onExport = () => {
    const data = { drawingName, shapes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = drawingName || 'drawing';
    a.click();
  };

  // 6. Import از JSON
  const fileInputRef = useRef();
  const onImportClick = () => fileInputRef.current.click();
  const onFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const { drawingName: name, shapes: loaded } = JSON.parse(evt.target.result);
        setDrawingName(name || '');
        setShapes(Array.isArray(loaded) ? loaded : []);
        const maxId = loaded.reduce((m, s) => (s.id > m ? s.id : m), 0);
        idCounter.current = maxId + 1;
      } catch { alert('فرمت فایل معتبر نیست'); }
    };
    reader.readAsText(file);
  };

  // 7. شمارش تعداد اشکال برای BottomBar
  const countOf = type => shapes.filter(s => s.type === type).length;

  return (
    <div className="app">
      <Header
        drawingName={drawingName}
        onDrawingNameChange={setDrawingName}
        onExport={onExport}
        onImportClick={onImportClick}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
      />

      <div className="main">
        <Sidebar
          selectedType={selectedType}
          onSelectTool={setSelectedType}
        />

        <Canvas
          ref={canvasRef}
          shapes={shapes}
          selectedType={selectedType}
          onAddShape={addShape}
          onMoveShape={moveShape}
          onDeleteShape={deleteShape}
        />
      </div>

      <BottomBar
        countCircle={countOf('circle')}
        countSquare={countOf('square')}
        countTriangle={countOf('triangle')}
      />
    </div>
  );
}
```
---

## 2. Header.js

**توضیح:**  
این کامپوننت بخش بالای صفحه را تشکیل می‌دهد و کاربر می‌تواند در آن عنوان نقاشی را وارد کند و با دکمه‌های Export/Import، فایل JSON شامل اطلاعات نقاشی را ذخیره یا بارگذاری نماید.

```jsx
function Header({
  drawingName,
  onDrawingNameChange,
  onExport,
  onImportClick,
  fileInputRef,
  onFileChange
}) {
  return (
    <header className="header">
      <input
        type="text"
        value={drawingName}
        placeholder="Painting Title"
        onChange={e => onDrawingNameChange(e.target.value)}
      />
      <button onClick={onExport}>Export</button>
      <button onClick={onImportClick}>Import</button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </header>
  );
}
```
---

## 3. Sidebar.js

**توضیح:**  
نوار کناری شامل لیستی از ابزارهای شکل (دایره، مربع، مثلث) است. کاربر با کلیک روی هر ابزار یا درگ آن، نوع شکلی که قصد استفاده از آن را دارد انتخاب می‌کند.

```jsx
function Sidebar({ selectedType, onSelectTool }) {
  const tools = ['circle', 'square', 'triangle'];
  return (
    <aside className="sidebar">
      {tools.map(type => (
        <ToolItem
          key={type}
          type={type}
          isSelected={selectedType === type}
          onSelect={() => onSelectTool(type)}
        />
      ))}
    </aside>
  );
}
```
---

## 4. ToolItem.js

**توضیح:**  
نمایش یک آیتم ابزار در Sidebar. این کامپوننت قابلیت کلیک برای انتخاب ابزار و درگ کردن آن را دارد. هنگام شروع درگ، نوع شکل را در dataTransfer قرار می‌دهد.

```jsx
function ToolItem({ type, isSelected, onSelect }) {
  const handleDragStart = e => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type })
    );
  };

  return (
    <div
      className={`tool-item ${isSelected ? 'selected' : ''}`}
      draggable
      onClick={onSelect}
      onDragStart={handleDragStart}
    >
      <ShapePreview type={type} size={40} />
    </div>
  );
}
```
---

## 5. Canvas.js

**توضیح:**  
ناحیهٔ اصلی رسم است که اشکال را نمایش می‌دهد و رویدادهای کلیک، درگ‌اُور و دراپ را مدیریت می‌کند. بر اساس نوع ابزار انتخاب‌شده یا داده‌های درگ‌شده، اشکال جدید ایجاد یا اشکال موجود جابجا می‌شوند.

```jsx
const Canvas = forwardRef(({
  shapes, selectedType,
  onAddShape, onMoveShape, onDeleteShape
}, ref) => {

  const onDragOver = e => e.preventDefault();

  const onDrop = e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (data.offsetX || 0);
    const y = e.clientY - rect.top - (data.offsetY || 0);

    if (data.id != null) {
      onMoveShape(data.id, x, y);
    } else {
      onAddShape(data.type, x, y);
    }
  };

  const onClick = e => {
    if (!selectedType) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddShape(selectedType, x, y);
  };

  return (
    <div
      className="canvas"
      ref={ref}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {shapes.map(s => (
        <Shape
          key={s.id}
          {...s}
          onMove={onMoveShape}
          onDelete={onDeleteShape}
        />
      ))}
    </div>
  );
});
```
---

## 6. Shape.js

**توضیح:**  
نمایش و مدیریت یک شیء روی بوم. این کامپوننت قابلیت درگ (برای جابجایی) و دوکلیک (برای حذف) دارد و با استفاده از offsetهای دریافت‌شده هنگام درگ، محل جدید را به والد گزارش می‌دهد.

```jsx
function Shape({ id, type, x, y, onMove, onDelete }) {
  const handleDragStart = e => {
    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id, type, offsetX, offsetY })
    );
  };

  return (
    <div
      className="shape"
      style={{ left: x, top: y, position: 'absolute' }}
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={() => onDelete(id)}
    >
      <ShapePreview type={type} size={60} />
    </div>
  );
}
```
---

## 7. ShapePreview.js

**توضیح:**  
این کامپوننت صرفاً وظیفهٔ رسم شکل بر اساس نوع (`circle`، `square`، `triangle`) و اندازهٔ ورودی را دارد. برای مثلث از ترفند CSS border-hack استفاده می‌کند.

```jsx
function ShapePreview({ type, size }) {
  const common = {
    width: size,
    height: size,
    display: 'inline-block'
  };

  if (type === 'circle') {
    return <div style={{ ...common, borderRadius: '50%', background: '#555' }} />;
  }
  if (type === 'square') {
    return <div style={{ ...common, background: '#333' }} />;
  }
  if (type === 'triangle') {
    return (
      <div style={{ ...common, position: 'relative' }}>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid #111`,
            position: 'absolute',
            left: '50%', top: 0,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
    );
  }
  return null;
}
```
---

## 8. BottomBar.js

**توضیح:**  
در پایین صفحه تعداد اشکال هر نوع (دایره، مربع، مثلث) را به‌صورت زنده نمایش می‌دهد و بروزرسانی آن‌ها بر اساس state اصلی در App.js انجام می‌شود.

```jsx
function BottomBar({ countCircle, countSquare, countTriangle }) {
  return (
    <footer className="bottom-bar">
      <div>
        <ShapePreview type="circle" size={20}/> {countCircle}
      </div>
      <div>
        <ShapePreview type="square" size={20}/> {countSquare}
      </div>
      <div>
        <ShapePreview type="triangle" size={20}/> {countTriangle}
      </div>
    </footer>
  );
}
```