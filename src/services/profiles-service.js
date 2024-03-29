import axios from 'axios';

export const handleSearchChange = (onSearch, setSearchValue) => (event) => {
  const searchValue = event.target.value;
  setSearchValue(searchValue); // Update the search input value

  // Make API call to retrieve positions based on the input value
  axios.get(`http://localhost:8080/candidates?fullNameCandidate=${searchValue}`)
       .then(response => {
         onSearch(response.data); // Pass the filtered data to the parent component
       })
       .catch(error => {
         console.error('Error fetching positions:', error);
       });
};

//Fetch all positions
export const fetchPositions = () => {
  return axios.get('http://localhost:8080/positions')
              .then(response => response.data.filter(Boolean)) // Filter out any null values from the response
              .catch(error => {
                console.error('Error fetching positions:', error);
                throw error; // Rethrow the error to handle it outside of this function if necessary
              });
};

export const fetchProfilesByPositions = (selectedPositions) => {
  const queryParams = selectedPositions.map(pos => `position=${encodeURIComponent(pos)}`).join('&');
  const url = `http://localhost:8080/profiles/positions?${queryParams}`;
  return axios.get(url)
              .then(response => response.data)
              .catch(error => {
                console.error('Error fetching profiles by positions:', error);
                throw error;
              });
};
