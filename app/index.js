import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from '@material-ui/core/Dialog';
import Drawer from '@material-ui/core/Drawer';
import HighlightModeSelector from './HighlightModeSelector';
import Video_info from './newdirected/Video_info';
// import jsondata from './graphFile.json';
import BarField from './components/BarField';
import SearchField from './components/SearchField';
import LearningMapFrame from './components/LearningMapFrame';
import CreatingField from './components/CreatingField';
import MenuDrawer from './components/MenuDrawer';
import { EditorState } from 'draft-js';
import Editor from './components/Editor'
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Cards from './components/Cards';



function storedata() {
  var firebaseConfig = {
    apiKey: "AIzaSyD5ro8Oj_EHuFweJR3bywJCO49egETQp7g",
    authDomain: "test-7916a.firebaseapp.com",
    databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-7916a",
    storageBucket: "test-7916a.appspot.com",
    messagingSenderId: "931195594829",
    appId: "1:931195594829:web:65c637f9dc54e245d4d404",
    measurementId: "G-T5RH81V2MG"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var db = firebase.firestore();
  db.collection("movies").doc("Harry Potter").set(
    {
      name:"Harry",
      date:"2010",
    }
  )
  console.log("hit!!")
}

/*** * 獲取當前瀏覽器類型 */ 
function myBrowser() { 
  var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字符串 
  
  var isOpera = userAgent.indexOf("Opera") > -1; 
  if (isOpera) { //判斷是否Opera瀏覽器 
  return "Opera"; }
  
  if (userAgent.indexOf("Firefox") > -1) { //判斷是否Firefox瀏覽器 
  return "FF"; }
  if (userAgent.indexOf("Chrome") > -1){ return "Chrome"; }
  if (userAgent.indexOf("Safari") > -1) { //判斷是否Safari瀏覽器
  return "Safari"; }
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判斷是否IE瀏覽器
  return "IE"; }
  }
function beforunload(event) { event = event ? event : (window.event ? window.event : null); 
  var myIE = myBrowser(); 
  if (myIE=="IE") { // IE 
  var cy = event.clientY || event.target.event.clientY;
  var ak = event.altKey || event.target.event.altKey; 
  if (cy < 0 || ak) { 
  return "確定要離開本頁面嗎？"; }
  } 
  else {
  // Firefox、Chrome
  var nodeName = event.currentTarget.document.activeElement.nodeName; 
  if (nodeName!="A") { return "確定要離開本頁面嗎？"; } } } 

    



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MenuOpened : false,
      drawer:false,
      selectedVid:null,
      Progress:1,
      SearchHistory:null,
      VisJson:null,
      SearchKeyword:null
  };
    this.SetProgress = this.SetProgress.bind(this);
    this.SetMenuOpen = this.SetMenuOpen.bind(this);
    this.SetMenuClose = this.SetMenuClose.bind(this);
    this.SetSearchHistory = this.SetSearchHistory.bind(this);
    this.SetSearchKeyword = this.SetSearchKeyword.bind(this);
    this.OpenDrawer = this.OpenDrawer.bind(this);
    this.CloseDrawer = this.CloseDrawer.bind(this);
    this.SetVisJson = this.SetVisJson.bind(this);
    this.SetNewJson = this.SetNewJson.bind(this);
  }
  SetVisJson(json){
    this.setState({VisJson : json});
  }
  SetNewJson(json){
    console.log("NewJson setted from ", this.state.NewJson, " to ", json);
    this.setState({NewJson : json});
  }


  SetProgress(progress,json){
    // console.log("p,k",progress,json);
    if(json==undefined){
      this.setState({Progress:progress});
    }
    else{
      this.setState({
        Progress: progress,
        VisJson : json,
        NewJson : json
      });
    }
  }
  SetMenuOpen(){
    this.setState({
      MenuOpened: true,
    });
  }
  SetMenuClose(){
    this.setState({
      MenuOpened: false,
    });
  }


  SetSearchHistory(v){
    this.setState({SearchHistory:v});
  }

  SetSearchKeyword(w){
    this.setState({SearchKeyword:w});
  }
  OpenDrawer(vid,e){
    // console.log("here",vid,e,jsondata.videos_info[vid].transcript);
    this.setState(
      {
        drawer:true,
        selectedVid:vid
      });
  }
  CloseDrawer(){
    this.setState({drawer:false});
  }

  render() {
    window.onbeforeunload = function(event) { 
      return beforunload(event); 
      }; 
      

  
  
    if(this.state.Progress==1){
      return (       
        <div>
          <MuiThemeProvider>
              <BarField 
                SetProgress = {this.SetProgress} 
                SetMenuOpen = {this.SetMenuOpen} 
                SetSearchHistory={this.SetSearchHistory}
                />
              <MenuDrawer  
                SetNewJson = {this.SetNewJson}
                open = {this.state.MenuOpened} 
                SetProgress = {this.SetProgress}  
                SearchHistory={this.state.SearchHistory} 
                SetSearchHistory={this.SetSearchHistory} 
                SetMenuClose={this.SetMenuClose}
                />
              <SearchField SetProgress = {this.SetProgress} SearchHistory={this.state.SearchHistory} SetSearchHistory={this.SetSearchHistory} SetSearchKeyword={this.SetSearchKeyword} Set_NotFinishCreate={this.Set_NotFinishCreate}/>   
          </MuiThemeProvider>
        </div>
      
      );
    }else if(this.state.Progress==2){
      return (       
        <div>
          <MuiThemeProvider>
          <BarField 
            SetProgress = {this.SetProgress} 
            SetMenuOpen = {this.SetMenuOpen} 
            SetSearchHistory={this.SetSearchHistory}
          />
          <CreatingField SetProgress = {this.SetProgress} SearchKeyword={this.state.SearchKeyword} />
          </MuiThemeProvider>
        </div>
      );
    }else if(this.state.Progress==3){
      return(
        <div style={{userSelect: "none"}}>
          <MuiThemeProvider>
          <BarField 
            SetProgress = {this.SetProgress} 
            SetMenuOpen = {this.SetMenuOpen} 
            SetSearchHistory={this.SetSearchHistory}
          />
          <LearningMapFrame data={this.state.VisJson} 
                            OpenDrawer={(text) =>this.OpenDrawer(text)}
                            SetVisJson = {this.SetVisJson}
                            SetNewJson = {this.SetNewJson}
                            NewJson = {this.state.NewJson}
          />
          <Dialog
            fullScreen
            open={this.state.drawer}
            onClose={this.CloseDrawer}
          >
          <Video_info vid = {this.state.selectedVid} videos_info = {this.state.VisJson.videos_info} CloseDrawer={this.CloseDrawer} />
          </Dialog>
          </MuiThemeProvider> 
        </div>
      );
    }
  }
}


    

ReactDOM.render(<App />, document.getElementById('app'));