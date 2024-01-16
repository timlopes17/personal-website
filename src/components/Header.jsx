import React from 'react';

const Header = ({className}) => {
  return (
    <header className={`${className} bg-zinc-950 text-white py-4 shadow-md fixed top-0 left-0 right-0 z-10`}>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex-grow"></div>
        <ul className="flex sm:space-x-6 text-base md:text-4xl"> {/* added md:text-xl class */}
            <li>
            <a href="#skills" className="hover:text-tw_skills sm: p-2">SKILLS</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#projects" className="hover:text-tw_projects sm: p-2">PROJECTS</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#demos" className="hover:text-tw_demos sm: p-2">DEMOS</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#about" className="hover:text-tw_about sm: p-2">ABOUT</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#contact" className="hover:text-tw_contact sm: p-2">CONTACT</a> {/* removed text-xlg class */}
            </li>
        </ul>
        <div className="flex-grow"></div>
      </nav>
    </header>
  );
};

export default Header;