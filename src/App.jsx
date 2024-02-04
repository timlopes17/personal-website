import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SkillTable from './components/SkillTable';
import Project from './components/Project'
import me from './icons/me.jpg'
import linkedinIcon from './icons/linkedin.png';
import gmail from './icons/gmail.png'
import github from './icons/github.png'
import leetcode from './icons/leetcode.png'
import { Button } from '@mui/material'
import { darkTheme } from './Themes';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const firstDivHeight = document.querySelector('#first-div').offsetHeight;
      const scrollPosition = window.scrollY;
  
      if (scrollPosition < firstDivHeight/2) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    }
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showHeader]);

  return (
    <ThemeProvider theme={darkTheme}>
        <div className="flex flex-col h-screen">
          <Header className={showHeader ? 'show-header' : 'hide-header'} />
        <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
          <h1 className="md:text-6xl text-4xl font-bold text-center mb-4">
            Tim Lopes
          </h1>
          <h1 className="md:text-4xl text-2xl font-bold text-center mb-4">
            Software Developer
          </h1>
          <div className="flex flex-col sm:flex-row justify-between gap-2 mx-auto max-w-4xl mt-8">
              <Button size="large" variant="text" color="tl_skills" href="#skills" style={{fontSize: '30px'}}>
                Skills
              </Button>
              <Button size="large" variant="text" color="tl_projects" href="#projects" style={{fontSize: '30px'}}>
                Projects
              </Button>
              <Button size="large" variant="text" color="tl_demos" href="#demos" style={{fontSize: '30px'}}>
                Demos
              </Button>
              <Button size="large" variant="text" color="tl_about" href="#about" style={{fontSize: '30px'}}>
                About
              </Button>
              <Button size="large" variant="text" color="tl_contact" href="#contact" style={{fontSize: '30px'}}>
                Contact
              </Button>
          </div>
        </div>
        <div id="skills" className="pt-16 md:pt-20 pb-12 bg-mygray">
          <div className="mx-auto border-t-4 border-tw_skills">
            <div className="flex flex-wrap justify-center">
              <SkillTable/>
            </div>
          </div>
        </div>
        <div id="projects" className="pt-16 md:pt-20 pb-12 bg-mygray">
          <div className="border-t-4 border-tw_projects">
            <div className="flex-col flex justify-center items-center">
              <Project 
                icon='./discord-classroom.png' 
                link="https://github.com/timlopes17/discord-classroom" 
                label="Discord Classroom"
                description={<div dangerouslySetInnerHTML={{ __html: "Discord bot that provides a comprehensive learning environment for educators and "
                + "students. Features include: Quizzes, Assignments, Attendance, Polling, AI Study Tools, Lectures, and More.<br/><br/>Programming Language: "
                + "<span class='bold-project'>Python</span> <br/>Deployed on: <span class='bold-project'>Google Cloud Platform</span><br/>Database: "
                + "<span class='bold-project'>Supabase SQL</span><br />Testing: <span class='bold-project'>Unittest Framework</span>" }}></div>}
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
                icon="./plunged.png"
                link="https://store.steampowered.com/app/2499650/Plunged/"
                label="Plunged"
                description={<div dangerouslySetInnerHTML={{ __html: "Plunged is a first-person platformer developed on the <span class='bold-project'>Unity Real-Time Development Platform</span>. "
                + "Set in a dynamic 3D environment, players strive to ascend each level. Crafted in C#, the game features intuitive settings designed with <span class='bold-project'>UI/UX</span> best "
                + "practices. Comprehensive memory management ensures seamless asset loading and a high-quality experience across devices.<br/><br/>"
                + "Programming Language: <span class='bold-project'>C#</span><br/>Game Engine: <span class='bold-project'>Unity</span><br/>Steam Page:"
                + "<a href='https://store.steampowered.com/app/2499650/Plunged/' target='_blank' rel='noreferrer' class='bold-project'> HERE</a>" }}></div>}
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
        <div id="demos" className="pt-16 md:pt-20 bg-mygray">
          <div className="border-t-4 border-tw_demos">
            <div className="p-4 md:p-16 flex-col flex justify-center items-center">
              <p className="text-center text-gray-300 text-5xl">DEMOS<br/><br/></p>
              <Button
                size="large"
                variant="outlined"
                color="tl_demos"
                onClick={() => window.open('/movies', '_blank')}
                style={{ fontSize: '30px' }}>
                Movie Matchmaker
              </Button>
              <div className="p-6 border-b-2 border-tw_demos flex flex-col justify-between items-center text-white w-3/4 md:w-1/2 mb-6">
              <p className="text-center text-gray-300">Discover your next favorite film with Movie Matchmaker! This web tool takes the art of movie recommendations to the next level. Simply input two of your favorite movies, and let Movie Matchmaker work its magic!</p>
              <p className="text-center text-gray-300"><br/>Scikit-learn-based <span class='bold-demo'>machine learning</span> model development</p>
              <p className="text-center text-gray-300"><br/><span class='bold-demo'>Flask API</span> deployment on Google Cloud</p>
              <p className="text-center text-gray-300"><br/>Integrated with <span class='bold-demo'>OpenAI API</span> for AI movie generation</p>
              </div>

              <Button
                size="large"
                variant="outlined"
                color="tl_demos"
                onClick={() => window.open('/budget', '_blank')}
                style={{ fontSize: '30px' }}>
                Budget Balance
              </Button>
              <div className="p-6 border-b-2 border-tw_demos flex flex-col justify-between items-center text-white w-3/4 md:w-1/2">
              <p className="text-center text-gray-300">Discover your next favorite film with Movie Matchmaker! This web tool takes the art of movie recommendations to the next level. Simply input two of your favorite movies, and let Movie Matchmaker work its magic!</p>
              <p className="text-center text-gray-300"><br/>Scikit-learn-based <span class='bold-demo'>machine learning</span> model development</p>
              <p className="text-center text-gray-300"><br/><span class='bold-demo'>Flask API</span> deployment on Google Cloud</p>
              <p className="text-center text-gray-300"><br/>Integrated with <span class='bold-demo'>OpenAI API</span> for AI movie generation</p>
              </div>
            </div>
          </div>
        </div>
        <div id="about" className="pt-16 md:pt-20 bg-mygray">
          <div className="border-t-4 border-tw_about">
            <div className="p-4 md:p-16 flex-col flex justify-center items-center">
              <a href="https://www.linkedin.com/in/timlopes/" target="_blank" rel="noreferrer">
                <img src={me} alt="Project icon" className="border-4 border-tw_about w-64 h-64 mb-4" />
              </a>
              <a href="https://www.linkedin.com/in/timlopes/" target="_blank" rel="noreferrer" className="text-xl text-white text-center md:w-1/2">
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
          <div className="border-t-4 border-tw_contact">
            <div className="text-white text-xl md:text-3xl pt-8 flex-col flex justify-center items-center">
              <span className='flex items-center p-2'>
                <img src={gmail} alt="Gmail Icon" class="w-6 h-6 mr-2"/>
                <span>
                  Email:&nbsp;
                  <a href="mailto:timlopes0817@gmail.com" target="_blank" rel="noreferrer" className="text-white font-bold">timlopes0817@gmail.com</a>
                </span>
              </span>
              <span className="p-2">
                📞 Phone: 267-356-9719
              </span>
              <span class='flex items-center p-2'>
                <img src={linkedinIcon} alt="LinkedIn Icon" class="w-6 h-6 mr-2"/>
                <span>
                  LinkedIn:&nbsp;
                  <a href="https://www.linkedin.com/in/timlopes/" target="_blank" rel="noreferrer" className="text-white font-bold">/timlopes</a>
                </span>
              </span>
              <span class='flex items-center p-2'>
                <img src={github} alt="GitHub Icon" class="w-6 h-6 mr-2"/>
                <span>
                  GitHub:&nbsp;
                  <a href="https://github.com/timlopes17" target="_blank" rel="noreferrer" className="text-white font-bold">/timlopes17</a>
                </span>
              </span>
              <span class='flex flex-row justify-center items-center p-2'>
                <img src={leetcode} alt="LeetCode Icon" class="w-6 h-6 mr-2"/>
                <span>
                  LeetCode:&nbsp;
                  <a href="https://leetcode.com/timlopes/" target="_blank" rel="noreferrer" className="text-white font-bold">/timlopes</a>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;