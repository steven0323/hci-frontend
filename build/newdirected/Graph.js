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
            HighlightNodes: [],
            DirectNodes:[],
            // PopoverIndexes:[],
            studentslist : []
        };
        
        this.SetHighlightNodes = this.SetHighlightNodes.bind(this);
        // this.SetPopoverIndexes = this.SetPopoverIndexes.bind(this);
    }
    componentDidMount() {
        this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
        var force = d3.forceSimulation(this.props.data.concept_relationship.nodes);

    
        force.on('tick', () => {
            force
            .force("charge", d3.forceManyBody().strength(-700))
            .force("link", d3.forceLink(this.props.data.concept_relationship.links).distance(function(d) {return (1/((d.similarity+0.5))*200);}).strength(0.1))
            .force("center", d3.forceCenter().x(this.props.width*0.6 / 2).y(this.props.height / 2))
            // .force("collide", d3.forceCollide([5]).iterations([5]))

            // const node = d3.selectAll('g').call(drag);
            this.d3Graph.call(updateGraph)
        });
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
    }
    
    
    
    render() {
        
        
        var nodes = this.props.data.concept_relationship.nodes.map( (node) => {
        

            
            //this.readFirebase();


            //console.log(node.name);
            //console.log("--------");
            
            
            
            var data_db = this.state.studentslist[0];
            //console.log(this.state.studentslist);

            //Assuming reading firebase work
            //var data_db = "Bitcoin a new wave which is a decentralized digital currency, without a central bank or single administrator, a breakout,that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries. Transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain. The cryptocurrency was invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto. The currency began use in 2009 when its implementation was released as open-source software.";
            
            // if-else statement on whether token is matched with the left conceptmap
            try{
                //var text_seg = cldrSegmentation.wordSplit(data_db);
                if(data_db.includes(node.name))
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
                else
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
                        />
                        
                        );
    
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
        
        return (
            <div width={this.props.width} height={this.props.height} style={styles.root} >
                <div style={styles.Div}>
                    <svg className="graph" width={(this.props.width)/2} height={this.props.height} style={styles.root2}>
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
            </div>
        );
    }
}
export default Graph;