const Notification = ({message}) => {
    if(message === null) {
        return null
    }

    const className = message.startsWith('Error') || message.startsWith('Person') ? 'error' : 'success';

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification