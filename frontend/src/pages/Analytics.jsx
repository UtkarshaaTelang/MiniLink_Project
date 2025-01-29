import React from 'react'
import '../components/HomeComponents.css';
import './Links.css';
import {Navbar, Sidebar} from '../components/HomeComponents';


const Analytics = () => {
  return (
    <div className='home'>
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="links-content">
          <div className="links-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>ip address</th>
                  <th>User Device</th>
                </tr>
              </thead>
            </table>
            </div>
            </div>
          </div>
    </div>
    
  )
}

export default Analytics
