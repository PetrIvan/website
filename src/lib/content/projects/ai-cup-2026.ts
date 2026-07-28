import type { Project } from './types';

export const aiCup2026: Project = {
	id: 'ai-cup-2026',
	label: 'Competition project',
	period: '2026',
	title: 'AI Cup 2026',
	summary:
		'Our team built a radar-track classifier and a deployment prototype for targeted wind farm curtailment.',
	cardSummary:
		'Our team combined bird-track classification with a prototype for targeted turbine curtailment and placed first overall.',
	facts: [
		{ label: 'Role', value: 'Team member · modelling and system design' },
		{ label: 'Team', value: 'Stochastic Gulls Descent' },
		{ label: 'Stack', value: 'Python, TabPFN, PyTorch, C++, ONNX Runtime' }
	],
	metrics: [
		{ value: '1st', label: 'overall in AI Cup 2026' },
		{ value: '89', label: 'teams from seven universities' }
	],
	primaryAction: {
		label: 'Read the report',
		href: 'https://drive.google.com/file/d/1GhqXJ8pQYMRGPI7yNO4ixqt7C1jtveuB/view'
	},
	cardVisual: {
		kind: 'image',
		media: {
			image: 'ai-cup-dashboard',
			alt: 'AI Cup operator dashboard showing bird tracks and turbine status at Eemshaven'
		}
	},
	sections: [
		{
			title: 'Competition context',
			paragraphs: [
				'AI Cup 2026 was a nationwide student competition organised by Team Epoch and enabled by AIC4NL around a challenge provided by TNO. Eighty-nine teams from seven Dutch universities worked with radar tracks from Windpark Eemshaven.',
				[
					'The Kaggle performance track ranked classifiers for nine bird groups. A separate implementation track asked teams to show how a model could support a feasible and responsible operational system. Our team was ',
					{
						label: 'Andreas Tziakouris',
						href: 'https://www.linkedin.com/in/andreas-tziakouris'
					},
					', ',
					{ label: 'Filip Morawiec', href: 'https://www.linkedin.com/in/filip-morawiec' },
					', ',
					{
						label: 'Mateusz Marciniak',
						href: 'https://www.linkedin.com/in/mateusz-marciniak-928530256'
					},
					', Petr Ivan and ',
					{ label: 'Tadeáš Fryčák', href: 'https://www.linkedin.com/in/tadeas-frycak' },
					'.'
				]
			]
		},
		{
			title: 'Classifying radar tracks',
			paragraphs: [
				'The data contained short position, altitude and radar-cross-section time series from a small number of labelled days. The classes were imbalanced, while the hidden test period included days and months absent from training.',
				'We represented each track with engineered flight, trajectory, radar and ecological features. A pretrained tabular foundation model outperformed the sequence encoders we tested in this small and noisy setting.'
			]
		},
		{
			title: 'Flock reconstruction and ablation results',
			paragraphs: [
				'The radar can cycle between birds in the same flock and record them as separate but related tracks. We reconstructed those groups through multiscale spatiotemporal clustering and fed flock-level context back into each prediction.',
				'Post-competition ablations showed that the core feature set, the tabular foundation model and multiscale clustering carried most of the generalisable gain. Several later priors and blends mainly improved the public leaderboard and transferred less reliably.'
			]
		},
		{
			title: 'Deployment prototype',
			paragraphs: [
				'The competition model was too heavy for the proposed edge computer, so we distilled its class probabilities into a compact SwiGLU MLP. The exported 786 KiB ONNX model runs beside a C++ feature extractor and accepts partial tracks as observations arrive.',
				'On the tested Intel i7, feature extraction, inference, trajectory prediction and the decision engine completed in under 1 ms per track. The prototype then estimated which turbines lay in a predicted path and emitted targeted pitch decisions instead of proposing a farm-wide shutdown.',
				'This was a deployment prototype, not a connection to a live wind farm SCADA system. Field integration, operational validation and safety work would still be required.'
			],
			media: [
				{
					image: 'ai-cup-dashboard',
					alt: 'AI Cup operator dashboard showing classified bird tracks, turbine status and curtailment statistics at Eemshaven',
					caption:
						'Our operator dashboard replays radar tracks and exposes classifications, turbine state and curtailment controls',
					credit:
						'Map powered by Esri; imagery sources: Esri, Vantor, Earthstar Geographics, and the GIS User Community'
				}
			]
		},
		{
			title: 'Result',
			paragraphs: [
				'Stochastic Gulls Descent ranked first in both the performance and implementation tracks, then finished first overall after the five finalists presented at the Dutch AI Congress. Team Epoch announced that the team would continue working with TNO to put the model into practice.'
			]
		}
	],
	resources: [
		{ label: 'Team Epoch competition recap', href: 'https://www.teamepoch.ai/ai-cup/' },
		{
			label: 'Competition format and rankings',
			href: 'https://www.teamepoch.ai/ai-cup/challenge-center/'
		},
		{ label: 'AIC4NL winner announcement', href: 'https://aic4nl.nl/en/aic4nl/winnaar-ai-cup/' },
		{
			label: 'Final presentation',
			href: 'https://drive.google.com/file/d/1md4J5umHG3ARYxxw2782Jv7KcZxqCsTc/view'
		}
	],
	featured: true
};
