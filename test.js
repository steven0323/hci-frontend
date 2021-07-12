import React, { Component } from ‘react’;
import { EditorState } from ‘draft-js’;
import { Editor } from ‘react-draft-wysiwyg’;
import ‘../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css’;

export default class TextEditor extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }
  
  onEditorStateChange(editorState) {
    this.setState({editorState,});
  };
  render() {
    const { editorState } = this.state;
      return (
        <div style={{border:"1px, solid, black", height:"600px"}}>
        <Editor
          initialEditorState={editorState}
          wrapperClassName=”demo-wrapper”
          editorClassName=”demo-editor”                                                                                 
          onEditorStateChange={this.onEditorStateChange}
        />
      )
   }
}