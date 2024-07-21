import { Helmet } from 'react-helmet-async';

import GdprView from 'src/sections/gdpr/gdprview';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> GDPR </title>
      </Helmet>

      <GdprView />
    </>
  );
}
