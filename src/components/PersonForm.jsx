const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
    return ( 
        <form onSubmit={addPerson} className="person">
            <div>
            name: <input value={newName}
            onChange={handleNameChange}/>
            </div>
            <div>
            number: <input value={newNumber}
            onChange={handleNumberChange}/>
            </div>
            <div>
            <button className="addBtn" type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm