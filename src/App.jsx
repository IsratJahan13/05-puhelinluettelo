import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')  
  const [newNumber, setNewNumber] = useState('')  
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
  
    if (existingPerson) {
      // If person already exists, confirm with the user before updating
      const confirmUpdate = window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`);
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Modified ${returnedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`Person '${existingPerson.name}' has already been removed from the server`);
            } else {
              setErrorMessage(`Error updating person '${existingPerson.name}': ${error.message}`);
            }
            setTimeout(() => {
              setErrorMessage(null);
            }, 12000);
          });
      } else {
        // Cancel update, do nothing
        setNewName('');
        setNewNumber('');
      }
    } else {
      // If person doesn't exist, create a new one
      const personObject = {
        name: newName,
        number: newNumber
      };
      personsService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 12000);
        })
        .catch(error => {
          setErrorMessage(`Error adding person '${newName}': ${error.message}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };  

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    // Filter the persons based on the search term
    const filteredPersons = searchTerm.trim() === '' ? persons : persons.filter(person =>
      person.name.toLowerCase().includes(searchTerm)
    );

    setPersons(filteredPersons);
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      personsService.remove(id)
        .then(() => {
          // Filter out the deleted person from the state
          const updatedPersons = persons.filter(person => person.id !== id);
          setPersons(updatedPersons);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage || successMessage} />
      <Filter 
        search={search} 
        handleSearchChange={handleSearchChange} 
      />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} handleDelete={handleDelete} />
    </div>
  )

}

export default App