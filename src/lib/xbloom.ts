import type { XBloomProfile } from './types';

export function xbloomProfileToJSON(profile: XBloomProfile): string {
  return JSON.stringify(profile, null, 2);
}

export function xbloomProfileToFilename(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${safe}.xbloomprofile`;
}

export function xbloomProfileToQRPayload(profile: XBloomProfile): string {
  return JSON.stringify(profile);
}
