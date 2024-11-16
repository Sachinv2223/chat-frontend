interface IMessage {
    id: string;
    content: string;
    sender: 'self' | 'other';
    timestamp: Date;
}


const IndividualMessage = ({ message }: { message: IMessage }) => {
    return (
        <div
            key={message.id}
            className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${message.sender === 'self'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
            >
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block ${message.sender === 'self' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
};

export default IndividualMessage;