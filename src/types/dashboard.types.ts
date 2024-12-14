export interface iConversation {
    conversationId: string
    otherUser: iOtherUser
}

export interface iOtherUser {
    id: string
    fullName: string
    email: string
}