import storyImg from '$lib/assets/placeholder/story-01.jpg';
import craftImg from '$lib/assets/placeholder/craft-01.jpg';
import lifestyleImg from '$lib/assets/placeholder/lifestyle-01.jpg';
import alpineStockImg from '$lib/assets/stock-images/AdobeStock_1552940722.webp';

export interface JournalPost {
	slug: string;
	title: string;
	category: 'Lookbook' | 'Behind the Scenes' | 'Styling' | 'New Arrival';
	date: string;
	image: string;
	featured?: boolean;
	content?: {
		intro: string;
		body: string[];
		pullQuote?: string;
		images?: { src: string; alt: string }[];
	};
}

export const journalPosts = [
	{
		slug: 'spring-in-full-bloom',
		title: 'Spring in Full Bloom',
		category: 'Lookbook',
		date: '2026-02-14',
		image: storyImg,
		featured: true,
		content: {
			intro:
				'As the first crocuses push through frost-kissed soil, our Spring 2026 lookbook captures the quiet joy of a home awakening to longer days and softer light.',
			body: [
				'This season, our designers drew inspiration from alpine meadows in early bloom — the pale violets, the buttery yellows, the way morning dew catches on linen left out overnight. Each piece in the Imperial Bloom collection carries that sense of gentle abundance.',
				'Photographed in a restored farmhouse in the Austrian countryside, the lookbook pairs our newest jacquard throws with hand-thrown ceramics and freshly cut wildflowers. The result is an invitation to slow down, to linger at the breakfast table a little longer.',
				'From the reversible duvet covers in our signature botanical print to the crisp percale pillowcases finished with a delicate hemstitch, every detail has been considered. This is bedding that feels as beautiful as it looks.'
			],
			pullQuote:
				'We wanted each textile to feel like the first warm breeze of spring — light, alive, full of promise.'
		}
	},
	{
		slug: 'behind-the-loom',
		title: 'Behind the Loom',
		category: 'Behind the Scenes',
		date: '2025-11-08',
		image: craftImg,
		content: {
			intro:
				'In the foothills of the Alps, a family-run weaving mill has been perfecting the art of jacquard for over a century. We spent a week with the artisans who bring Aziza textiles to life.',
			body: [
				'The mill sits at the edge of a small village, its stone walls softened by decades of ivy. Inside, the rhythmic clatter of looms fills the air — a sound that has barely changed since the workshop was founded in 1897. Today, fourth-generation weaver Markus Hofer oversees a team of twelve, each trained in techniques passed down through apprenticeship.',
				'Our jacquard patterns begin as hand-drawn illustrations, translated into thousands of individual thread instructions. A single throw can take up to eight hours on the loom, with each colour change requiring careful hand-adjustment. It is slow, deliberate work — and you can feel it in the finished cloth.',
				'Sustainability is woven into every step. The mill sources certified organic cotton and European linen, dyes with low-impact pigments, and recycles nearly all water used in finishing. Offcuts are donated to local craft schools rather than discarded.'
			],
			pullQuote:
				'Every thread has a story. Our job is to make sure the finished piece tells it honestly.'
		}
	},
	{
		slug: 'styling-the-bedroom-for-spring',
		title: 'Styling the Bedroom for Spring',
		category: 'Styling',
		date: '2026-01-22',
		image: lifestyleImg,
		content: {
			intro:
				'Transitioning your bedroom from the cocooning warmth of winter to the airy freshness of spring does not require a complete overhaul. A few considered changes can transform the mood of an entire room.',
			body: [
				'Start with layers. Swap your heavy wool blanket for a lighter cotton throw in a muted botanical tone — sage, clay, or soft lavender. Keep your base linen neutral so the accent pieces do the seasonal storytelling. Our Maison Jardin flat sheet in natural ecru provides the perfect canvas.',
				'Next, think about texture. Spring bedding should feel crisp but not cold. A percale weave breathes beautifully as temperatures rise, while a single jacquard cushion adds visual warmth without weight. Try mixing a smooth sateen pillowcase with a textured linen sham for depth.',
				'Finally, do not underestimate the power of scent and light. A linen spray with notes of bergamot and white tea, paired with sheer curtains that let in the morning sun, completes the transformation. Your bedroom should feel like a deep breath.'
			]
		}
	},
	{
		slug: 'introducing-alpine-heritage',
		title: 'Introducing Alpine Heritage',
		category: 'New Arrival',
		date: '2025-09-15',
		image: alpineStockImg,
		content: {
			intro:
				'Rooted in the rugged beauty of the Austrian Alps, our newest collection draws on centuries of mountain craft tradition — reimagined for the modern home.',
			body: [
				'Alpine Heritage is a study in contrasts: the softness of brushed cotton against the structure of a herringbone weave; the warmth of amber and ochre set against cool slate and stone. Each piece references the textures and tones of the alpine landscape — from weathered timber to lichen-covered rock.',
				'The collection features six core pieces, including our first-ever wool-blend blanket, woven from a mix of merino and alpaca sourced from small farms in Tyrol. It is impossibly soft, naturally temperature-regulating, and finished with a hand-knotted fringe that nods to traditional Tyrolean textiles.'
			],
			pullQuote:
				'Alpine Heritage is where tradition meets restraint — craft you can feel, design that knows when to step back.'
		}
	}
] satisfies JournalPost[];
