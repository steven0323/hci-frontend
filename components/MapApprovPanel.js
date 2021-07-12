import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VideoSequence from './VideoSequence';
import ConceptSequence from './ConceptSequence';
import RelatedVideosPanel from './RelatedVideosPanel'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = ({
    rootTitle:{
        // margin:10,
        paddingBottom:20,
        textAlign:"center",
        fontSize:20,
        fontFamily:"Cambria"
    },
    containerTitle:{
        display:"flex",
        fontSize:14,
        fontWeight:"bold"
    },
    OuterContainer: {
        display: 'flex',
        flexDirection: "row",
        position:"absolute",
        // left:930,
        right:'0%',
        flexWrap: 'no-wrap',
        zIndex:6
        // margin:10,
        // padding:10
    },
  
  paper2: {
    width: 520,
    // height: 850,
    overflowX: "hidden",
    overflowY: "scroll",
    padding: 15,
    margin : 15,
  },
  paper2_UpperContainer: {
    display: 'flex',
    flexDirection: "column",
  },
  paper2_BelowContainer: {
    display: 'flex',
    flexDirection: "row",
  },
  container3_1: {
    width: 225,
    // height: 500,
  },
  container3_2: {
    width: 265,
    // height: 500,
  },
  CloseBotton: {
    // marginLeft: 5,
    float:"right",
    marginRight: 1,

  },
  content:{
    // display: "block",
    margin: "auto",
    display:"flex"
  }
});

class MapApprovPanel extends Component {
    constructor(props) {
        super(props);
        this.CloseOnClick = this.CloseOnClick.bind(this);
    }
    CloseOnClick(){
        this.props.SetMapConsult("close");
    }
    render() {

        if(this.props.MapConsult==true){
            console.log("this is MapPanel!!")
            return (
                <div style = {styles.OuterContainer}>
                    {/* <Paper style={styles.paper2} elevation={13}> */}
                    <Paper style= {Object.assign({}, styles.paper2, {height:window.innerHeight-130})} elevation={13}>
                    <div style={styles.rootTitle}>
                    {"Map Approval Consult"}
                    <IconButton style={styles.CloseBotton} color="inherit" aria-label="Close">
                        <CloseIcon onClick={this.CloseOnClick.bind(this)}/>
                    </IconButton>
                    </div>
                    <div style = {styles.paper2_UpperContainer}>
                        <div style={styles.containerTitle}> Video Ring</div>
                        <div style={styles.content}>
                        <g>
                            {"Related Video Sequence"}
                        </g>
                        </div>
                        
                    </div>
                    <div height="5"><hr></hr></div>
                    <div style = {styles.paper2_BelowContainer}>
                        <div style = {styles.container3_1}>
                        {/* <div style = {Object.assign({}, styles.container3_1, {height:window.innerHeight-900})}> */}
                        
                            <div style={styles.containerTitle}> Concept Path </div>
                            {"ConceptSequence " }
                        </div>
                        <div style = {styles.container3_2}>
                        {/* <div style = {Object.assign({}, styles.container3_2, {height:window.innerHeight-900})}> */}
                            <div style={styles.containerTitle}> 
                            Video Path
                            </div>
                            {"VideoSequence"}
                        </div>
                    </div>
                    </Paper>  
                </div>
            );
        }
        else{
            return null;
        }
        
        
    }
}
export default MapApprovPanel;