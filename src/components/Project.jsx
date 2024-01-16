import React from 'react';
const iconContext = require.context('../icons', true, /\.(png|jpg)$/);

const icons = iconContext.keys().reduce((icons, key) => {
  icons[key] = iconContext(key);
  return icons;
}, {});

const Project = ({ icon, link, label, description }) => {
    return (
        <div className="p-6 border-b-2 border-tw_projects flex flex-col justify-between items-center text-white w-3/4 md:w-1/2">
            <a href={link} target="_blank" rel="noreferrer">
                <img src={icons[icon]} alt="Project icon" className="ring-2 ring-gray-300 w-32 h-32 rounded-full mb-4" />
            </a>
            <h3 className="text-xl font-bold mb-2">
            <a href={link} target="_blank" rel="noopener noreferrer">{label}</a>
            </h3>
            <p className="text-center text-gray-300">{description}</p>
        </div>
    );
  };

export default Project;