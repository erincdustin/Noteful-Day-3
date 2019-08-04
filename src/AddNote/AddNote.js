import React from 'react';
import config from '../config';
import cuid from 'cuid';
import ApiContext from '../ApiContext';

import './AddNote.css';


export default class AddFolder extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '',
      folder: '',
      value: '',
      nameValid: false,
      validationMessages: {
        name: '',
      },
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    
    console.log(e.target.addNoteName.value, e.target.addNoteContent.value, e.target.addNoteFolder.value)
    const name = e.target.addNoteName.value;
    const content = e.target.addNoteContent.value;
    const modified = Date.now();
    const folderid = e.target.addNoteFolder.value;
    console.log(modified);

    
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify({
        id: cuid(),
        name: name,
        modified,
        folderid,
        content: content
      })
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(res => {
        this.context.addNote(res)
      })
      .catch(error => {
        console.error({ error })
      })


  }
  setName = name => {
    this.setState({name}, () => {this.validateName(name)});
  }

  setContent = content => {
    this.setState({content})
    console.log(this.state.content)
  }

  setFolder = id => {
    this.setState({folder: id})
    console.log(this.state.folder)
  }

  validateName = name => {
    const validationMessages = {...this.state.validationMessages}
    let nameValid = true;

    if (name.length === 0) {
      validationMessages.name = 'Name is required';
      nameValid = false;
      // return;
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
    const mappedOptions = this.context.folders.map(folder => <option value={folder.id} key={folder.id} id={folder.id} name={folder.name}>{folder.name}</option>)
    return(
      <div className='AddNoteForm'>
        <form onSubmit={e =>{
           this.handleSubmit(e);
           this.props.history.push('/')}}>
          <label htmlFor='addNoteName'>Name of the Note:
          {!this.state.nameValid && (<div><p class="error">{this.state.validationMessages.name}</p></div>)}</label>
            <input id='addNoteName' type='text' name='addNoteName' className='addNoteName' onChange={e => this.setName(e.target.value)}></input>
          <label htmlFor='addNoteContent'>Content:</label>
            <input id='addNoteContent' type='addNoteContent' name='addNoteContent' className='addNoteContent'></input>
          <label htmlFor='addNoteFolder'>Folder Name:</label>
            <select id='addNoteFolder' name='addNoteFolder'>
              {mappedOptions}
            </select>
          <button className="addNoteButton" type='submit' disabled={!this.state.nameValid}>Create Note</button>
        </form>
      </div>
    )
  }
}