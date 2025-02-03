"use client";
import React, { useEffect, useState, useRef } from 'react';
import L, { Map, Marker, Icon } from 'leaflet';
import '@/_assets/style/map.css';
// import '@/_assets/style/style.css';
import 'leaflet/dist/leaflet.css';
// import '@/_assets/style/leafletex.css';
import { timeout } from '@/utils/commonFunctions';
import 'leaflet-responsive-popup';
import { redirect, useRouter } from 'next/navigation';
import Link from "next/link";
import $ from "jquery";
import {
  TApiResponse,
  TErrorMessage,
  TToastErrorSettingData,
  TLogMsgApiSerializerResponse,
  TApiResponseCommon
} from "@/types/type";

type TProp = {
  logMsgArr: TLogMsgApiSerializerResponse[]
}

const MapComponent = ({ logMsgArr }: TProp) => {
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null); // Using ref to store the map instance

  let map_data: TLogMsgApiSerializerResponse[] = logMsgArr

  const imgBasePath = "/asset/country_flags";
  const [map, setMap] = useState<Map | null>(null);

  const [markerListData, setMarkerListData] = useState([]);
  const [markerSerialIndex, setMarkerSerialIndex] = useState(1);
  const worldMapUrl = '/map_assets/map04.svg';
  type TMarkerDetails = {
    coordinates: [number, number];  // Tuple representing latitude and longitude
    data: TLogMsgApiSerializerResponse;
  }
  const customIcon = L.icon({
    iconUrl: '/map_assets/dot03.svg',
    iconSize: [20, 20],
    iconAnchor: [8, 8],
  });

  let loop = 0
  //   center: [51.505, -0.09],
  // zoom: 13,
  // dragging: true, // Enable dragging
  // scrollWheelZoom: false // Disable scroll wheel zoom if needed

  useEffect(() => {
    if (mapRef.current === null) {
      // Initialize map only if it's not already created
      const map = L.map("map", {

        minZoom: 2.2,
        maxZoom: 2.2,
        zoomControl: false,
        dragging: true,
        attributionControl: false
      }).setView([5, 10], 2);

      // Add the overlay image
      L.imageOverlay('/map_assets/map04.svg', [[-60, -140], [70, 160]]).addTo(map);

      mapRef.current = map; // Store the map instance in the ref
      const updateMapDragging = () => {
        if (window.innerWidth <= 991) {
          map.dragging.disable();
        } else {
          map.dragging.enable();
        }
      };

      updateMapDragging(); // Set initial dragging state
      window.addEventListener("resize", updateMapDragging); // Adjust dragging on resize

      // Clean up the resize listener when the component unmounts
      return () => window.removeEventListener("resize", updateMapDragging);

    }

    // Clean up function to clear markers if necessary
    let markers: any[] = [];

    // Update markers whenever logMsgArr changes
    if (logMsgArr.length > 0) {
      // Clear existing markers before adding new ones
      markers.forEach(marker => mapRef.current?.removeLayer(marker));
      logMsgArr.forEach((item) => {
        if (item?.entity?.country) {
          if (mapRef.current) {
            const marker = L.marker([+(item.entity.country.latitude), +(item.entity.country.longitude)], {
              icon: L.icon({
                iconUrl: '/map_assets/dot03.svg',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            }).addTo(mapRef.current);

            markers.push(marker); // Keep track of markers for removal later
            const searchParams = new URLSearchParams({
              id: item?.group_id,
              type: 'group',
              msg_id: encodeURIComponent(item?.message_id),
            }).toString();
            // Use static popup HTML
            const popupHTML = `
                  <div id='popHTMLID'>
                    <a id='popup_overlay' href="/search?${searchParams}"></a>
                    <h3 style='z-index: -1'>${item?.message_text || ''}</h3>

                    <div class="content-area" style='z-index: -1'>
                        <p style='z-index: -1'>${item?.entity?.phone_number || ''}</p>
                      <div class="country" style='z-index: -1'>
                        <img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.alpha2_code || 'US'}.svg" style="width: 14px; height: 10px; z-index: -1" alt="Country Flag" />
                        <p style='z-index: -1'>${item?.entity?.country?.name || ''}</p>
                      </div>
                    </div>
                  </div>
                  `;

            const popup = L.responsivePopup({
              autoClose: false,
              closeOnClick: false,
              closeButton: true,
              className: 'custom-popup',
              keepInView: true,
              // bubblingMouseEvents: false
            } as any).setContent(popupHTML)

            // Add popup to marker
            marker.on('mouseover', function () {
              if (!this.isPopupOpen()) {
                this.bindPopup(popup).openPopup();
              }
            });

            const popupElement = document.querySelector('.popup-overlay');
            // $('#popup_overlay').on('click', function (e) {
            //   e.stopPropagation();
            //   alert('clicked')
            //   router.push(`/search?${searchParams}`);
            // })
            // Prevent popup from closing when hovering over it
            marker.on('popupopen', function () {
              const popupElement1 = document.querySelector('.popup-overlay');

              if (popupElement) {
                // Prevent popup from closing when mouse enters
                popupElement.addEventListener('mouseover', function (e) {
                  e.stopPropagation();
                  marker.openPopup();
                });

                // Allow popup to close when mouse leaves
                popupElement.addEventListener('mouseout', function (e) {
                  e.stopPropagation();
                  marker.closePopup();
                });
                // popupElement.addEventListener('click', function (this: L.Marker) {
                //   router.push(`/search?${searchParams}`);
                // });
                // Prevent click event interference
                // popupElement.addEventListener('click', function (e) {
                //   e.stopPropagation();
                //   e.preventDefault();
                //   alert()
                //   console.log('popupElement1');
                //   let a = document.getElementById('popHTMLID');
                //   const dataId = a.getAttribute('data-id');
                //   if (dataId) {
                //     window.location.href = dataId; // Redirect to the specified URL
                //   }
                // });
              }

            });


            marker.on('click', function (this: L.Marker) {
              router.push(`/search?${searchParams}`);
            });
          }
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

      <div id="map" style={{ height: "510px", backgroundColor: '#030D14' }}></div>
    </div>
  )
}

export default MapComponent