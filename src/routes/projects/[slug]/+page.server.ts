import { error } from '@sveltejs/kit';
import { getProject, projects } from '$lib/content/projects';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => projects.map((project) => ({ slug: project.id }));

export const load: PageServerLoad = ({ params }) => {
	const project = getProject(params.slug);

	if (!project) {
		error(404, 'Project not found');
	}

	const projectIndex = projects.findIndex((candidate) => candidate.id === project.id);
	const nextProject = projects[(projectIndex + 1) % projects.length];

	return {
		project,
		nextProject: {
			id: nextProject.id,
			label: nextProject.label,
			title: nextProject.title
		}
	};
};
