"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import type { PlaceType } from "@/types"

// Declare the google types
declare global {
  interface Window {
    google: typeof google
  }
}

interface PropertyMapProps {
  lat: number
  lng: number
  zoom?: number
  showPlaces?: boolean
  placeType?: PlaceType
  radius?: number
  keyword?: string
}

export default function PropertyMap({
  lat,
  lng,
  zoom = 14,
  showPlaces = false,
  placeType = "restaurant",
  radius = 1000,
  keyword = "",
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([])
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  // Load Google Maps API
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places"],
    })

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        // Add property marker
        const propertyMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "Property Location",
        })

        setMap(mapInstance)
      }
    })

    return () => {
      // Clean up markers when component unmounts
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [lat, lng, zoom])

  // Search for nearby places when map is loaded and showPlaces is true
  useEffect(() => {
    if (map && showPlaces) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      const service = new window.google.maps.places.PlacesService(map)
      const request = {
        location: { lat, lng },
        radius,
        type: placeType,
        keyword: keyword || undefined,
      }

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(results)

          // Create markers for each place
          const newMarkers = results
            .map((place) => {
              if (!place.geometry || !place.geometry.location) return null

              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map,
                title: place.name,
                animation: window.google.maps.Animation.DROP,
              })

              // Add info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
                  <p style="margin: 0;">${place.vicinity}</p>
                  ${place.rating ? `<p style="margin: 4px 0;">Rating: ${place.rating} ⭐</p>` : ""}
                </div>
              `,
              })

              marker.addListener("click", () => {
                infoWindow.open(map, marker)
              })

              return marker
            })
            .filter(Boolean) as google.maps.Marker[]

          setMarkers(newMarkers)
        }
      })
    }
  }, [map, showPlaces, placeType, radius, keyword, lat, lng])

  return <div ref={mapRef} className="h-full w-full" />
}
