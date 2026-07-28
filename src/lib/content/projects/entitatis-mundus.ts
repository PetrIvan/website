import type { Project } from './types';

export const entitatisMundus: Project = {
	id: 'entitatis-mundus',
	label: 'Brackeys Game Jam 2022.2',
	period: '2022',
	title: 'Entitatis Mundus',
	summary: 'A solo 2D platformer with fourteen levels, original pixel art and music.',
	cardSummary:
		'A solo 2D platformer built in one week, with fourteen levels, original pixel art and music, and an Entity that alters the simulation around the player.',
	facts: [
		{ label: 'Role', value: 'Solo developer · code, art, music and level design' },
		{ label: 'Availability', value: 'Playable on itch.io' },
		{ label: 'Stack', value: 'Unity, C#' }
	],
	metrics: [
		{ value: '86th', label: 'overall placement' },
		{ value: '1,046', label: 'jam entries' }
	],
	primaryAction: { label: 'Play on itch.io', href: 'https://nidive.itch.io/entitatis-mundus' },
	cardVisual: {
		kind: 'image',
		media: {
			image: 'entitatis-mundus-gameplay',
			alt: 'Entitatis Mundus level with a glowing white player and red pixel-art platforms',
			position: 'center'
		}
	},
	heroVisual: {
		kind: 'video',
		video: {
			src: '/media/entitatis-mundus-gameplay-720p.mp4',
			poster: '/media/entitatis-mundus-gameplay-720p-poster.jpg',
			alt: 'Entitatis Mundus gameplay showcase',
			caption: 'Gameplay showcase from the original jam release.'
		}
	},
	sections: [
		{
			title: 'Development',
			paragraphs: [
				'Entitatis Mundus was made for the theme “You’re not alone.” I handled the code, level design, pixel art, music and release during the seven-day jam. Downloaded sound effects are credited in the game.',
				'Several planned systems were cut so I could finish the central mechanic and public build on time.'
			]
		},
		{
			title: 'Game structure',
			paragraphs: [
				'Each death restarts the room and increments the simulation counter. Some blocks can change between attempts, while the Entity watches from positions assigned to each level.',
				'Scripted level events can stop the player, slow time, open dialogue and create or destroy spikes and blocks. The Entity can either help or obstruct the player.'
			]
		},
		{
			title: 'Release',
			paragraphs: [
				'The final build includes moving and bouncy platforms, animated dialogue and an ending scene.',
				'The game remains playable in the browser and downloadable for Windows, macOS and Linux. The jam submission preserves its rankings, ratings and feedback.'
			]
		}
	],
	resources: [
		{ label: 'Jam submission and results', href: 'https://itch.io/jam/brackeys-8/rate/1679372' },
		{ label: 'Brackeys Game Jam 2022.2', href: 'https://itch.io/jam/brackeys-8' }
	],
	featured: false
};
