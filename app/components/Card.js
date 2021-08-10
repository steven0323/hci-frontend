import React, { Component } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import IconButton from '@material-ui/core/IconButton';

/* editor component */
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

class Card extends Component {
    constructor(props) {
        super(props);
        this.getSunEditorInstance = this.getSunEditorInstance.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.ThumbOnClick = this.ThumbOnClick.bind(this);
        this.ref = React.createRef();
        this.state = {editing:false,
                        content:this.props.content,
                    thumbsCnt:0,
                    thumbColor:"disabled"};
        }
    getSunEditorInstance(sunEditor){
        this.ref.current = sunEditor;
        console.log("this.ref = ",this.ref);
        //this.ref.current.readOnly(true);
        //this.ref.current.disabled();    
    };
    componentDidMount(){
        //this.ref.current.readOnly(true);
        console.log(this.ref.current);
        //this.ref.current.disable();
    }
    handleEdit(){
        this.ref.current.enabled();
        this.ref.current.core.focusEdge();
        this.props.onEdit(this.props.id);
        this.setState({editing:true});
    }
    handleSave(){
        this.ref.current.disabled();
        this.props.onSave(this.props.id);
        this.setState({editing:false,
                        content:this.ref.current.core.getContents()});
    }
    handleCancel(){
        this.ref.current.disabled();
        this.ref.current.setContents(this.state.content);
        this.setState({editing:false});
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {        
            this.setState({content:this.props.content});
        }
      }
    ThumbOnClick(){
        if(this.state.thumbColor =="disabled"){
            var thumbColor ="primary";
            var thumbsCnt = this.state.thumbsCnt+1;
        }else{
            var thumbColor ="disabled";
            var thumbsCnt = this.state.thumbsCnt-1;
        }
        this.setState({thumbColor,thumbsCnt});
    }
    renderThumbCnt(){
        if(this.state.thumbsCnt==0){
            return null;
        }else{
            return this.state.thumbsCnt;
        }
    }
    render(){

        if(this.state.editing==false){
            return (
                <div>
                    <SunEditor 
                                getSunEditorInstance={this.getSunEditorInstance}
                                setOptions ={{buttonList:[],
                                                width:window.innerWidth/3}}
                                setContents = {this.state.content}
                                disable={true}
                                setDefaultStyle="font-family: Hahmlet; font-size:15px"
                    />
                    
                    <IconButton color="inherit" aria-label="Home">
                        {this.renderThumbCnt()}
                        <ThumbUpIcon color={this.state.thumbColor} onClick={this.ThumbOnClick}/>
                    </IconButton>
                    <button
                        onClick={this.handleEdit}
                        className="btn btn-primary btn-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={()=>this.props.onDelete(this.props.id)}
                        className="btn btn-danger btn-sm m-2"
                    >
                        Delete
                    </button>
                
                </div>
            )
        }
        else{
            return(
                <div>
                    <SunEditor  width="400px"
                                getSunEditorInstance={this.getSunEditorInstance}
                                setOptions ={{buttonList:[],
                                                }}
                                setContents = {this.state.content}
                                disable={true}
                    />
                    <IconButton color="inherit" aria-label="Home">
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
        

    }
}
export default Card;