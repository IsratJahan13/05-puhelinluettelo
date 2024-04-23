import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')  
  const [newNumber, setNewNumber] = useState('')  
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])
  console.log('render', persons.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

  if (existingPerson) {
    // If person already exists, update their number
    const updatedPerson = { ...existingPerson, number: newNumber }

    personService.update(existingPerson.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person =>
          person.id !== existingPerson.id ? person : returnedPerson
        ))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error updating person:', error)
      })
  } else {
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService.create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {
      console.error('Error adding person:', error)
    })
}
    if(persons.find(person => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const filteredPersons = search.trim() === '' ? persons : persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        search={search} 
        handleSearchChange={handleSearchChange}/>
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )

}

export default App