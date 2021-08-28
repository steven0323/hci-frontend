import React, { Component } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import IconButton from '@material-ui/core/IconButton';

/* editor component */
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
//import { style } from '../../craco.config';
import './Card.css';

//Start Connect to database----------
if (!firebase.apps.length) {
    firebase.initializeApp({
      databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })
    }else {
    firebase.app(); // if already initialized, use that one
    }
  
  const db = firebase.database();


class Card extends Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        //this.handleSave = this.handleSave.bind(this);
        this.ThumbOnClick = this.ThumbOnClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.ref = React.createRef();
        this.state = {
                        content:this.props.content,
                        windowWidth:window.innerWidth,
                    thumbColor:"disabled"};
        }

    handleResize(e){
        this.setState({windowWidth : window.innerWidth});
    }
    componentDidMount(){
        window.addEventListener("resize", this.handleResize);
        

       /* db.ref(this.props.dbPath).on("value",function (snapshot){
        
            var studentlist = [];
            var data_db= snapshot.val().contents.replace("<p>","").replace("</p>","");
            studentlist.push(data_db);
        });*/
    }
    handleEdit(){
        this.props.SetCardEdit(this.props.cardId);     //key is the cardId
        this.props.SetEditorContent(this.props.content);
        this.props.SetCardEdit(true, this.props.cardId);
    }
    /*handleSave(){
        this.ref.current.disabled();
        this.props.onSave(this.props.id);
        this.setState({editing:false,
                        content:this.ref.current.core.getContents()});
    }*/
    handleCancel(){
        this.props.SetCardEdit("");
        this.props.SetCardEdit(false, this.props.cardId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {        
            this.setState({content:this.props.content});
        }
      }
    ThumbOnClick(){
        if(this.state.thumbColor =="disabled"){
            var thumbColor ="primary";
        }else{
            var thumbColor ="disabled";
        }
        var sendBackEnd='https://conceptmap-backend.herokuapp.com/LikeCard/'+this.props.concept+"&"+this.props.cardId;
        console.log("LIKE", sendBackEnd);
        fetch(sendBackEnd);
        this.setState({thumbColor});
    }
    renderThumbCnt(){
        if(this.props.thumbsCnt==0){
            return null;
        }else{
            return this.props.thumbsCnt;
        }
    }
    render(){
        var tmp = this;
const styles = ({
    fullCard:{
      width: tmp.props.style.ul.width-40,
      border: '1px solid rgba(0.7,0.7,0.7, 0.7)',
      borderRadius: '5px',
      margin:' 10px 5px',
      padding: '4px',
    }
  });
            return (
                <div style={styles.fullCard}>
                    <div className='cardContent'>
                        <div className='cardText'>
                            <h4>{this.props.userId}</h4>
                            <p style={styles.content}>{this.props.content}</p>
                        </div>
                    </div>
                    <div>
                        <IconButton color="inherit" aria-label="Home">
                            {this.renderThumbCnt()}
                            <ThumbUpIcon color={this.state.thumbColor} onClick={this.ThumbOnClick}/>
                        </IconButton>
                        <button
                            onClick={this.handleEdit}
                            disabled={this.props.cardEditing}
                            className="btn btn-primary btn-sm"
                        >
                            Edit
                        </button>
                        {((!this.props.cardEditing)||(this.props.editingCardId!==this.props.cardId))&&<button
                            onClick={()=>this.props.onDelete(this.props.cardId)}
                            className="btn btn-danger btn-sm m-2"
                        >
                            Delete
                        </button>}
                        {(this.props.cardEditing) && (this.props.editingCardId==this.props.cardId)&&<button onClick={()=>this.handleCancel()}
                                                    className="btn btn-danger btn-sm m-2">
                                                Cancel
                                                </button>}
                    
                    </div>
                </div>
            )
/*        }
        else{
            return(
                <div style = {styles.fullCard}>
                    <div className='cardContent'>
                        <div className='cardText'>
                            <h4>{this.props.userId}</h4>
                            <p style={styles.content}>{this.props.content}</p>
                        </div>
                    </div>
                    <IconButton color="inherit" aria-label="Home">
                    {this.renderThumbCnt()}
                    <ThumbUpIcon color={this.state.thumbColor} onClick={this.ThumbOnClick}/>
                    </IconButton>
                    <button
                        onClick={this.handleSave}
                        className="btn btn-primary btn-sm"
                    >
                        Save
                    </button>
                    <button
                        onClick={()=>this.handleCancel()}
                        className="btn btn-danger btn-sm m-2"
                    >
                        Cancel
                    </button>
                
                </div>
            )
        }
        */

    }
}
export default Card;