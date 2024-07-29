import React, { Component } from 'react'
//import InformationAboutApplication from '../dialogBox/InformationAboutApplication'

import logoImage from '../../images/TefLogo.JPG';
import './Header.css';

export class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <header className="header">
        <div className="header-container">
          <div>
            {
              <img className="logo" src={logoImage} alt="Logo" />
            }
          </div>
          <div className="header-title-container">
            <h1 className='header-text'>Type Approval Register</h1>
          </div>
          <div className="header-info-container">
          </div>
        </div>
      </header>
    )
  }
}
export default Header;