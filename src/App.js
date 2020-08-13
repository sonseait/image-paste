import React from "react";
import "./App.css";
import { Input } from "./components/Input";

const renderItem = (item) => {
  if (item.type === "IMAGE") {
    return <img src={item.data} />;
  }
  return item.data;
};

function App() {
  const [messages, setMessages] = React.useState([]);

  const onSend = React.useCallback(
    (_messages) => {
      const newMessages = _messages.reverse().concat(messages);
      setMessages(newMessages);
    },
    [messages]
  );

  return (
    <div className="App">
      <Input onSend={onSend} />
      <div style={{ marginTop: 20 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ margin: "10px 0" }}>
            {renderItem(m)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
