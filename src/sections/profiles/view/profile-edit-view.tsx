import React from 'react';
import {useQuery} from 'react-query';

import Container from '@mui/material/Container';

import {paths} from 'src/routes/paths';

import {useSettingsContext} from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import {IUserItem} from 'src/types/user';

import {fetchUserById} from "../../../_mock";
import UserNewEditForm from '../user-new-edit-form';
import {queryClient} from "../../../hooks/queryClient";

type Props = {
  id: string;
};

const ProfileEditPage = ({ id }: Props) => {
  const settings = useSettingsContext();


  const { data: currentUser, error, isLoading, isFetching } = useQuery<IUserItem>(
    ['user', id],
    () => fetchUserById(id),
    {
      staleTime: 4 * 60 * 1000, // 4 minutes
      cacheTime: 4 * 60 * 1000, // 4 minutes
      initialData: () => 
        // Provide initial data if available in the cache
         queryClient.getQueryData<IUserItem>(['user', id])
      ,
    }
  );


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching user:', error);
    return <div>Error loading user.</div>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentUser?.name}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Profile',
            href: paths.dashboard.profiles.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
};

export default ProfileEditPage;
