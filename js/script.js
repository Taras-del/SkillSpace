const Storage = {
    init() {
        if (!localStorage.getItem('ss_users')) localStorage.setItem('ss_users', JSON.stringify([]));
        if (!localStorage.getItem('ss_courses')) this.seedCourses();
        if (!localStorage.getItem('ss_purchases')) localStorage.setItem('ss_purchases', JSON.stringify([]));
        if (!localStorage.getItem('ss_progress')) localStorage.setItem('ss_progress', JSON.stringify([]));
        if (!localStorage.getItem('ss_cart')) localStorage.setItem('ss_cart', JSON.stringify([]));
    },
    
    seedCourses() {
        const demoCourses = [
            {
                id: 'c1', title: 'C++ ЯДРО: АЛГОРИТМИ ТА ООП', 
                shortDesc: 'Опануйте базові концепції C++, типи даних, цикли та об\'єктно-орієнтоване програмування в оновленому середовищі.',
                category: 'Програмування', level: 'Початковий', price: 900, 
                author: 'Іван Петренко', authorId: 'a1', 
                cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
                lessons: [
                    { id: 'l1', title: 'Ініціалізація C++', type: 'video' },
                    { id: 'l2', title: 'Змінні та потоки даних', type: 'video' },
                    { id: 'l3', title: 'Основи ООП', type: 'video' }
                ]
            },
            {
                id: 'c2', title: 'AutoCAD 2070: КВАНТОВЕ ПРОЄКТУВАННЯ', 
                shortDesc: 'Створюйте професійні голографічні креслення та 3D-моделі простору.',
                category: 'Дизайн та UI/UX', level: 'Середній', price: 1200, 
                author: 'Олена Коваль', authorId: 'a2', 
                cover: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
                lessons: [
                    { id: 'l1', title: 'Нейро-інтерфейс AutoCAD', type: 'video' },
                    { id: 'l2', title: 'Основи просторового креслення', type: 'video' },
                    { id: 'l3', title: 'Генерування 3D об\'єктів', type: 'video' }
                ]
            },
            {
                id: 'c3', title: 'МЕРЕЖА FIVERR: МОНЕТИЗАЦІЯ НАВИЧОК', 
                shortDesc: 'Покроковий алгоритм для інтеграції у глобальну мережу. Отримайте перші смарт-контракти.',
                category: 'Бізнес', level: 'Початковий', price: 500, 
                author: 'Максим Сидоренко', authorId: 'a3', 
                cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
                lessons: [
                    { id: 'l1', title: 'Створення нейро-портфоліо', type: 'video' },
                    { id: 'l2', title: 'Оптимізація Gigs', type: 'video' }
                ]
            }
        ];
        localStorage.setItem('ss_courses', JSON.stringify(demoCourses));
    },

    get(key) { return JSON.parse(localStorage.getItem(key)) || []; },
    set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
    
    resetData() {
        if(confirm('УВАГА: Ви впевнені, що хочете стерти всі локальні дані системи?')) {
            localStorage.clear();
            location.reload();
        }
    }
};

const UI = {
    showModal(id, mode = null) {
        document.getElementById(id).style.display = 'block';
        if(id === 'auth-modal' && mode) {
            const isReg = mode === 'register';
            const currentIsReg = !document.getElementById('reg-fields').classList.contains('hidden');
            if(isReg !== currentIsReg) Auth.toggleMode();
        }
    },
    closeModal(id) {
        document.getElementById(id).style.display = 'none';
    },
    switchTab(group, targetId) {
        document.querySelectorAll(`#view-dashboard-${group} .btn-tab`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`#view-dashboard-${group} .tab-content`).forEach(c => c.classList.remove('active'));
        event.currentTarget.classList.add('active');
        document.getElementById(`${group}-${targetId}`).classList.add('active');
    },
    createCourseCard(course) {
        return `
            <a href="#course?id=${course.id}" class="course-card">
                <img src="${course.cover || 'https://via.placeholder.com/400x200?text=DATA'}" alt="Обкладинка" class="course-cover">
                <div class="course-info">
                    <div class="course-title">${course.title}</div>
                    <div class="course-author">АРХІТЕКТОР: ${course.author || 'Невідомий'}</div>
                    <div class="text-muted small" style="font-family: 'Rajdhani', sans-serif;">${course.category || ''} // ${course.level || ''}</div>
                    <div class="course-price">${course.price} ₴</div>
                </div>
            </a>
        `;
    }
};

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

const Auth = {
    currentUser: null,
    
    init() {
        const session = localStorage.getItem('ss_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.updateUI();
        }
    },

    toggleMode() {
        const regFields = document.getElementById('reg-fields');
        const title = document.getElementById('auth-title');
        const btn = document.getElementById('auth-submit-btn');
        const toggle = document.getElementById('auth-toggle');
        
        if (regFields.classList.contains('hidden')) {
            regFields.classList.remove('hidden');
            title.innerText = 'Ініціалізація профілю';
            btn.innerText = 'Зареєструвати в ядрі';
            toggle.innerText = 'Вже є профіль? Ідентифікація';
            document.getElementById('auth-form').dataset.mode = 'register';
        } else {
            regFields.classList.add('hidden');
            title.innerText = 'Ідентифікація';
            btn.innerText = 'Увійти в систему';
            toggle.innerText = 'Створити новий профіль';
            document.getElementById('auth-form').dataset.mode = 'login';
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        const mode = e.target.dataset.mode || 'login';
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const users = Storage.get('ss_users');

        if (mode === 'register') {
            const name = document.getElementById('auth-name').value;
            const role = document.getElementById('auth-role').value;
            
            if (users.find(u => u.email === email)) {
                alert('Помилка: Суб\'єкт з таким ідентифікатором вже існує');
                return;
            }
            
            const newUser = { id: 'u_' + Date.now(), name, email, password: pass, role };
            users.push(newUser);
            Storage.set('ss_users', users);
            this.login(newUser);
        } else {
            const user = users.find(u => u.email === email && u.password === pass);
            if (user) {
                this.login(user);
            } else {
                alert('Помилка доступу: Невірний ключ');
            }
        }
    },

    login(user) {
        this.currentUser = user;
        localStorage.setItem('ss_session', JSON.stringify(user));
        UI.closeModal('auth-modal');
        this.updateUI();
        window.location.hash = user.role === 'author' ? '#dashboard-author' : '#dashboard-student';
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ss_session');
        this.updateUI();
        window.location.hash = '#home';
    },

    updateUI() {
        const authBtns = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        
        if (this.currentUser) {
            authBtns.classList.add('hidden');
            userMenu.classList.remove('hidden');
            document.getElementById('user-name').innerText = this.currentUser.name;
            
            if (this.currentUser.role === 'author') {
                document.getElementById('link-author-dash').classList.remove('hidden');
                document.querySelectorAll('.author-only').forEach(el => el.classList.remove('hidden'));
            } else {
                document.getElementById('link-author-dash').classList.add('hidden');
                document.querySelectorAll('.author-only').forEach(el => el.classList.add('hidden'));
            }
        } else {
            authBtns.classList.remove('hidden');
            userMenu.classList.add('hidden');
            document.querySelectorAll('.author-only').forEach(el => el.classList.add('hidden'));
        }
    }
};

const Courses = {
    renderHome() {
        const courses = Storage.get('ss_courses');
        document.getElementById('home-courses').innerHTML = courses.slice(0, 3).map(c => UI.createCourseCard(c)).join('');
        
        const cats = ['Програмування', 'Дизайн та UI/UX', 'Бізнес', 'Штучний інтелект'];
        const catContainer = document.getElementById('home-categories');
        if (catContainer) {
            catContainer.innerHTML = cats.map(cat => 
                `<div class="category-card" onclick="window.location.hash='#catalog'; document.getElementById('filter-category').value='${cat}'; Courses.renderCatalog();">${cat}</div>`
            ).join('');
        }
    },
    
    renderCatalog() {
        let courses = Storage.get('ss_courses');
        
        const cat = document.getElementById('filter-category').value;
        const lvl = document.getElementById('filter-level').value;
        const q = document.getElementById('global-search').value.toLowerCase();
        const sort = document.getElementById('sort-catalog').value;

        if (cat) courses = courses.filter(c => c.category === cat);
        if (lvl) courses = courses.filter(c => c.level === lvl);
        if (q) courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.shortDesc.toLowerCase().includes(q));

        if (sort === 'price-asc') courses.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') courses.sort((a, b) => b.price - a.price);
        
        document.getElementById('catalog-count').innerText = `Знайдено: ${courses.length}`;
        const container = document.getElementById('catalog-courses');
        container.innerHTML = courses.length ? courses.map(c => UI.createCourseCard(c)).join('') : '<p>Дані відсутні.</p>';
    },
    
    resetFilters() {
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-level').value = '';
        document.getElementById('global-search').value = '';
        this.renderCatalog();
    },

    renderCoursePage(id) {
        const course = Storage.get('ss_courses').find(c => c.id === id);
        if(!course) return;

        const isPurchased = Auth.currentUser && Storage.get('ss_purchases').some(p => p.userId === Auth.currentUser.id && p.courseId === id);

        document.getElementById('cd-header').innerHTML = `
            <h1 class="text-glow" style="color: var(--primary);">${course.title}</h1>
            <p style="font-size: 18px; opacity: 0.8; max-width: 800px; margin: 15px auto;">${course.shortDesc}</p>
            <div class="mt-2" style="font-family: 'Rajdhani', sans-serif; letter-spacing: 1px;">
                <span class="text-accent">АРХІТЕКТОР:</span> ${course.author} &nbsp;|&nbsp; 
                <span class="text-accent">КЛАСТЕР:</span> ${course.category} &nbsp;|&nbsp; 
                <span class="text-accent">РІВЕНЬ:</span> ${course.level}
            </div>
        `;

        document.getElementById('cd-main').innerHTML = `
            <h3 class="section-title">Структура даних</h3>
            <div class="glass-panel" style="padding: 0;">
                ${course.lessons.map((l, i) => `
                    <div style="padding:15px 25px; border-bottom:1px solid var(--border); display:flex; gap: 20px; align-items: center;">
                        <span style="color: var(--primary); font-family: 'Rajdhani'; font-size: 18px; font-weight: bold;">БЛОК 0${i+1}</span>
                        <span>${l.title}</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('cd-sidebar').innerHTML = `
            <img src="${course.cover || 'https://via.placeholder.com/400x200?text=DATA'}" alt="Cover" style="width: 100%; border-radius: var(--radius); margin-bottom: 25px; border: 1px solid var(--border);">
            <div style="font-family: 'Rajdhani'; font-size: 14px; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 5px;">ЕНЕРГОЗАТРАТИ:</div>
            <h2 class="course-price text-glow" style="font-size:36px; margin-bottom:25px; color: var(--primary);">${course.price} ₴</h2>
            ${isPurchased 
                ? `<button class="btn btn-primary w-100 magnetic-btn" onclick="window.location.hash='#player?id=${course.id}'">СИНХРОНІЗУВАТИ ДАНІ</button>`
                : `<button class="btn btn-primary w-100 magnetic-btn" onclick="Cart.add('${course.id}')">ІНІЦІЮВАТИ ТРАНЗАКЦІЮ</button>`
            }
        `;
    }
};

const Cart = {
    add(courseId) {
        if (!Auth.currentUser) {
            UI.showModal('auth-modal', 'login');
            return;
        }
        let cart = Storage.get('ss_cart');
        if (!cart.includes(courseId)) {
            cart.push(courseId);
            Storage.set('ss_cart', cart);
        } else {
            alert('Дані вже в сховищі');
        }
        this.updateBadge();
    },

    remove(courseId) {
        let cart = Storage.get('ss_cart').filter(id => id !== courseId);
        Storage.set('ss_cart', cart);
        this.render();
        this.updateBadge();
    },

    updateBadge() {
        document.getElementById('cart-badge').innerText = Storage.get('ss_cart').length;
    },

    render() {
        const cartIds = Storage.get('ss_cart');
        const courses = Storage.get('ss_courses');
        const container = document.getElementById('cart-items-container');
        
        let total = 0;
        let html = '';

        cartIds.forEach(id => {
            const c = courses.find(c => c.id === id);
            if(c) {
                total += Number(c.price);
                html += `
                    <div class="cart-item">
                        <img src="${c.cover || 'https://via.placeholder.com/120'}" alt="">
                        <div class="cart-item-info">
                            <h4 style="font-family: 'Rajdhani'; font-size: 20px; letter-spacing: 1px;">${c.title}</h4>
                            <p class="text-muted small">Архітектор: ${c.author}</p>
                        </div>
                        <div style="font-weight:bold; font-size: 22px; font-family: 'Rajdhani'; color: var(--primary); padding: 0 20px;">${c.price} ₴</div>
                        <button class="btn btn-outline magnetic-btn" onclick="Cart.remove('${c.id}')">Видалити</button>
                    </div>
                `;
            }
        });

        container.innerHTML = html || '<p>Сховище порожнє.</p>';
        document.getElementById('cart-total').innerText = total + ' ₴';
    },

    checkout() {
        if(!Auth.currentUser) return UI.showModal('auth-modal');
        let cart = Storage.get('ss_cart');
        if(cart.length === 0) return alert('Сховище порожнє');

        let purchases = Storage.get('ss_purchases');
        cart.forEach(courseId => {
            if(!purchases.some(p => p.userId === Auth.currentUser.id && p.courseId === courseId)) {
                purchases.push({ userId: Auth.currentUser.id, courseId });
            }
        });
        Storage.set('ss_purchases', purchases);
        Storage.set('ss_cart', []);
        
        alert('Транзакція підтверджена системою. Модулі завантажено.');
        this.updateBadge();
        window.location.hash = '#dashboard-student';
    }
};

const Dashboard = {
    renderStudent() {
        if(!Auth.currentUser || Auth.currentUser.role !== 'student') return;
        
        const purchases = Storage.get('ss_purchases').filter(p => p.userId === Auth.currentUser.id);
        const allCourses = Storage.get('ss_courses');
        const myCourses = purchases.map(p => allCourses.find(c => c.id === p.courseId)).filter(c => c);

        document.getElementById('student-my-courses').innerHTML = myCourses.length 
            ? myCourses.map(c => `
                <div class="course-card">
                    <img src="${c.cover || 'https://via.placeholder.com/400'}" class="course-cover">
                    <div class="course-info">
                        <h4 style="font-family: 'Rajdhani'; font-size: 20px; letter-spacing: 1px; margin-bottom: 15px;">${c.title}</h4>
                        <button class="btn btn-primary mt-1 w-100 magnetic-btn" style="margin-top: auto;" onclick="window.location.hash='#player?id=${c.id}'">АКТИВУВАТИ</button>
                    </div>
                </div>
            `).join('')
            : '<p>Синхронізовані курси відсутні.</p>';
    },

    renderAuthor() {
        if(!Auth.currentUser || Auth.currentUser.role !== 'author') return;
        
        const myCourses = Storage.get('ss_courses').filter(c => c.authorId === Auth.currentUser.id);
        
        document.getElementById('author-stats').innerHTML = `
            <div class="stat-card"><h3>${myCourses.length}</h3><p>Активних модулів</p></div>
            <div class="stat-card"><h3>0</h3><p>Підключень (Демо)</p></div>
            <div class="stat-card"><h3>0 ₴</h3><p>Енерго-дохід (Демо)</p></div>
        `;

        document.getElementById('author-courses-list').innerHTML = myCourses.length
            ? myCourses.map(c => UI.createCourseCard(c)).join('')
            : '<p>Система не знайшла ваших модулів.</p>';
    }
};

const Editor = {
    lessonCount: 0,
    
    addLessonField() {
        this.lessonCount++;
        const div = document.createElement('div');
        div.className = 'form-group pb-1 mb-1';
        div.style.borderBottom = "1px solid var(--border)";
        div.innerHTML = `
            <input type="text" placeholder="Ідентифікатор блоку ${this.lessonCount}" class="lesson-title mb-1" required style="margin-bottom:10px;">
            <input type="file" accept="video/*" class="lesson-video">
        `;
        document.getElementById('ce-lessons').appendChild(div);
    },

    saveCourse(e) {
        e.preventDefault();
        if(!Auth.currentUser || Auth.currentUser.role !== 'author') return;

        const title = document.getElementById('ce-title').value;
        const shortDesc = document.getElementById('ce-short').value;
        const category = document.getElementById('ce-category').value;
        const price = document.getElementById('ce-price').value;

        const lessons = [];
        const lessonDivs = document.getElementById('ce-lessons').children;
        
        for(let i=0; i<lessonDivs.length; i++) {
            const lTitle = lessonDivs[i].querySelector('.lesson-title').value;
            const fileInput = lessonDivs[i].querySelector('.lesson-video');
            let videoUrl = null;
            if (fileInput.files.length > 0) {
                videoUrl = URL.createObjectURL(fileInput.files[0]);
            }
            lessons.push({ id: 'l_'+Date.now()+'_'+i, title: lTitle, videoUrl });
        }

        const newCourse = {
            id: 'c_' + Date.now(),
            title, shortDesc, category, price: Number(price),
            author: Auth.currentUser.name,
            authorId: Auth.currentUser.id,
            level: 'Ініціалізація',
            cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
            lessons
        };

        const courses = Storage.get('ss_courses');
        courses.push(newCourse);
        Storage.set('ss_courses', courses);

        alert('Модуль інтегровано в систему!');
        document.getElementById('course-editor-form').reset();
        document.getElementById('ce-lessons').innerHTML = '';
        this.lessonCount = 0;
        
        UI.switchTab('author', 'my-courses-author');
        Dashboard.renderAuthor();
    }
};

const Player = {
    currentCourse: null,
    currentLessonIndex: 0,

    loadCourse(courseId) {
        this.currentCourse = Storage.get('ss_courses').find(c => c.id === courseId);
        if(!this.currentCourse || !this.currentCourse.lessons.length) return;
        
        this.currentLessonIndex = 0;
        this.renderPlaylist();
        this.playLesson(0);
    },

    renderPlaylist() {
        const progress = Storage.get('ss_progress').find(p => p.userId === Auth.currentUser.id && p.courseId === this.currentCourse.id) || { completed: [] };
        
        const html = this.currentCourse.lessons.map((l, i) => `
            <div class="playlist-item ${i === this.currentLessonIndex ? 'active' : ''} ${progress.completed.includes(l.id) ? 'completed' : ''}" 
                 onclick="Player.playLesson(${i})">
                [0${i+1}] ${l.title}
            </div>
        `).join('');
        document.getElementById('player-playlist').innerHTML = html;
    },

    playLesson(index) {
        this.currentLessonIndex = index;
        const lesson = this.currentCourse.lessons[index];
        document.getElementById('player-lesson-title').innerText = `Поточний потік: ${lesson.title}`;
        
        const container = document.getElementById('video-container');
        if (lesson.videoUrl) {
            container.innerHTML = `<video src="${lesson.videoUrl}" controls style="width:100%; height:100%; object-fit:contain; z-index: 2; position: relative;"></video>`;
        } else {
            container.innerHTML = `<div style="color: var(--text-muted); font-family: 'Rajdhani'; letter-spacing: 2px; z-index: 2; position: relative;">ПОТІК ДАНИХ ВІДСУТНІЙ. ТЕКСТОВА СИМУЛЯЦІЯ.</div>`;
        }
        
        this.renderPlaylist();
    },

    markComplete() {
        let allProgress = Storage.get('ss_progress');
        let prog = allProgress.find(p => p.userId === Auth.currentUser.id && p.courseId === this.currentCourse.id);
        
        if(!prog) {
            prog = { userId: Auth.currentUser.id, courseId: this.currentCourse.id, completed: [] };
            allProgress.push(prog);
        }
        
        const lessonId = this.currentCourse.lessons[this.currentLessonIndex].id;
        if(!prog.completed.includes(lessonId)) {
            prog.completed.push(lessonId);
            Storage.set('ss_progress', allProgress);
        }
        this.next();
    },

    next() {
        if(this.currentLessonIndex < this.currentCourse.lessons.length - 1) {
            this.playLesson(this.currentLessonIndex + 1);
        }
    },
    prev() {
        if(this.currentLessonIndex > 0) {
            this.playLesson(this.currentLessonIndex - 1);
        }
    }
};

/* FX & Interactions */
const Fx = {
    initCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if(!cursor || !follower || window.innerWidth < 900) return;

        let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
        let isCursorVisible = false;

        document.addEventListener('mousemove', (e) => {
            if (!isCursorVisible) {
                cursor.style.opacity = '1';
                follower.style.opacity = '1';
                isCursorVisible = true;
                posX = e.clientX;
                posY = e.clientY;
            }

            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
        });

        function renderLoop() {
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;
            follower.style.transform = `translate3d(${posX - 20}px, ${posY - 20}px, 0)`;
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
        
        document.querySelectorAll('a, button, .magnetic-btn, .course-card, input, select').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = `translate3d(${posX - 20}px, ${posY - 20}px, 0) scale(1.5)`;
                follower.style.backgroundColor = 'rgba(225, 29, 46, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.transform = `translate3d(${posX - 20}px, ${posY - 20}px, 0) scale(1)`;
                follower.style.backgroundColor = 'transparent';
            });
        });
    },

    initMagneticButtons() {
        if(window.innerWidth < 900) return;
        
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }
};

const App = {
    init() {
        Storage.init();
        Auth.init();
        Cart.updateBadge();
        
        document.getElementById('global-search').addEventListener('input', () => {
            if(window.location.hash !== '#catalog') window.location.hash = '#catalog';
            Courses.renderCatalog();
        });

        window.addEventListener('hashchange', this.route.bind(this));
        this.route();
        
        setTimeout(() => {
            Fx.initCursor();
            Fx.initMagneticButtons();
        }, 500);
    },

    route() {
        let hash = window.location.hash || '#home';
        const params = new URLSearchParams(hash.split('?')[1]);
        const path = hash.split('?')[0];

        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
            v.style.animation = 'none'; 
        });
        
        const view = document.getElementById('view-' + path.replace('#', ''));
        if (view) {
            view.classList.add('active');
            void view.offsetWidth;
            view.style.animation = 'fadeIn 0.4s ease forwards';
        }

        if (path === '#home') {
            Courses.renderHome();
        } else if (path === '#catalog') {
            Courses.renderCatalog();
        } else if (path === '#course') {
            Courses.renderCoursePage(params.get('id'));
        } else if (path === '#cart') {
            Cart.render();
        } else if (path === '#dashboard-student') {
            if(!Auth.currentUser) return window.location.hash = '#home';
            Dashboard.renderStudent();
        } else if (path === '#dashboard-author') {
            if(!Auth.currentUser || Auth.currentUser.role !== 'author') return window.location.hash = '#home';
            Dashboard.renderAuthor();
        } else if (path === '#player') {
            if(!Auth.currentUser) return window.location.hash = '#home';
            Player.loadCourse(params.get('id'));
        }
        
        window.scrollTo(0,0);
        
        setTimeout(() => { Fx.initMagneticButtons(); }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());