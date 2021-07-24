import React, { Component } from 'react';

/* editor component */
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import plugins from 'suneditor/src/plugins'
import { axisLeft } from 'd3-axis';
import SUNEDITOR from 'suneditor';
//Start Connect to database----------
if (!firebase.apps.length) {
  firebase.initializeApp({
    databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app/"
  })
  }else {
  firebase.app(); // if already initialized, use that one
  }

const mydatabase = firebase.database();

var options = {
  buttonList: [
      ['undo', 'redo'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
      ['image', 'video']
  ],
  width: '100%'
}

// ex) A command plugin to add "text node" to selection
var plugin_command = {
  name: 'customCommand',
  display: 'command',

  title:'Text node change', 
  buttonClass:'', 
  // This icon uses Font Awesome
  innerHTML:'<i class="fas fa-font"></i>', 

  add: function (core, targetElement) {
      const context = core.context;
      context.customCommand_2 = {
          targetButton: targetElement
      };
  },
  active: function (element) {
      if (!element) {
          this.util.removeClass(this.context.customCommand_2.targetButton, 'active');
      } else if (/^mark$/i.test(element.nodeName) && element.style.backgroundColor.length > 0) {
          this.util.addClass(this.context.customCommand_2.targetButton, 'active');
          return true;
      }

      return false;
  },
  action: function () {
      if (!this.util.hasClass(this.context.customCommand_2.targetButton, 'active')) {
          const newNode = this.util.createElement('MARK');
          newNode.style.backgroundColor = 'hsl(60,75%,60%)';
          this.nodeChange(newNode, ['background-color'], null, null);
      } else {
          this.nodeChange(null, ['background-color'], ['mark'], true);
      }
  }
}


class Editor extends Component {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    constructor(props) {
      super(props);
      //this.callBackSave = this.SetHighlightNodes.bind(this);
      this.handleChange=this.handleChange.bind(this);
      this.onInput=this.onInput.bind(this);
      this.save = this.save.bind(this);
      this.getSunEditorInstance = this.getSunEditorInstance.bind(this);
      this.state = {
        content:this.props.content
      };
      this.ref = React.createRef();
      }
    handleChange(content){
      //var today = new Date();
      mydatabase.ref('/change/').set({content});
      //console.log(content,typeof(content));
      //console.log("this.ref = ", this.ref);
      //console.log(this.ref.current.core)
      var keyword = this.props.content;
      if(keyword!=" "){
          if (content.includes(keyword) && !content.includes("<strong>"+keyword)){
          //var n = content.search("bitcoin")
          var word = "<strong>"+keyword+"</strong> "
          var newcontent = content.replace(keyword, word)
          //console.log(word)
          //console.log(newcontent)
          this.ref.current.setContents(newcontent);
          console.log("keyword = ", keyword);
          console.log("onChange: ",content,">>>",newcontent);
          this.setState({content: newcontent});
          this.ref.current.core.focusEdge();
        }
      }
      else{
        //this.setState({content : this.props.content});
        this.setState({content : content});
        //this.forceUpdate();
      }
    };
    onInput(e, core){
      console.log('onInput', e, core);
    };

		getSunEditorInstance(sunEditor){
      this.ref.current = sunEditor;
      console.log("this.ref = ",this.ref);
    }; 
    onFocus(event, core){
      console.log("On Focus!!");
    };
    onBlur(event, core){
      console.log("on Blur!!");
    };
    componentDidUpdate(prevProps, prevState, snapshot){
      console.log("content update!!")
      if (this.props.content == " "){
        var prevKey = prevProps.content;
        var content = this.ref.current.core.getContents();
        if (content.includes(prevKey)){
          var word = "<strong>"+prevKey+"</strong>";
          var newcontent = content.replace(word, prevKey);
          this.ref.current.setContents(newcontent);
          console.log("DidUpdate: ",content,">>>",newcontent);
          this.ref.current.core.focusEdge();
        }
      }
      else if(prevProps.content!==this.props.content){
        var keyword = this.props.content;
        var content = this.ref.current.core.getContents();
        //console.log("contents=",this.ref.current.core.getContents());
        if (content.includes(keyword) && !content.includes("<strong>"+keyword)){
          //var n = content.search("bitcoin")
          var word = "<strong>"+keyword+"</strong> ";
          var newcontent = content.replace(keyword, word);
          //console.log(word)
          //console.log(newcontent)
          this.ref.current.setContents(newcontent);
          //console.log("DidUpdate: ",content,">>>",newcontent);
          this.ref.current.core.focusEdge();
        }
      }      
  }
  save(){
    //console.log("SetMapConsult(add)");
    var tmp = this;
    fetch('http://localhost:8001/GetJson/')     //跟後端連結去getJson
    .then(function (res) {
        //console.log(res.json());
        return res.json();
    }).then(function(myJson) {
        tmp.props.SetNewJson(myJson);
        return myJson;
    });
    //console.log(this.props);
    //this.props.SetMapConsult("add");
    //mydatabase.ref('/save').set({contents});
  }

    render() {
      return (
        <div>
          {this.state.content }
        <SunEditor 
                        SetMapConsult = {this.props.SetMapConsult}
                        setOptions = {{
                          width:(window.innerWidth-(window.innerWidth-50)/2)-600,
                          height:window.innerHeight-100,
                          plugins: [plugin_command],
                          buttonList:[
                            ['undo', 'redo'],
                            ['font', 'align', 'save' ],
                            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                            ["removeFormat"],
                            ["outdent", "indent"],
                            ['customCommand'],
                            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print'],
                          ],
                          callBackSave : this.save
                    }}
                    onChange = {this.handleChange}
                    getSunEditorInstance={this.getSunEditorInstance}
                    onFocus = {this.onFocus}
                    onBlur = {this.onBlur}
                    setContents = {"hot end 3d print stl file"}
                    SetMapConsult={this.props.SetMapConsult}
                     />
    </div>
      );
    }
  }
  export default Editor;
