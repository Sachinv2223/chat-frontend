import React, { useEffect, useState } from "react";
import userCircle from "../../assets/user-circle.svg";
import IndividualMessage from "../../components/IndividualMessage/IndividualMessage";
import Input from "../../components/Input";
import { dashboardService } from "../../services/dashboard.service";
import { iConversation, iMessage, iOtherUser } from "../../types/dashboard.types";
import { commonService } from "../../services/common.service";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserPlusIcon } from "@heroicons/react/16/solid";

function Dashboard() {
    const defaultImg = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    const [isOpenMainChatDropdown, setIsOpenMainChatDropdown] = useState(false);
    const [isOpenUserProfileDropdown, setIsOpenUserProfileDropdown] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:data') || ''));
    const [conversations, setConversations] = useState([] as iConversation[]);
    const [messages, setMessages] = useState([] as iMessage[])
    const [selectedConversation, setSelectedConversation] = useState(null as iConversation | null);
    const [inputMessage, setInputMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [conversationCreated, setConversationCreated] = useState(0);
    const [allUserList, setAllUserList] = useState([] as iOtherUser[]);

    const getConversations: () => Promise<iConversation[]> = async () => {
        return user ? await dashboardService.fetchConversations(user?.id, navigate) : [] as iConversation[];
    }
    const navigate = useNavigate();
    const fetchMessages = async (conversation: iConversation) => {
        setSelectedConversation(conversation);
        const [error, messages] = await commonService.catchError(dashboardService.fetchMessages(conversation?.conversationId, navigate));
        if (error) {
            console.log(JSON.stringify(`Inside Dashboard:MessageError ${JSON.stringify(error)}`));
        }
        console.log('messages => ', JSON.stringify(messages));
        setMessages(messages);
    }

    const sendInputMessage = async (inputMessage: string) => {
        const [error, result] = await commonService.catchError(dashboardService.sendMessage(inputMessage, String(selectedConversation?.conversationId), user?.id, navigate));
        if (error) {
            console.log(JSON.stringify(`Inside Dashboard:InputMessageError ${JSON.stringify(error)}`));
        }
        console.log('sendInputMessage => ', JSON.stringify(result));
        setInputMessage('');
        selectedConversation && await fetchMessages(selectedConversation);
    }

    const onLogout = async () => {
        dashboardService.logout(navigate);
    }

    const onClickMessageNewPeople = async () => {

        // * get all users and update in allUserList
        // TODO its not a good way to call this api everytime on clicking MessageNewPeople button if the backend data is not changing
        const [error, users] = await commonService.catchError(dashboardService.fetchAllUsers(user?.id, navigate));
        if (error) {
            console.log(JSON.stringify(`Inside Dashboard:onClickMessageNewPeople ${JSON.stringify(error)}`));
        }
        setAllUserList(users as iOtherUser[]);

        // * to open this modal dialog
        setOpenModal(true);
    }

    const handleSelectUser = async (receiverData: iOtherUser) => {
        const [error, result] = await commonService.catchError(dashboardService.createConversation(user?.id, receiverData.id, navigate));
        if (error) {
            console.log(JSON.stringify(`Inside Dashboard:CreateConversationError ${JSON.stringify(error)}`));
        }
        console.log(`createConversation result => ${JSON.stringify(result)}`);

        // * to update the conversation list
        // const [errorConv, convs] = await commonService.catchError(getConversations());
        // if (errorConv) {
        //     console.log(JSON.stringify(`Inside Dashboard:convError ${JSON.stringify(error)}`));
        // }
        // setConversations(convs);

        // ! to trigger useEffect for fetching conversations (can cause issues)
        setConversationCreated(conversationCreated + 1);

        // * to switch the main chat to the newly created conversation
        await fetchMessages({
            conversationId: result.conversationId,
            otherUser: {
                id: receiverData.id,
                fullName: receiverData.fullName,
                email: receiverData.email
            }
        })

        // * close this modal dialog
        setOpenModal(false);
    }

    // * to fetch conversation details whenever user changes
    useEffect(() => {
        const fetchConversations = async () => {
            const [error, convs] = await commonService.catchError(getConversations());
            if (error) {
                console.log(JSON.stringify(`Inside Dashboard:convError ${JSON.stringify(error)}`));
            }
            console.log(JSON.stringify(convs));
            setConversations(convs);
        };
        fetchConversations(); // Call the async function
        // Optionally, you can add a cleanup function if needed
    }, [user, conversationCreated]); // Add user as a dependency if you want to refetch when user changes

    // * to close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if ((isOpenMainChatDropdown && !target.closest('.relative'))
                || (isOpenUserProfileDropdown && !target.closest('.relative'))) {
                setIsOpenMainChatDropdown(false);
                setIsOpenUserProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpenMainChatDropdown, isOpenUserProfileDropdown]);

    return (
        <div className="w-screen h-screen flex flex-row">

            {/* Left Sidebar */}
            <div className="w-1/4 h-full bg-gray-200 border border-gray-300 flex flex-col">
                {/* Fixed Header */}
                <div className="flex flex-row justify-between items-center p-4">
                    <div className="flex items-center gap-2">
                        <img src={userCircle} alt="user-profile-img" className="size-20" />
                        <div>
                            <h3 className="text-3xl">{user?.fullName || 'DefaultName'}</h3>
                            <p className="text-md text-gray-600">My Account</p>
                        </div>
                    </div>

                    <div className="relative flex flex-col justify-center items-center">
                        <div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-colors"
                            onClick={() => setIsOpenUserProfileDropdown(!isOpenMainChatDropdown)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {isOpenUserProfileDropdown && (
                            <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    View Profile
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-t-1 border-gray-300" />

                {/* Messages Section */}
                <div className="flex-1 flex flex-col min-h-0 px-4 pb-4">
                    <div className="py-4 flex flex-row justify-between items-center">
                        <span className="text-lg font-semibold text-center">Messages</span>

                        {/* Message new people */}
                        <div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-colors" onClick={() => onClickMessageNewPeople()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                        </div>
                    </div>
                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-y-auto">

                        {
                            conversations && conversations?.length > 0

                                ? conversations.map((conversation, index) => (
                                    <div
                                        onClick={() => fetchMessages(conversation)}
                                        key={conversation.conversationId}
                                        id={conversation.conversationId}
                                        className={`flex items-center py-3 px-2 gap-4 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${index < conversations.length - 1 ? 'border-b border-gray-400' : ''}`}
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
                    selectedConversation

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
                                                onClick={() => setIsOpenMainChatDropdown(!isOpenMainChatDropdown)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {isOpenMainChatDropdown && (
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

                                {
                                    messages && messages.length > 0
                                        ? <>
                                            {/* Scrollable Container */}
                                            <div className="flex-1 flex flex-col-reverse p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                {/* Messages Container */}
                                                <div className="flex flex-col justify-end space-y-4">
                                                    {messages.map((message) => (
                                                        <IndividualMessage key={message?.id} message={{
                                                            id: message?.id,
                                                            content: message?.message,
                                                            sender: message?.sender.id === user?.id ? 'self' : 'other',
                                                            timestamp: new Date(message?.timestamp)
                                                        }}></IndividualMessage>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                        : <div className="flex items-center justify-center h-full">
                                            <p className="text-lg">No Message</p>
                                        </div>
                                }


                                {/* Input Container */}
                                <div className="w-full my-2 gap-4 py-2 px-4 flex items-center justify-around">

                                    <Input
                                        name="messageInput"
                                        placeholder="Type your message here..."
                                        className="flex-1 border-2 border-gray-300 rounded-full w-full px-4"
                                        type="text"
                                        required={true}
                                        validationRequired={false}
                                        value={inputMessage}
                                        onChange={(e: any) => { setInputMessage(e.target.value) }}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendInputMessage(inputMessage)}
                                    >
                                    </Input>

                                    {/* Send Button */}
                                    <div
                                        onClick={() => sendInputMessage(inputMessage)} className={`p-2 bg-gray-100 hover:bg-slate-600 hover:text-white rounded-full cursor-pointer transition-colors ${!inputMessage && 'pointer-events-none'}`}>
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





            {/* Modal */}
            <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-10/12 md:w-8/12 lg:w-6/12"
                        >
                            <div className="bg-white p-8 h-[80vh] flex flex-col min-h-0">
                                <DialogTitle as="h2" className="flex flex-col">
                                    <span className="text-xl font-semibold text-gray-900">New Conversation</span>
                                    <span className="text-gray-400 text-sm">Select a member</span>
                                </DialogTitle>
                                <div className="my-4 flex-1 overflow-y-auto">
                                    {
                                        allUserList && allUserList.length > 0
                                            ? <div className="flex flex-col gap-4">
                                                {
                                                    allUserList.map((user: iOtherUser) => (
                                                        <div className="flex items-center gap-4 hover:bg-gray-100 p-2 cursor-pointer rounded-md" key={user.id} onClick={() => handleSelectUser(user)}>
                                                            <img
                                                                src={'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                                                                alt={user.fullName}
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                            <span>{user.fullName}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            : <div className="flex items-center gap-2">
                                                <span>No User Found</span>
                                            </div>
                                    }
                                </div>
                                <div className="flex flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={() => setOpenModal(false)}
                                        className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 ml-3 w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

        </div >
    );
}

export default Dashboard;