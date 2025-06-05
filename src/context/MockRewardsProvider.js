import PropTypes from 'prop-types';
import { RewardsContext } from './RewardsContext';

export function MockRewardsProvider({ children }) {
  const mockValue = {
    rewards: [],
    loading: false,
    error: null,
    fetchRewards: async () => {},
    createReward: async (data) => {
      console.log('Mock create reward:', data);
      return { success: true, rewardId: 'mock-id' };
    },
    updateReward: async (id, data) => {
      console.log('Mock update reward:', id, data);
      return { success: true };
    }
  };

  return (
    <RewardsContext.Provider value={mockValue}>
      {children}
    </RewardsContext.Provider>
  );
}

MockRewardsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};