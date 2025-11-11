
import React from 'react';
import InstagramIcon from './icons/InstagramIcon';

interface AboutArtistProps {
  name: string;
  instagramUrl: string;
}

const AboutArtist: React.FC<AboutArtistProps> = ({ name, instagramUrl }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-5 text-center">
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-sm text-gray-400 mt-2 mb-4">
        Weaving love, nostalgia, and memory into a dreamy blend of glam-pop and cinematic indie rock.
      </p>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/60 text-sm text-cyan-300 font-medium rounded-full hover:bg-slate-600/80 hover:text-white transition-colors"
      >
        <InstagramIcon />
        Follow on Instagram
      </a>
    </div>
  );
};

export default AboutArtist;
