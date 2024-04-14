
import { _mock } from 'src/_mock';

import { User } from '../auth/types';
import axiosInstance from '../utils/axios';
import { getAccountId } from '../auth/context/jwt/utils';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------


export async function fetchUser() {
  console.log(getAccountId());
  try {
    const response = await axiosInstance.get(`http://localhost:8080/users/${getAccountId()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    return [];
  }
}

export function useMockedUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    fetchUser().then(userDataFromAPI => {
      const user: User = {
        id: getAccountId(),
        firstName: userDataFromAPI.firstName,
        lastName: userDataFromAPI.lastName,
        email: userDataFromAPI.email,
        password: 'demo1234',
        photoURL: _mock.image.avatar(24),
        phoneNumber: '+40 777666555',
        country: 'United States',
        address: '90210 Broadway Blvd',
        state: 'California',
        city: 'San Francisco',
        zipCode: '94116',
        about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
        role: 'admin',
        isPublic: true,
      };
      resolve(user);
    }).catch(error => {
      console.error('Error fetching user data:', error);
      reject(error);
    });
  });
}

