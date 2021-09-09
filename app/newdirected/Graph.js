// refer to :https://codepen.io/vialito/pen/WMKwEr

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Node from './Node';
import Link from './Link';
import Drawer from '@material-ui/core/Drawer';
import PopoverNode from './PopoverNode';
import Masker from './Masker';
import * as cldrSegmentation from 'cldr-segmentation';
// const width = 1000;
// const height = 800;


/* editor component */
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { axisLeft } from 'd3';


if (!firebase.apps.length) {
    firebase.initializeApp({
        databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app/"
    });
    }else {
    firebase.app(); // if already initialized, use that one
}


var hovering = false;

const styles = ({
    root:{
        overflowX: "scroll",
        overflowY: "scroll",
    },
    root2:{
        //  zoom:1.2
    },
    mask:{
        opacity:"0.5",
    },
    Div:{
        float:axisLeft,
    }
    
  });


const color = d3.scaleOrdinal(d3.schemeCategory10);
const force = d3.forceSimulation();
var childNodeDict;


const drag = () => {
    d3.selectAll('g')
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));
};

function dragStarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
    console.log('dragStarted')
}
function dragging(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
    console.log('dragging')
}
function dragEnded(d) {
    if (!d3.event.active) force.alphaTarget(0.5)//0
    d.fx = null
    d.fy = null
    console.log('dragEnded')
}

const enterNode = (selection) => {
    // selection.select('circle')
        // .attr("r", function(d){return ScaleDotSize(d.count)})
        // .style("fill", function(d) { return '#555' })

    // selection.select('text')
        // .style("transform", "translateX(-50%,-50%")
};
const updateNode = (selection) => {
    selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
};
const enterLink = (selection) => {
    selection.attr("stroke-width", 1)
    .style("stroke","#bbb")
        .style("opacity",".2")
};
const updateLink = (selection) => {
        selection
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    
};
const updateGraph = (selection) => {
    //if(hovering==true){
    selection.selectAll('.node')
        .call(updateNode);
        // .call(drag);
    selection.selectAll('.link')
        .call(updateLink);

    var zoom = d3.zoom()
        .scaleExtent([0.6,2])
        .on('zoom', function(d) {
            console.log("zoom",d3.event.transform.k,14/(d3.event.transform ?d3.event.transform.k : 1));
            selection.select('g').attr("transform", d3.event.transform);
            selection.selectAll('text').style('font-size',14/(d3.event.transform ?d3.event.transform.k : 1));
            // selection.selectAll('.node').attr("fontSize",14/(d3.event.transform ? d3.event.transform : 1));
          });
    selection.select('.graphContainer')
    .call(zoom);
    //}
};


function CheckDirectNodes(index,BFSinput) {
    var ans=[]
    for (var i in BFSinput) {
        if(BFSinput[i].includes(index)){
            ans.push(parseInt(i));
        }
      }
    console.log("CheckDirectNodes")
    return ans;
}

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HighlightNodes: this.props.HighlightNodesAtIndex,
            DirectNodes:this.props.DirectNodesAtIndex,
            // PopoverIndexes:[],
            studentslist : [],
            hovering:false,
        };
        this.SetNodeHovering = this.SetNodeHovering.bind(this);
        this.SetHighlightNodes = this.SetHighlightNodes.bind(this);
        // this.SetPopoverIndexes = this.SetPopoverIndexes.bind(this);
    }
    SetNodeHovering(bool){
        this.setState({hovering:bool});
        hovering=bool;
    }
    componentDidMount() {
        this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
        var force = d3.forceSimulation(this.props.data.concept_relationship.nodes);

        firebase.database().ref("/change").on("value", snapshot => {
            let studentlist = [];
            snapshot.forEach(snap => {
                // snap.val() is the dictionary with all your keys/values from the 'students-list' path
                var data = snap.val();
                console.log("snap.val=",snap.val());
                //var data = data.replace("<p>","").replace("</p>","");
                studentlist.push(data);
                console.log(data);
            });
            this.setState({ studentslist: studentlist });
        });

        
        force.on('tick', () => {
            force
            .force("charge", d3.forceManyBody().strength(-50))
            .force("link", d3.forceLink(this.props.data.concept_relationship.links).distance(function(d) {return (1/((d.similarity+0.5))*200);}).strength(0.1))
            .force("center", d3.forceCenter().x(this.props.width*0.6 / 2).y(this.props.height / 2))
            // .force("collide", d3.forceCollide([5]).iterations([5]))
            // const node = d3.selectAll('g').call(drag);
            this.d3Graph.call(updateGraph)
        });
    }
    componentDidUpdate(prevProps,prevState) {
        // 常見用法（別忘了比較 prop）：
        if (this.props.data !== prevProps.data) {
            console.log("data update!!");
            this.forceUpdate();
        };
      }
    SetHighlightNodes(index){
        var ans = CheckDirectNodes(index,this.props.data.BFSinput[index]);
        // console.log("hhh",this.props.data.highlight_nodes[index]);
        
        this.setState(
            {
                HighlightNodes:this.props.data.highlight_nodes[index],
                DirectNodes:ans
            }
        );
        this.props.SetHighlightNodesAtIndex(this.props.data.highlight_nodes[index]);
        this.props.SetDirectNodesAtIndex(ans);
    }
/*     readFirebase()
    {
        var db = firebase.database();
        db.ref("/save").on("value",function (snapshot){
                
                var studentlist = [];
                var data_db= snapshot.val().contents.replace("<p>","").replace("</p>","");
                studentlist.push(data_db);
                
            });
        this.setState(
            {
                studentslist:studentlist
            }
        );
        console.log("reading db complete ...")
            
    }
     */
    
    render() {
        //console.log("nodes = ", this.props.data.concept_relationship.nodes);
        var nodes = this.props.data.concept_relationship.nodes.map( (node) => {
            try{
                /*if(data_db.includes(node.name))
                {
                    return (
                        <Node
                            data={node}
                            name={node.name}
                            key={"node"+node.index}
                            // enterNode = {enterNode}
                            updateNode = {updateNode}
                            // OpenDrawer = {(text) =>this.props.OpenDrawer(text)}
                            SetHighlightNodes = {this.SetHighlightNodes}
                            HighlightNodes = {this.state.HighlightNodes}
                            DirectNodes = {this.state.DirectNodes}
                            HoverConceptIndex = {this.props.HoverConceptIndex}
                            SetHoverConceptIndex={this.props.SetHoverConceptIndex}
                            ClearHoverConcept = {this.props.ClearHoverConcept}
                            Path_ConceptIndex={this.props.Path_ConceptIndex} 
                            SetPath_ConceptIndex={this.props.SetPath_ConceptIndex==-1}
                            ConceptRange={this.props.ConceptRange}
                            HighlightNodeText={this.props.HighlightConceptIndex}
                            BigCircleIndex={this.props.BigCircleIndex==null?this.props.Path_ConceptIndex:this.props.BigCircleIndex}
                            SetHightlightWord={this.state.SetHightlightWord}
                        />
                        );
                }
                else*/ if(( this.props.src =="ApprovPanel" ) && (node.group==2) )
                {
                    console.log("group==1!")
                    return (
               
                        <Node
                            data={node}
                            name={node.name}
                            key={"node"+node.index}
                            // enterNode = {enterNode}
                            updateNode = {updateNode}
                            // OpenDrawer = {(text) =>this.props.OpenDrawer(text)}
                            SetHighlightNodes = {this.SetHighlightNodes}
                            HighlightNodes = {this.state.HighlightNodes}
                            ClearHoverConcept = {this.props.ClearHoverConcept}
                            DirectNodes = {this.state.DirectNodes}
                            HoverConceptIndex = {this.props.HoverConceptIndex}
                            SetHoverConceptIndex={this.props.SetHoverConceptIndex}
                            Path_ConceptIndex={this.props.Path_ConceptIndex} 
                            SetPath_ConceptIndex={this.props.SetPath_ConceptIndex}
                            ConceptRange={this.props.ConceptRange}
                            HighlightNodeText={this.props.HighlightConceptIndex}
                            BigCircleIndex={this.props.BigCircleIndex==null?this.props.Path_ConceptIndex:this.props.BigCircleIndex}
                            SetHightlightWord={this.state.SetHightlightWord}
                            updated={true}
                        />
                        
                        );
    
                }else{
                    return(
                    <Node
                        data={node}
                        name={node.name}
                        key={"node"+node.index}
                        // enterNode = {enterNode}
                        updateNode = {updateNode}
                        // OpenDrawer = {(text) =>this.props.OpenDrawer(text)}
                        SetHighlightNodes = {this.SetHighlightNodes}
                        HighlightNodes = {this.state.HighlightNodes}
                        SetNodeHovering = {this.SetNodeHovering}
                        DirectNodes = {this.state.DirectNodes}
                        HoverConceptIndex = {this.props.HoverConceptIndex}
                        SetHoverConceptIndex={this.props.SetHoverConceptIndex}
                        ClearHoverConcept = {this.props.ClearHoverConcept}
                        Path_ConceptIndex={this.props.Path_ConceptIndex} 
                        SetPath_ConceptIndex={this.props.SetPath_ConceptIndex}
                        ConceptRange={this.props.ConceptRange}
                        HighlightNodeText={this.props.HighlightConceptIndex}
                        BigCircleIndex={this.props.BigCircleIndex==null?this.props.Path_ConceptIndex:this.props.BigCircleIndex}
                        SetHightlightWord={this.props.SetHightlightWord}
                    />)
                }
            }
            catch (err){
                //console.log(err);
                return (
               
                    <Node
                        data={node}
                        name={node.name}
                        key={"node"+node.index}
                        // enterNode = {enterNode}
                        updateNode = {updateNode}
                        // OpenDrawer = {(text) =>this.props.OpenDrawer(text)}
                        SetHighlightNodes = {this.SetHighlightNodes}
                        HighlightNodes = {this.state.HighlightNodes}
                        
                        DirectNodes = {this.state.DirectNodes}
                        HoverConceptIndex = {this.props.HoverConceptIndex}
                        SetHoverConceptIndex={this.props.SetHoverConceptIndex}
                        ClearHoverConcept = {this.props.ClearHoverConcept}
                        Path_ConceptIndex={this.props.Path_ConceptIndex} 
                        SetPath_ConceptIndex={this.props.SetPath_ConceptIndex}
                        ConceptRange={this.props.ConceptRange}
                        HighlightNodeText={this.props.HighlightConceptIndex}
                        BigCircleIndex={this.props.BigCircleIndex==null?this.props.Path_ConceptIndex:this.props.BigCircleIndex}
                        SetHightlightWord={this.props.SetHightlightWord}
                    />
                    
                    );
                }
               
      
            
            });
        
        var links = this.props.data.concept_relationship.links.map( (link,i) => {
            return (
                <Link
                    key = {"link"+i}
                    // key={link.target+i}
                    data={link}
                    enterLink = {enterLink}
                    updateLink = {updateLink}
                    HighlightNodes = {this.state.HighlightNodes}
                    SetHightlightWord={this.props.SetHightlightWord}
                />);
        });
        
        // var PopoverNodes = this.props.data.concept_relationship.nodes.map( (node) => {
        //     if(this.props.Path_ConceptIndex===node.index){
        //         return(
        //             <g>
        //                 <PopoverNode 
        //                     key={"PopoverNode"+node.index}
        //                     data={node}
        //                     video_info = {this.props.data.videos_info}
        //                     updateNode = {updateNode}
        //                     SetPopoverIndexes = {this.props.SetPopoverIndexes}
        //                     SentRange = {this.props.SentRange}
        //                     SetHoverVideoIndex = {this.props.SetHoverVideoIndex}
        //                     HoverVideoIndex = {this.props.HoverVideoIndex}
        //                 />
        //             </g>
        //         );
        //     }
        //     return (
        //         null
        //     );
        // });
        //console.log("nodes = ", nodes);
        //console.log("links = ", links);
        return (
            <div width={this.props.width} height={this.props.height} style={styles.root} >
                    <svg className="graph" width={(this.props.width)} height={this.props.height} style={styles.root2}>
                        <g className='graphContainer'>
                        <defs>
                        <marker id="markerArrow" viewBox="0 -4 10 10" markerWidth="7" markerHeight="7" refX="28" refY="0" orient="auto" xoverflow="visible" >
                            <path d="M0,-4 L10 ,0 L0,4" fill="#5b5b5b" stroke = "#5b5b5b"/>
                        </marker>
                        </defs>
                        <g>
                            {links}
                        </g>
                        <g>
                            {nodes}
                        </g>
                        <g>
                            <Masker 
                                width={this.props.width} 
                                height={this.props.height}
                                Path_ConceptIndex={this.props.Path_ConceptIndex} 
                                SetPath_ConceptIndex ={this.props.SetPath_ConceptIndex}
                            />
                        </g>
                        <g>
                            {/* {PopoverNodes} */}
                            {/* {this.renderMask()} */}
                        </g>
                        </g>
                        

                    </svg>

            </div>
        );
    }
}
export default Graph;