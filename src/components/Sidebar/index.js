import React from 'react';

const Sidebar = ({ chapters, selectChapter }) => {
  return (
    <nav className="sidebar">
      <ul>
        {chapters.map((chapter, index) => (
          <li key={index} onClick={() => selectChapter(index)}>
            {chapter.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;