import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function ProfileCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.profiles.root,
          },
          { name: 'New user' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
