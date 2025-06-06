// Enrutamiento simple
const routes = {
    '/': homeView,
    '/cartelera': carteleraView,
    '/historia': historiaView,
    '/contacto': contactoView,
    '/admin33860988': adminView,
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

// En // En renderView, agregamos un pequeño retraso para evitar problemas en móviles
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
            } else if (window.location.hash === '#/admin33860988') {
                setupAdminForm();
                loadAdminShows();
            }

            // Configurar los eventos del navbar después de renderizar
            setupNavbarCollapse();

            // Reasignar eventos para los enlaces
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
                link.addEventListener('click', handleLinkClick);
            });
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
});

function handleLinkClick(e) {
    e.preventDefault();
    const path = e.currentTarget.getAttribute('href').slice(1);
    navigateTo(path);
}

// Función para cerrar el menú colapsado al hacer clic en un enlace
function setupNavbarCollapse() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('#navbarNav');

    navLinks.forEach(link => {
        // Limpiamos eventos previos para evitar duplicados
        link.removeEventListener('click', closeNavbarOnClick);
        link.addEventListener('click', closeNavbarOnClick);
    });

    function closeNavbarOnClick() {
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    }
}

// Vistas
// function homeView() {
//     return `
//         <div class="container mt-4">
//             <div id="next-show-banner" class="banner">
                
//                 <div id="next-show-content"></div>
//             </div>
//             <div class="newsletter">
//                 <h4>¡Suscribite a nuestro newsletter!</h4>
//                 <p>Recibí todas las novedades del Teatro Español Pigüé en tu mail.</p>
//                 <form id="newsletter-form">
//                     <input type="text" name="name" id="name" required placeholder="Nombre y apellido" class="campo">
//                     <input type="email" name="email" id="email" required placeholder="Dirección de mail" class="campo">
//                     <input type="submit" value="Suscribirme" class="boton">
//                 </form>
//             </div>
//         </div>
//     `;
// }

function homeView() {
    return `
        <div class="container mt-4">
            <div id="next-show-banner" class="banner">
                <div id="showsCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner" id="next-show-content">
                        <!-- Elementos del carrusel se cargan dinámicamente -->
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#showsCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#showsCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                </div>
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
            <!-- Sección Historia -->
            <div class="row historia-section">
                <div class="col-md-6 historia-text">
                    <h1 class="text-center mb-4">HISTORIA</h1>
                    <h2><strong>Un edificio único,<br> con una historia centenaria.</strong></h2>
                    <p>La Sociedad Española de Socorros Mutuos de Pigüé fue fundada el 14 de junio de 1894, apenas diez años después de la creación de la ciudad. Treinta años más tarde, se emprendió una gran iniciativa: la construcción de un teatro, convirtiéndose en la única sala concebida y edificada desde el inicio de la ciudad con ese propósito, <strong>inaugurado el 26 de abril de 1926.</strong></p>
                    <p><strong>Declarado monumento histórico provincial</strong> mediante la Ley 11535 en mayo de 1994, el edificio del Teatro Español fue diseñado por el ingeniero Marseillán, oriundo de Bahía Blanca, y construido por la empresa de Don Domingo Oresti. Este destacado empresario, reconocido por su labor en numerosas obras particulares e institucionales en Pigüé y la región, dejó un legado que aún es visible en la actualidad.</p>
                    <p>El teatro, con su clásico formato en herradura, cuenta con palcos altos y bajos, palcos laterales y platea, albergando hasta <strong>446 espectadores.</strong> Su extraordinaria acústica lo ha consolidado como un espacio de referencia para la cultura y las artes escénicas.</p>
                    <p>Entre 2021 y 2024, la Sociedad Española estableció un convenio de uso con la Municipalidad de Saavedra-Pigüé, retomando una idea impulsada por Jorge Capotosti, quien no pudo concretarla en vida durante su gestión como concejal y secretario de cultura municipal. No obstante, a partir de 2025, la Sociedad Española decidió retomar la administración plena del teatro, con el propósito de focalizarse en la <strong>conmemoración del centenario de la construcción del edificio.</strong> En este nuevo ciclo, la gestión del espacio se encuentra a cargo de Anita Lopez Holzmann y Bruno Alberstein.</p>
                    <p>De esta forma, se proyecta la puesta en valor del edificio y se garantiza el acceso transversal para toda la comunidad artística, reafirmando su papel fundamental en la vida cultural de Pigüé y la región.</p>
                </div>
                <div class="col-md-6 historia-image-container">
                    <img src="images/teatropanoramica.jpg" alt="Teatro Español Panorámica" class="historia-image">
                </div>
            </div>

            <!-- Sección Ubicación -->
            <div class="row historia-section ubicacion-section">
                <div class="col-md-6 historia-image-container order-md-1 order-2">
                    <img src="images/mapaPBA.png" alt="Mapa de la Provincia de Buenos Aires" class="historia-image">
                </div>
                <div class="col-md-6 historia-text order-md-2 order-1">
                    <h1 class="text-center mb-4">UBICACIÓN</h1>
                    <h2><strong>En el sudoeste,<br> el lugar del encuentro.</strong></h2>
                    <p><strong>La localidad de Pigüé, cabecera del Partido de Saavedra</strong>, se encuentra ubicada en el cruce de las rutas Nacional Nº 33 y Provincial Nº 67, lo que denota una <strong>posición estratégica</strong> no sólo a nivel local y regional, sino también nacional.</p>
                    <p>La ruta Nacional Nº 33 constituye un eje natural de unión hacia el norte (Trenque Lauquen, Rosario) hacia el sur (Bahía Blanca, Viedma) y las posibles conexiones con las rutas nacionales Nº 3, 22 y 35. En tanto, la ruta Provincial Nº 67, es la conexión hacia el oeste con Puán y Santa Rosa (La Pampa) y hacia el este con Coronel Suárez y el centro de la provincia de Buenos Aires, mediante las rutas nacionales 226 y 228, y la 76 y 85 de la red vial provincial.</p>
                    <p>El Teatro Español de Pigüé se encuentra ubicado en la <strong>calle España 120</strong>, entre las calles Manuel Belgrano y Cdad. de Rodez, solo una cuadra de la Av. E. Casey, una de las arterias principales de la ciudad.</p>
                </div>
            </div>
        </div>
    `;
}

function contactoView() {
    return `
        <div class="container mt-4 contacto-container">
            <h1>CONTACTO</h1>
            <form id="contacto-form" class="contacto-form">
                <div class="form-group">
                    <input type="text" id="subject" name="subject" placeholder="Asunto" required>
                </div>
                <div class="form-group">
                    <input type="text" id="name" name="name" placeholder="Nombre" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email" placeholder="Correo Electrónico" required>
                </div>
                <div class="form-group">
                    <textarea id="message" name="message" placeholder="Escribinos tu mensaje acá" required></textarea>
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
// function loadNextShow() {
//     fetch('api/get_next_show.php')
//         .then(res => {
//             if (!res.ok) {
//                 throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
//             }
//             return res.json();
//         })
//         .then(response => {
//             const content = document.getElementById('next-show-content');
//             if (!content) return;

//             if (response.success && response.data) {
//                 const show = response.data;

//                 // Validar imágenes y establecer valores predeterminados
//                 const bannerImage = show.bannerImage && show.bannerImage.trim() !== '' ? show.bannerImage : show.image;
//                 const fallbackImage = show.image && show.image.trim() !== '' ? show.image : 'ruta/a/imagen-por-defecto.jpg';

//                 // Parsear la fecha manualmente para evitar problemas de zona horaria
//                 const [year, month, day] = show.date.split('-');
//                 const parsedDate = new Date(year, month - 1, day); // month es 0-based en JavaScript

//                 content.innerHTML = `
//                     <a href="#/show/${show.id_show}">
//                         <h2>PRÓXIMAMENTE</h2>
//                         <picture>
//                             <source media="(min-width: 750px)" srcset="${bannerImage}">
//                             <img src="${fallbackImage}" alt="${show.name}" class="banner-image">
//                         </picture>
//                     </a>
//                     <div class="banner-info">
//                         <h2>${show.name}</h2>
//                         <p>${parsedDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} - ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'}</p>
//                         <a href="#/show/${show.id_show}">
//                             <button class="buy-button">Comprar entradas</button>
//                         </a>
//                     </div>
//                 `;
//             } else {
//                 content.innerHTML = '';
//                 content.style.display = 'none';
//             }
//         })
//         .catch(error => {
//             console.error('Error al cargar el próximo espectáculo:', error);
//             const content = document.getElementById('next-show-content');
//             if (content) {
//                 content.innerHTML = '';
//                 content.style.display = 'none';
//             }
//         });
// }

function loadNextShow() {
    fetch('api/get_upcoming_shows.php')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(response => {
            const content = document.getElementById('next-show-content');
            if (!content) return;

            if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
                const shows = response.data;

                content.innerHTML = shows.map((show, index) => {
                    const bannerImage = show.bannerImage && show.bannerImage.trim() !== '' ? show.bannerImage : show.image;
                    const fallbackImage = show.image && show.image.trim() !== '' ? show.image : 'ruta/a/imagen-por-defecto.jpg';

                    const [year, month, day] = show.date.split('-');
                    const parsedDate = new Date(year, month - 1, day);

                    return `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <a href="#/show/${show.id_show}">
                                <picture>
                                    <source media="(min-width: 750px)" srcset="${bannerImage}">
                                    <img src="${fallbackImage}" alt="${show.name}" class="d-block w-100 banner-image">
                                </picture>
                            </a>
                        </div>
                    `;
                }).join('');

                // Add "Ver cartelera completa" button below the carousel
                const carouselContainer = document.getElementById('showsCarousel');
                if (carouselContainer) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'full-cartelera-container';
                    buttonContainer.innerHTML = `
                        <a href="https://www.teatropigue.com.ar/#/cartelera" class="btn btn-full-cartelera">Ver cartelera completa</a>
                    `;
                    carouselContainer.insertAdjacentElement('afterend', buttonContainer);
                }

                // Initialize carousel only if not already initialized
                const carouselElement = document.getElementById('showsCarousel');
                if (carouselElement && !carouselElement._carousel) {
                    carouselElement._carousel = new bootstrap.Carousel(carouselElement, {
                        interval: 2000, // Change slide every 2 seconds
                        wrap: true
                    });
                }
            } else {
                content.innerHTML = '';
                content.parentElement.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error al cargar los espectáculos futuros:', error);
            const content = document.getElementById('next-show-content');
            if (content) {
                content.innerHTML = '';
                content.parentElement.style.display = 'none';
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

                container.innerHTML = filteredShows.map(show => {
                    // Parsear la fecha manualmente para evitar problemas de zona horaria
                    let formattedDate = 'Fecha no disponible';
                    if (show.date) {
                        const [year, month, day] = show.date.split('-');
                        const parsedDate = new Date(year, month - 1, day); // month es 0-based en JavaScript
                        formattedDate = parsedDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
                    }

                    return `
                        <div class="show-card">
                            ${(show.image && show.image !== '') ? `<img src="${show.image}" alt="${show.name}" class="show-image">` : ''}
                            <div class="show-info">
                                <h3>${show.name}</h3>
                                <p>${formattedDate} <br> ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'}</p>
                                <a href="#/show/${show.id_show}">
                                    <button>+ Info</button>
                                </a>
                            </div>
                        </div>
                    `;
                }).join('');
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
        .then(response => {
            console.log('Respuesta de get_show.php:', response); // Depuración

            // Verificar si la respuesta tiene éxito y contiene datos
            if (!response.success || !response.data) {
                throw new Error(response.message || 'No se encontraron datos del espectáculo');
            }

            const show = response.data; // Extraemos los datos del espectáculo
            const content = document.getElementById('show-detail-content');
            if (!content) return;

  
            // Parsear la fecha manualmente para evitar problemas de zona horaria
            const [year, month, day] = show.date.split('-');
            const parsedDate = new Date(year, month - 1, day); // month es 0-based en JavaScript

            // Mostrar los datos en la interfaz
            content.innerHTML = `
                <div class="show-image-container">
                    ${(show.image && show.image !== '') ? `<img src="${show.image}" alt="${show.name || 'Espectáculo'}" class="show-image">` : ''}
                </div>
                <div class="show-info-container">
                    <h2>${show.name || 'Nombre no disponible'}</h2>
                    <p class="show-description">${show.description || 'Descripción no disponible'}</p>
                </div>
                <div class="show-extra-container">
                <p>${parsedDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p><strong>Hora:</strong> ${show.hora ? show.hora.substring(0, 5) : 'Hora no disponible'} hs</p>
                    <a href="${(show.link && show.link.startsWith('http')) ? show.link : (show.link ? 'https://' + show.link : '#')}" target="_blank" rel="noopener noreferrer">
                        <button class="buy-button">Comprar entradas</button>
                    </a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al cargar el detalle del espectáculo:', error);
            const content = document.getElementById('show-detail-content');
            if (content) {
                content.innerHTML = `<p>Error al cargar el detalle del espectáculo: ${error.message}</p>`;
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
    if (!form) {
        console.error('Formulario admin-form no encontrado');
        return;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Capturar valores directamente de los campos para depuración
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const mes = document.getElementById('mes').value;
        const date = document.getElementById('date').value;
        const hora = document.getElementById('hora').value;
        const link = document.getElementById('link').value;
        const editId = document.getElementById('edit-id').value;

        console.log('Valores capturados directamente:');
        console.log('name:', name);
        console.log('description:', description);
        console.log('price:', price);
        console.log('mes:', mes);
        console.log('date:', date);
        console.log('hora:', hora);
        console.log('link:', link);
        console.log('edit-id:', editId);

        // Construir FormData manualmente
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('mes', mes);
        formData.append('date', date);
        formData.append('hora', hora);
        formData.append('link', link);
        formData.append('edit-id', editId);

        // Manejar archivos
        const imageInput = document.getElementById('image');
        const bannerImageInput = document.getElementById('bannerImage');
        if (imageInput.files.length > 0) {
            formData.append('image', imageInput.files[0]);
        }
        if (bannerImageInput.files.length > 0) {
            formData.append('bannerImage', bannerImageInput.files[0]);
        }

        // Imprimir FormData para depuración
        console.log('Datos en FormData antes de enviar:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Validar que los campos requeridos tengan valores
        if (!name || !mes || !date || !hora || !link) {
            Swal.fire('Error', 'Por favor, complete todos los campos requeridos', 'error');
            return;
        }

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
            Swal.fire('Error', 'Error al guardar el espectáculo: ' + error.message, 'error');
        }
    });
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
                        ${(show.image && show.image !== '') ? `<img src="${show.image}" alt="${show.name}" class="show-image">` : ''}
                        <div class="show-info">
                            <h3>${show.name}</h3>
                            <h3>${show.date}</h3>
                            <h3>${show.hora}</h3>
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
