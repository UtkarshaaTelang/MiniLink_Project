import React from 'react'
import './SettingsComponents.css'


const SettingsForm = (props) => {
  return (
    <div>
      <div className="settings-compo">
        <label>{props.label}</label>
        {/* <div> */}
        <input type={props.type} placeholder={props.placeholder} />
        {/* </div> */}
      </div>
    </div>
  )
}

export {SettingsForm};


const SettingsButton = (props) => {
  return (
    <div className='settings-btns'>
        <button  style={props.style}>{props.buttontxt}</button>   
    </div>
  )
}

export {SettingsButton};

