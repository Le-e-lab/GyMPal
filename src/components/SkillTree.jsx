import React, { useState } from 'react';
import { getAllSkillBranches, loadSkills, calculateSkillProgress } from '../hooks/useSkills';

const SkillTree = () => {
  const [skills, setSkills] = useState(loadSkills());
  const [activeTab, setActiveTab] = useState('overview');

  const skillBranches = getAllSkillBranches();

  const getSkillData = (skillKey) => {
    const skillData = skills[skillKey] || { xp: 0 };
    return {
      ...calculateSkillProgress(skillData.xp),
      xp: skillData.xp
    };
  };

  const handleSkillClick = (skillKey) => {
    setActiveTab(skillKey);
  };

  return (
    <div className="skill-tree-container">
      <div className="skill-tree-header">
        <h2>Your Fitness Skill Tree</h2>
        <p>Track your progress across different fitness attributes</p>
      </div>
      
      <div className="skill-tree-tabs">
        {Object.keys(skillBranches).map((skillKey) => {
          const branch = skillBranches[skillKey];
          const skillData = getSkillData(skillKey);
          return (
            <button
              key={skillKey}
              className={`skill-tab ${activeTab === skillKey ? 'active' : ''}`}
              onClick={() => handleSkillClick(skillKey)}
            >
              <div className="skill-tab-icon">{branch.icon}</div>
              <div className="skill-tab-info">
                <div className="skill-tab-name">{branch.name}</div>
                <div className="skill-tab-level">Level {skillData.level}</div>
              </div>
              <div className="skill-tab-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${skillData.progressPercent}%` }}
                  ></div>
                </div>
                <small>{Math.round(skillData.progressPercent)}%</small>
              </div>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' ? (
        <div className="skill-overview">
          <h3>Skill Overview</h3>
          <p>Click on a skill above to see detailed progression and unlockables</p>
          <div className="skill-stats">
            {Object.keys(skillBranches).map((skillKey) => {
              const branch = skillBranches[skillKey];
              const skillData = getSkillData(skillKey);
              return (
                <div key={skillKey} className="skill-stat-card">
                  <div className="skill-stat-icon">{branch.icon}</div>
                  <div className="skill-stat-info">
                    <h4>{branch.name}</h4>
                    <p className="skill-stat-level">Level {skillData.level}</p>
                    <div className="skill-stat-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${skillData.progressPercent}%` }}
                        ></div>
                      </div>
                      <small>{Math.round(skillData.progressPercent)}%</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="skill-detail">
          <h3>{skillBranches[activeTab].name}</h3>
          <p>{skillBranches[activeTab].description}</p>
          
          <div className="skill-progress">
            <h4>Current Progress</h4>
            <p>Level: {getSkillData(activeTab).level}</p>
            <p>XP: {getSkillData(activeTab).xp}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getSkillData(activeTab).progressPercent}%` }}
              ></div>
            </div>
            <p>{Math.round(getSkillData(activeTab).progressPercent)}% to next level</p>
          </div>

          <div className="skill-unlockables">
            <h4>Upcoming Unlockables</h4>
            {/* This would be populated with actual unlockable content based on level */}
            <ul>
              <li>Level 5: Advanced Push-up Variations</li>
              <li>Level 8: Weighted Push-up Training</li>
              <li>Level 12: Plyometric Push-up Circuit</li>
              <li>Level 15: One-arm Push-up Preparation</li>
            </ul>
          </div>

          <div className="skill-tips">
            <h4>Training Tips</h4>
            <p>Focus on controlled movements and proper form to maximize skill gains.</p>
            <p>Consistency beats intensity - aim for regular practice over occasional intense sessions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTree;