import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Rss } from 'lucide-react';

// Fill these in once the show is approved on each app; empty ones stay hidden.
export const PODCAST_LINKS: { label: string; href: string }[] = [
  { label: 'Apple Podcasts', href: '' },
  { label: 'Spotify', href: '' },
  { label: 'YouTube Music', href: '' },
];

export const PODCAST_FEED = 'https://kenjiai.com/podcast/feed.xml';

interface Props {
  number: number;
  title: string;
  image: string;
  audioUrl: string;
  duration: number;
  showAllLink?: boolean;
}

const PodcastPlayer: React.FC<Props> = ({ number, title, image, audioUrl, duration, showAllLink = true }) => (
  <div className="rounded-2xl border border-white/10 bg-gray-900/60 overflow-hidden">
    <img src={image} alt={`Episode ${number}: ${title}`} className="w-full aspect-video object-cover" loading="eager" />
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Headphones className="w-4 h-4 text-cyan-400" />
        <span>Episode {number} · {Math.round(duration / 60)} min</span>
      </div>
      <audio controls preload="metadata" src={audioUrl} className="w-full">
        <a href={audioUrl}>Download the episode</a>
      </audio>
      <div className="flex flex-wrap gap-2 text-sm">
        {PODCAST_LINKS.filter((l) => l.href).map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
             className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700">
            {l.label}
          </a>
        ))}
        <a href={PODCAST_FEED} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 inline-flex items-center gap-1.5">
          <Rss className="w-3.5 h-3.5" /> RSS feed
        </a>
        {showAllLink && (
          <Link to="/podcast" className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700">
            All episodes
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default PodcastPlayer;
