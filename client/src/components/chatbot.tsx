import { useState } from "react";


const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async () => {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, `You: ${input}`, `Bot: ${data.reply}`]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 w-80 bg-white border rounded shadow">
      <h3 className="font-bold mb-2">ShopPal Assistant</h3>
      <div className="h-40 overflow-y-auto text-sm">
        {messages.map((msg, idx) => <p key={idx}>{msg}</p>)}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 border p-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2 bg-blue-500 text-white px-3 rounded" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;