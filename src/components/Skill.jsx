import React from 'react';

const Skill = ({ label, description }) => {
    let html;

    html = (
        <div className="bg-mygray text-white p-6 border-2 border-red-600 flex flex-col justify-between h-80 w-64">
          <div className="text-lg font-bold mb-2 text-center my-auto border-b pb-4">{label}</div>
          <div className="text-base flex-grow pt-3 text-center"dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
      );
  
    if (label === "Programming languages") {
        html = (
        <div className="bg-mygray text-white p-6 border-2 border-red-600 flex flex-col justify-between h-80 w-64">
          <div className="text-lg font-bold mb-2 text-center my-auto border-b pb-4">{label}</div>
          <div className="text-base flex-grow text-center pt-3">Python</div>
          <div className="text-base flex-grow text-center pt-3">Java</div>
          <div className="text-base flex-grow text-center pt-3">React</div>
          <div className="text-base flex-grow text-center pt-3">Kotlin</div>
          <div className="text-base flex-grow text-center pt-3">C / C++ / C#</div>
        </div>
        )
    }
  
    return html;
  };

export default Skill;