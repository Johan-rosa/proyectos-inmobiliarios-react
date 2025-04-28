"use client"
import {properties as projects} from "@/data/projects"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { 
  ArrowLeft,
  MapPin,
  Building,
  Dumbbell,
  PocketIcon as Pool,
  Users,
  Calendar,
  CheckCircle,
  Clock,
 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/app-header"
// import PropertyMap from "@/components/projects-ui/project-map"
import NearbyPlaces from "@/components/projects-ui/project-map-places"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { use, useState} from "react"
import type { PlaceType } from "@/types"

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)

  const [placeType, setPlaceType] = useState<PlaceType>("restaurant")
  const [searchRadius, setSearchRadius] = useState<number>(500)

  if (!project) return <h1>Sorry</h1>

  const GoBackLink = ({ href }: { href: string }) => {
    return (
      <Link href={href} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista de proyectos
      </Link>
    )
  }

  const ProjectImage = ({ src } : { src: string }) => {
    return (
      <Image
            src={src}
            alt={project.title}
            fill
            className="object-cover object-center"
            priority
          />
    )   
  }

  const ProjectCondition = ({ condition }: {condition: string}) => {
    return(
      <div className="flex items-center gap-1">
        {condition === "Listo" ? (
          <>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-600">Listo para entrega</span>
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-amber-600">En Construcción</span>
          </>
        )}
    </div>
    )
  }

  interface AmenityListProps {
    amenities: string[]
    className?: string
    itemClassName?: string
  }
  
  const AmenityList = ({ amenities, className, itemClassName }: AmenityListProps) => {
    return (
      <section className={cn("flex flex-wrap gap-3", className)}>
        {amenities.map((amenity) => {
          let Icon
          const amenityLower = amenity.toLowerCase()
  
          if (amenityLower.includes("gimnasio")) {
            Icon = Dumbbell
          } else if (amenityLower.includes("piscina")) {
            Icon = Pool
          } else if (
            amenityLower.includes("social") ||
            amenityLower.includes("comunidad") ||
            amenityLower.includes("eventos") ||
            amenityLower.includes("lounge")
          ) {
            Icon = Users
          } else {
            Icon = Building
          }
  
          return (
            <div
              key={amenity}
              className={cn(
                "flex items-center gap-2 p-3 border rounded-lg",
                itemClassName
              )}
            >
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <span>{amenity}</span>
            </div>
          )
        })}
      </section>
    )
  }

  return (
    <div>
      <PageHeader>
        <div className="w-full h-auto  flex flex-wrap items-center justify-between p-2">
          <h1 className="text-xl font-medium">{project.title}</h1>
        </div>
      </PageHeader>
      <main className="container mx-auto px-4 py-8">
        <GoBackLink href="/proyectos" />

        <section className="md:flex gap-4">

          <div className="relative w-full md:w-1/3 h-[500px] rounded-lg overflow-hidden">
            <ProjectImage src={`/project-imgs${project.image}`} />
          </div>

          <div className="md:w-2/3">

            <h1 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-4">
                <MapPin className="h-4 w-4" />
                {project.address}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-base py-1 px-3">
                ${project.price.toLocaleString()}
              </Badge>

              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Entrega: {project.anioEntrega}</span>
              </div>

              <ProjectCondition condition={project.condicion || ""}/>


            </div>  
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <AmenityList amenities={project.amenities || [""]} />
            </div>
          </section >

          <section className="mt-3 w-full h-[500px] lg:h-[700px] rounded-md overflow-hidden">
            <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <label htmlFor="place-type" className="text-sm font-medium">
                    Tipo de Lugar
                  </label>
                  <Select 
                    value={placeType} 
                    onValueChange={(value) => setPlaceType(value as PlaceType)}
                  >
                    <SelectTrigger id="place-type" className="w-full md:w-auto">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurantes</SelectItem>
                      <SelectItem value="supermarket">Supermercados</SelectItem>
                      <SelectItem value="shopping_mall">Centros Comerciales</SelectItem>
                      <SelectItem value="hospital">Hospitales</SelectItem>
                      <SelectItem value="gym">Gimnasios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="search-radius" className="text-sm font-medium">
                    Radio de Búsquedas
                  </label>
                  <Select
                    value={searchRadius.toString()}
                    onValueChange={(value) => setSearchRadius(Number.parseInt(value))}
                  >
                    <SelectTrigger id="search-radius" className="w-full md:w-auto">
                      <SelectValue placeholder="Seleccionar radio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500m</SelectItem>
                      <SelectItem value="1000">1km</SelectItem>
                      <SelectItem value="2000">2km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <NearbyPlaces lat={project.latitude} lng={project.longitude} placeType={placeType} radius={searchRadius} />
          </section>
        </main>
      </div>
  )
}