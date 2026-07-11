import React from "react";

interface ChatsuggestionProps {
  text?: string;
}

const Chatsuggestion: React.FC<ChatsuggestionProps> = ({ text = "Greet" }) => {
  return (
    <div className="px-3 py-1 bg-white rounded-full text-[0.75rem] cursor-pointer hover:bg-[#f4f4f4] text-[#5C5C5C]">
      <div>{text}</div>
    </div>
  );
};

export default Chatsuggestion;
