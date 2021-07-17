import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import * as cldrSegmentation from 'cldr-segmentation';
import CommunicationCallSplit from 'material-ui/svg-icons/communication/call-split';
import { text } from 'd3';


// import { withStyles } from '@material-ui/core/styles';
const styles = {
    block: {
        margin: 10,
    },
    circle: {
        cursor: "pointer",
        // fill:"#555",
        // zIndex:-1,
        // opacity:0.4,
    },
    conceptlabel: {
        // fontFamily:"EB Garamond",
        position: "absolute",
        zIndex: -1,
        fontSize: 14,

    }
};

if (!firebase.apps.length) {
    firebase.initializeApp({
        databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app/"
    });
} else {
    firebase.app(); // if already initialized, use that one
}


//   var ScaleDotSize = d3.scaleLinear()
//   .domain([0,70])//Math.max.apply(Math,recorditems.map(function(o){return o.cnt;}))
//   .range([5,7]);//4,6
function HighLightTextStyle(HighlightNodeText, HighlightNodes, index) {
    if (HighlightNodeText != null) {
        if (HighlightNodeText.includes(index) && HighlightNodes.includes(index)) {
            // return {fill:"red"};
            return { textShadow: "0px 0px 15px #ff5151,0px 0px 15px #ff5151" };
        } else {
            return { fill: "black" };
        }
    }
    return { fill: "black" };
}
function FadeTextStyle(Path_ConceptIndex, HighlightNodes, index) {
    if (Path_ConceptIndex != null && HighlightNodes.length != 0 && !HighlightNodes.includes(index)) {
        // return {fill:"red"};
        return { fillOpacity: "0.5" };
    }
    return { fill: "black" };
}

class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            studentslist: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.NodeRadius = this.NodeRadius.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        //this.handleHighlight = this.handleHighlight.bind(this);
    }

    componentDidMount() {
        this.d3Node = d3.select(ReactDOM.findDOMNode(this))
            .datum(this.props.data)
        // .call(this.props.enterNode)
        // console.log("node this",ReactDOM.findDOMNode(this),this.props.data);

        firebase.database().ref("/change").on("value", snapshot => {
            let studentlist = [];
            snapshot.forEach(snap => {
                // snap.val() is the dictionary with all your keys/values from the 'students-list' path
                var data = snap.val();
                //console.log("snap = ", snap);
                var data = data.replace("<p>", "").replace("</p>", "");
                studentlist.push(data);
                //console.log(data);
            });
            this.setState({ studentslist: studentlist });
        });

    }

    // let the node can be moved!!!
    componentDidUpdate() {
        this.d3Node.datum(this.props.data)
            .call(this.props.updateNode)
        // console.log("Update!!",this.props.data.index,this.props.HighlightNodes);
    }



    handleClick(e) {
        //console.log("[click],conceptMapNode",",",this.props.data.name,",",this.props.data.index);
        //console.log(this.pros);
        // d3.select(ReactDOM.findDOMNode(this)).select('text')
        // .transition()
        // .duration(500)
        // .attr("text-anchor","middle")
        // .style("font-style","italic")
        // .style("text-shadow","2px 2px 4px #888")
        // .style("font-size","19");

        this.setState({
            anchorEl: ReactDOM.findDOMNode(this),
        });
        this.props.SetPath_ConceptIndex("add", this.props.data.index);
    };
    handleClose() {
        // console.log("unclick",ReactDOM.findDOMNode(this));
        d3.select(ReactDOM.findDOMNode(this)).select('text')
            .transition()
            .duration(500)
            .attr("text-anchor", "right")
            .style("font-style", "normal")
            .style("text-shadow", "none")
            .style("font-size", "14");

        this.setState({
            anchorEl: null,
        });

    };

    handleHover(i) {

        var data_db = this.state.studentslist[0];
        var revised_string = '<strong>';
        if (data_db.includes(this.props.data.name)) {
            //revised_string = revised_string.concat(this.props.data.name, '</strong>');
            //console.log(revised_string)
            //this.props.SetHighlightWord(revised_string);
            this.props.SetHoverConceptIndex(this.props.data.index, this.props.data.name);
            this.props.SetHighlightNodes(this.props.data.index);
    
        }
        else {
            this.props.SetHoverConceptIndex(this.props.data.index, this.props.data.name);
            this.props.SetHighlightNodes(this.props.data.index);    
            console.log("node does not exist in content");
        }
        
        console.log("[hover],conceptMapNode", ",", this.props.data.name, ",", this.props.data.index);
        // console.log(ReactDOM.findDOMNode(this));

        //--------------------
        console.log("this.props.data.name = ", this.state.studentslist);
        //---------------------


    };



    NodeRadius(cnt, Range) {
        var ScaleDotSize = d3.scaleLinear()
            .domain([Range[0], Range[1]])//Math.max.apply(Math,recorditems.map(function(o){return o.cnt;}))
            .range([6, 15]);//4,6
        return ScaleDotSize(cnt)
    }

    ClickedNode(highlight, radius) {
        if (highlight == true) {
            return (
                <circle ref="dragMe"
                    fill="#AAAAAA"
                    r={radius}
                    opacity={0.4} >
                </circle>
            );
        }
    }
    handleMouseOut(){
        this.props.ClearHoverConcept();
        console.log("handleout!!");
    }

    //欲修改Node顏色，於此區塊修改
    render() {

        //console.log(this.props.SetPath_ConceptIndex);
        if (this.props.Path_ConceptIndex == null) {
            var NodeOpacityValue = this.props.HighlightNodes.includes(this.props.data.index) ? 1 : 0.4;
        } else {
            var NodeOpacityValue = this.props.HighlightNodes.includes(this.props.data.index) ? 1 : 0.3;
        }

        // var NodeColor =  this.props.HighlightNodes.includes(this.props.data.index)? "#009FCC":"#555" ;

        if (this.props.Path_ConceptIndex == this.props.data.index) {
            var NodeColor = "#444444";
        } else if (this.props.HoverConceptIndex == this.props.data.index) {
            var NodeColor = "#5c4350";
            // "#17667c"r
        }
        else {
            // var NodeColor =  this.props.HighlightNodes.includes(this.props.data.index)? "#009FCC":"#555" ;
            if (this.props.DirectNodes.includes(this.props.data.index)) {
                var NodeColor = "#009FCC"; // "#8f7683"
            } else if (this.props.HighlightNodes.includes(this.props.data.index)) {
                var NodeColor = "#009FCC";
            } else {
                var NodeColor = "#555";
            }
        }
        if (this.props.SetPath_ConceptIndex == false) {
            var NodeColor = "#AFC700";
            console.log("fixing line ...");
        }
        if (this.props.updated == true) {
            var NodeColor = "#FF0000";
        }


        return (
            <g className='node' >
                {/* <circle ref="dragMe" onMouseOver={thi(s.handle.bind(this)}/> */}
                <circle ref="dragMe"
                    onClick={this.handleClick.bind(this)}
                    onMouseOver={this.handleHover.bind(this)}
                    // 應該要綁定一個事件是當用戶觸發某個狀態 會從新繪圖 e.g. mouse over
                    //onMouseOver={this.handleHighlight.bind(this)} 
                    onMouseOut={this.handleMouseOut}
                    r={this.NodeRadius(this.props.data.count, this.props.ConceptRange)}
                    // r = {ScaleDotSize(this.props.data.count)}
                    style={Object.assign({}, styles.circle, { opacity: NodeOpacityValue, fill: NodeColor })}
                >
                </circle>
                {/* {this.ClickedNode(this.props.BigCircleIndex==this.props.data.index,this.NodeRadius(this.props.data.count,this.props.ConceptRange)+15)} */}

                {/* <Popover
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div style={styles.block}>
                        <PopoverContent node={this.props.data} video_info = {this.props.video_info} OpenDrawer = {(text) =>this.props.OpenDrawer(text)}/>
                    </div>
                </Popover> */}
                {/* <circle ref="dragMe" onMouseOver={ Tooltip.show(findDOMNode(this.refs.foo))}/> */}
                {/* <text style={styles.conceptlabel} dx="5" dy="8">  {this.props.data.name}</text> */}
                <text
                    style={Object.assign({},
                        styles.conceptlabel,
                        HighLightTextStyle(this.props.HighlightNodeText, this.props.HighlightNodes, this.props.data.index),
                        FadeTextStyle(this.props.Path_ConceptIndex, this.props.HighlightNodes, this.props.data.index))}
                    dx="5"
                    dy="8">{this.props.data.name}
                </text>

            </g>
        );
    }
}
export default Node;