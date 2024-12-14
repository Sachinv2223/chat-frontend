export interface iConversation {
    conversationId: string
    otherUser: iOtherUser
}

export interface iOtherUser {
    id: string
    fullName: string
    email: string
}

export interface iMessage {
    id: string
    message: string
    sender: iOtherUser
    timestamp: string
  }
  