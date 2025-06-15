import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await sendMessage({ image: base64Image });
      e.target.value = ""; // clear file input
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    const handleImageLoad = () => {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    };

    const images = document.querySelectorAll("img");
    images.forEach((img) => img.addEventListener("load", handleImageLoad));
    return () => {
      images.forEach((img) => img.removeEventListener("load", handleImageLoad));
    };
  }, [messages, selectedUser]);

  const currentUserId = authUser?._id;

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="logo" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <div>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="chat-img"
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                ) : (
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                      isCurrentUser
                        ? "bg-violet-600 rounded-br-none"
                        : "bg-violet-500/30 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <p className="text-gray-500 text-xs text-right mt-1">
                  {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                </p>
              </div>
              {isCurrentUser && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/20 backdrop-blur-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
          type="text"
          placeholder="Send a message..."
          className="flex-1 px-4 py-2 rounded bg-white/10 text-white placeholder-gray-300 outline-none"
        />
        <input
          onChange={handleSendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="gallery" className="w-5 mr-2 cursor-pointer" />
        </label>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
