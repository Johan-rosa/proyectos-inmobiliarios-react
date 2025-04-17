import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building,
  Dumbbell,
  PocketIcon as Pool,
  Users,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react"
import type { Property } from "@/data/projects"

interface ProjectCardProps {
  project: Property
}

// Helper function to get the appropriate icon for each amenity
function getAmenityIcon(amenity: string) {
  const amenityLower = amenity.toLowerCase()
  if (amenityLower.includes("gimnasio")) {
    return <Dumbbell className="h-3 w-3" />
  } else if (amenityLower.includes("piscina")) {
    return <Pool className="h-3 w-3" />
  } else if (
    amenityLower.includes("social") ||
    amenityLower.includes("comunidad") ||
    amenityLower.includes("eventos") ||
    amenityLower.includes("lounge")
  ) {
    return <Users className="h-3 w-3" />
  } else {
    return <Building className="h-3 w-3" />
  }
}

const ProjectCard = ({ project } : ProjectCardProps) => {
  return (
    <Card className="p-0 pb-3 gap-2 overflow-hidden h-full transition-all hover:shadow-md m-2" >
      <div className="relative min-h-80  w-full">
        <Image 
          src={`/project-imgs${project.image}`} 
          alt={project.title} fill 
          className="object-fit object-center"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-emerald-600 hover:bg-emerald-700">${project.price.toLocaleString()}</Badge>
        </div>
        {(
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              Edificio de Apartamentos
            </Badge>
          </div>
        )}
      </div>
      <CardContent>
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3" />
          {project.address}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Entrega: {project.anioEntrega}</span>
          </div>
          <div className="flex items-center gap-1">
            {project.condicion === "Listo" ? (
              <>
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">Listo</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 text-amber-600" />
                <span className="text-amber-600">En Construcción</span>
              </>
            )}
          </div>
        </div>

        {true && project.amenities && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.amenities.slice(0, 3).map((amenity) => {
              const icon = getAmenityIcon(amenity)
              return (
                <div 
                  key={amenity} 
                  className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {icon}
                  <span>{amenity}</span>
                </div>
              )
            })}
            {project.amenities.length > 3 && (
              <div
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                +{project.amenities.length - 3} más
              </div>
            )}
          </div>
        )}

      </CardContent>
      <CardFooter className="pt-1 text-sm text-muted-foreground">
        {project.description.substring(0, 100)}...
      </CardFooter>
    </Card>
  )
}

export default ProjectCard;