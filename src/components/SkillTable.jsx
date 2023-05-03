import React from 'react';
import Skill from './Skill'

const SkillTable = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="pt-16 md:pt-16  md:pr-16">
        <Skill label="Programming languages" description="." bold="" />
      </div>
      <div className="pt-8 md:pt-16  md:pr-16">
        <Skill label="Web development" description="I have experience developing progressive web apps using 
          <span class='bold-skill'>React</span>, <span class='bold-skill'>Tailwind CSS</span>, and <span class='bold-skill'>Next.js</span>. 
          Additionally, I have created web applications utilizing <span class='bold-skill'>AJAX</span>, <span class='bold-skill'>PHP</span> and <span class='bold-skill'>MySQL</span>."/>
      </div>
      <div className="pt-8 md:pt-16 md:pr-16">
        <Skill label="Databases" description="I have experience using <span class='bold-skill'>MySQL</span> and <span class='bold-skill'>PostgreSQL</span>, as well as cloud databases
          such as <span class='bold-skill'>Supabase</span> and <span class='bold-skill'>Firebase</span>. This includes designing database schemas, writing complex queries, and optimizing performance." />
      </div>
      <div className="pt-8 md:pr-16">
        <Skill label="Mobile development" description="I have published two Android apps using <span class='bold-skill'>Android Studio</span> and <span class='bold-skill'>Kotlin</span>. 
          My latest app ChopIt! utilizes the sensors on mobile devices to create an interactive game experience." />
      </div>
      <div className="pt-8 md:pr-16">
        <Skill label="Cloud computing" description="I have used <span class='bold-skill'>Google Cloud Platform</span> for mutliple projects for deploying, utilizing APIs, 
        and running virtual machines. Check my Projects for more info." />
      </div>
      <div className="pt-8 md:pr-16">
        <Skill label="Machine learning" description="While completing course work for <span class='bold-skill'>CS50 Intro to Artificial Intelligence</span> I've used Python Machine Learning libraries including
         <span class='bold-skill'>TensorFlow</span>, <span class='bold-skill'>NLTK</span>, and <span class='bold-skill'>NumPy.</span> " />
      </div>
    </div>
  );
};

export default SkillTable;