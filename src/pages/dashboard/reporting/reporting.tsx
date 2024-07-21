import { Helmet } from 'react-helmet-async';
import ReportingView from "../../../sections/reporting/reportingview";



// ----------------------------------------------------------------------

export default function ReportingPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Three</title>
      </Helmet>

      <ReportingView />
    </>
  );
}
