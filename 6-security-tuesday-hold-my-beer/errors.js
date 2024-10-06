class ServerError {
    constructor(error) {
        this.error = error;
    }
}

export function userNotInConversationError() {
    return new ServerError("User not in conversation")
}

export function conversationNotFoundError() {
    return new ServerError("Conversation not found")
}

export function emptyMessageError() {
    return new ServerError("Message is empty")
}
