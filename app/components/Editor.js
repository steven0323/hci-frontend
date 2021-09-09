import React, { Component } from 'react';

/* editor component */
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import plugins, { template } from 'suneditor/src/plugins'
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
      this.handleResize = this.handleResize.bind(this);
      this.state = {
        content:this.props.content,
        windowWidth:window.innerWidth,
        windowHeight:window.innerHeight,
      };
      this.ref = React.createRef();
      }
    handleChange(content){
      //var today = new Date();
      //mydatabase.ref('/change/').set({content});
      //console.log(content,typeof(content));
      //console.log("this.ref = ", this.ref);
      //console.log(this.ref.current.core)

      //commented in 8/25------------------------------------------------------
      /*var keyword = this.props.content;
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
      }*/
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
    componentDidUpdate(prevProps, prevState, snapshot){     //props.content stands for the key to be highlight
                                                            // unless it's " ", " " means that nothing 
                                                            // should be highlighted
                                                            //this if is to cancel the highlight
        //commented in 8/25-----------------------------------------------------------
        /*if (this.props.content == " "){                      
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
      else if(prevProps.content!==this.props.content){              //this is to add the new highlight
        var keyword = this.props.content;                           //which is, if the new key is not " "
        var content = this.ref.current.core.getContents();          //(there are things to highlight) and differs from the prev.
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
      }*/
      
      if((prevProps.cardEditing==false)&&(this.props.cardEditing==true)){
        this.ref.current.setContents(this.props.editorContent);
        this.ref.current.core.focusEdge();
      }
      
  }
  
  componentDidMount(){
    window.addEventListener("resize", this.handleResize);
  }
  handleResize(e){
      this.setState({windowWidth : window.innerWidth,
                      windowHeight : window.innerHeight});
  }
  save(){
    //console.log("SetMapConsult(add)");
    //console.log(this.ref.current);
    var content = this.ref.current.getText();
    var tmp = this;
    var userId = this.props.userId;
    var concept = this.props.searchInfo;
    var cardId = this.props.editingCardId;
    
    if(this.props.cardEditing==false){
      
      var sendBackEnd='https://conceptmap-backend.herokuapp.com/SaveEditor/';
      sendBackEnd = sendBackEnd+concept+"&"+userId+"&"+content;
      fetch(sendBackEnd)     //跟後端連結去getJson
      .then(function (res) {
          console.log(res);
          return res.json();
      }).then(function(myJson) {
          tmp.props.SetNewJson(myJson);
          
        tmp.props.SetVisJson(myJson);
          return myJson;
      });
      //console.log(this.props);
      //this.props.SetMapConsult("add");
      //mydatabase.ref('/save').set({contents});
    }
    else{
      
      var sendBackEnd='https://conceptmap-backend.herokuapp.com/SaveCard/';
      sendBackEnd = sendBackEnd+concept+"&"+cardId+"&"+userId+"&"+content;
      console.log("sendBackEnd = ", sendBackEnd);
      fetch(sendBackEnd)
      .then(function (res) {
        console.log(res);
        return res.json();
    }).then(function(myJson) {
        tmp.props.SetNewJson(myJson);
        tmp.props.SetVisJson(myJson);
        return myJson;
    });     //跟後端連結去getJson
      this.props.SetCardEdit(false,"");
    }
    
  }

    render() {
      var width = (this.state.windowWidth/2-100)+"px";
      var height = (this.state.windowHeight/3)-250+"px";
      return (
        <div>
        <SunEditor      
                        width = {width}
                        height = {height}
                        SetMapConsult = {this.props.SetMapConsult}
                        setOptions = {{
                          plugins: [plugin_command],
                          buttonList:[
                            ['undo', 'redo'],
                            ['font', 'align'],
                            ['-right', 'save']
                          ],
                          callBackSave : this.save
                    }}
                    onChange = {this.handleChange}
                    getSunEditorInstance={this.getSunEditorInstance}
                    onFocus = {this.onFocus}
                    onBlur = {this.onBlur}
                    SetMapConsult={this.props.SetMapConsult}
                     />
    </div>
      );
    }
  }
  export default Editor;
