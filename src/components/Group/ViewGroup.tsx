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
      className={`animate-fade-in fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark mx-2 w-full max-w-[500px] rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              Group Members
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="border-dark-lighten flex items-stretch border-b">
          <button
            onClick={() => setSelectedSection(Sections.members)}
            className={`flex-1 py-2 text-center ${
              selectedSection === Sections.members ? "bg-dark-lighten" : ""
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setSelectedSection(Sections.admins)}
            className={`flex-1 py-2 text-center ${
              selectedSection === Sections.admins ? "bg-dark-lighten" : ""
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setSelectedSection(Sections.addMembers)}
            className={`flex-1 py-2 text-center ${
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
