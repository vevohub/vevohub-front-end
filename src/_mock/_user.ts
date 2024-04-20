import { countries } from 'src/assets/data';

import { _mock } from './_mock';
import axiosInstance from '../utils/axios';
import { IUserItem, IApiProfiles } from '../types/user';

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
  { value: 'rejected', label: 'Rejected' },
];

export const _userAbout = {
  id: _mock.id(1),
  role: _mock.role(1),
  email: _mock.email(1),
  country: countries[1].label,
  school: _mock.companyName(2),
  company: _mock.companyName(1),
  coverUrl: _mock.image.cover(3),
  totalFollowers: _mock.number.nativeL(1),
  totalFollowing: _mock.number.nativeL(2),
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  socialLinks: {
    facebook: `https://www.facebook.com/caitlyn.kerluke`,
    instagram: `https://www.instagram.com/caitlyn.kerluke`,
    linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitter: `https://www.twitter.com/caitlyn.kerluke`,
  },
};

export const _userFollowers = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  country: countries[index + 1].label,
  avatarUrl: _mock.image.avatar(index),
}));

export const _userFriends = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _userGallery = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  imageUrl: _mock.image.cover(index),
}));

export const _userFeeds = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  createdAt: _mock.time(index),
  media: _mock.image.travel(index + 1),
  message: _mock.sentence(index),
  personLikes: [...Array(20)].map((__, personIndex) => ({
    name: _mock.fullName(personIndex),
    avatarUrl: _mock.image.avatar(personIndex + 2),
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(index + 5),
        name: _mock.fullName(index + 5),
      },
      createdAt: _mock.time(2),
      message: 'Praesent venenatis metus at',
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(index + 6),
        name: _mock.fullName(index + 6),
      },
      createdAt: _mock.time(3),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
    },
  ],
}));

export const _userCards = [...Array(21)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  coverUrl: _mock.image.cover(index),
  avatarUrl: _mock.image.avatar(index),
  totalFollowers: _mock.number.nativeL(index),
  totalPosts: _mock.number.nativeL(index + 2),
  totalFollowing: _mock.number.nativeL(index + 1),
}));

export const _userPayment = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  cardNumber: ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 7878'][index],
  cardType: ['mastercard', 'visa', 'visa'][index],
  primary: index === 1,
}));

export const _userAddressBook = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  phoneNumber: _mock.phoneNumber(index),
  fullAddress: _mock.fullAddress(index),
  addressType: (index === 0 && 'Home') || 'Office',
}));

export const _userInvoices = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-199${index}`,
  createdAt: _mock.time(index),
  price: _mock.number.price(index),
}));

export const _userPlans = [
  {
    subscription: 'basic',
    price: 0,
    primary: false,
  },
  {
    subscription: 'starter',
    price: 4.99,
    primary: true,
  },
  {
    subscription: 'premium',
    price: 9.99,
    primary: false,
  },
];


export async function fetchCandidates(): Promise<IApiProfiles[]> {
  try {
    const response = await axiosInstance.get<IApiProfiles[]>('http://localhost:8080/candidates');
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    return [];
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


export function transformApiDataToUserItems(apiData: IApiProfiles[]): IUserItem[] {
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


import { getAccountId } from '../auth/context/jwt/utils';

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

    const response = await axiosInstance.post(`http://localhost:8080/initiate-password-reset`, { email });

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

export default updateUser;
