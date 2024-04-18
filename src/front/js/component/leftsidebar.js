// Función para cambiar el contenido principal
function changeContent(option) {
    const mainContent = document.getElementById('main-content');
    
    switch(option) {
        case 'feed':
            mainContent.innerHTML = `
                <h1>Feed</h1>
                <p>This is the feed content.</p>
            `;
            break;
        case 'profile':
            mainContent.innerHTML = `
                <h1>Profile</h1>
                <p>This is the profile content.</p>
            `;
            break;
        case 'settings':
            mainContent.innerHTML = `
                <h1>Settings</h1>
                <p>This is the settings content.</p>
            `;
            break;
        default:
            mainContent.innerHTML = `
                <h1>Main Content</h1>
                <p>Select an option from the sidebar to change this content.</p>
            `;
    }
}

// Event listener para todos los enlaces de la barra lateral
document.addEventListener('DOMContentLoaded', function() {
    const feedLink = document.getElementById('feed-link');
    const profileLink = document.getElementById('profile-link');
    const settingsLink = document.getElementById('settings-link');

    if (feedLink) {
        feedLink.addEventListener('click', function(event) {
            event.preventDefault();
            changeContent('feed');
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', function(event) {
            event.preventDefault();
            changeContent('profile');
        });
    }

    if (settingsLink) {
        settingsLink.addEventListener('click', function(event) {
            event.preventDefault();
            changeContent('settings');
        });
    }
});

// Exportar la función changeContent para usar en otros archivos
export { changeContent };