import { memo, useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { bgBlur } from 'src/theme/css';

import Scrollbar from 'src/components/scrollbar';
import { NavSectionHorizontal } from 'src/components/nav-section';

import { User } from '../../auth/types';
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import HeaderShadow from '../common/header-shadow';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await useMockedUser();
        console.log(userData)
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);


  const navData = useNavData();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: user?.role,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
