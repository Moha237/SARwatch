// Initialize the map
let map;
let currentLayer = null;
let turisMarker = null;
let laPalmaMarker = null;

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setupEventListeners();
    setDefaultDates();
    setupSARPanelListeners();
});

// Initialize Leaflet map
function initMap() {
    map = L.map('map').setView([20, 0], 2);

    // Add base tile layer (dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Update coordinates on mouse move
    map.on('mousemove', function(e) {
        document.getElementById('coordinates').textContent =
            `Lat: ${e.latlng.lat.toFixed(4)}, Lon: ${e.latlng.lng.toFixed(4)}`;
    });

    // Update zoom level
    map.on('zoomend', function() {
        document.getElementById('zoom-level').textContent =
            `Zoom: ${map.getZoom()}`;
    });

    // Add example SAR overlay markers (placeholder for actual SAR data)
    addExampleMarkers();

    // Add Turís, Valencia marker
    addTurisMarker();

    // Add La Palma volcano marker
    addLaPalmaMarker();
}

// Add example markers to demonstrate functionality
function addExampleMarkers() {
    const exampleLocations = [
        { lat: 40.7128, lon: -74.0060, name: 'Nueva York', event: 'urbano' },
        { lat: 34.0522, lon: -118.2437, name: 'Los Ángeles', event: 'incendio' },
        { lat: 51.5074, lon: -0.1278, name: 'Londres', event: 'urbano' },
        { lat: 35.6762, lon: 139.6503, name: 'Tokio', event: 'terremoto' },
        { lat: -23.5505, lon: -46.6333, name: 'São Paulo', event: 'inundacion' },
        { lat: -33.8688, lon: 151.2093, name: 'Sydney', event: 'incendio' },
        { lat: 19.4326, lon: -99.1332, name: 'Ciudad de México', event: 'terremoto' },
        { lat: 28.6139, lon: 77.2090, name: 'Nueva Delhi', event: 'urbano' }
    ];

    exampleLocations.forEach(location => {
        const marker = L.circleMarker([location.lat, location.lon], {
            radius: 8,
            fillColor: getEventColor(location.event),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(map);

        marker.bindPopup(`
            <div style="color: #0a0e27; font-weight: 600;">
                <strong>${location.name}</strong><br>
                Evento: ${location.event}<br>
                Coordenadas: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}
            </div>
        `);
    });
}

// Get color based on event type
function getEventColor(eventType) {
    const colors = {
        'incendio': '#ff4444',
        'inundacion': '#4444ff',
        'terremoto': '#ff8800',
        'huracan': '#8844ff',
        'deforestacion': '#44ff44',
        'urbano': '#00d4ff'
    };
    return colors[eventType] || '#ffffff';
}

// Set default dates (today and 7 days ago)
function setDefaultDates() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    document.getElementById('date-end').valueAsDate = today;
    document.getElementById('date-start').valueAsDate = weekAgo;
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar toggle
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
    });

    // Apply filters button
    document.getElementById('applyFilters').addEventListener('click', applyFilters);

    // Reset filters button
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Time range selector
    document.getElementById('time-range').addEventListener('change', function(e) {
        if (e.target.value !== 'custom') {
            updateDatesByTimeRange(e.target.value);
        }
    });

    // Zone selector
    document.getElementById('zone-select').addEventListener('change', function(e) {
        zoomToZone(e.target.value);
    });
}

// Apply filters
function applyFilters() {
    const zone = document.getElementById('zone-select').value;
    const dateStart = document.getElementById('date-start').value;
    const dateEnd = document.getElementById('date-end').value;
    const eventType = document.getElementById('event-type').value;
    const resolution = document.getElementById('resolution').value;

    console.log('Aplicando filtros:', {
        zone,
        dateStart,
        dateEnd,
        eventType,
        resolution
    });

    // Show notification (in a real app, this would fetch SAR data)
    showNotification('Filtros aplicados. Buscando imágenes SAR...');

    // In a real application, you would:
    // 1. Make API call to fetch SAR imagery
    // 2. Update map with new data
    // 3. Display SAR imagery layers
}

// Reset filters
function resetFilters() {
    document.getElementById('zone-select').value = '';
    document.getElementById('event-type').value = '';
    document.getElementById('resolution').value = 'high';
    document.getElementById('time-range').value = '7d';
    setDefaultDates();

    // Reset map view
    map.setView([20, 0], 2);

    showNotification('Filtros restablecidos');
}

// Update dates based on time range selection
function updateDatesByTimeRange(range) {
    const today = new Date();
    const startDate = new Date(today);

    switch(range) {
        case '24h':
            startDate.setDate(startDate.getDate() - 1);
            break;
        case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
    }

    document.getElementById('date-end').valueAsDate = today;
    document.getElementById('date-start').valueAsDate = startDate;
}

// Zoom to specific zone
function zoomToZone(zone) {
    const zoneCoordinates = {
        'norte-america': { lat: 45, lon: -100, zoom: 4 },
        'sur-america': { lat: -15, lon: -60, zoom: 4 },
        'europa': { lat: 50, lon: 10, zoom: 4 },
        'asia': { lat: 35, lon: 105, zoom: 4 },
        'africa': { lat: 0, lon: 20, zoom: 4 },
        'oceania': { lat: -25, lon: 135, zoom: 4 }
    };

    if (zone && zoneCoordinates[zone]) {
        const coords = zoneCoordinates[zone];
        map.setView([coords.lat, coords.lon], coords.zoom);
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #cc4444 100%);
        color: #1a0a0a;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add Turís, Valencia marker
function addTurisMarker() {
    const turisLocation = {
        lat: 39.3897,
        lon: -0.6850,
        name: 'Turís, Valencia',
        image: 'sar_simulado.png',
        date: '2025-10-01',
        satellite: 'Sentinel-1'
    };

    turisMarker = L.circleMarker([turisLocation.lat, turisLocation.lon], {
        radius: 10,
        fillColor: '#ff6b6b',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    turisMarker.bindPopup(`
        <div style="color: #0a0e27; font-weight: 600;">
            <strong>${turisLocation.name}</strong><br>
            Coordenadas: ${turisLocation.lat.toFixed(4)}, ${turisLocation.lon.toFixed(4)}<br>
            <em>Click para ver imágenes SAR</em>
        </div>
    `);

    // Add click event to open SAR panel
    turisMarker.on('click', function() {
        showNotification('Buscando imágenes SAR...');
        setTimeout(() => {
            openSARPanel(turisLocation);
        }, 1000);
    });
}

// Add La Palma volcano marker
function addLaPalmaMarker() {
    const laPalmaLocation = {
        lat: 28.5719,
        lon: -17.8449,
        name: 'Volcán de La Palma, Canarias',
        image: 'la_palma_volcan_slide_sar_rgb.png',
        date: '2021-10-15',
        satellite: 'Sentinel-1'
    };

    laPalmaMarker = L.circleMarker([laPalmaLocation.lat, laPalmaLocation.lon], {
        radius: 10,
        fillColor: '#ff8800',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    laPalmaMarker.bindPopup(`
        <div style="color: #0a0e27; font-weight: 600;">
            <strong>${laPalmaLocation.name}</strong><br>
            Coordenadas: ${laPalmaLocation.lat.toFixed(4)}, ${laPalmaLocation.lon.toFixed(4)}<br>
            <em>Click para ver imágenes SAR</em>
        </div>
    `);

    // Add click event to open SAR panel
    laPalmaMarker.on('click', function() {
        showNotification('Buscando imágenes SAR...');
        setTimeout(() => {
            openSARPanel(laPalmaLocation);
        }, 1000);
    });
}

// Setup SAR panel listeners
function setupSARPanelListeners() {
    const closeSarPanelBtn = document.getElementById('closeSarPanel');

    closeSarPanelBtn.addEventListener('click', function() {
        closeSARPanel();
    });
}

// Open SAR panel
function openSARPanel(location) {
    const sarPanel = document.getElementById('sarPanel');
    const locationInfo = document.getElementById('locationInfo');
    const sarImagesContainer = document.getElementById('sarImagesContainer');

    // Update location info
    locationInfo.innerHTML = `
        <h3>${location.name}</h3>
        <p>Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}</p>
    `;

    // Update SAR images
    sarImagesContainer.innerHTML = `
        <div class="sar-image-item">
            <img src="${location.image}" alt="Imagen SAR" class="sar-preview">
            <div class="sar-image-info">
                <p><strong>Fecha:</strong> ${location.date}</p>
                <p><strong>Resolución:</strong> 5m</p>
                <p><strong>Satélite:</strong> ${location.satellite}</p>
            </div>
            <button class="download-btn" onclick="downloadSARImage('${location.image}')">
                ⬇ Descargar Imagen
            </button>
        </div>
    `;

    // Open panel
    sarPanel.classList.add('open');
}

// Close SAR panel
function closeSARPanel() {
    const sarPanel = document.getElementById('sarPanel');
    sarPanel.classList.remove('open');
}

// Download SAR image
function downloadSARImage(imagePath) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = imagePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Descargando imagen SAR...');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
