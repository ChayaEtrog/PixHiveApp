import { useContext, useEffect, useState } from 'react';

import { Card, CardContent, Typography, Box, Grid2 } from '@mui/material';
import { UserStatistics } from '../types/UserStatistics';
import { getUserStatisticsById } from '../components/user/UserService';
import { UserContext } from '../components/user/UserReducer';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const StatCard = ({
  label,
  value,
  gradient
}: {
  label: string;
  value: string | number;
  gradient: string;
}) => {
  return (
    <Card
      sx={{
        border: '2px solid',
        borderImage: gradient,
        borderImageSlice: 1,
        minWidth: 200,
        width: '29vw',
        textAlign: 'center',
        boxShadow: 'none',
      }}
    >
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const UserStatsPage = () => {
  const { user } = useContext(UserContext)
  const [stats, setStats] = useState<UserStatistics | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStatisticsById(user.id, API_BASE_URL);
        setStats(data);
      } catch (error) {
        console.error("Failed to load user statistics", error);
      }
    };

    fetchStats();
  }, [user.id]);

  if (!stats) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Typography fontSize={30} mb={3} textAlign="center">
        statics for {stats.username}
      </Typography>
      
      <Grid2 container spacing={3}>
        <Grid2>
          <StatCard
            label="Number of Albums"
            value={stats.albumCount}
            gradient='linear-gradient(45deg, #47dcd1 , #dc8dec)'
          />
        </Grid2>
        <Grid2>
          <StatCard
            label="Number of Files"
            value={stats.fileCount}
            gradient='linear-gradient(45deg, #47dcd1 , #dc8dec)'
          />
        </Grid2>
        <Grid2>
          <StatCard
            label="Usage (MB)"
            value={stats.usedMegabytes.toFixed(2)}
            gradient='linear-gradient(45deg, #47dcd1 , #dc8dec)'
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default UserStatsPage;
