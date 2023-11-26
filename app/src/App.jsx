import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

function App() {
  const [message, setMessages] = useState([
  {
    message: "Hello, I'm your nightmare",
    sender: 'ChatGPT',
    sentTime: 'just now',
  }
  ])
  const [isTyping, setIsTyping] = useState(false);
const handleSend = async (message) => {
  const newMessage = {
    message,
    sender: 'user',
    direction: 'outgoing',
  }
  //update message
  // process message (send+_response)

  const newMessages = [...message, newMessage];
  setMessages(newMessages);
  setIsTyping(true);
  await processsMessageToChatGPt(newMessages);
};
async function processsMessageToChatGPt(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

await fetch("https://api.openai.com/v1/chat/completions",
{
  method: "POST",
  headers: {
    "Authorization": "Bearer " + API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(apiRequestBody)
}).then((data)) => {
  return data.json();
}).then((data) => {
  console.log(data);
  setMessages([...chatMessages, {
    message: data.choices[0].text,
    sender: 'ChatGPT',
    sentTime: 'just now',
  }])

  return (
    <div className="App">
      <div style={{position: 'relative', height: '800px', width: '700px'}}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
               {message.map((meesage, i) => {
                 return <Message key={i} model={message}/>
               })}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
