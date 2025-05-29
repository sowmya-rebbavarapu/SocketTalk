import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData, userDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Convert user array to map for quick lookup
  const usersById = Object.fromEntries(
    userDummyData.map(user => [user._id, user])
  );

  // Set current user ID (mock login user ID)
  const currentUserId = "680f50e4f10f3cd28382ecf9"; // Martin Johnson

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
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

      {/* Chat Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;
          const sender = usersById[msg.senderId];

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="chat-img"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                    isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={
                    isCurrentUser
                      ? assets.avatar_icon
                      : sender?.profilePic || assets.default_profile
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

         {/*bottom area*/}
         <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-white/10">
  {/* Text Input and File Upload */}
  <div className="flex items-center flex-1 bg-white/5 rounded-full px-3 py-2">
    <input
      type="text"
      placeholder="Send a message"
      className="bg-transparent outline-none text-white flex-1"
    />
    {/* Hidden File Input */}
    <input
      type="file"
      id="image"
      accept="image/png, image/jpeg"
      hidden
    />
    <label htmlFor="image" className="cursor-pointer">
      <img src={assets.gallery_icon} alt="Gallery" className="w-5 mr-2" />
    </label>
  </div>

  {/* Send Button */}
  <img
    src={assets.send_button}
    alt="Send"
    className="w-7 cursor-pointer"
  />
</div>

    </div>
  ) : (
    // Default view when no user is selected
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime anywhere</p>
    </div>
  );
};

export default ChatContainer;
