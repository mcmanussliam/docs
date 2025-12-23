import fs from 'fs';
import path from 'path';
import type {
  Project,
  Doc,
  ProjectMetadata,
  DocMetadata,
  MDXDocument,
  TocEntry,
} from './content.types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/');

export async function getProjects(): Promise<Project[]> {
  const projectDirs = fs.readdirSync(CONTENT_DIR);

  const projects = await Promise.all(
    projectDirs
      .filter(dir => {
        const dirPath = path.join(CONTENT_DIR, dir);
        return fs.statSync(dirPath).isDirectory();
      })
      .map(async dir => {
        const projectDir = path.join(CONTENT_DIR, dir);
        const indexPath = path.join(projectDir, 'index.mdx');
        if (!fs.existsSync(indexPath)) {
          throw new Error(`Project ${dir} missing index.mdx`);
        }

        const files = fs.readdirSync(projectDir);
        const docsCount = files.filter(file => file.endsWith('.mdx') && file !== 'index.mdx').length;

        const mdxModule: MDXDocument<ProjectMetadata> = await import(`@/content/${dir}/index.mdx`);

        return {
          id: dir,
          ...mdxModule.frontmatter,
          docsCount,
        };
      })
  );

  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getProject(projectId: string): Promise<Project | null> {
  const projectDir = path.join(CONTENT_DIR, projectId);
  const indexPath = path.join(projectDir, 'index.mdx');

  if (!fs.existsSync(projectDir) || !fs.existsSync(indexPath)) {
    return null;
  }

  const files = fs.readdirSync(projectDir);
  const docsCount = files.filter(file => file.endsWith('.mdx') && file !== 'index.mdx').length;

  const mdxModule: MDXDocument<ProjectMetadata> = await import(`@/content/${projectId}/index.mdx`);

  return {
    id: projectId,
    ...mdxModule.frontmatter,
    docsCount,
  };
}

export async function getProjectDocs(projectId: string): Promise<Doc[]> {
  const projectDir = path.join(CONTENT_DIR, projectId);
  if (!fs.existsSync(projectDir)) {
    return [];
  }

  const files = fs.readdirSync(projectDir);
  const docFiles = files.filter(file => file.endsWith('.mdx') && file !== 'index.mdx');

  const docs = await Promise.all(
    docFiles.map(async file => {
      const slug = file.replace('.mdx', '');

      const mdxModule: MDXDocument<DocMetadata> = await import(`@/content/${projectId}/${file}`);

      return {
        slug,
        path: [slug],
        ...mdxModule.frontmatter,
      };
    })
  );

  return docs.sort((a, b) => {
    // If both have order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }

    // If only a has order, it comes first
    if (a.order !== undefined) {
      return -1;
    }

    // If only b has order, it comes first
    if (b.order !== undefined) {
      return 1;
    }

    // Otherwise, sort alphabetically by title
    return a.title.localeCompare(b.title);
  });
}

export async function getDoc(
  projectId: string,
  slug: string[]
): Promise<Doc | null> {
  const slugStr = slug.join('/');
  const filePath = path.join(CONTENT_DIR, projectId, `${slugStr}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const mdxModule: MDXDocument<DocMetadata> = await import(`@/content/${projectId}/${slugStr}.mdx`);

  return {
    slug: slugStr,
    path: slug,
    ...mdxModule.frontmatter,
  };
}

export function extractTocFromContent(content: string): TocEntry[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TocEntry[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 1 | 2 | 3;
    const text = match[2].trim();

    const cleanText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove code formatting
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1'); // Remove italic

    const id = cleanText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({id, text: cleanText, level});
  }

  return toc;
}

export function getProjectIds(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((dir) => fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory());
}

export function getProjectDocPaths(projectId: string): string[][] {
  const projectDir = path.join(CONTENT_DIR, projectId);
  if (!fs.existsSync(projectDir)) {
    return [];
  }

  const files = fs.readdirSync(projectDir);
  return files
    .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
    .map((file) => [file.replace('.mdx', '')]);
}
