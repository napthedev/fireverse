import { FC, useState } from "react";

import Files from "./Files";
import Image from "./Image";

interface ViewMediaProps {
  setIsOpened: (value: boolean) => void;
}

const ViewMedia: FC<ViewMediaProps> = ({ setIsOpened }) => {
  enum Sections {
    images,
    files,
  }
  const [selectedSection, setSelectedSection] = useState(Sections.images);

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
              View images and files
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
            onClick={() => setSelectedSection(Sections.images)}
            className={`flex-1 text-center py-2 ${
              selectedSection === Sections.images ? "bg-dark-lighten" : ""
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setSelectedSection(Sections.files)}
            className={`flex-1 text-center py-2 ${
              selectedSection === Sections.files ? "bg-dark-lighten" : ""
            }`}
          >
            Files
          </button>
        </div>

        {selectedSection === Sections.images ? (
          <Image />
        ) : selectedSection === Sections.files ? (
          <Files />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ViewMedia;
