"use client"

import {properties as projects} from "@/data/projects"
import ProjectCard from "@/components/projects-ui/project-card"

const Projects = () => {

  const cardsUi = projects.map((project) => {
    console.log(project.id, project.image)
    return ( <ProjectCard project={project} key={project.id}/> )
  })

  return (
    <div className="p-3">{cardsUi}</div>
  )
}

export default Projects