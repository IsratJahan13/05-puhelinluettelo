import React from 'react';

const Persons = ({ persons, handleDelete }) => {
  return (
    <ul style={{ listStyleType: 'none' }}>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number} 
          <button className='deleteBtn' onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
