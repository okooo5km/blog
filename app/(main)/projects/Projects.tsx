import { ProjectCard } from '~/app/(main)/projects/ProjectCard'
import { getSettings } from '~/sanity/queries'

export async function Projects() {
  const { projects } = await getSettings()

  return (projects ? 
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </ul> : <strong>🔥 产品和项目很多，待我慢慢更新！</strong>
  )
}
