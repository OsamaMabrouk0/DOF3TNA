document.addEventListener('DOMContentLoaded', function () {
    // إظهار شاشة التحميل
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        welcomeNotification();
    }, 2000); // إخفاء شاشة التحميل بعد ثانيتين
});

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; // إخفاء الصفحة
    });

    const activePage = document.getElementById(pageId);
    activePage.classList.add('active');
    activePage.style.display = 'block'; // عرض الصفحة النشطة
}

function showLectures() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; // إخفاء الصفحات الأخرى
    });

    const lecturesPage = document.getElementById('lectures');
    lecturesPage.classList.add('active');
    lecturesPage.style.display = 'block'; // عرض صفحة المحاضرات
}

function toggleDoctors(element) {
    const allLists = document.querySelectorAll('.doctor-list');
    const allIcons = document.querySelectorAll('.arrow-icon');
    const currentList = element.nextElementSibling;
    const currentIcon = element.querySelector('.arrow-icon');

    // غلق جميع القوائم الأخرى إذا كانت مفتوحة
    allLists.forEach(list => {
        if (list !== currentList) {
            list.style.maxHeight = "0";
            list.previousElementSibling.querySelector('.arrow-icon').classList.remove('arrow-open');
        }
    });

    // فتح أو غلق القائمة الحالية
    if (currentList.style.maxHeight === "0px" || !currentList.style.maxHeight) {
        currentList.style.maxHeight = currentList.scrollHeight + "px";
        currentIcon.classList.add('arrow-open');
    } else {
        currentList.style.maxHeight = "0";
        currentIcon.classList.remove('arrow-open');
    }
}