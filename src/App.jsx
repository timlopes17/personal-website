import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SkillTable from './components/SkillTable';
import Project from './components/Project'
import me from './icons/me.jpg'
import linkedinIcon from './icons/linkedin.png';
import gmail from './icons/gmail.png'
import github from './icons/github.png'
import leetcode from './icons/leetcode.png'

function App() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const firstDivHeight = document.querySelector('#first-div').offsetHeight;
      const scrollPosition = window.scrollY;
  
      if (scrollPosition < firstDivHeight/2) {
        console.log("Hidden")
        setShowHeader(false);
      } else {
        console.log("Visible")
        setShowHeader(true);
      }
    }
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showHeader]);

  return (
    <div className="flex flex-col h-screen">
      <Header className={showHeader ? 'show-header' : 'hide-header'} />
      <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
        <h1 className="md:text-6xl text-4xl font-bold text-center mb-4">
          Tim Lopes
        </h1>
        <h1 className="md:text-4xl text-2xl font-bold text-center mb-4">
          Software Developer
        </h1>
        <div className="flex flex-col sm:flex-row justify-between mx-auto max-w-4xl mt-8">
          <button className="bg-white-600 hover:bg-red-600 text-white py-4 px-8 text-xl rounded mb-4 sm:mb-0 sm:mr-4">
            <a href="#skills">Skills</a>
          </button>
          <button className="bg-white-600 hover:bg-blue-600 text-white py-4 px-8 text-xl rounded mb-4 sm:mb-0 sm:mr-4">
            <a href="#projects">Projects</a>
          </button>
          <button className="bg-white-600 hover:bg-green-600 text-white py-4 px-8 text-xl rounded mb-4 sm:mb-0 sm:mr-4">
            <a href="#about">About</a>
          </button>
          <button className="bg-white-600 hover:bg-yellow-600 text-white py-4 px-8 text-xl rounded">
            <a href="#contact">Contact</a>
          </button>
        </div>
      </div>
      <div id="skills" className="pt-16 md:pt-20 pb-12 bg-mygray">
        <div className="mx-auto border-t-4 border-red-600">
          <div className="flex flex-wrap justify-center">
            <SkillTable/>
          </div>
        </div>
      </div>
      <div id="projects" className="pt-16 md:pt-20 pb-12 bg-mygray">
        <div className="border-t-4 border-blue-600">
          <div className="flex-col flex justify-center items-center">
            <Project 
              icon='./discord-classroom.png' 
              link="https://github.com/timlopes17/discord-classroom" 
              label="Discord Classroom"
              description={<div dangerouslySetInnerHTML={{ __html: "Discord bot that provides a comprehensive learning environment for educators and "
              + "students. Features include: Quizzes, Assignments, Attendance, Polling, AI Study Tools, Lectures, and More.<br/><br/>Programming Language: "
              + "<span class='bold-project'>Python</span> <br/>Deployed on: <span class='bold-project'>Google Cloud Platform</span><br/>Database: "
              + "<span class='bold-project'>Supabase SQL</span><br />Testing: <span class='bold-project'>unittest framework</span>" }}></div>}
            />
            <Project 
              icon='./adorado.png' 
              link="https://github.com/timlopes17/adorado" 
              label="Adorado"
              description={<div dangerouslySetInnerHTML={{ __html: "A Single Page Web Application that enables Billboard owners to list their rental properties and "
              + "Advertisers to rent these properties, while leveraging the powerful Google Maps API for listing creation and search functionality.<br/><br/>Programming Language: "
              + "<span class='bold-project'>Javascript</span><br/>Framework: <span class='bold-project'>React JS</span><br/>Deployed on: <span class='bold-project'>Vercel</span><br/>Database: "
              + "<span class='bold-project'>Supabase SQL</span>" }}></div>}
            />
            <Project 
              icon='./chop-it.png'  
              link="https://github.com/timlopes17/Chop-It-Phone-Sensor-Game" 
              label="Chop It!"
              description={<div dangerouslySetInnerHTML={{ __html: "Chop It is an engaging Android game that utilizes various sensors such as the gyroscope, accelerometer, magnetometer, "
              + "and light sensor to create a unique gaming experience. The incorporation of different sensors enhances the game's responsiveness and interactivity, making it a fun "
              + "and challenging game to play.<br/><br/>Programming Language: "
              + "<span class='bold-project'>Kotlin</span><br/>Deployed on: <span class='bold-project'>Play Store</span><br/>Play Store:"
              + "<a href='https://play.google.com/store/apps/details?id=edu.temple.chopitgame' target='_blank' class='bold-project'> DOWNLOAD</a>" }}></div>}
            />
            <Project
              icon="./overwatch-workshop.png"
              link="https://www.youtube.com/@PMAJellies/videos"
              label="Overwatch Workshop Developer"
              description={<div dangerouslySetInnerHTML={{ __html: "Using the Overwatch Workshop tool I've created over 30 Gamemodes. I was hired on NVIDIA "
              + "to create custom modes used for benchmarking and monitor testing. In total, over 500,000 people have used my workshops.<br/><br/>" 
              + "Programming Language: <span class='bold-project'>Simplified C++</span><br/>"
              + "Deployed on: <span class='bold-project'>Overwatch</span><br/>"}}></div>}
            />
            <Project
              icon="./jellies-bot.png"
              link="https://github.com/timlopes17/JelliesBot"
              label="Jellies Bot"
              description={<div dangerouslySetInnerHTML={{ __html: "Discord bot used by Twitch Streamer/YouTuber with +300,000 subscribers used to "
              + "easily tell editors what videos to edit and automatically upload content from Twitch to YouTube.<br/><br/>" 
              + "Programming Language: <span class='bold-project'>Python</span><br/>"
              + "Deployed on: <span class='bold-project'>Raspberry Pi</span><br/>"}}></div>}
            />
            <Project
              icon="./me.png"
              link="https://github.com/timlopes17/personal-website"
              label="Portfolio Website"
              description={<div dangerouslySetInnerHTML={{ __html: "I created this website to show off my projects, skills, about me, and contact links. "
              + "Used TailwindCSS to help with its reponsive design and feel.<br/><br/>" 
              + "Programming Language: <span class='bold-project'>React JS</span><br/>"
              + "IDE: <span class='bold-project'>VSCode</span><br/>"
              + "Deployed on: <span class='bold-project'>Netlify</span><br/>"}}></div>}
            />
          </div>
        </div>
      </div>
      <div id="about" className="pt-16 md:pt-20 bg-mygray">
        <div className="border-t-4 border-green-600">
          <div className="p-4 md:p-16 flex-col flex justify-center items-center">
            <a href="https://www.linkedin.com/in/timlopes/" target="_blank">
              <img src={me} alt="Project icon" className="border-4 border-green-600 w-64 h-64 mb-4" />
            </a>
            <a href="https://www.linkedin.com/in/timlopes/" target="_blank" className="text-xl text-white text-center md:w-1/2">
              https://www.linkedin.com/in/timlopes/
            </a>
            <div className="p-8 text-white text-center md:w-1/2">
            Hello! My name is Tim Lopes, and I am a computer science professional with a passion for video editing and social media management. 
            I have experience in both fields, having worked as a Freelance Video Editor and Digital Marketing Specialist. 
            In my previous roles, I was responsible for creating video content for customers, managing teams of video editors, and using 
            Python scripts to increase production efficiency.<br/><br/>

            I have a Bachelor of Science in Computer Science from Temple University, where I maintained a GPA of 3.71. 
            I also hold an Associate of Science in Computer Science from Montgomery County Community College, where I graduated with a GPA of 3.78. 
            Throughout my academic career, I completed a variety of courses, including Calculus 3, Software Design, Android Mobile Development, and 
            Web Application Development. <br/><br/>

            Currently, I am seeking a software development role where I can leverage my skills in programming and project management 
            to create high-quality software and solve complex problems in a dynamic and challenging environment. <br/><br/>
            </div>
          </div>
        </div>
      </div>
      <div id="contact" className="pt-16 md:pt-20 min-h-screen bg-mygray">
        <div className="border-t-4 border-yellow-600">
          <div className="text-white text-xl md:text-3xl pt-8 flex-col flex justify-center items-center">
            <span className='flex items-center p-2'>
              <img src={gmail} alt="Gmail Icon" class="w-6 h-6 mr-2"/>
              <span>
                Email:&nbsp;
                <a href="mailto:timlopes0817@gmail.com" target="_blank" className="text-white font-bold">timlopes0817@gmail.com</a>
              </span>
            </span>
            <span className="p-2">
              📞 Phone: 267-356-9719
            </span>
            <span class='flex items-center p-2'>
              <img src={linkedinIcon} alt="LinkedIn Icon" class="w-6 h-6 mr-2"/>
              <span>
                LinkedIn:&nbsp;
                <a href="https://www.linkedin.com/in/timlopes/" target="_blank" className="text-white font-bold">/timlopes</a>
              </span>
            </span>
            <span class='flex items-center p-2'>
              <img src={github} alt="GitHub Icon" class="w-6 h-6 mr-2"/>
              <span>
                GitHub:&nbsp;
                <a href="https://github.com/timlopes17" target="_blank" className="text-white font-bold">/timlopes17</a>
              </span>
            </span>
            <span class='flex flex-row justify-center items-center p-2'>
              <img src={leetcode} alt="LeetCode Icon" class="w-6 h-6 mr-2"/>
              <span>
                LeetCode:&nbsp;
                <a href="https://leetcode.com/timlopes/" target="_blank" className="text-white font-bold">/timlopes</a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;