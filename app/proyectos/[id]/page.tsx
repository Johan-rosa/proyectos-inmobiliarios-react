"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, MapPin, CheckCircle, Clock, Calendar,
  Dumbbell,
  WavesLadder as Pool,
  Users,
  Building,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"

import { PageHeader } from "@/components/app-header"
import {properties as projects} from "@/data/projects"


export default function ProjectDetails({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const project = projects.find(project => project.id == id)

  if (!project) return <h3>Project not found</h3>

  return(
    <div>
      <PageHeader>
        <h2 className="text-xl font-medium p-2">{project?.title}</h2>
      </PageHeader>
      <main>
        <GoBackLink href="/proyectos"/>
        <section className="p-2">
          <div className="lg:flex gap-3">

            <div className="relative w-full h-[300px] lg:h-[400px] rounded-md overflow-hidden">
              <ProjectImage src={`/project-imgs${project.image}`} title={project.title} />
            </div>
            <div>
              <h2 className="mt-2 md:mt-0 text-xl">{project.title}</h2>
              <p className="flex gap-1 items-center text-muted-foreground">
                <MapPin className="h-4 w-4"/>
                {project.address}
              </p>

              <div className="mt-2 flex gap-2 items-center">
                <Badge className="bg-emerald-600">
                  ${project.price.toLocaleString()}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Entrega: {project.anioEntrega}</span>
                </div>
                <ProjectCondition condition={project.condicion || ""}/>
              </div>

              <div className="my-2">
                <h3 className="font-medium text-gray-700 mb-2">Descripción</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

            <div>
              <h3 className="mb-1">Amenidades</h3>
              <AmenityList amenities={project.amenities || [""]} />
            </div>

            </div>

          </div>
        </section>
      </main>
    </div>
  )
}

const GoBackLink = ({ href }: { href: string }) => {
  return (
    <Link 
      href={href} 
      className="mb-6"
    >
      <Button variant="ghost" className="flex justify-start pointer w-full rounded-none">
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista de proyectos
      </Button>
    </Link>
  )
}

const ProjectImage = ({src, title } : {src: string, title:string}) => {
  return(
      <Image
        src={src}
        alt={`Image of project ${title}`}
        className="object-cover object-center"
        fill
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
          <div key={amenity} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-gray-100 p-2 rounded-full">
              <Icon className="h-4 w-4" />
            </div>
            <span>{amenity}</span>
          </div>
        )
      })}
    </section>
  )
}