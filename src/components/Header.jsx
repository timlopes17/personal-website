import React from 'react';

const Header = ({className}) => {
  return (
    <header className={`${className} bg-zinc-950 text-white py-4 shadow-md fixed top-0 left-0 right-0 z-10`}>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex-grow"></div>
        <ul className="flex sm:space-x-6 text-base md:text-4xl"> {/* added md:text-xl class */}
            <li>
            <a href="#skills" className="hover:text-red-600 sm: p-3">Skills</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#projects" className="hover:text-blue-600 sm: p-3">Projects</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#about" className="hover:text-green-600 sm: p-3">About</a> {/* removed text-xlg class */}
            </li>
            <li>
            <a href="#contact" className="hover:text-yellow-600 sm: p-3">Contact</a> {/* removed text-xlg class */}
            </li>
        </ul>
        <div className="flex-grow"></div>
      </nav>
    </header>
  );
};

export default Header;