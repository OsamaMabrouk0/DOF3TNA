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


// تحميل الملاحظات عند بداية تشغيل الصفحة
document.addEventListener('DOMContentLoaded', loadNotes);

function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => displayNote(note));
}

function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    
    if (noteText) {
        displayNote(noteText);
        saveNoteToStorage(noteText);
        noteInput.value = ''; // إعادة تعيين الحقل بعد إضافة الملاحظة
    } else {
        Swal.fire("تنبيه", "الرجاء إدخال نص للملاحظة!", "warning");
    }
}

function displayNote(noteText) {
    const notesList = document.getElementById('notes-list');
    const noteItem = document.createElement('li');
    noteItem.classList.add('note-item');
    noteItem.innerHTML = `
        <span class="note-text">${noteText}</span>
        <div class="note-actions">
            <i class="fas fa-edit" onclick="editNote(this)"></i>
            <i class="fas fa-trash" onclick="deleteNote(this)"></i>
        </div>
    `;
    notesList.appendChild(noteItem);
}

function saveNoteToStorage(noteText) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteText);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote(element) {
    const noteItem = element.parentElement.parentElement;
    const noteText = noteItem.querySelector('.note-text').textContent.trim();

    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف الملاحظة نهائيًا!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، قم بالحذف!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            noteItem.remove();
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes = notes.filter(note => note !== noteText);
            localStorage.setItem('notes', JSON.stringify(notes));
            Swal.fire('تم الحذف!', 'تم حذف الملاحظة بنجاح.', 'success');
        }
    });
}

function editNote(element) {
    const noteItem = element.parentElement.parentElement;
    const noteTextElement = noteItem.querySelector('.note-text');
    const oldText = noteTextElement.textContent.trim();

    Swal.fire({
        title: 'تعديل الملاحظة',
        input: 'text',
        inputValue: oldText,
        showCancelButton: true,
        confirmButtonText: 'حفظ',
        cancelButtonText: 'إلغاء',
        inputValidator: (value) => {
            if (!value.trim()) {
                return 'الرجاء إدخال نص للملاحظة';
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== oldText) {
            const newText = result.value.trim();
            noteTextElement.textContent = newText;
            updateNoteInStorage(oldText, newText);
            Swal.fire('تم التحديث!', 'تم تحديث الملاحظة بنجاح.', 'success');
        }
    });
}

function updateNoteInStorage(oldText, newText) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteIndex = notes.indexOf(oldText);
    if (noteIndex !== -1) {
        notes[noteIndex] = newText;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setInterval(checkTaskStatus, 60000); // فحص المهام كل دقيقة
});

function loadTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    const taskInput = document.getElementById('task-input').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;

    if (taskInput && taskDate && taskTime) {
        const task = { text: taskInput, desc: taskDesc, date: taskDate, time: taskTime, status: 'pending' };
        displayTask(task);
        saveTaskToStorage(task);
        clearTaskInputFields();
    } else {
        Swal.fire("تنبيه", "الرجاء إدخال جميع البيانات المطلوبة للمهمة!", "warning");
    }
}

function displayTask(task) {
    const tasksList = document.getElementById('tasks-list');
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.dataset.date = task.date;
    taskItem.dataset.time = task.time;
    taskItem.dataset.status = task.status;

    taskItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="task-desc">${task.desc}</span>
        <span class="task-datetime">${task.date} ${task.time}</span>
        <span class="task-status ${task.status}">${getTaskStatusText(task.status)}</span>
        <div class="task-actions">
            <i class="fas fa-check" onclick="markTaskAsCompleted(this)"></i>
            <i class="fas fa-edit" onclick="editTask(this)"></i>
            <i class="fas fa-trash" onclick="deleteTask(this)"></i>
        </div>
    `;
    tasksList.appendChild(taskItem);
}

function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTaskInputFields() {
    document.getElementById('task-input').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-time').value = '';
}

function checkTaskStatus() {
    const now = new Date();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        if (task.status === 'pending') {
            const taskDateTime = new Date(`${task.date}T${task.time}`);
            if (now >= taskDateTime) {
                task.status = 'failed';
                Swal.fire("فشل المهمة", `فشلت في تنفيذ المهمة: ${task.text}`, "error");
            }
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks(); // تحديث العرض
}

function markTaskAsCompleted(element) {
    const taskItem = element.parentElement.parentElement;
    const taskText = taskItem.querySelector('.task-text').textContent.trim();

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText) task.status = 'completed';
        return task;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function getTaskStatusText(status) {
    switch(status) {
        case 'pending': return 'قيد التنفيذ';
        case 'completed': return 'تم الإنجاز';
        case 'failed': return 'فشل التنفيذ';
    }
}

// تابع الحذف والتعديل موجودة كما هي بدون تغيير كبير

let isEditMode = false;
let editingUrl = null;

document.addEventListener("DOMContentLoaded", loadLinks);

function toggleForm() {
    const form = document.getElementById("addLinkForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
    if (form.style.display === "none") clearForm(); // إعادة التهيئة عند الإغلاق
}

function cancelEdit() {
    clearForm(); // إعادة تهيئة الحقول
    document.getElementById("addLinkForm").style.display = "none"; // إخفاء النموذج
}

function hideNoResultsMessage() {
    const searchQuery = document.getElementById("searchInput").value;
    if (!searchQuery)
        document.getElementById("noResultsMessage").style.display = "none";
}

function notify(message, icon = "success") {
    Swal.fire({
        text: message,
        icon: icon,
        timer: 2000,
        showConfirmButton: false,
        background: "#222",
        color: "#fff",
        toast: true,
        position: "top-end",
    });
}

function loadLinks() {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    savedLinks.forEach((link) => displayLink(link));
}

function saveOrUpdateLink() {
    const linkName = document.getElementById("linkName").value;
    let linkUrl = document.getElementById("linkUrl").value;
    const linkDescription = document.getElementById("linkDescription").value;
    const isImportant =
        document.getElementById("linkImportance").value === "important";

    // تأكد من أن الرابط يحتوي على http أو https
    if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
        linkUrl = "http://" + linkUrl; // أو https إذا كنت تفضل ذلك
    }

    if (!linkName || !linkUrl) {
        notify("يرجى إدخال اسم وعنوان الرابط", "error");
        return;
    }

    const link = {
        name: linkName,
        url: linkUrl,
        description: linkDescription,
        important: isImportant,
    };

    if (isEditMode) {
        showConfirmation("هل أنت متأكد من تعديل الرابط؟", () => {
            updateLink(editingUrl, link);
            notify("تم تعديل الرابط بنجاح");
            cancelEdit(); // إغلاق النموذج بعد التعديل
        });
    } else {
        saveLink(link);
        notify("تمت إضافة الرابط بنجاح");
        cancelEdit(); // إغلاق النموذج بعد الإضافة
    }
}

function updateLink(url, updatedLink) {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    const index = savedLinks.findIndex((link) => link.url === url);

    if (index !== -1) {
        savedLinks[index] = updatedLink;
        localStorage.setItem("links", JSON.stringify(savedLinks));
        document.getElementById("linksList").innerHTML = "";
        savedLinks.forEach((link) => displayLink(link));
    }
}
function displayLink(link) {
    const linkItem = document.createElement("div");
    linkItem.classList.add("link-item");
    linkItem.setAttribute("data-url", link.url); // إضافة معرّف البيانات
    if (link.important) linkItem.classList.add("important");

    const openCount = link.openCount || 0;

    linkItem.innerHTML = `
        <h3>${link.name}</h3>
        <p>${link.description}</p>
        <div class="link-icons">
            <a href="${link.url}" target="_blank" onclick="incrementOpenCount('${link.url}')">فتح الرابط</a>
            <span class="open-count"><i class="fas fa-eye"></i> ${openCount}</span>
            <button class="pin-button" onclick="toggleImportance('${link.url}')">
                <i class="fas ${link.important ? "fa-star" : "fa-star-half-alt"}"></i>
            </button>
        </div>
        <button class="delete-button" onclick="deleteLink('${link.url}')"><i class="fas fa-trash"></i></button>
        <button class="edit-button" onclick="editLink('${link.url}')"><i class="fas fa-edit"></i></button>
        <button class="share-button" onclick="shareLink('${link.url}')"><i class="fas fa-share-alt"></i></button>
    `;

    document.getElementById("linksList").appendChild(linkItem);
}


function loadLinks() {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    savedLinks.forEach((link) => displayLink(link));

    // جعل القائمة قابلة للسحب باستخدام Sortable.js
    const linksList = document.getElementById("linksList");
    new Sortable(linksList, {
        animation: 150, // مدة التحريك، اختياري لجعل السحب أكثر سلاسة
        handle: ".drag-handle", // التأكد من السحب من المقبض فقط
        onEnd: function (evt) {
            updateOrderInLocalStorage();
        },
    });
}

// دالة لتحديث ترتيب الروابط في localStorage بعد السحب
function updateOrderInLocalStorage() {
    const linkItems = document.querySelectorAll("#linksList .link-item");
    const updatedLinks = Array.from(linkItems).map((item) => {
        const url = item.getAttribute("data-url");
        return JSON.parse(localStorage.getItem("links")).find((link) => link.url === url);
    });

    localStorage.setItem("links", JSON.stringify(updatedLinks));
}




function incrementOpenCount(url) {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    const linkToUpdate = savedLinks.find((link) => link.url === url);

    if (linkToUpdate) {
        linkToUpdate.openCount = (linkToUpdate.openCount || 0) + 1; // زيادة عدد الفتحات
        localStorage.setItem("links", JSON.stringify(savedLinks)); // تحديث البيانات في localStorage

        // تحديث العرض ليظهر عدد الفتحات الجديد
        document.getElementById("linksList").innerHTML = "";
        savedLinks.forEach((link) => displayLink(link));
    }
}

const link = {
    name: linkName,
    url: linkUrl,
    description: linkDescription,
    important: isImportant,
    openCount: 0, // بدء عدد الفتحات من 0
};

function shareLink(url) {
    if (navigator.share) {
        navigator
            .share({
                title: "Check out this link!",
                url: url,
            })
            .then(() => {
                notify("تمت مشاركة الرابط بنجاح");
            })
            .catch((error) => {
                notify("فشل في مشاركة الرابط", "error");
            });
    } else {
        // Fallback for browsers that do not support the Web Share API
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = url;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        notify("تم نسخ الرابط إلى الحافظة");
    }
}

function saveLink(link) {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    savedLinks.push(link);
    localStorage.setItem("links", JSON.stringify(savedLinks));
    displayLink(link);
}

function deleteLink(url) {
    showConfirmation("هل أنت متأكد من حذف هذا الرابط؟", () => {
        const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
        const updatedLinks = savedLinks.filter((link) => link.url !== url);
        localStorage.setItem("links", JSON.stringify(updatedLinks));
        document.getElementById("linksList").innerHTML = "";
        updatedLinks.forEach((link) => displayLink(link));
        notify("تم حذف الرابط بنجاح");
    });
}

function editLink(url) {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    const linkToEdit = savedLinks.find((link) => link.url === url);

    if (linkToEdit) {
        document.getElementById("linkName").value = linkToEdit.name;
        document.getElementById("linkUrl").value = linkToEdit.url;
        document.getElementById("linkDescription").value = linkToEdit.description;
        document.getElementById("linkImportance").value = linkToEdit.important
            ? "important"
            : "normal";
        editingUrl = linkToEdit.url;
        isEditMode = true;
        toggleForm();
    }
}

function clearForm() {
    document.getElementById("linkName").value = "";
    document.getElementById("linkUrl").value = "";
    document.getElementById("linkDescription").value = "";
    document.getElementById("linkImportance").value = "normal";
    editingUrl = null;
    isEditMode = false;
}

function toggleImportance(url) {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    const linkToToggle = savedLinks.find((link) => link.url === url);

    if (linkToToggle) {
        linkToToggle.important = !linkToToggle.important;
        localStorage.setItem("links", JSON.stringify(savedLinks));
        document.getElementById("linksList").innerHTML = "";
        savedLinks.forEach((link) => displayLink(link));
        notify(
            linkToToggle.important ? "تم تمييز الرابط كمهم" : "تم إزالة تمييز الرابط"
        );
    }
}

function filterLinks() {
    const searchInput = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const linkItems = document.querySelectorAll(".link-item");
    let hasResults = false;

    linkItems.forEach((item) => {
        const linkName = item.querySelector("h3").textContent.toLowerCase();
        if (linkName.includes(searchInput)) {
            item.style.display = "block";
            hasResults = true;
        } else {
            item.style.display = "none";
        }
    });

    document.getElementById("noResultsMessage").style.display = hasResults
        ? "none"
        : "block";
}

function filterByImportance() {
    const importanceFilter = document.getElementById("filterImportance").value;
    const linkItems = document.querySelectorAll(".link-item");

    linkItems.forEach((item) => {
        if (importanceFilter === "all") {
            item.style.display = "block";
        } else {
            const isImportant = item.classList.contains("important");
            item.style.display =
                (importanceFilter === "important" && isImportant) ||
                    (importanceFilter === "normal" && !isImportant)
                    ? "block"
                    : "none";
        }
    });
}

function showConfirmation(message, callback) {
    Swal.fire({
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "إلغاء",
        background: "#222",
        color: "#fff",
    }).then((result) => {
        if (result.isConfirmed) callback();
    });
}

function toggleForm() {
    const form = document.getElementById("addLinkForm");
    const overlay = document.getElementById("modalOverlay");

    // تحقق مما إذا كانت الخلفية والنموذج مرئيين، ثم اقلب حالتهما
    if (form.style.display === "block") {
        form.style.display = "none";
        overlay.style.display = "none";
        clearForm(); // إعادة تعيين الحقول عند الإغلاق
    } else {
        form.style.display = "block";
        overlay.style.display = "block";
    }
}

// تأكد من إغلاق النموذج والخلفية عند النقر على `modalOverlay`
document.getElementById("modalOverlay").addEventListener("click", () => {
    const form = document.getElementById("addLinkForm");
    const overlay = document.getElementById("modalOverlay");
    form.style.display = "none";
    overlay.style.display = "none";
    clearForm(); // إعادة تعيين الحقول عند الإغلاق
});

function cancelEdit() {
    clearForm(); // إعادة تهيئة الحقول
    document.getElementById("addLinkForm").style.display = "none"; // إخفاء النموذج
    document.getElementById("modalOverlay").style.display = "none"; // إخفاء الخلفية
}

// تأكد من إغلاق النموذج والخلفية عند النقر على `modalOverlay`
document.getElementById("modalOverlay").addEventListener("click", () => {
    cancelEdit(); // استخدم دالة cancelEdit لإغلاق النموذج والخلفية
});

// إذا كان لديك زر لإغلاق النموذج، ربطه بنفس الدالة
document.getElementById("closeButton").addEventListener("click", cancelEdit);



// تبديل عرض القائمة المنسدلة
function toggleDropdown() {
    document.getElementById("subjectMenu").classList.toggle("show");
}

// تحميل قائمة التشغيل بناءً على المادة المختارة
function loadPlaylist(playlistId, subjectName) {
    const youtubePlaylist = document.getElementById("youtubePlaylist");
    const subjectTitle = document.getElementById("subjectTitle");

    // تحديث عنوان المادة
    subjectTitle.textContent = `فيديوهات ${subjectName}`;

    // تحديث رابط قائمة التشغيل
    youtubePlaylist.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;

    // إغلاق القائمة المنسدلة
    toggleDropdown();
}

// إغلاق القائمة المنسدلة عند النقر خارجها
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
