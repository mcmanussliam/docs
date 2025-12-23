import {notFound} from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import {
  getDoc,
  getProject,
  getProjectDocs,
  getProjectIds,
  getProjectDocPaths,
  extractTocFromContent,
} from '@/lib/content';
import {TableOfContents} from '@/components/custom/table-of-contents';
import {BreadcrumbNav, BreadcrumbNavItemProps} from '@/components/custom/breadcrumb-nav';
import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface Props {
  params: Promise<{projectId: string; slug: string[] }>;
}

export function generateStaticParams() {
  const projectIds = getProjectIds();
  const paths: {projectId: string; slug: string[]}[] = [];

  for (const projectId of projectIds) {
    const docPaths = getProjectDocPaths(projectId);
    for (const slug of docPaths) {
      paths.push({projectId, slug});
    }
  }

  return paths;
}

export default async function Root({params}: Props) {
  const {projectId, slug} = await params;
  const doc = await getDoc(projectId, slug);

  if (!doc) {
    notFound();
  }

  const project = await getProject(projectId);
  const allDocs = await getProjectDocs(projectId);

  const currentIndex = allDocs.findIndex((d) => d.slug === doc.slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  const document = await import(`@/content/${projectId}/${doc.slug}.mdx`);
  const Content = document.default;

  const filePath = path.join(
    process.cwd(),
    'src/content',
    projectId,
    `${doc.slug}.mdx`
  );

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const toc = extractTocFromContent(fileContent);

  const breadcrumbItems: readonly BreadcrumbNavItemProps[] = [
    {label: 'Projects', href: '/projects'},
    {label: project?.title || projectId, href: `/projects/${projectId}`},
    {label: doc.title},
  ];

  return (
    <>
      <BreadcrumbNav items={breadcrumbItems}/>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7">
            <Content/>
          </article>

          {(prevDoc || nextDoc) && (
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row justify-between gap-4">
              {
                prevDoc ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/docs/${prevDoc.slug}`}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      {prevDoc.title}
                    </Link>
                  </Button>
                ) : (
                  <div/>
                )
              }
              {
                nextDoc && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/docs/${nextDoc.slug}`}>
                      {nextDoc.title}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )
              }
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <TableOfContents toc={toc} />
        </aside>
      </div>
    </>
  );
}
