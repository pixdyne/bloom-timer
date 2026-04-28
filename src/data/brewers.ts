import type { Brewer } from '@/lib/types';
import { recipes } from './recipes';

export type BrewerInfo = {
  slug: Brewer;
  displayName: string;
  short: string;
  description: string;
};

export const brewers: BrewerInfo[] = [
  {
    slug: 'v60',
    displayName: 'Hario V60',
    short: 'V60',
    description:
      'A 60° conical paper filter with a single spiral hole. The most studied dripper in specialty coffee.',
  },
  {
    slug: 'aeropress',
    displayName: 'AeroPress',
    short: 'AeroPress',
    description:
      'Closed pressure brewing with paper filtration. Forgiving, fast, and championship-tested.',
  },
  {
    slug: 'chemex',
    displayName: 'Chemex',
    short: 'Chemex',
    description: 'Heavy paper, glass body, decanter shape. A clean cup at three-cup scale.',
  },
  {
    slug: 'kalita',
    displayName: 'Kalita Wave',
    short: 'Kalita',
    description: 'A flat-bottomed bed and three holes. The forgiving cousin of the V60.',
  },
  {
    slug: 'origami',
    displayName: 'Origami',
    short: 'Origami',
    description:
      "A pleated dripper that adapts to either a V60 or a flat filter. Tetsu's favourite.",
  },
  {
    slug: 'french-press',
    displayName: 'French Press',
    short: 'French Press',
    description: 'Immersion brewing — long steep, simple technique, minimal fuss.',
  },
  {
    slug: 'moka',
    displayName: 'Moka Pot',
    short: 'Moka',
    description: 'Stovetop pressure brewing. Strong, fast, classic.',
  },
];

export function brewerBySlug(slug: string): BrewerInfo | undefined {
  return brewers.find((b) => b.slug === slug);
}

export function recipesForBrewer(slug: Brewer) {
  return recipes.filter((r) => r.brewer === slug);
}
