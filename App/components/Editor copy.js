import React, { Component } from 'react';

/* editor component */
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import plugins from 'suneditor/src/plugins'
import { axisLeft } from 'd3-axis';

if (!firebase.apps.length) {
  firebase.initializeApp({
    databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });
  }else {
  firebase.app(); // if already initialized, use that one
  }
  const mydatabase = firebase.database();
    
class Editor extends Component {
// Defining save button-------------------------------------------------------------------------------------------
//callBackSave    : Callback functions that is called when the Save button is clicked. 
//Arguments - (contents, isChanged).                            default: functions.save {Function}

  /*constructor(props) {
    super(props);
    this.callBackSave = this.SetHighlightNodes.bind(this);
  };
  */
	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional

  render() {

    return (
            <SunEditor setOptions = {{
                width:(window.innerWidth-(window.innerWidth-50)/2)-150,
                height:window.innerHeight-100,
                buttonList:[
                  ['undo', 'redo'],
                  ['font', 'align', 'save' ],
                  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                  ["removeFormat"],
                  ["outdent", "indent"]
                ],
                callBackSave : function(contents, isChanged) {
                  var today = new Date();
                  var time = today.getFullYear();
                  mydatabase.ref('/save/'+today.getFullYear()+
                                  '/'+(today.getMonth()+1)+
                                  '/'+today.getDate()+
                                  '/'+today.getHours()+
                                  '/'+today.getMinutes()+
                                  '/'+today.getSeconds()).push({contents});
                  console.log("hit!")	
                }
            }}
            />
    );
  }
}
export default Editor;