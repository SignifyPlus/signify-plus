#!/bin/bash
# SignifyPlus API Test Commands - Fixed Version
# Handles specific chat configurations in your database

# Test Environment Variables
USER_IMAN_PHONE="+90123456789"
USER_KAMILA_PHONE="+994557259939"
USER_OSAMA_PHONE="+90987654321"  

SERVER="http://localhost:3001"
RESULTS_DIR="test_results"

# Create results directory if it doesn't exist
mkdir -p $RESULTS_DIR

echo "============================================"
echo "STARTING SIGNIFYPLUS API TESTS"
echo "$(date)"
echo "============================================"

# Helper function to extract ID from JSON response
extract_id() {
  echo "$1" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Helper function to extract chat ID
extract_chat_id() {
  echo "$1" | grep -o '"chatId":"[^"]*"' | head -1 | cut -d'"' -f4
}

# 1. Get user IDs to ensure we have the correct IDs
echo -e "\n1. Getting User IDs"
IMAN_RESPONSE=$(curl -s -X GET "$SERVER/users/phone/$USER_IMAN_PHONE" || echo '{}')
KAMILA_RESPONSE=$(curl -s -X GET "$SERVER/users/phone/$USER_KAMILA_PHONE" || echo '{}')
OSAMA_RESPONSE=$(curl -s -X GET "$SERVER/users/phone/$USER_OSAMA_PHONE" || echo '{}')

# If user API endpoint doesn't exist, use known IDs
USER_IMAN_ID=$(extract_id "$IMAN_RESPONSE")
USER_KAMILA_ID=$(extract_id "$KAMILA_RESPONSE")
USER_OSAMA_ID=$(extract_id "$OSAMA_RESPONSE")

# Fallback to hardcoded IDs if API doesn't exist
if [ -z "$USER_IMAN_ID" ]; then
  USER_IMAN_ID="680be2f74b458b0637e83544"
fi
if [ -z "$USER_KAMILA_ID" ]; then
  USER_KAMILA_ID="680bfe0e6b137d89bda1902a"
fi
if [ -z "$USER_OSAMA_ID" ]; then
  USER_OSAMA_ID="680be27b4b458b0637e834cb"
fi

echo "Iman ID: $USER_IMAN_ID"
echo "Kamila ID: $USER_KAMILA_ID"
echo "Osama ID: $USER_OSAMA_ID"

# 2. Delete existing chats first to ensure clean state
echo -e "\n2. Getting existing chats to clean up"
CHATS_RESPONSE=$(curl -s -X GET "$SERVER/chats/$USER_IMAN_PHONE")
echo "$CHATS_RESPONSE" > "$RESULTS_DIR/existing_chats.json"

# Extract all chat IDs (this is a simplified approach, you might need more complex parsing)
echo "Cleaning up existing chats..."
echo "$CHATS_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4 | while read -r chat_id; do
  echo "Deleting chat $chat_id"
  curl -s -X DELETE "$SERVER/chats/delete" \
    -H "Content-Type: application/json" \
    -d "{
      \"userPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"chatId\": \"$chat_id\"
    }" > /dev/null
done

# 3. Now create a fresh chat between Iman and Kamila
echo -e "\n3. Creating new chat between Iman and Kamila"
CHAT_RESPONSE=$(curl -s -X POST "$SERVER/chats/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"mainUserPhoneNumber\": \"$USER_IMAN_PHONE\", 
    \"participants\": [\"$USER_KAMILA_PHONE\"]
  }")

echo "$CHAT_RESPONSE" > "$RESULTS_DIR/new_chat.json"

# Handle different response formats
if [[ "$CHAT_RESPONSE" == *"StatusCode"* ]]; then
  echo "Note: Chat creation returned an error. This could be because:"
  echo "1. A chat already exists (which we should have cleaned up)"
  echo "2. There's an issue with the API"
  
  # Try to get chats again to find the one with Kamila
  CHATS_RESPONSE=$(curl -s -X GET "$SERVER/chats/$USER_IMAN_PHONE")
  echo "$CHATS_RESPONSE" > "$RESULTS_DIR/retried_chats.json"
  
  # Now we need to find a chat where Kamila is a participant
  # This is more complex pattern matching - we're looking for a chat where Kamila's ID appears
  CHAT_ID=$(echo "$CHATS_RESPONSE" | grep -o "{\"_id\":\"[^\"]*\"[^}]*$USER_KAMILA_ID" | grep -o "\"_id\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)
  
  if [ -z "$CHAT_ID" ]; then
    # Explicitly create a new chat if we still can't find one
    echo "Creating a completely new chat..."
    CHAT_RESPONSE=$(curl -s -X POST "$SERVER/chats/create" \
      -H "Content-Type: application/json" \
      -d "{
        \"mainUserPhoneNumber\": \"$USER_IMAN_PHONE\", 
        \"participants\": [\"$USER_KAMILA_PHONE\"]
      }")
    echo "$CHAT_RESPONSE" > "$RESULTS_DIR/forced_new_chat.json"
    CHAT_ID=$(extract_id "$CHAT_RESPONSE")
  fi
else
  # Normal path - extract chat ID from response
  CHAT_ID=$(extract_id "$CHAT_RESPONSE")
fi

echo "Chat ID between Iman and Kamila: $CHAT_ID"

if [ -z "$CHAT_ID" ]; then
  echo "Failed to get a valid chat ID. Exiting tests."
  exit 1
fi

# 4. Get Chat by Phone Number (Iman's chats)
echo -e "\n4. Getting Chat by Phone Number (Iman)"
curl -s -X GET "$SERVER/chats/$USER_IMAN_PHONE" > "$RESULTS_DIR/chats_by_phone.json"
echo "Results saved to $RESULTS_DIR/chats_by_phone.json"

# 5. Get Chat History by ID - to verify it's the right chat
echo -e "\n5. Getting Chat History by ID"
CHAT_HISTORY=$(curl -s -X GET "$SERVER/chats/custom/id/$CHAT_ID")
echo "$CHAT_HISTORY" > "$RESULTS_DIR/chat_history.json"

# Make sure this is a chat between Iman and Kamila
echo "Verifying chat participants..."
CHAT_PARTICIPANTS=$(echo "$CHAT_HISTORY" | grep -o "$USER_KAMILA_ID")
if [ -z "$CHAT_PARTICIPANTS" ]; then
  echo "WARNING: This may not be a chat with Kamila. Proceeding anyway..."
fi

# 6. Post Message (Iman to Kamila)
echo -e "\n6. Posting Message (Iman to Kamila)"
MESSAGE_RESPONSE=$(curl -s -X POST "$SERVER/messages/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"mainUserPhoneNumber\": \"$USER_IMAN_PHONE\",
    \"targetUserPhoneNumbers\": [\"$USER_KAMILA_PHONE\"],
    \"message\": \"Test message via curl - $(date)\"
  }")

echo "$MESSAGE_RESPONSE" > "$RESULTS_DIR/created_message.json"

# Extract message ID
MESSAGE_ID=$(extract_id "$MESSAGE_RESPONSE")
echo "Created Message ID: $MESSAGE_ID"

if [ -z "$MESSAGE_ID" ]; then
  echo "Failed to get a valid message ID."
  echo "Response content: $MESSAGE_RESPONSE"
  echo "Trying to continue with remaining tests..."
  
  # Try to find a message ID in the chat history
  echo "Looking for existing messages in the chat..."
  MESSAGES_RESPONSE=$(curl -s -X GET "$SERVER/chats/custom/id/$CHAT_ID")
  echo "$MESSAGES_RESPONSE" > "$RESULTS_DIR/existing_messages.json"
  
  EXISTING_MESSAGE_ID=$(echo "$MESSAGES_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ ! -z "$EXISTING_MESSAGE_ID" ]; then
    echo "Found existing message ID: $EXISTING_MESSAGE_ID"
    MESSAGE_ID=$EXISTING_MESSAGE_ID
  fi
fi

# Continue with remaining tests if we have a message ID
if [ ! -z "$MESSAGE_ID" ]; then
  # 7. Reply to Message
  echo -e "\n7. Replying to Message"
  REPLY_RESPONSE=$(curl -s -X POST "$SERVER/messages/create" \
    -H "Content-Type: application/json" \
    -d "{
      \"mainUserPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"targetUserPhoneNumbers\": [\"$USER_KAMILA_PHONE\"],
      \"message\": \"This is a reply to the previous message - $(date)\",
      \"replyToId\": \"$MESSAGE_ID\"
    }")

  echo "$REPLY_RESPONSE" > "$RESULTS_DIR/reply_message.json"
  REPLY_ID=$(extract_id "$REPLY_RESPONSE")
  echo "Created Reply ID: $REPLY_ID"

  # 8. Edit Message
  echo -e "\n8. Editing Message"
  EDIT_RESPONSE=$(curl -s -X PUT "$SERVER/messages/edit" \
    -H "Content-Type: application/json" \
    -d "{
      \"senderPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"messageId\": \"$MESSAGE_ID\",
      \"newContent\": \"This is the edited message content - $(date)\"
    }")

  echo "$EDIT_RESPONSE" > "$RESULTS_DIR/edit_message.json"
  echo "Message edited result: $EDIT_RESPONSE"

  # 9. Pin Chat
  echo -e "\n9. Pinning Chat"
  PIN_CHAT_RESPONSE=$(curl -s -X POST "$SERVER/chats/pin" \
    -H "Content-Type: application/json" \
    -d "{
      \"userPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"chatId\": \"$CHAT_ID\",
      \"isPinned\": true
    }")

  echo "$PIN_CHAT_RESPONSE" > "$RESULTS_DIR/pin_chat.json"
  echo "Chat pinned result: $PIN_CHAT_RESPONSE"

  # 10. Pin Message
  echo -e "\n10. Pinning Message"
  PIN_MESSAGE_RESPONSE=$(curl -s -X POST "$SERVER/messages/pin" \
    -H "Content-Type: application/json" \
    -d "{
      \"userPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"messageId\": \"$MESSAGE_ID\",
      \"isPinned\": true
    }")

  echo "$PIN_MESSAGE_RESPONSE" > "$RESULTS_DIR/pin_message.json"
  echo "Message pinned result: $PIN_MESSAGE_RESPONSE"

  # 11. Toggle Message Read Status (mark as read)
  echo -e "\n11. Toggling Message Read Status"
  READ_RESPONSE=$(curl -s -X POST "$SERVER/messages/read-status" \
    -H "Content-Type: application/json" \
    -d "{
      \"userPhoneNumber\": \"$USER_KAMILA_PHONE\",
      \"messageId\": \"$MESSAGE_ID\",
      \"isRead\": true
    }")

  echo "$READ_RESPONSE" > "$RESULTS_DIR/read_status.json"
  echo "Message marked as read result: $READ_RESPONSE"

  # 12. Get Unread Message Count (specific chat)
  echo -e "\n12. Getting Unread Message Count (specific chat)"
  UNREAD_CHAT_RESPONSE=$(curl -s -X GET "$SERVER/messages/unread-count/$USER_KAMILA_PHONE/$CHAT_ID")
  echo "$UNREAD_CHAT_RESPONSE" > "$RESULTS_DIR/unread_count_chat.json"
  echo "Unread count for chat: $UNREAD_CHAT_RESPONSE"

  # 13. Get Unread Message Count (all chats)
  echo -e "\n13. Getting Unread Message Count (all chats)"
  UNREAD_ALL_RESPONSE=$(curl -s -X GET "$SERVER/messages/unread-count/$USER_KAMILA_PHONE")
  echo "$UNREAD_ALL_RESPONSE" > "$RESULTS_DIR/unread_count_all.json"
  echo "Unread count for all chats: $UNREAD_ALL_RESPONSE"

  # 14. Get Message Replies
  echo -e "\n14. Getting Message Replies"
  REPLIES_RESPONSE=$(curl -s -X GET "$SERVER/messages/replies/$MESSAGE_ID")
  echo "$REPLIES_RESPONSE" > "$RESULTS_DIR/message_replies.json"
  echo "Message replies result: $REPLIES_RESPONSE"

  # 15. Forward Message
  echo -e "\n15. Forwarding Message"
  FORWARD_RESPONSE=$(curl -s -X POST "$SERVER/messages/forward" \
    -H "Content-Type: application/json" \
    -d "{
      \"senderPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"messageId\": \"$MESSAGE_ID\",
      \"targetUserPhoneNumbers\": [\"$USER_OSAMA_PHONE\"]
    }")
  
  echo "$FORWARD_RESPONSE" > "$RESULTS_DIR/forward_message.json"
  echo "Message forwarded result: $FORWARD_RESPONSE"

  # 16. Soft Delete Message
  echo -e "\n16. Soft Deleting Message"
  DELETE_MESSAGE_RESPONSE=$(curl -s -X POST "$SERVER/messages/soft-delete" \
    -H "Content-Type: application/json" \
    -d "{
      \"senderPhoneNumber\": \"$USER_IMAN_PHONE\",
      \"messageId\": \"$MESSAGE_ID\"
    }")
  
  echo "$DELETE_MESSAGE_RESPONSE" > "$RESULTS_DIR/delete_message.json"
  echo "Message soft deleted result: $DELETE_MESSAGE_RESPONSE"
else
  echo "Skipping remaining tests as we couldn't get a valid message ID."
fi

# 17. Delete Chat (cleanup)
echo -e "\n17. Deleting Chat"
DELETE_CHAT_RESPONSE=$(curl -s -X DELETE "$SERVER/chats/delete" \
  -H "Content-Type: application/json" \
  -d "{
    \"userPhoneNumber\": \"$USER_IMAN_PHONE\",
    \"chatId\": \"$CHAT_ID\"
  }")

echo "$DELETE_CHAT_RESPONSE" > "$RESULTS_DIR/delete_chat.json"
echo "Chat deleted result: $DELETE_CHAT_RESPONSE"

echo -e "\n============================================"
echo "TESTS COMPLETED"
echo "$(date)"
echo "Test results saved in $RESULTS_DIR directory"
echo "============================================"