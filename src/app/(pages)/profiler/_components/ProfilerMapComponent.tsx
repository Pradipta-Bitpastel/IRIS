import React, { useEffect, useRef } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet-responsive-popup';
import '@/_assets/style/map.css';
import '@/_assets/style/style.css';
import 'leaflet/dist/leaflet.css';
import '@/_assets/style/leafletex.css';
import mappointer from '@/_assets/images/dot03.svg'
const ProfilerMapComponent = ({profileData}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);  // Ref to store the map instance
    // console.log(profileData);
    // console.log(mappointer);
    
    useEffect(() => {
        if (!mapInstance.current && profileData) {
            // Initialize the map
            const map = L.map('map', {
                zoomControl: false, // Disable default zoom control
                dragging: true,
                attributionControl: false,
                scrollWheelZoom: true,
                // closePopupOnClick: false
            }).setView([profileData?.latitude, profileData?.longitude], 13);

            // Base layers
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                className: 'custom-color-tiles',
            });

            const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // Google subdomains
                maxZoom: 19,
            });

            const terrainLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                maxZoom: 19,
            });

            // Add street view as default
            streetLayer.addTo(map);

            // Create a layer control for base layers
            const baseMaps = {
                "Street View": streetLayer,
                "Satellite View": satelliteLayer,
                "Terrain View": terrainLayer,
            };

            L.control.layers(baseMaps).addTo(map);

            // Add zoom control to bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Add a custom marker
            const marker = L.marker([profileData?.latitude, profileData?.longitude], {
                icon: L.icon({
                    iconUrl: mappointer?.src,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                }),
            }).addTo(map);

            // Define the popup HTML
            const popupHTML = L.responsivePopup({
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                className: 'custom-popup',
                keepInView: true,
                // bubblingMouseEvents: false
              } as any).setContent(`
                <div class="content-area">
                    <div class="country">
                      <img src=http://purecatamphetamine.github.io/country-flag-icons/3x2/${profileData?.country?.alpha2_code || 'US'}.svg style="width: 14px; height: 10px;" alt="Country Flag" />
                        <p style='color:#505050 !important; margin-bottom: 0;'>${profileData?.name}</p>
                    </div>
                </div>
            `);

            // Attach event listeners to the marker
            marker.on('mouseover', function () {
                this.bindPopup(popupHTML).openPopup();
            });

            marker.on('mouseout', function () {
                this.closePopup();
            });

            mapInstance.current = map; // Store the map instance
        }
    }, [profileData]);

    
    return (
        <div className='profiler-map'>
            <div id="map" ref={mapRef} style={{ height: "510px", backgroundColor: '#030D14' }}></div>

        </div>
    );
};

export default ProfilerMapComponent;
