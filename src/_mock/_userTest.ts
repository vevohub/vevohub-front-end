import axios from 'axios';
import { Candidate } from '../types/user';

// interface Candidate {
//   id: number;
//   osca: string;
//   recruiter: string;
//   full_name_candidate: string;
//   profile: string;
//   location_city: string;
//   financial_expectations: string;
//   contact_no: string;
//   email: string;
//   linkedin_link: string;
//   interview_rt_week: string;
//   feedback: string;
//   status: string;
//   details: string;
//   first_name: string;
//   last_name: string;
//   is_checked: boolean;
// }

const mapCandidate = (candidate: any, index: number): Candidate => {
  return {
    id: candidate.id,
    osca: candidate.osca,
    recruiter: candidate.recruiter,
    full_name_candidate: candidate.full_name_candidate,
    profile: candidate.profile,
    location_city: candidate.location_city,
    financial_expectations: candidate.financial_expectations,
    contact_no: candidate.contact_no,
    email: candidate.email,
    linkedin_link: candidate.linkedin_link,
    interview_rt_week: candidate.interview_rt_week,
    feedback: candidate.feedback,
    status: (index % 2 && 'pending') || (index % 3 && 'banned') || (index % 4 && 'rejected') || 'active',
    details: candidate.details,
    first_name: candidate.first_name,
    last_name: candidate.last_name,
    is_checked: candidate.is_checked,
  };
};

export const fetchDataAndMap = async (): Promise<Candidate[]> => {
  try {
    const response = await axios.get('http://localhost:8080/candidates');
    return response.data.map(mapCandidate);
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array or handle the error accordingly
  }
};
