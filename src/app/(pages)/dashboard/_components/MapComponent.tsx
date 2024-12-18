"use client";
import React, { useEffect, useState, useRef } from 'react';
import L, { Map, Marker, Icon } from 'leaflet'; 
import '@/_assets/style/map.css';
import '@/_assets/style/style.css';
import 'leaflet/dist/leaflet.css';
import '@/_assets/style/leafletex.css';
import { timeout } from '@/utils/commonFunctions';
import 'leaflet-responsive-popup';



import {
    TApiResponse,
    TErrorMessage,
    TToastErrorSettingData,
    TLogMsgApiSerializerResponse,
    TApiResponseCommon
  } from "@/types/type";

type TProp={
    logMsgArr:TLogMsgApiSerializerResponse[]
}

const MapComponent = ({logMsgArr}:TProp) => {
  const mapRef = useRef<L.Map | null>(null); // Using ref to store the map instance

    let map_data:TLogMsgApiSerializerResponse[]=logMsgArr
    
    const imgBasePath = "/asset/country_flags";
    const [map, setMap] = useState<Map | null>(null); 

    const [markerListData, setMarkerListData] = useState([]);
    const [markerSerialIndex, setMarkerSerialIndex] = useState(1);
    const worldMapUrl = '/map_assets/map04.svg';
type TMarkerDetails ={
        coordinates: [number, number];  // Tuple representing latitude and longitude
        data: TLogMsgApiSerializerResponse;
      }
    const customIcon = L.icon({
      iconUrl: '/map_assets/dot03.svg',
      iconSize: [20, 20],
      iconAnchor: [8, 8],
    });

    let loop=0
  //   center: [51.505, -0.09],
  // zoom: 13,
  // dragging: true, // Enable dragging
  // scrollWheelZoom: false // Disable scroll wheel zoom if needed

      useEffect(() => {
        if (mapRef.current === null) {
          // Initialize map only if it's not already created
          const map = L.map("map", {

            minZoom: 2,
            maxZoom: 2,
            zoomControl: false,
          }).setView([0, 0], 2);
    
          // Add the overlay image
          L.imageOverlay('/map_assets/map04.svg', [[-90, -180], [90, 180]]).addTo(map);
    
          mapRef.current = map; // Store the map instance in the ref
        }
    
        // Clean up function to clear markers if necessary
        let markers: any[] = [];
    
        // Update markers whenever logMsgArr changes
        if (logMsgArr.length > 0) {
          // Clear existing markers before adding new ones
          markers.forEach(marker => mapRef.current?.removeLayer(marker));
    
          logMsgArr.forEach((item) => {
            if(mapRef.current){
            const marker = L.marker([+(item.entity.country.latitude), +(item.entity.country.longitude)], {
              icon: L.icon({
                iconUrl: '/map_assets/dot03.svg',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            }).addTo(mapRef.current);
    
            markers.push(marker); // Keep track of markers for removal later
            const popupHTML = L.responsivePopup().setContent(`
              <h3>${item?.message_text||''}</h3>
              <div class="content-area">
                <p>${item?.entity?.phone_number || ''}</p>
                <div class="country">
                  <img src=http://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.alpha2_code||'US'}.svg style="width: 14px; height: 10px;" alt="Country Flag" />
        
               
                  
                  <p>${item?.entity?.country?.name ||''}</p>
                </div>
              </div>`);
  
          // Attach event listeners for 'mouseover' and 'mouseout'
          marker.on('mouseover', function (this: L.Marker) {
            this.bindPopup(popupHTML).openPopup();
          });
  
          marker.on('mouseout', function (this: L.Marker) {
            this.closePopup();
          });
          }
          });
        }


     
    
        return () => {
          // Clean up markers when component unmounts
          markers.forEach(marker => mapRef.current?.removeLayer(marker));
        };
      }, [logMsgArr]); // Re-run this effect when logMsgArr changes
    
    
  return (
    <div className="map-container">
    {/* {console.log("map-dom",map)} */}
    <div id="map" style={{ height: "510px", backgroundColor: '#030D14' }}></div>
  </div>
  )
}

export default MapComponent