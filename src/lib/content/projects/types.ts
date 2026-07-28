export type ProjectImageId =
	| 'ai-cup-dashboard'
	| 'chordseqai-editor'
	| 'chordseqai-timeline'
	| 'chordseqai-suggestions'
	| 'entitatis-mundus-gameplay';

export interface ProjectResource {
	label: string;
	href: string;
}

export interface ProjectTextLink {
	label: string;
	href: string;
}

export type ProjectParagraph = string | Array<string | ProjectTextLink>;

export interface ProjectFact {
	label: string;
	value: string;
}

export interface ProjectMetric {
	value: string;
	label: string;
}

export interface ProjectHighlight {
	title: string;
	body: string;
}

export interface ProjectMedia {
	image: ProjectImageId;
	alt: string;
	caption?: string;
	credit?: string;
	fit?: 'cover' | 'contain';
	position?: string;
}

export interface ProjectVideo {
	src: string;
	poster: string;
	alt: string;
	caption?: string;
}

export type ProjectVisual =
	{ kind: 'image'; media: ProjectMedia } | { kind: 'video'; video: ProjectVideo };

export interface ProjectSection {
	title: string;
	paragraphs: ProjectParagraph[];
	highlights?: ProjectHighlight[];
	media?: ProjectMedia[];
}

export interface Project {
	id: string;
	label: string;
	period: string;
	title: string;
	summary: string;
	cardSummary: string;
	facts: ProjectFact[];
	metrics: ProjectMetric[];
	sections: ProjectSection[];
	primaryAction: ProjectResource;
	resources: ProjectResource[];
	cardVisual: ProjectVisual;
	heroVisual?: ProjectVisual;
	featured: boolean;
}
