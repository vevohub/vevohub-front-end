import axiosInstance from '../utils/axios';
import {IUserItem, IApiProfile} from '../types/user';
import {getAccountId} from '../auth/context/jwt/utils';
import {candidatesResponseAPI} from "../types/candidates";

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
  {value: 'active', label: 'Active'},
  {value: 'pending', label: 'Pending'},
  {value: 'banned', label: 'Banned'},
  {value: 'rejected', label: 'Rejected'},
];


export async function fetchCandidates(page: number, size: number, profiles?: string[],
                                      fullNameCandidate?: string): Promise<candidatesResponseAPI> {
  try {
    const response = await axiosInstance.get<candidatesResponseAPI>('http://localhost:8080/candidates', {
      params: {
        page,
        size,
        profiles: profiles?.length ? profiles : undefined,// Only include if profiles are provided
        fullNameCandidate, // Only include if fullNameCandidate is provided
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates', error);
    throw error;
  }
}

export async function fetchRoles(): Promise<string[]> {
  try {
    const response = await axiosInstance.get('http://localhost:8080/candidates/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    return [];
  }
}

export function transformApiDataToUserItems(apiData: IApiProfile[] = []): IUserItem[] {
  if (!apiData || apiData.length === 0) {
    console.log("apiData is undefined or empty:", apiData);
    return [];
  }

  console.log(apiData);
  return apiData.map(apiUser => ({
    id: apiUser.id.toString(),
    name: apiUser.fullNameCandidate || 'Default Name',
    city: apiUser.locationCity || 'Default City',
    profile: apiUser.profile || 'Default Role',
    email: apiUser.email || 'no-email@example.com',
    status: apiUser.status || 'pending',
    address: 'Default Address',
    country: 'Default Country',
    financial_expectations: apiUser.financialExpectations || '0',
    avatarUrl: 'Default Avatar URL',
    phoneNumber: apiUser.contactNo,
    isVerified: true,
    linkedinUrl: ''
  }));
}

export const fetchUserById = async (id: string): Promise<IUserItem> => {
  try {
    const response = await axiosInstance.get(`http://localhost:8080/candidates/${id}`);
    const apiUser = response.data;
    return {
      id: apiUser.id.toString(),
      name: apiUser.fullNameCandidate || 'Default Name',
      city: apiUser.locationCity || 'Default City',
      profile: apiUser.profile || 'Default Role',
      email: apiUser.email || 'no-email@example.com',
      status: apiUser.status || 'pending',
      address: 'Default Address', // Placeholder
      country: 'Default Country', // Placeholder
      financial_expectations: apiUser.financialExpectations || '0',
      avatarUrl: 'Default Avatar URL', // Placeholder
      phoneNumber: apiUser.contactNo,
      isVerified: true,
      linkedinUrl: ''
    };
  } catch (error) {
    console.error('Error fetching user by ID', error);
    throw error;
  }
};


// Assuming you have a baseURL for your API
const baseURL = 'https://api.example.com/';

// Function to update user data via API
const updateUser = async (userData: any) => {

  try {
    // Make a PATCH request to update user data

    console.log('User data to update:', userData);

    const response = await axiosInstance.patch(`http://localhost:8080/users/${getAccountId()}`, userData);

    // Check if the request was successful
    if (response.status === 200) {
      // Data was updated successfully
      console.log('User data updated:', response.data);
    } else {
      // Handle unsuccessful response
      throw new Error('Failed to update user data');
    }
  } catch (error) {
    // Handle any errors
    console.error('Error updating user data:', error.message);
    throw error;
  }
};


export const resetForgottenUserPasswordByEmail = async (email: string) => {

  try {

    const response = await axiosInstance.post(`http://localhost:8080/initiate-password-reset`, {email});

    // Check if the request was successful
    if (response.status === 200) {
      // Data was updated successfully
      console.log('User data updated:', response.data);
    } else {
      // Handle unsuccessful response
      throw new Error(`No user found with email: ${email}`);
    }
  } catch (error) {
    // Handle any errors
    console.error('No user found with email:', error.message);
    throw error;
  }
};

export const updateUserCredentials = async (data: any) => {

  try {

    const response = await axiosInstance.post(`http://localhost:8080/update-password`, data);

    // Check if the request was successful
    if (response.status === 200) {
      // Data was updated successfully
      console.log('User data updated:', response.data);
    } else {
      // Handle unsuccessful response
      throw new Error(`No user found with email: ${data}`);
    }
  } catch (error) {
    // Handle any errors
    console.error('No user found with email:', error.message);
    throw error;
  }
};


export default updateUser;
