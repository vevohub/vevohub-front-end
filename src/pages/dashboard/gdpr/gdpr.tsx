import { Helmet } from 'react-helmet-async';

import TwoView from 'src/sections/gdpr/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Two</title>
      </Helmet>

      <TwoView />
    </>
  );
}
