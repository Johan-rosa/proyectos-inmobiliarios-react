"use client"

import { useEffect, useState } from "react"
import PropertyMap from "./project-map"
import { Card, CardContent } from "@/components/ui/card"
import type { PlaceType } from "@/types"
import { MapPin, Star } from "lucide-react"
import { Loader } from "@googlemaps/js-api-loader"

interface NearbyPlacesProps {
  lat: number
  lng: number
  placeType: PlaceType
  radius: number
  keyword?: string
}

declare global {
  interface Window {
    google: typeof google
  }
}

export default function NearbyPlaces({ lat, lng, placeType, radius, keyword }: NearbyPlacesProps) {
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // We'll load places using the Google Maps Places API
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places"],
    })

    loader.load().then(() => {
      const service = new window.google.maps.places.PlacesService(document.createElement("div"))

      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius,
        type: placeType,
        keyword: keyword || undefined,
      }

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(results)
        } else {
          setPlaces([])
        }
        setLoading(false)
      })
    })
  }, [lat, lng, placeType, radius, keyword])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-[400px] rounded-lg overflow-hidden">
        <PropertyMap
          lat={lat}
          lng={lng}
          zoom={14}
          showPlaces={true}
          placeType={placeType}
          radius={radius}
          keyword={keyword}
        />
      </div>

      <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
        {loading ? (
          <p className="text-center py-4 text-muted-foreground">Cargando lugares cercanos...</p>
        ) : places.length > 0 ? (
          places.map((place, index) => (
            <Card key={place.place_id || index} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {place.vicinity}
                    </p>
                  </div>
                  {place.rating && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-sm">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {place.rating}
                    </div>
                  )}
                </div>

                {place.geometry?.location && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {calculateDistance(lat, lng, place.geometry.location.lat(), place.geometry.location.lng())}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center py-4 text-muted-foreground">No se encontraron lugares cercanos.</p>
        )}
      </div>
    </div>
  )
}

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m de distancia`
  } else {
    return `${distance.toFixed(1)}km de distancia`
  }
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
