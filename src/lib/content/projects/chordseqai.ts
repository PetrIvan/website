import type { Project } from './types';

export const chordseqai: Project = {
	id: 'chordseqai',
	label: 'Open-source product',
	period: '2023 – now',
	title: 'ChordSeqAI',
	summary:
		'A composition tool with models for chord progressions, local browser inference and an editable music workflow.',
	cardSummary:
		'A composition tool with chord suggestions, local browser inference, an editable timeline, playback and export.',
	facts: [
		{ label: 'Role', value: 'Creator · machine learning, product and web engineering' },
		{ label: 'Availability', value: 'Public web app · open source' },
		{ label: 'Stack', value: 'PyTorch, ONNX Runtime, Next.js, TypeScript, Tone.js' }
	],
	metrics: [],
	primaryAction: { label: 'Try ChordSeqAI', href: 'https://chordseqai.com/' },
	cardVisual: {
		kind: 'image',
		media: {
			image: 'chordseqai-editor',
			alt: 'ChordSeqAI editor showing a chord timeline and ranked chord suggestions',
			position: 'center'
		}
	},
	heroVisual: {
		kind: 'image',
		media: {
			image: 'chordseqai-editor',
			alt: 'ChordSeqAI editor showing a chord timeline and ranked chord suggestions',
			caption: 'The editor shows the full progression alongside several possible next chords.'
		}
	},
	sections: [
		{
			title: 'Overview',
			paragraphs: [
				'ChordSeqAI suggests possible continuations for a chord progression without generating a finished song. Musicians can audition, accept, replace or ignore each suggestion.',
				'The progression remains editable, with prediction integrated into the wider composition workflow.'
			]
		},
		{
			title: 'Development',
			paragraphs: [
				[
					'The project began in 2023 as my final project at Student Trainee Center, a selective two-year apprenticeship supported by Microsoft. During the initial four-month research period, I worked under the supervision of ',
					{ label: 'Petr Kučera', href: 'https://petrkucerak.cz/' },
					' on data collection, chord representation, model design and evaluation.'
				],
				'I continued independently after the programme and turned the experimental models into a public application. The product layer around inference covers state management, editing, playback, import and export, documentation, browser compatibility and ongoing maintenance.'
			]
		},
		{
			title: 'Application and local inference',
			paragraphs: [
				'The PyTorch models are exported to ONNX and run in a web worker. This avoids a model server and keeps the progression in the browser.',
				'The editor includes a zoomable timeline, durations and time signatures, style conditioning, chord search and variants, undo and redo, autosave, keyboard shortcuts and audio playback. Progressions can be imported from or exported to MIDI, and exported as rendered audio.'
			],
			media: [
				{
					image: 'chordseqai-timeline',
					alt: 'ChordSeqAI timeline with chord blocks, durations and playback controls',
					caption: 'The timeline supports direct editing and playback.',
					fit: 'contain'
				},
				{
					image: 'chordseqai-suggestions',
					alt: 'Ranked chord suggestions in the ChordSeqAI interface',
					caption: 'Suggestions are presented as alternatives within the editor.',
					fit: 'contain'
				}
			]
		},
		{
			title: 'Use and recognition',
			paragraphs: [
				'At its peak, ChordSeqAI had more than 5,000 monthly active users. The underlying research was presented through Czech and international student science programmes in 2024 and 2025.'
			],
			highlights: [
				{
					title: 'Students’ Professional Activities · 2024',
					body: '1st place nationally in Computer Science.'
				},
				{
					title: 'Jaroslav Heyrovský Endowment Fund Prize · 2024',
					body: 'National recognition for the ChordSeqAI research.'
				},
				{
					title: 'Taiwan International Science Fair · 2025',
					body: 'Second Award in Computer Science and Information Engineering.'
				},
				{
					title: 'Learned Society of the Czech Republic · 2025',
					body: 'Award for secondary-school students.'
				}
			]
		},
		{
			title: 'After release',
			paragraphs: [
				'ChordSeqAI has been publicly available since January 2024. Later work moved inference into a web worker, expanded MIDI import, added rendered audio export and introduced automated tests for the core composition flow. Recent maintenance has focused on keeping local inference and the static deployment reliable as browsers and the surrounding web stack change.'
			]
		}
	],
	resources: [
		{ label: 'Source code', href: 'https://github.com/PetrIvan/chord-seq-ai-app' },
		{ label: 'Wiki', href: 'https://chordseqai.com/wiki' },
		{
			label: 'Original research repository',
			href: 'https://github.com/StudentTraineeCenter/chord-seq-ai'
		}
	],
	featured: true
};
