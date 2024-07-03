import { Helmet } from 'react-helmet-async';

import { ProfileListView } from 'src/sections/profiles/view';

// ----------------------------------------------------------------------

export default function ProfilesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <ProfileListView />
    </>
  );
}
