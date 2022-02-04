import { FC, useState } from "react";

import AddMembers from "./AddMembers";
import Admin from "./Admin";
import { ConversationInfo } from "../../shared/types";
import Members from "./Members";

interface ViewGroupProps {
  setIsOpened: (value: boolean) => void;
  conversation: ConversationInfo;
}

const ViewGroup: FC<ViewGroupProps> = ({ setIsOpened, conversation }) => {
  enum Sections {
    members,
    admins,
    addMembers,
  }
  const [selectedSection, setSelectedSection] = useState(Sections.members);

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 w-full h-full bg-[#00000080] z-20 flex justify-center items-center transition-all duration-300 animate-fade-in`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] mx-2 bg-dark rounded-lg"
      >
        <div className="py-3 border-b border-dark-lighten flex justify-between items-center px-3">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-center text-2xl whitespace-nowrap">
              Group Members
            </h1>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button
              onClick={() => setIsOpened(false)}
              className="w-8 h-8 bg-dark-lighten rounded-full flex justify-center items-center"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex items-stretch border-b border-dark-lighten">
          <button
            onClick={() => setSelectedSection(Sections.members)}
            className={`flex-1 text-center py-2 ${
              selectedSection === Sections.members ? "bg-dark-lighten" : ""
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setSelectedSection(Sections.admins)}
            className={`flex-1 text-center py-2 ${
              selectedSection === Sections.admins ? "bg-dark-lighten" : ""
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setSelectedSection(Sections.addMembers)}
            className={`flex-1 text-center py-2 ${
              selectedSection === Sections.addMembers ? "bg-dark-lighten" : ""
            }`}
          >
            Add members
          </button>
        </div>

        {selectedSection === Sections.members ? (
          <Members conversation={conversation} />
        ) : selectedSection === Sections.admins ? (
          <Admin conversation={conversation} />
        ) : selectedSection === Sections.addMembers ? (
          <AddMembers conversations={conversation} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ViewGroup;
