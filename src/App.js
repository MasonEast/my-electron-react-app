import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Footer from './components/Footer';
import './App.less';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);

  const openFile = async () => {
    const response = await ipcRenderer.invoke('open-file');
    if (!response.canceled) {
      const chapters = parseChapters(response.content)
      setChapters(chapters);
    }
  };

  const parseChapters = (text) => {
    const chapterRegex = /第[一二三四五六七八九十百千\d]+章/g;
    const sections = text.split(chapterRegex).filter(section => section.trim());

    return sections.map((section, index) => {
      const title = `第${index + 1}章`;
      return { title, content: section.trim() };
    });
  };

  return (
    <div className="app">
      <Header />
      <button onClick={openFile}>打开文件</button>
      <Sidebar chapters={chapters} selectChapter={setCurrentChapter} />
      <pre className='text_pre'>
      {chapters.map((chapter, index) => (
            <div key={index}>
              <h2>{chapter.title}</h2>
              <p>{chapter.content}</p>
            </div>
          ))}
      </pre>
      <Footer />
    </div>
  );
};

export default App;