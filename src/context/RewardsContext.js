import PropTypes from 'prop-types';
import { createContext, useContext, useState, useCallback } from 'react';
import { rewardsApi } from '../api/rewardsApi';

export const RewardsContext = createContext();

export function RewardsProvider({ children }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rewardsApi.getAllRewards();
      setRewards(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReward = useCallback(async (rewardData) => {
    setLoading(true);
    try {
      const result = await rewardsApi.createReward(rewardData);
      await fetchRewards(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRewards]);

  const updateReward = useCallback(async (rewardId, updateData) => {
    setLoading(true);
    try {
      const result = await rewardsApi.updateReward(rewardId, updateData);
      await fetchRewards(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRewards]);

  const deleteReward = useCallback(async (rewardId) => {
    try {
      await rewardsApi.deleteReward(rewardId);
      setRewards(prev => prev.filter(reward => reward.rewardId !== rewardId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const bulkDeleteRewards = useCallback(async (rewardIds) => {
    try {
      await rewardsApi.bulkDeleteRewards(rewardIds);
      setRewards(prev => prev.filter(reward => !rewardIds.includes(reward.rewardId)));
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    rewards,
    loading,
    error,
    fetchRewards,
    createReward,
    updateReward,
    deleteReward,
    bulkDeleteRewards
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}

RewardsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};