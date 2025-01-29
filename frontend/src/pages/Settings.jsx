import React from 'react'
import '../components/HomeComponents.css';
import '../components/SettingsComponents.css';
import {Navbar, Sidebar} from '../components/HomeComponents';
import { SettingsButton, SettingsForm } from '../components/SettingsComponents';

const Settings = () => {
  return (
    <div className='home'>
          <Sidebar />
          <div className="main-content">
            <Navbar />
          
            <div className="settingsform">
            <div>
            <SettingsForm label="Name" type="name" placeholder="Name" />
            <SettingsForm label="Email id" type="email" placeholder="Email"/>
            <SettingsForm label="Mobile no." type="mobile" placeholder="Mobile"/>
            </div>
            <div>
            <SettingsButton buttontxt="Save Changes" style={{background:"#1B48DA"}}/>
            <SettingsButton buttontxt="Delete Account" style={{background:"#EB0D0D"}}/>
            </div>
            </div>
        
          </div>
    </div>
  )
}

export default Settings



