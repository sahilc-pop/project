import React, { useEffect, useState } from 'react';
import { TPlayer, TPlayerType } from '../types';
import getPlayers from '../api/getPlayers';
import PlayerList from '../components/PlayerList';
import { Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<TPlayer[]>([]);
  const [selectedType, setSelectedType] = useState<TPlayerType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    let result = players;

    if (selectedType) {
      result = result.filter((player) => player.type === selectedType);
    }

    if (searchQuery) {
      result = result.filter((player) =>
        player.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlayers(result);
  }, [selectedType, searchQuery, players]);

  const handleSort = (key: 'name' | 'rank' | 'age') => {
    const sorted = [...filteredPlayers].sort((a, b) => {
      if (key === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (key === 'rank') {
        return (a.rank || 0) - (b.rank || 0);
      } else {
        const getAge = (dob?: number | null) => {
          if (!dob) return 0;
          return new Date().getTime() - dob;
        };
        return getAge(a.dob) - getAge(b.dob);
      }
    });
    setFilteredPlayers(sorted);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Trophy className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cricketers</h1>
        </div>
      </div>

      <PlayerList
        players={filteredPlayers}
        onTypeFilter={setSelectedType}
        onSearch={setSearchQuery}
        onSort={handleSort}
      />
    </div>
  );
};

export default Home;