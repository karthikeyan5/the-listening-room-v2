
import React, { useRef, useMemo, useState } from 'react';
import { Song, Feedback } from '../types';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
}

type Timeframe = 'day' | 'week' | 'month' | 'all';

const StatCard: React.FC<{ title: string; value: string | number; description?: string }> = ({ title, value, description }) => (
  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

const MIN_RATINGS_FOR_TOP_SPOT = 3;

const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({ isOpen, onClose, songs }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('day');

  const analyticsData = useMemo(() => {
    if (!isOpen) return null;

    const now = new Date();
    const timeFilters: Record<Timeframe, (date: Date) => boolean> = {
      day: (date) => now.getTime() - date.getTime() < 24 * 60 * 60 * 1000,
      week: (date) => now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000,
      month: (date) => now.getTime() - date.getTime() < 30 * 24 * 60 * 60 * 1000,
      all: () => true,
    };

    const songStatsMap: { [key: string]: { plays: number; totalRating: number; comments: number } } = {};
    songs.forEach(s => {
      songStatsMap[s.title] = { plays: 0, totalRating: 0, comments: 0 };
    });

    let totalPlays = 0;
    let totalRatingSum = 0;
    const uniqueListeners = new Set<string>();

    songs.forEach(song => {
      // FIX: Safely access optional 'feedback' property to prevent runtime errors.
      (song.feedback || []).forEach(f => {
        if (timeFilters[timeframe](f.timestamp)) {
          songStatsMap[song.title].plays += 1;
          songStatsMap[song.title].totalRating += f.rating;
          if (f.comment !== 'Quick rated from the list.') {
              songStatsMap[song.title].comments += 1;
          }
          totalPlays++;
          totalRatingSum += f.rating;
          uniqueListeners.add(f.expertName === 'Anonymous' ? f.id : f.expertName);
        }
      });
    });

    const songStats = Object.entries(songStatsMap).map(([title, data]) => ({
      title,
      ...data,
      avgRating: data.plays > 0 ? data.totalRating / data.plays : 0,
    }));

    const mostPlayedSong = [...songStats].sort((a, b) => b.plays - a.plays)[0];
    
    const eligibleForHighestRated = songStats.filter(s => s.plays >= MIN_RATINGS_FOR_TOP_SPOT);

    const highestRatedSong = eligibleForHighestRated.length > 0
      // If there are songs with enough ratings, find the best among them
      ? [...eligibleForHighestRated].sort((a, b) => b.avgRating - a.avgRating)[0]
      // Fallback to the best of any rated song if none meet the threshold
      : [...songStats].filter(s => s.plays > 0).sort((a, b) => b.avgRating - a.avgRating)[0];


    return {
      totalPlays,
      uniqueListeners: uniqueListeners.size,
      averageRating: totalPlays > 0 ? (totalRatingSum / totalPlays).toFixed(1) : 'N/A',
      mostPlayedSong,
      highestRatedSong,
      songStats,
    };
  }, [songs, timeframe, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  const timeframeLabels: Record<Timeframe, string> = { day: 'Today', week: 'This Week', month: 'This Month', all: 'All Time'};

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-5xl p-6 border border-slate-700 flex flex-col h-[85vh]"
      >
        <div className="flex-shrink-0 mb-4">
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <div className="flex items-center gap-2 mt-3 border-b border-slate-700 pb-3">
                {(Object.keys(timeframeLabels) as Timeframe[]).map(tf => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                            timeframe === tf ? 'bg-cyan-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/70'
                        }`}
                    >
                        {timeframeLabels[tf]}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {analyticsData && analyticsData.totalPlays > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Plays" value={analyticsData.totalPlays} />
                <StatCard title="Unique Listeners" value={analyticsData.uniqueListeners} />
                <StatCard title="Average Rating" value={`${analyticsData.averageRating} / 10`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard title="Most Played Song" value={analyticsData.mostPlayedSong.title} description={`${analyticsData.mostPlayedSong.plays} plays`} />
                {analyticsData.highestRatedSong && (
                    <StatCard 
                        title="Highest Rated Song" 
                        value={analyticsData.highestRatedSong.title} 
                        description={`${analyticsData.highestRatedSong.avgRating.toFixed(1)}/10 avg.`} 
                    />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Song Breakdown</h3>
                <div className="relative overflow-x-auto border border-slate-700 rounded-lg">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-slate-900/70">
                      <tr>
                        <th scope="col" className="px-6 py-3">Song Title</th>
                        <th scope="col" className="px-6 py-3 text-center">Plays</th>
                        <th scope="col" className="px-6 py-3 text-center">Comments</th>
                        <th scope="col" className="px-6 py-3 text-center">Avg. Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.songStats.map((song) => (
                        <tr key={song.title} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{song.title}</th>
                          <td className="px-6 py-4 text-center">{song.plays}</td>
                          <td className="px-6 py-4 text-center">{song.comments}</td>
                          <td className="px-6 py-4 text-center text-yellow-400 font-semibold">{song.avgRating.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center">No analytics data available for "{timeframeLabels[timeframe]}".</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardModal;