import { useEffect, useState } from "react";
import userCircle from "../../assets/user-circle.svg";
import IndividualMessage from "../../components/IndividualMessage/IndividualMessage";
import Input from "../../components/Input";
import { dashboardService } from "../../services/dashboard.service";
import { iConversation, iMessage } from "../../types/dashboard.types";

function Dashboard() {
    const defaultImg = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    // const messages: {
    //     id: string;
    //     content: string;
    //     sender: 'self' | 'other';
    //     timestamp: Date;
    // }[] = [
    //         { id: '1', content: 'Hello', sender: 'self', timestamp: new Date() },
    //         { id: '2', content: 'Hi', sender: 'other', timestamp: new Date() },
    //         { id: '3', content: 'How are you?', sender: 'self', timestamp: new Date() },
    //         { id: '4', content: 'I am fine. How about you?', sender: 'other', timestamp: new Date() },
    //         { id: '5', content: 'I am good. Thank you.', sender: 'self', timestamp: new Date() },
    //         { id: '6', content: 'You are welcome.', sender: 'other', timestamp: new Date() },
    //         { id: '7', content: 'I am fine. How about you?', sender: 'self', timestamp: new Date() },
    //         { id: '8', content: 'I am good. Thank you.', sender: 'other', timestamp: new Date() },
    //         { id: '9', content: 'You are welcome.', sender: 'self', timestamp: new Date() },
    //         { id: '10', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', sender: 'other', timestamp: new Date() },
    //         { id: '11', content: 'I am good. Thank you.', sender: 'self', timestamp: new Date() },
    //         { id: '12', content: 'You are welcome.', sender: 'other', timestamp: new Date() },
    //         { id: '13', content: 'I am fine. How about you?', sender: 'self', timestamp: new Date() },
    //         { id: '14', content: 'I am good. Thank you.', sender: 'other', timestamp: new Date() },
    //         { id: '15', content: 'You are welcome.', sender: 'self', timestamp: new Date() },
    //         { id: '16', content: 'I am fine. How about you?', sender: 'other', timestamp: new Date() },
    //         { id: '17', content: 'I am good. Thank you.', sender: 'self', timestamp: new Date() },
    //         { id: '18', content: 'You are welcome.', sender: 'other', timestamp: new Date() },
    //         { id: '19', content: 'I am fine. How about you?', sender: 'self', timestamp: new Date() },
    //         { id: '20', content: 'I am good. Thank you.', sender: 'other', timestamp: new Date() },
    //         { id: '21', content: 'You are welcome.', sender: 'self', timestamp: new Date() },
    //         { id: '22', content: 'I am fine. How about you?', sender: 'other', timestamp: new Date() },
    //         { id: '23', content: 'I am good. Thank you.', sender: 'self', timestamp: new Date() },
    //         { id: '24', content: 'You are welcome.', sender: 'other', timestamp: new Date() },
    //         { id: '25', content: 'I am fine. How about you?', sender: 'self', timestamp: new Date() },
    //         { id: '26', content: 'I am the latest one', sender: 'other', timestamp: new Date() },
    //     ];
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:data') || ''));
    const [conversations, setConversations] = useState([] as iConversation[]);
    const [messages, setMessages] = useState([] as iMessage[])
    const [selectedConversation, setSelectedConversation] = useState(null as iConversation | null);
    const getConversations: () => Promise<iConversation[]> = async () => {
        return user ? await dashboardService.fetchConversations(user?.id) : [] as iConversation[];
    }
    const fetchMessages = async (conversation: iConversation) => {
        setSelectedConversation(conversation);
        const messages = await dashboardService.fetchMessages(conversation?.conversationId);
        console.log('messages => ', JSON.stringify(messages));
        setMessages(messages);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.relative')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // to fetch conversation details whenever user changes
    useEffect(() => {
        const fetchConversations = async () => {
            const convs = await getConversations();
            console.log(JSON.stringify(convs));
            setConversations(convs);
        };
        fetchConversations(); // Call the async function
        // Optionally, you can add a cleanup function if needed
    }, [user]); // Add user as a dependency if you want to refetch when user changes

    return (
        <div className="w-screen h-screen flex flex-row">

            {/* Left Sidebar */}
            <div className="w-1/4 h-full bg-gray-200 border border-gray-300 flex flex-col">
                {/* Fixed Header */}
                <div className="flex-none p-4">
                    <div className="flex items-center gap-2">
                        <img src={userCircle} alt="user-profile-img" className="size-20" />
                        <div>
                            <h3 className="text-3xl">{user?.fullName || 'DefaultName'}</h3>
                            <p className="text-md text-gray-600">My Account</p>
                        </div>
                    </div>
                </div>

                <hr className="border-t-1 border-gray-300" />

                {/* Messages Section */}
                <div className="flex-1 flex flex-col min-h-0 p-4">
                    <div className="text-lg font-semibold mb-2">Messages</div>
                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-y-auto">

                        {
                            conversations && conversations?.length > 0

                                ? conversations.map((conversation, index) => (
                                    <div
                                        onClick={() => fetchMessages(conversation)}
                                        key={conversation.conversationId}
                                        id={conversation.conversationId}
                                        className={`flex items-center py-4 px-2 gap-4 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${index < conversations.length - 1 ? 'border-b border-gray-400' : ''}`}
                                    >
                                        <img
                                            src={defaultImg}
                                            alt={`${conversation.otherUser.fullName}'s profile`}
                                            className="size-12 rounded-full object-cover object-center"
                                        />
                                        <div>
                                            <h3 className="text-xl text-slate-800">{conversation.otherUser.fullName}</h3>
                                            <p className="text-sm text-gray-500">Online</p>
                                        </div>
                                    </div>
                                ))

                                : <div className="flex items-start justify-center h-full">
                                    <p className="text-lg">No Conversations</p>
                                </div>

                        }
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-slate-300 flex flex-col items-center h-full">

                {
                    selectedConversation && messages && messages.length > 0

                        ? <>
                            {/* Header in chat */}
                            <div className="w-3/4 p-4 m-4 bg-gray-100 flex-none rounded-full">
                                <div className="flex items-center justify-between">
                                    {/* For profile picture and name */}
                                    <div className="flex items-center justify-between gap-2">
                                        <img src={userCircle} alt="user-profile-img" className="size-14" />
                                        <div>
                                            <h3 className="text-2xl font-semibold">{selectedConversation?.otherUser?.fullName}</h3>
                                            <p className="text-sm flex items-center gap-1"><span className="text-green-600">●</span> Online</p>
                                        </div>
                                    </div>

                                    {/* For audio and video call actions */}
                                    <div className="flex items-center justify-end gap-4">

                                        {/* video call */}
                                        <div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                        </div>

                                        {/* phone call */}
                                        <div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                            </svg>
                                        </div>

                                        {/* More options with dropdown */}
                                        <div className="relative">
                                            <div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-colors"
                                                onClick={() => setIsOpen(!isOpen)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {isOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                        View Profile
                                                    </button>
                                                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                        Clear Chat
                                                    </button>
                                                    <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                                        Block Contact
                                                    </button>
                                                </div>
                                            )}
                                        </div>



                                    </div>
                                </div>
                            </div>

                            {/* Messages Parent Container */}
                            <div className="flex-1 flex flex-col min-h-0 p-4 w-full">
                                {/* Scrollable Container */}
                                <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {/* Messages Container */}
                                    <div className="flex flex-col justify-end space-y-4">
                                        {messages.map((message) => (
                                            <IndividualMessage key={message?.id} message={{
                                                id: message?.id,
                                                content: message?.message,
                                                sender: message?.sender === user?.id ? 'self' : 'other',
                                                timestamp: new Date(message?.timestamp)
                                            }}></IndividualMessage>
                                        ))}
                                    </div>
                                </div>
                                {/* Input Container */}
                                <div className="w-full my-2 gap-4 py-2 px-4 flex items-center justify-around">

                                    {/* <input type="text" className="flex-1block border-2 border-gray-300 rounded-md p-2 w-full" placeholder="Type your message here..." id="message" /> */}
                                    <Input name="messageInput" placeholder="Type your message here..." className="flex-1 border-2 border-gray-300 rounded-full w-full px-4" type="text" required={true} validationRequired={false}></Input>

                                    {/* Send Button */}
                                    <div className="p-2 bg-gray-100 hover:bg-slate-600 hover:text-white rounded-full cursor-pointer transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                        </svg>
                                    </div>

                                    {/* Attachment Button */}
                                    <div className="p-2 bg-gray-100 hover:bg-slate-600 hover:text-white rounded-full cursor-pointer transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </>

                        : <div className="flex items-center justify-center h-full">
                            <p className="text-lg">Select a Conversation</p>
                        </div>
                }

            </div>
        </div>
    );
}

export default Dashboard;