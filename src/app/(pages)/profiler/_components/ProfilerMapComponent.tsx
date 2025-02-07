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
    const mapInstance = useRef<L.Map | null>(null);  
    // console.log(profileData);
    // console.log(mappointer);
    
    useEffect(() => {
        if (!mapInstance.current) {
            const latitude = profileData?.latitude || 31.0461; 
            const longitude = profileData?.longitude || 34.8516; 
    
            // Initialize the map
            const map = L.map('map', {
                zoomControl: false, 
                dragging: true,
                attributionControl: false,
                scrollWheelZoom: true,
            }).setView([latitude, longitude], 5); 
    
            // Base layers
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                className: 'custom-color-tiles',
            });
    
            const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], 
                maxZoom: 19,
            });
    
            const terrainLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                maxZoom: 19,
            });
    
            streetLayer.addTo(map);
    
            // Layer control
            L.control.layers({
                "Street View": streetLayer,
                "Satellite View": satelliteLayer,
                "Terrain View": terrainLayer,
            }).addTo(map);
    
            // Zoom control
            L.control.zoom({ position: 'bottomright' }).addTo(map);
    
            // Add marker only if valid coordinates are available
            if (profileData?.latitude != null && profileData?.longitude != null) {
                const marker = L.marker([profileData.latitude, profileData.longitude], {
                    icon: L.icon({
                        iconUrl: mappointer?.src,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    }),
                }).addTo(map);
    
                const popupHTML = L.responsivePopup({
                    autoClose: false,
                    closeOnClick: false,
                    closeButton: false,
                    className: 'custom-popup',
                    keepInView: true,
                } as any).setContent(`
                    <div class="content-area">
                        <div class="country">
                            <img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/${profileData?.country?.alpha2_code || 'US'}.svg" style="width: 14px; height: 10px;" alt="Country Flag" />
                            <p style='color:#505050 !important; margin-bottom: 0;'>${profileData?.name}</p>
                        </div>
                    </div>
                `);
    
                marker.on('mouseover', function () {
                    this.bindPopup(popupHTML).openPopup();
                });
    
                marker.on('mouseout', function () {
                    this.closePopup();
                });
            }
    
            mapInstance.current = map;
        }
    }, [profileData]);
    
    

    
    return (
        <div className='profiler-map'>
            <div id="map" ref={mapRef} style={{ height: "510px", backgroundColor: '#030D14' }}></div>

        </div>
    );
};

export default ProfilerMapComponent;
