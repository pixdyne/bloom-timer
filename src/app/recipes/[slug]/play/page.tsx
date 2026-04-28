import { notFound } from 'next/navigation';
import { recipes, recipeBySlug } from '@/data/recipes';
import { FullscreenTimer } from '@/components/FullscreenTimer';

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) return {};
  return {
    title: `${r.name} — Live Timer`,
    description: `Brewing ${r.name} by ${r.author}.`,
  };
}

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) notFound();
  return <FullscreenTimer recipe={r} />;
}
