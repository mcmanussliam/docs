import Link from 'next/link';
import {getProjects} from '@/lib/content';
import {Badge} from '@/components/ui/badge';

export default async function Root() {
  const projects = await getProjects();

  return (
    <>
      <h1 className='heading'>Projects</h1>
      <div className="space-y-6 lg:space-y-8">
        {projects.map((project) => (
          <div key={project.id} className="group">
            <Link
              href={`/projects/${project.id}`}
              className="block"
            >
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  {project.docsCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {project.docsCount} {project.docsCount === 1 ? 'doc' : 'docs'}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Updated {new Date(project.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>

                  {project.links && project.links.length > 0 && (
                    <>
                      <span>-</span>
                      <div className="flex gap-3">
                        {project.links.map((link, index) => (<span key={index} className="text-primary">{link.key}</span>))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Link>
            <div className="mt-4 border-b border-border/40" />
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No projects yet. Check back soon!
          </p>
        </div>
      )}
   </>
  );
}
