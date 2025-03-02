// Enrutamiento simple
const routes = {
    '/': homeView,
    '/cartelera': carteleraView,
    '/historia': historiaView,
    '/contacto': contactoView,
    '/admin': adminView,
    '/show/:id': showDetailView
};

function navigateTo(path) {
    console.log('Navigating to:', path); // Depuración
    window.history.pushState({}, '', '#' + path);
    renderView();
}

function parseRoute() {
    const path = window.location.hash.slice(1) || '/';
    console.log('Parsing route:', path); // Depuración
    const routeKeys = Object.keys(routes);
    for (let route of routeKeys) {
        const regex = new RegExp('^' + route.replace(/:\w+/g, '([\\w-]+)') + '$');
        const match = path.match(regex);
        if (match) {
            return { handler: routes[route], params: match.slice(1) };
        }
    }
    return { handler: routes['/'], params: [] };
}

// En renderView, agregamos un pequeño retraso para evitar problemas en móviles
function renderView() {
    try {
        console.log('Rendering view...');
        const { handler, params } = parseRoute();
        const app = document.getElementById('app');
        if (!app) {
            console.error('Element with id "app" not found');
            return;
        }
        // Agregamos un pequeño retraso para mejorar el rendimiento en móviles
        setTimeout(() => {
            app.innerHTML = handler(...params);

            // Lógica específica según la vista después de renderizar
            if (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#/home') {
                console.log('Loading home view specific logic...');
                setupNewsletterForm();
                loadNextShow();
            } else if (window.location.hash.startsWith('#/cartelera')) {
                loadCartelera();
            } else if (window.location.hash.startsWith('#/show/')) {
                const id = window.location.hash.split('/').pop();
                loadShowDetail(id);
            } else if (window.location.hash === '#/contacto') {
                setupContactoForm();
            } else if (window.location.hash === '#/admin') {
                setupAdminForm();
                loadAdminShows();
            }
        }, 100);
    } catch (error) {
        console.error('Error in renderView:', error);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<p>Error al cargar la página. Por favor, recargue.</p>';
        }
    }
}

// Aseguramos que los eventos no se acumulen en móviles
window.addEventListener('popstate', () => {
    console.log('Popstate event triggered');
    renderView();
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');
    renderView();

    // Limpiamos y reasignamos eventos para los enlaces
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.removeEventListener('click', handleLinkClick); // Evitamos duplicados
        link.addEventListener('click', handleLinkClick);
    });
});

function handleLinkClick(e) {
    e.preventDefault();
    const path = e.currentTarget.getAttribute('href').slice(1);
    navigateTo(path);
}

// Vistas
function homeView() {
    return `
        <div class="container mt-4">
            <div id="next-show-banner" class="banner">
                <h2>PRÓXIMAMENTE</h2>
                <div id="next-show-content"></div>
            </div>
            <div class="newsletter">
                <h4>¡Suscribite a nuestro newsletter!</h4>
                <p>Recibí todas las novedades del Teatro Español Pigüé en tu mail.</p>
                <form id="newsletter-form">
                    <input type="text" name="name" id="name" required placeholder="Nombre y apellido" class="campo">
                    <input type="email" name="email" id="email" required placeholder="Dirección de mail" class="campo">
                    <input type="submit" value="Suscribirme" class="boton">
                </form>
            </div>
        </div>
    `;
}

function carteleraView() {
    return `
        <div class="container mt-4">
            <h2>Cartelera de espectáculos</h2>
            <div class="search-bar">
                <input type="text" id="search-input" placeholder="Buscar espectáculo...">
                <select id="month-select">
                    <option value="">Seleccionar mes</option>
                    <!-- Meses se llenan dinámicamente -->
                </select>
            </div>
            <div id="shows-container" class="shows-container">
                <!-- Espectáculos se cargan dinámicamente -->
            </div>
        </div>
    `;
}

function historiaView() {
    return `
        <div class="container mt-4 historia-container">
            <div class="historia-content">
                <h1>HISTORIA</h1>
                <p><strong>Un edificio único, con una historia centenaria.</strong></p>
                <p>La Sociedad Española de Socorros Mutuos de Pigüé fue fundada el 14 de junio de 1894...</p>
                <!-- Resto del contenido de Historia.js -->
            </div>
            <div class="historia-image-container">
                <img src="images/teatropanoramica.jpg" alt="Teatro Español Panorámica" class="historia-image">
            </div>
        </div>
    `;
}

function contactoView() {
    return `
        <div class="container mt-4 contacto-container">
            <h2>Contacto</h2>
            <form id="contacto-form" class="contacto-form">
                <div class="form-group">
                    <label for="subject">Asunto:</label>
                    <input type="text" id="subject" name="subject" required>
                </div>
                <div class="form-group">
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Mensaje:</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    `;
}

function adminView() {
    return `
        <div class="container mt-4 admin-tep-container">
            <div class="admin-tep-left">
                <h1 id="admin-title">Cargar Nuevo Espectáculo</h1>
                <form id="admin-form">
                    <label>Nombre:</label>
                    <input type="text" id="name" required>
                    <label>Descripción:</label>
                    <textarea id="description" required></textarea>
                    <label>Precio:</label>
                    <input type="number" id="price" required>
                    <label>Mes:</label>
                    <input type="text" id="mes" required>
                    <label>Fecha:</label>
                    <input type="date" id="date" required>
                    <label>Hora:</label>
                    <input type="time" id="hora" required>
                    <label>Link:</label>
                    <input type="text" id="link" required>
                    <label>Imagen (para celulares):</label>
                    <input type="file" id="image" accept="image/*">
                    <label>Imagen Banner (para computadoras/tablets):</label>
                    <input type="file" id="bannerImage" accept="image/*">
                    <input type="hidden" id="edit-id">
                    <button type="submit">Guardar Espectáculo</button>
                </form>
            </div>
            <div class="admin-tep-right">
                <h1 class="center-title">Espectáculos Cargados</h1>
                <div class="search-bar">
                    <input type="text" id="admin-search" placeholder="Buscar espectáculo...">
                    <select id="admin-month-select">
                        <option value="">Seleccionar mes</option>
                    </select>
                </div>
                <div id="admin-shows-container" class="shows-container"></div>
            </div>
        </div>
    `;
}

function showDetailView(id) {
    return `
        <div class="container mt-4 show-detail-container">
            <div id="show-detail-content">
                <!-- Contenido cargado dinámicamente -->
            </div>
        </div>
    `;
}

// Configurar el formulario del Newsletter
function setupNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(form);
            formData.append('register', 'true');

            try {
                const response = await fetch('guardar.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        form.reset();
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: result.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al enviar los datos. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }, { once: true });
    }
}

// Cargar el próximo espectáculo
function loadNextShow() {
    fetch('api/get_next_show.php')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(response => {
            const content = document.getElementById('next-show-content');
            if (!content) return;

            if (response.success && response.data) {
                const show = response.data;
                content.innerHTML = `
                    <a href="#/show/${show.id_show}">
                        <picture>
                            <source media="(min-width: 750px)" srcSet="uploads/${show.bannerImage || show.image}">
                            <img src="uploads/${show.image}" alt="${show.name}" class="banner-image">
                        </picture>
                    </a>
                    <div class="banner-info">
                        <h2>${show.name}</h2>
                        <p>${new Date(show.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} - ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'}</p>
                        <a href="#/show/${show.id_show}">
                            <button class="buy-button">Comprar entradas</button>
                        </a>
                    </div>
                `;
            } else {
                content.innerHTML = `
                    <p style="text-align: center; color: #666;">No hay espectáculos próximos disponibles.</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error al cargar el próximo espectáculo:', error);
            const content = document.getElementById('next-show-content');
            if (content) {
                content.innerHTML = `
                    <p style="text-align: center; color: #666;">Error al cargar el próximo espectáculo.</p>
                `;
            }
        });
}

// Cargar cartelera
function loadCartelera() {
    fetch('api/get_shows.php')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(response => {
            // Asegurarnos de que response.data exista y sea un array
            if (!response.success || !Array.isArray(response.data)) {
                throw new Error(response.message || 'La respuesta del servidor no contiene un array válido de espectáculos');
            }

            const shows = response.data; // Extraemos el array de data
            const container = document.getElementById('shows-container');
            const monthSelect = document.getElementById('month-select');
            const searchInput = document.getElementById('search-input');

            if (!container || !monthSelect || !searchInput) return;

            const months = [...new Set(shows.map(show => show.mes))];
            monthSelect.innerHTML = '<option value="">Seleccionar mes</option>';
            months.forEach(month => {
                monthSelect.innerHTML += `<option value="${month}">${month}</option>`;
            });

            function renderShows(filter = '', month = '') {
                const filteredShows = shows.filter(show => {
                    const matchesSearch = show.name.toLowerCase().includes(filter.toLowerCase());
                    const matchesMonth = month ? show.mes === month : true;
                    return matchesSearch && matchesMonth;
                });

                container.innerHTML = filteredShows.map(show => `
                    <div class="show-card">
                        ${(show.image && show.image !== '') ? `<img src="uploads/${show.image}" alt="${show.name}" class="show-image">` : ''}
                        <div class="show-info">
                            <h3>${show.name}</h3>
                            <p>${new Date(show.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} <br> ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'}</p>
                            <a href="#/show/${show.id_show}">
                                <button>+ Info</button>
                            </a>
                        </div>
                    </div>
                `).join('');
            }

            renderShows();

            searchInput.addEventListener('input', () => {
                renderShows(searchInput.value, monthSelect.value);
            }, { once: true });
            monthSelect.addEventListener('change', () => {
                renderShows(searchInput.value, monthSelect.value);
            }, { once: true });
        })
        .catch(error => {
            console.error('Error al cargar la cartelera:', error);
            const container = document.getElementById('shows-container');
            if (container) {
                container.innerHTML = `<p>Error al cargar los espectáculos: ${error.message}</p>`;
            }
        });
}

// Cargar detalle del espectáculo
function loadShowDetail(id) {
    fetch(`api/get_show.php?id=${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(show => {
            const content = document.getElementById('show-detail-content');
            if (!content) return;

            content.innerHTML = `
                <div class="show-image-container">
                    ${(show.image && show.image !== '') ? `<img src="uploads/${show.image}" alt="${show.name}" class="show-image">` : ''}
                </div>
                <div class="show-info-container">
                    <h2>${show.name}</h2>
                    <p>${show.description}</p>
                </div>
                <div class="show-extra-container">
                    <p><strong>Fecha:</strong> ${new Date(show.date).toLocaleDateString('es-ES')}</p>
                    <p><strong>Hora:</strong> ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'} hs</p>
                    <a href="${show.link?.startsWith('http') ? show.link : 'https://' + show.link}" target="_blank" rel="noopener noreferrer">
                        <button class="buy-button">Comprar entradas</button>
                    </a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al cargar el detalle del espectáculo:', error);
            const content = document.getElementById('show-detail-content');
            if (content) {
                content.innerHTML = '<p>Error al cargar el detalle del espectáculo.</p>';
            }
        });
}

// Configurar formulario de contacto
function setupContactoForm() {
    const form = document.getElementById('contacto-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch('api/enviar_contacto.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                }).then(() => {
                    navigateTo('/');
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al enviar el mensaje. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }, { once: true });
}

// Configurar formulario de admin
function setupAdminForm() {
    const form = document.getElementById('admin-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const id = document.getElementById('edit-id').value;

        try {
            const response = await fetch('api/save_show.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                Swal.fire('Éxito', result.message, 'success');
                form.reset();
                document.getElementById('edit-id').value = '';
                document.getElementById('admin-title').textContent = 'Cargar Nuevo Espectáculo';
                loadAdminShows();
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al guardar el espectáculo:', error);
            Swal.fire('Error', 'Error al guardar el espectáculo', 'error');
        }
    }, { once: true });
}

// Cargar espectáculos en el admin
function loadAdminShows() {
    fetch('api/get_shows.php')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(response => {
            // Asegurarnos de que response.data exista y sea un array
            if (!response.success || !Array.isArray(response.data)) {
                throw new Error(response.message || 'La respuesta del servidor no contiene un array válido de espectáculos');
            }

            const shows = response.data; // Extraemos el array de data
            const container = document.getElementById('admin-shows-container');
            const searchInput = document.getElementById('admin-search');
            const monthSelect = document.getElementById('admin-month-select');

            if (!container || !searchInput || !monthSelect) return;

            const months = [...new Set(shows.map(show => show.mes))];
            monthSelect.innerHTML = '<option value="">Seleccionar mes</option>';
            months.forEach(month => {
                monthSelect.innerHTML += `<option value="${month}">${month}</option>`;
            });

            function renderAdminShows(filter = '', month = '') {
                const filteredShows = shows.filter(show => {
                    const matchesSearch = show.name.toLowerCase().includes(filter.toLowerCase());
                    const matchesMonth = month ? show.mes === month : true;
                    return matchesSearch && matchesMonth;
                });

                container.innerHTML = filteredShows.map(show => `
                    <div class="show-card">
                        ${(show.image && show.image !== '') ? `<img src="uploads/${show.image}" alt="${show.name}" class="show-image">` : ''}
                        <div class="show-info">
                            <h3>${show.name}</h3>
                            <p>${show.description}</p>
                            <button onclick="editShow(${show.id_show})">Modificar</button>
                            <button onclick="deleteShow(${show.id_show})">Eliminar</button>
                        </div>
                    </div>
                `).join('');
            }

            renderAdminShows();

            searchInput.addEventListener('input', () => {
                renderAdminShows(searchInput.value, monthSelect.value);
            }, { once: true });
            monthSelect.addEventListener('change', () => {
                renderAdminShows(searchInput.value, monthSelect.value);
            }, { once: true });
        })
        .catch(error => {
            console.error('Error al cargar espectáculos:', error);
            const container = document.getElementById('admin-shows-container');
            if (container) {
                container.innerHTML = `<p>Error al cargar los espectáculos: ${error.message}</p>`;
            }
        });
}

function editShow(id) {
    fetch(`api/get_show.php?id=${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(show => {
            document.getElementById('name').value = show.name;
            document.getElementById('description').value = show.description;
            document.getElementById('price').value = show.price;
            document.getElementById('mes').value = show.mes;
            document.getElementById('date').value = show.date;
            document.getElementById('hora').value = show.hora || '';
            document.getElementById('link').value = show.link;
            document.getElementById('edit-id').value = show.id_show;
            document.getElementById('admin-title').textContent = 'Modificar Espectáculo';
        })
        .catch(error => {
            console.error('Error al cargar el espectáculo para edición:', error);
        });
}

function deleteShow(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás deshacer esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then(result => {
        if (result.isConfirmed) {
            fetch('api/delete_show.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${id}`,
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result.success) {
                        Swal.fire('Éxito', result.message, 'success');
                        loadAdminShows();
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar el espectáculo:', error);
                    Swal.fire('Error', 'Error al eliminar el espectáculo', 'error');
                });
        }
    });
}