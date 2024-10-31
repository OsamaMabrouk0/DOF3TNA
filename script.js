document.addEventListener('DOMContentLoaded', function () {
    // إظهار شاشة التحميل
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    // إخفاء شاشة التحميل بعد ثانيتين ثم إضافة تأثير الانزلاق
    setTimeout(() => {
        loader.classList.add('hidden');
        document.querySelectorAll('.grid-container, .page').forEach(element => {
            element.classList.add('visible');
        });
    }, 2000);

    // استرجاع الإعدادات من localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('toggleThemeButton').textContent = "تبديل الوضع إلى الليلي";
    }
    
    if (savedAccentColor) {
        document.documentElement.style.setProperty('--accent-color', savedAccentColor);
        document.getElementById('accentColorPicker').value = savedAccentColor;
    }

    renderColorSuggestions();
});

// دالة لإظهار القسم المطلوب وإخفاء الأقسام الأخرى
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none'; // إخفاء كل قسم
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block'; // إظهار القسم المطلوب
    }
}

// دالة خاصة بعرض قسم "المحاضرات"
function showLectures() {
    showPage('lectures');
}

function navigateToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
    const bottomNav = document.querySelector('.bottom-navigation');

    if (pageId === 'home') {
        bottomNav.classList.remove('active');
    } else {
        bottomNav.classList.add('active');
    }
}

// دالة للتبديل بين الوضعين النهاري والليلي
function toggleTheme() {
    const isLightTheme = document.body.classList.toggle('light-theme');
    document.getElementById('toggleThemeButton').textContent = isLightTheme ? "تبديل الوضع إلى الليلي" : "تبديل الوضع إلى النهاري";
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
}

// دالة لتغيير اللون الأساسي حسب اختيار المستخدم
function changeAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

// دالة لإعادة ضبط الإعدادات إلى الوضع الافتراضي
function resetSettings() {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم إعادة الإعدادات للوضع الافتراضي!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، قم بإعادة الضبط!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('theme');
            localStorage.removeItem('accentColor');
            document.documentElement.style.setProperty('--accent-color', '#58a6ff'); // اللون الأساسي الافتراضي
            document.body.classList.remove('light-theme'); // العودة إلى الوضع الليلي
            document.getElementById('toggleThemeButton').textContent = "تبديل الوضع إلى النهاري";
            document.getElementById('accentColorPicker').value = '#58a6ff';

            Swal.fire(
                'تمت إعادة الضبط!',
                'تم إعادة الإعدادات إلى الوضع الافتراضي.',
                'success'
            );
        }
    });
}

// دالة لإظهار أو إخفاء القوائم
function toggleList(element, type) {
    const currentList = element.nextElementSibling;
    const currentIcon = element.querySelector('.arrow-icon');

    if (type === 'outer') {
        document.querySelectorAll('.doctor-list').forEach(list => {
            if (list !== currentList) {
                list.style.maxHeight = "0";
                list.previousElementSibling.querySelector('.arrow-icon').classList.remove('arrow-open');
            }
        });
    } else if (type === 'inner') {
        document.querySelectorAll('.file-list').forEach(list => {
            if (list !== currentList) {
                list.style.maxHeight = "0";
                list.previousElementSibling.querySelector('.arrow-icon').classList.remove('arrow-open');
            }
        });
    }

    // فتح أو غلق القائمة الحالية
    if (currentList.style.maxHeight === "0px" || !currentList.style.maxHeight) {
        currentList.style.maxHeight = currentList.scrollHeight + "px";
        currentIcon.classList.add('arrow-open');

        // توسيع القائمة الخارجية لاحتواء القائمة الداخلية المفتوحة
        if (type === 'inner') {
            let outerList = element.closest('.doctor-list'); // الحصول على القائمة الخارجية الأقرب
            if (outerList) {
                outerList.style.maxHeight = outerList.scrollHeight + currentList.scrollHeight + "px";
            }
        }
    } else {
        currentList.style.maxHeight = "0";
        currentIcon.classList.remove('arrow-open');
        
        // تقليص القائمة الخارجية بعد غلق القائمة الداخلية
        if (type === 'inner') {
            let outerList = element.closest('.doctor-list');
            if (outerList) {
                outerList.style.maxHeight = outerList.scrollHeight - currentList.scrollHeight + "px";
            }
        }
    }
}

// دالة لعرض اقتراحات الألوان
function renderColorSuggestions() {
    const suggestionContainer = document.querySelector('.color-suggestions');
    ['#58a6ff', '#ff6347', '#ffa500', '#32cd32', '#800080'].forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('color-option');
        colorOption.style.backgroundColor = color;
        colorOption.onclick = () => changeAccentColor(color);
        suggestionContainer.appendChild(colorOption);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.querySelector('input[type="color"]');
    colorPicker.addEventListener('input', (event) => {
        document.documentElement.style.setProperty('--accent-color', event.target.value);
    });
});
