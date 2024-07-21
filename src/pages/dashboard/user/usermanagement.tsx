import { Helmet } from 'react-helmet-async';

import UserManagementView from 'src/sections/four/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Four</title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
