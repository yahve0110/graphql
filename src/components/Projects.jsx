import React from 'react';
import PropTypes from 'prop-types';

const ProjectList = ({ projects }) => {
  const filteredProjects = projects.filter(project => project.xp !== undefined);

  filteredProjects.sort((a, b) => new Date(b.created) - new Date(a.created));

  return (
    <div className="projectList">
      {filteredProjects.map((project, index) => (
        <div key={index} className="projectContainer">
          <h3>{project.projectName}</h3>
          <p>XP: {project.xp}</p>
          <p>Created: {new Date(project.created).toLocaleDateString()}</p>
          {project.updated && <p>Updated: {new Date(project.updated).toLocaleDateString()}</p>}
          {project.path && <p>Path: {project.path}</p>}
        </div>
      ))}
    </div>
  );
};



export default ProjectList;
