"use client"

import { PageHeader } from "@/components/app-header"
import {properties as projects} from "@/data/projects"
import ProjectCard from "@/components/projects-ui/project-card"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {Button } from "@/components/ui/button"

const Projects = () => {
  const cardsUi = projects.map((project) => {
    return (
      <Link key={project.id} href={`proyectos/${project.id}`}>
        <ProjectCard project={project} key={project.id}/>
      </Link>
    )
  })

  return (
    <>
      <PageHeader>
        <div className="w-full h-auto  flex flex-wrap items-center justify-between p-2">
          <h1 className="text-xl font-medium">Proyectos</h1>
          <div className="lg:flex flex-wrap gap-2 hidden">
            <Input className="w-[340px]" type="search" placeholder="Buscar" />
            <Link href="/payment-builder">
              <Button>Agregar proyecto</Button>
            </Link>
          </div>
        </div>
      </PageHeader>
      <div className="px-3 mt-2">
        <div className="flex gap-2 lg:hidden mb-2">
            <Input className="" type="search" placeholder="Buscar" />
            <Link href="/payment-builder">
              <Button>Agregar proyecto</Button>
            </Link>
        </div>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{cardsUi}</div>
    </>
  )
}

export default Projects