import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ProfileEditPageView} from 'src/sections/profiles/view';

// ----------------------------------------------------------------------

export default function ProfileEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: User Edit</title>
      </Helmet>

      <ProfileEditPageView id={`${id}`} />
    </>
  );
}
