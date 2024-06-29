import axiosInstance from '../utils/axios';
import {IApiProfile, IUserItem} from '../types/user';
import {getAccountId} from '../auth/context/jwt/utils';
import {candidatesResponseAPI} from "../types/candidates";

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
  {value: 'active', label: 'Active'},
  {value: 'pending', label: 'Pending'},
  {value: 'banned', label: 'Banned'},
  {value: 'rejected', label: 'Rejected'},
];


export async function fetchCandidates(page: number, size: number): Promise<candidatesResponseAPI[]> {
  try {
    const response = await axiosInstance.get<candidatesResponseAPI[]>('http://localhost:8080/candidates', {
      params: {page, size}
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

export function transformApiDataToUserItems(apiData: IApiProfile[]): IUserItem[] {
  return apiData.map(apiUser => ({
    id: apiUser.id.toString(),
    name: apiUser.fullNameCandidate || 'Default Name',
    city: apiUser.locationCity || 'Default City',
    profile: apiUser.profile || 'Default Role',  // Since role isn't provided by API, set a default or another logic
    email: apiUser.email || 'no-email@example.com',
    status: apiUser.status || 'pending',
    address: 'Default Address',  // Not provided by API, use a placeholder
    country: 'Default Country',  // Not provided by API, use a placeholder
    financial_expectations: apiUser.financialExpectations || '0',
    avatarUrl: 'Default Avatar URL',  // Not provided by API, use a placeholder
    phoneNumber: apiUser.contactNo,
    isVerified: true,  // Not provided by API, assume a default
  }));
}

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
