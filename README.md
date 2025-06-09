# مستندات پروژه «نقاشی‌گر تعاملی» (React)


---

## 1. App.js

**توضیح کلی:**  
این کامپوننت نقطهٔ مرکزی برنامه است و کلیهٔ داده‌ها و منطق اصلی (عنوان نقاشی، لیست اشکال، افزودن/جابجایی/حذف شکل، عملیات وارد/صادر JSON) را نگه‌داری و مدیریت می‌کند. وظیفه دارد props و callback‌های لازم را به کامپوننت‌های فرزند منتقل کرده و تغییرات را دریافت و اعمال نماید.

‎**Props**
- این کامپوننت مستقیماً props نمی‌گیرد (root component).

‎**Hooks**
- `useState`  
  • `drawingName`: رشتهٔ عنوان نقاشی  
  • `shapes`: آرایهٔ اشکال موجود روی بوم  
  • `selectedType`: نوع شکلی که در Sidebar انتخاب شده
- `useRef`  
  • `canvasRef`: برای دسترسی به عنصری که بوم را نگه می‌دارد  
  • `idCounter`: شمارندهٔ یکتای شناسهٔ اشکال  
  • `fileInputRef`: ارجاع به `<input type="file">` برای import

---

## 2. Header.js

**توضیح کلی:**  
بخش بالای رابط کاربری که شامل یک فیلد متنی برای وارد کردن/ویرایش عنوان نقاشی و دو دکمهٔ Export و Import است. دکمهٔ Export خروجی JSON را تولید و دانلود می‌کند و Import با باز کردن فایل‌سِلکتور، JSON ذخیره‌شده را بارگذاری می‌نماید.

‎**Props**
- `drawingName` (string): عنوان فعلی نقاشی
- `onDrawingNameChange` (function): handler برای تغییر عنوان
- `onExport` (function): callback برای صادر کردن JSON
- `onImportClick` (function): callback برای باز کردن دیالوگ import
- `fileInputRef` (ref): مرجع به عنصر فایل‌اینپوت
- `onFileChange` (function): handler خواندن و پردازش فایل JSON

‎**Hooks**
- این کامپوننت خود از هیچ Hook داخلی استفاده نمی‌کند.

---

## 3. Sidebar.js

**توضیح کلی:**  
نوار کناری که لیستی از ابزارهای شکل (دایره، مربع، مثلث) را نمایش می‌دهد و کاربر می‌تواند با کلیک یا درگ روی هر ابزار، انتخاب نوع شکل را انجام دهد.

‎**Props**
- `selectedType` (string|null): نوع شکلی که هم‌اکنون انتخاب شده
- `onSelectTool` (function): handler برای تغییر نوع ابزار فعال

‎**Hooks**
- این کامپوننت از هیچ Hook داخلی استفاده نمی‌کند.

---

## 4. ToolItem.js

**توضیح کلی:**  
نمایش یک ابزار منفرد در Sidebar. علاوه بر کلیک برای انتخاب، امکان درگ کردن دارد و هنگام شروع درگ، نوع شکل را در `dataTransfer` قرار می‌دهد تا در Canvas قابل خواندن باشد.

‎**Props**
- `type` (string): نام نوع شکل (‘circle’/‘square’/‘triangle’)
- `isSelected` (boolean): آیا این ابزار هم‌اکنون فعال است
- `onSelect` (function): callback هنگام کلیک روی آیتم

‎**Hooks**
- از هیچ Hook Reactی استفاده نمی‌کند.

---

## 5. Canvas.js

**توضیح کلی:**  
ناحیهٔ تعاملی بوم که اشکال را رندر می‌کند و اتفاقات کلیک (برای افزودن شکل جدید)، `dragOver` (برای جلوگیری از رفتار پیش‌فرض) و `drop` (برای افزودن یا جابجایی اشکال بر اساس دادهٔ `dataTransfer`) را مدیریت می‌کند.

‎**Props**
- `shapes` (Array): آرایهٔ اشیاء شکل با `{ id, type, x, y }`
- `selectedType` (string|null): نوع شکلی که برای کلیک مستقیم روی بوم آماده است
- `onAddShape` (function): callback افزودن شکل جدید
- `onMoveShape` (function): callback جابجایی شکل موجود
- `onDeleteShape` (function): callback حذف شکل

‎**Hooks**
- `forwardRef` از React برای دریافت مرجع به عنصر بوم از والد

---

## 6. Shape.js

**توضیح کلی:**  
نمایش یک شکل مشخص روی بوم با Position مطلق. قابلیت درگ برای جابجایی و دوکلیک برای حذف را دارد. در `dragStart` مختصات offset کلیک را ثبت و در `dataTransfer` می‌فرستد تا در Canvas بتواند محل جدید را به‌درستی محاسبه کند.

‎**Props**
- `id` (number|string): شناسهٔ یکتای شکل
- `type` (string): نوع شکل
- `x`, `y` (number): مختصات موقعیت جاری روی بوم
- `onMove` (function): callback جابجایی شکل
- `onDelete` (function): callback حذف شکل

‎**Hooks**
- از هیچ Hook داخلی استفاده نمی‌کند.

---

## 7. ShapePreview.js

**توضیح کلی:**  
کامپوننت خالصی که وظیفهٔ ترسیم شکل (دایره، مربع یا مثلث) را با CSS انجام می‌دهد. پارامتر اندازه (size) و نوع شکل را می‌گیرد و DOM مناسب را رندر می‌کند.

‎**Props**
- `type` (string): نوع شکل (‘circle’/‘square’/‘triangle’)
- `size` (number): عرض/ارتفاع نمایشی

‎**Hooks**
- از هیچ Hook داخلی استفاده نمی‌کند.

---

## 8. BottomBar.js

**توضیح کلی:**  
نوار پایین صفحه که به‌صورت زنده تعداد اشکال هر نوع را نمایش می‌دهد. این تعداد از state اصلی App.js مشتق می‌شود و به این کامپوننت در قالب props ارسال می‌گردد.

‎**Props**
- `countCircle` (number): تعداد دایره‌ها
- `countSquare` (number): تعداد مربع‌ها
- `countTriangle` (number): تعداد مثلث‌ها

‎**Hooks**
- از هیچ Hook داخلی استفاده نمی‌کند.
