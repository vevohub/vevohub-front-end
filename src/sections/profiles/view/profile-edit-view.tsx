import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IUserItem } from 'src/types/user';

import {fetchUserById} from "../../../_mock";
import UserNewEditForm from '../user-new-edit-form';

type Props = {
  id: string;
};

export default function ProfileEditPage({ id }: Props) {
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState<IUserItem | null>(null);

  useEffect(() => {
    fetchUserById(id).then(user => {
      setCurrentUser(user);
    }).catch(error => {
      console.error('Error fetching user:', error);
    });
  }, [id]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Profile',
            href: paths.dashboard.profiles.root,
          },
          { name: currentUser.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}
