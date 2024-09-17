import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Footer from './components/Footer';
import './App.css';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);

  const openFile = async () => {
    const response = await ipcRenderer.invoke('open-file');
    if (!response.canceled) {
      const newChapter = {
        title: response.filePath.split('/').pop(), // Use file name as title
        content: response.content,
      };
      setChapters([...chapters, newChapter]);
    }
  };

  return (
    <div className="app">
      <Header />
      <button onClick={openFile}>打开文件</button>
      <Sidebar chapters={chapters} selectChapter={setCurrentChapter} />
      {chapters.length > 0 && <Content content={chapters[currentChapter].content} />}
      <Footer />
    </div>
  );
};

export default App;