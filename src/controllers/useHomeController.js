import { useHikes } from '../context/HikeContext';
import { useAuth } from '../context/AuthContext';

export const useHomeController = (navigation) => {
  const { filteredTrails, selectedDifficulty, setSelectedDifficulty, myStats } = useHikes();
  const { user, signOut } = useAuth();

  const difficulties = [
    { label: 'All', value: 'All' },
    { label: 'Hard', value: 'Hard' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Easy', value: 'Easy' },
  ];

  const handleNavigateToAddHike = () => {
    navigation.navigate('AddHike');
  };

  const handleNavigateToDetail = (hikeId) => {
    navigation.navigate('HikeDetail', { hikeId });
  };

  const handleNavigateToEdit = (hikeId) => {
    navigation.navigate('EditHike', { hikeId });
  };

  return {
    user,
    signOut,
    filteredTrails,
    selectedDifficulty,
    setSelectedDifficulty,
    myStats,
    difficulties,
    handleNavigateToAddHike,
    handleNavigateToDetail,
    handleNavigateToEdit
  };
};
