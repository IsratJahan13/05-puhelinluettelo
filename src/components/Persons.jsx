const Persons = ({filteredPersons}) => {
    return (
        <ul style={{ listStyleType: 'none' }}>
        {filteredPersons.map((person, index) => (
          <li key={index}>{person.name} {person.number}</li>
        ))}
        </ul>
    )
}

export default Persons