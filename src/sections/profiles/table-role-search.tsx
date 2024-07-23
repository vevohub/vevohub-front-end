import React, { useState, useEffect, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

interface ProfileSearchProps {
  data: string[];
  setFilteredData: (filteredData: string[]) => void;
}

// Utility function to normalize text (capitalize words)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s\w/g, (char) => char.toUpperCase());
};

const ProfileSearch: React.FC<ProfileSearchProps> = ({ data, setFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filteredData = data.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [searchTerm, data, setFilteredData]);

  return (
    <div>
      <TextField
        label="Search Profiles"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <List>
        {data.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProfileSearch;
