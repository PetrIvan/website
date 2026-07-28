import { aiCup2026 } from './ai-cup-2026';
import { chordseqai } from './chordseqai';
import { entitatisMundus } from './entitatis-mundus';

export type {
	Project,
	ProjectFact,
	ProjectHighlight,
	ProjectImageId,
	ProjectMedia,
	ProjectMetric,
	ProjectResource,
	ProjectSection,
	ProjectVideo,
	ProjectVisual
} from './types';

export const projects = [chordseqai, aiCup2026, entitatisMundus];
export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(id: string) {
	return projects.find((project) => project.id === id);
}
