<div dir="rtl">

# مستندات پروژه «نقاشی‌گر تعاملی» (React)

---

## 1. App.js

**توضیح کلی:**  
این کامپوننت نقطهٔ مرکزی برنامه است و کلیهٔ داده‌ها و منطق اصلی (عنوان نقاشی، لیست اشکال، افزودن/جابجایی/حذف شکل، عملیات وارد/صادر JSON) را نگه‌داری و مدیریت می‌کند. وظیفه دارد props و callback‌های لازم را به کامپوننت‌های فرزند منتقل کرده و تغییرات را دریافت و اعمال نماید.
 
 قابلیت **Props**
-  این کامپوننت مستقیماً props نمی‌گیرد (root component).

قابلیت **Hooks**
-  موارد  `useState`  
  • ویژگی `drawingName`: رشتهٔ عنوان نقاشی  
  • ویژگی `shapes`: آرایهٔ اشکال موجود روی بوم  
  • ویژگی `selectedType`: نوع شکلی که در Sidebar انتخاب شده
- موارد `useRef`  
  • ویژگی `canvasRef`: برای دسترسی به عنصری که بوم را نگه می‌دارد  
  • ویژگی `idCounter`: شمارندهٔ یکتای شناسهٔ اشکال  
  • ویژگی `fileInputRef`: ارجاع به `<input type="file">` برای import

</div>

<div dir="rtl">

## 2. Header.js

**توضیح کلی:**  
بخش بالای رابط کاربری که شامل یک فیلد متنی برای وارد کردن/ویرایش عنوان نقاشی و دو دکمهٔ Export و Import است. دکمهٔ Export خروجی JSON را تولید و دانلود می‌کند و Import با باز کردن فایل‌سِلکتور، JSON ذخیره‌شده را بارگذاری می‌نماید.

قابلیت**Props**
- ویژگی `drawingName` (string): عنوان فعلی نقاشی
- ویژگی `onDrawingNameChange` (function): handler برای تغییر عنوان
- ویژگی `onExport` (function): callback برای صادر کردن JSON
- ویژگی `onImportClick` (function): callback برای باز کردن دیالوگ import
- ویژگی `fileInputRef` (ref): مرجع به عنصر فایل‌اینپوت
- ویژگی `onFileChange` (function): handler خواندن و پردازش فایل JSON

قابلیت **Hooks**
-  این کامپوننت خود از هیچ Hook داخلی استفاده نمی‌کند.

</div>

<div dir="rtl">

## 3. Sidebar.js

**توضیح کلی:**  
نوار کناری که لیستی از ابزارهای شکل (دایره، مربع، مثلث) را نمایش می‌دهد و کاربر می‌تواند با کلیک یا درگ روی هر ابزار، انتخاب نوع شکل را انجام دهد.

قابلیت **Props**
- ویژگی `selectedType` (string|null): نوع شکلی که هم‌اکنون انتخاب شده
- ویژگی `onSelectTool` (function): handler برای تغییر نوع ابزار فعال

قابلیت **Hooks**
-  این کامپوننت از هیچ Hook داخلی استفاده نمی‌کند.

</div>

<div dir="rtl">

## 4. ToolItem.js

**توضیح کلی:**  
نمایش یک ابزار منفرد در Sidebar. علاوه بر کلیک برای انتخاب، امکان درگ کردن دارد و هنگام شروع درگ، نوع شکل را در `dataTransfer` قرار می‌دهد تا در Canvas قابل خواندن باشد.

قابلیت **Props**
- ویژگی `type` (string): نام نوع شکل (‘circle’/‘square’/‘triangle’)
- ویژگی `isSelected` (boolean): آیا این ابزار هم‌اکنون فعال است
- ویژگی `onSelect` (function): callback هنگام کلیک روی آیتم

قابلیت **Hooks**
-  از هیچ Hook Reactی استفاده نمی‌کند.

</div>

<div dir="rtl">

## 5. Canvas.js

**توضیح کلی:**  
ناحیهٔ تعاملی بوم که اشکال را رندر می‌کند و اتفاقات کلیک (برای افزودن شکل جدید)، `dragOver` (برای جلوگیری از رفتار پیش‌فرض) و `drop` (برای افزودن یا جابجایی اشکال بر اساس دادهٔ `dataTransfer`) را مدیریت می‌کند.

قابلیت **Props**
- ویژگی `shapes` (Array): آرایهٔ اشیاء شکل با `{ id, type, x, y }`
- ویژگی `selectedType` (string|null): نوع شکلی که برای کلیک مستقیم روی بوم آماده است
- ویژگی `onAddShape` (function): callback افزودن شکل جدید
- ویژگی `onMoveShape` (function): callback جابجایی شکل موجود
- ویژگی `onDeleteShape` (function): callback حذف شکل

قابلیت **Hooks**
- ویژگی `forwardRef` از React برای دریافت مرجع به عنصر بوم از والد

</div>

<div dir="rtl">

## 6. Shape.js

**توضیح کلی:**  
نمایش یک شکل مشخص روی بوم با Position مطلق. قابلیت درگ برای جابجایی و دوکلیک برای حذف را دارد. در `dragStart` مختصات offset کلیک را ثبت و در `dataTransfer` می‌فرستد تا در Canvas بتواند محل جدید را به‌درستی محاسبه کند.

قابلیت **Props**
- ویژگی `id` (number|string): شناسهٔ یکتای شکل
- ویژگی `type` (string): نوع شکل
- ویژگی `x`, `y` (number): مختصات موقعیت جاری روی بوم
- ویژگی `onMove` (function): callback جابجایی شکل
- ویژگی `onDelete` (function): callback حذف شکل

قابلیت **Hooks**
-  از هیچ Hook داخلی استفاده نمی‌کند.

</div>

<div dir="rtl">

## 7. ShapePreview.js

**توضیح کلی:**  
کامپوننت خالصی که وظیفهٔ ترسیم شکل (دایره، مربع یا مثلث) را با CSS انجام می‌دهد. پارامتر اندازه (size) و نوع شکل را می‌گیرد و DOM مناسب را رندر می‌کند.

قابلیت **Props**
- ویژگی `type` (string): نوع شکل (‘circle’/‘square’/‘triangle’)
- ویژگی `size` (number): عرض/ارتفاع نمایشی

قابلیت **Hooks**
-  از هیچ Hook داخلی استفاده نمی‌کند.

</div>

<div dir="rtl">

## 8. BottomBar.js

**توضیح کلی:**  
نوار پایین صفحه که به‌صورت زنده تعداد اشکال هر نوع را نمایش می‌دهد. این تعداد از state اصلی App.js مشتق می‌شود و به این کامپوننت در قالب props ارسال می‌گردد.

قابلیت **Props**
- ویژگی `countCircle` (number): تعداد دایره‌ها
- ویژگی `countSquare` (number): تعداد مربع‌ها
- ویژگی `countTriangle` (number): تعداد مثلث‌ها

قابلیت **Hooks**
-  از هیچ Hook داخلی استفاده نمی‌کند.

</div>