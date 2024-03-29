import axios from 'axios';
import { API_BASE_URL } from './utility/helper';

export const signInUser = async (email, password, dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const accessToken = response.data.accessToken; // Assuming your server returns a token upon successful login

    // Store token in localStorage or sessionStorage
    // localStorage.setItem('token', token); // Or use sessionStorage if preferred

    try {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);

        const config = {
          headers: { Authorization: `Bearer ${accessToken}` }
        };

        const userDetailsResponse = await axios.get(`${API_BASE_URL}/users/user?email=${email}`,
          config);

        dispatch({
          type: 'SIGN_IN',
          payload: {
            user: {
              id: '5e86809283e28b96d2d38537',
              avatar: '/assets/avatars/avatar-anika-visser.png',
              name: userDetailsResponse.data.username,
              email: userDetailsResponse.data.email
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
    }

    // Dispatch action to update authentication state if needed
    // For example, you can dispatch an action to set isAuthenticated to true
    // and save user details from the token to state
  } catch (error) {
    // Handle authentication errors
    // You can set error state to display a message to the user
    console.error('Authentication er ror:', error.response.data);
    throw new Error('Authentication failed'); // Optional: rethrow the error to handle it elsewhere
  }
};

export const signUp = async (email, name, password) => {
  console.log(email, name, password);
  try {
    const data = {
      username: name, // Assuming 'name' contains the username
      passwordHash: password, // Assuming 'password' contains the password hash
      email: email, // The email remains the same
      role: 'user' // Assuming 'user' is the default role
    };

    const response = await axios.post('http://localhost:8080/register', data);

    if (response && response.data) {
      console.log(response.data);
    } else {
      console.log(response.data);
      console.error('Invalid response from server');
      throw new Error('Authentication failed');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Authentication error:', error.response.data);
    } else {
      console.error('Unexpected error during sign up:', error.message);
    }
    throw new Error('Authentication failed');
  }
};
