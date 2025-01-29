import React from 'react';
import '../components/HomeComponents.css';
import {Navbar, Sidebar} from '../components/HomeComponents';

function Home() {
  return (
    <div className='home'>
      <Sidebar />
      <div className="main-content">
        <Navbar />
      </div>
    </div>
  );
}

export default Home;
