import React from 'react';
import config from '../config';
import cuid from 'cuid';
import ApiContext from '../ApiContext';

import './AddFolder.css';


export default class AddFolder extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.folderName = React.createRef();
    this.state = {
      name: '',
      nameValid: false,
      validationMessages: {
        name: '',
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const name = e.target.addFolder.value;
    
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify(
        {name : name,
        id: cuid()})
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(res => {
        this.context.addFolder(res)
      })
      .catch(error => {
        console.error({ error })
      })


  }
  setName = name => {
    this.setState({name}, () => {this.validateName(name)});
  }

  validateName = name => {
    const validationMessages = {...this.state.validationMessages}
    let nameValid = true;

    if (name.length === 0) {
      validationMessages.name = 'Name is required';
      nameValid = false;
      
    } else {
      validationMessages.name = '';
      nameValid = true;
    }

    this.setState({
      validationMessages,
      nameValid,
    })
  }
  
  render() {
    return(
      <div className='addFolderForm'>
        <form onSubmit={e =>{
           this.handleSubmit(e);
           this.props.history.push('/')}}>
          <label htmlFor='addFolder'>Name of the folder
          {!this.state.nameValid && (<div><p class="error">{this.state.validationMessages.name}</p></div>)}</label>
          <input id='addFolder' type='text' name='addFolder' className='addFolder' onChange={e => this.setName(e.target.value)}></input>
          <button className="addFolderButton" type='submit' disabled={!this.state.nameValid}>Create folder</button>
        </form>
      </div>
    )
  }
}