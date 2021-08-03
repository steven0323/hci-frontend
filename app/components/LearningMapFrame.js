import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Graph from '../newdirected/Graph';
import VideoSequence from './VideoSequence';
import ConceptSequence from './ConceptSequence';
import Legend from './Legend';
import WordCloud from './WordCloud';
import RelatedVideosPanel from './RelatedVideosPanel';
import ConceptDetailPanel from './ConceptDetailPanel';
import MapApprovPanel from './MapApprovPanel';
import Notification from './Notification';
import Editor from './Editor'
import Cards from './Cards'
const styles = ({
    container: {
        // justifyContent: 'center',
        display: 'flex',
        flexDirection: "row",
        // flexGrow: 1,
        flexWrap: 'wrap',
        // margin:10,
        // padding:10
        paddingTop: 10,
        paddingLeft: 10,
        // marginTop:10,
        marginLeft: 10

    },
    Editor: {
        // width: 200,
        // height:800,
        position: 'fixed',
        bottom:10,
      },
    LeftField: {
        // display:'flex',
        // width: 900,
        // height: 700,
        // overflowX: "scroll",
        // overflowY: "hidden",
        // padding: 20,
        // margin : 20,
    },
});
var SentRange = []
var ConceptRange = []
class LearningMapFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HoverConceptIndex: null,
            HoverVideoIndex: null,
            PopoverIndexes: [],
            Path_ConceptIndex: null,
            BigCircleIndex: null,
            Hightlight_word: null,
            content:[
                " "
            ],
            newCardContent:false,
            MapConsult: false,
            };
        this.SetHoverConceptIndex = this.SetHoverConceptIndex.bind(this);
        this.SetMapConsult = this.SetMapConsult.bind(this);
        this.SetNewCardContent = this.SetNewCardContent.bind(this);
        this.SetHoverVideoIndex = this.SetHoverVideoIndex.bind(this);
        this.SetPopoverIndexes = this.SetPopoverIndexes.bind(this);
        this.SetPath_ConceptIndex = this.SetPath_ConceptIndex.bind(this);
        this.SetBigCircleIndex = this.SetBigCircleIndex.bind(this);
        this.ClearHoverConcept = this.ClearHoverConcept.bind(this);
        // Adding words hightlighting functions by YHT
        this.SetHightlightWord = this.SetHightlightWord.bind(this);
    }
    componentWillMount() {
        console.log("[graph]", ",", this.props.data.search_info.key);
        // console.log("cheeeee",this.props.data.concept_relationship.nodes);
        // calcalate SentimentScoreRange [SentScoreMin,SentScoreMax];
        var tmpList = [];
        for (var e in this.props.data.videos_info) {

            tmpList.push(this.props.data.videos_info[e].userFeedbackScore);
        };
        var tmpList2 = [];
        for (var e in this.props.data.concept_relationship.nodes) {
            tmpList2.push(this.props.data.concept_relationship.nodes[e].count);
        };
        // console.log("SentRange",[Math.min(...tmpList),Math.max(...tmpList)]);
        // console.log("tmpList2",tmpList2);
        SentRange = [Math.min(...tmpList), Math.max(...tmpList)];
        ConceptRange = [Math.min(...tmpList2), Math.max(...tmpList2), tmpList2.reduce((a, b) => a + b, 0)];
    }
    SetHoverConceptIndex(i, word) {
        // console.log("[hover] conceptMapNode",i);
        // Adding concept panel words highlighting
        console.log("word = ", word);
        this.setState({
            HoverConceptIndex: i
        });
        this.setState({
            HightlightWord: word
        });
        this.setState({
            content: word
        });
        console.log("call set hightlight");
        console.log("this.state.content=", this.state.content);
        console.log("this.state.HLW=", this.state.HightlightWord);
        //console.log(word);
        //this.forceUpdate();
    }
    ClearHoverConcept(){
        this.setState({content:" "});
        console.log("ClearHoverConcept");
    }
    // Adding by YHT
    SetHightlightWord(word) {

        // Adding concept panel words highlighting
        // Hightlight word in editor
        this.setState({
            HightlightWord: word
        });
        console.log("call set hightlight");
        console.log(word);
        // call function in Editor.js

    }
    SetHoverVideoIndex(vid) {
        this.setState({
            HoverVideoIndex: vid
        });
    };
    SetPopoverIndexes(method, index) {
        if (method == "add") {
            if (this.state.PopoverIndexes.includes(index) == false) {
                this.setState({
                    PopoverIndexes: [...this.state.PopoverIndexes, index]
                    // PopoverIndexes:this.state.PopoverIndexes.concat([index])
                });
            }
        } else if (method == "remove") {
            this.setState({
                PopoverIndexes: this.state.PopoverIndexes.filter(val => val !== index)
            });
        } else if (method == "clear") {
            this.setState({
                PopoverIndexes: []
            });
        }
    }
    SetPath_ConceptIndex(method, index) {
        if (method == "add") {
            this.setState({
                Path_ConceptIndex: index
            });
        } else if (method == "clear") {
            console.log("[close] ConceptDetailPanel");
            this.setState({
                Path_ConceptIndex: null,
                BigCircleIndex: null
            });
        }
    }
    SetMapConsult(method){
        if (method == "add"){
            /*     正式的讓後端去取db資料，算出新的Json檔
            fetch('http://localhost:8001/MapPreview/<Keyword>')     //跟後端連結去getJson
            .then(function (res) {
            //    console.log(res.json());
                return res.json();
            }).then(function(myJson) {
                this.props.SetNewJson(myJson);
                return myJson;
            });
            */
            this.setState({MapConsult: true});
            
        } else if (method =="dont_ask") {
            console.log("SetMapConsult(false)!!)");
            this.setState({MapConsult:false });
    }
    }
    SetBigCircleIndex(index) {
        this.setState({
            BigCircleIndex: index
        });
    }
    
    SetNewCardContent(content) {
        this.setState({
            newCardContent: content
        });
    }
    render() {
        var HighlightConceptTextIndex = this.state.HoverVideoIndex == null ? [] : this.props.data.VideoSequence_ConceptInfo[this.state.HoverConceptIndex][this.state.HoverVideoIndex];
        // console.log("windowheight",window.innerHeight);
        console.log (this.props.data);
        return (
            <div style={styles.container}>
                {/* {this.props.data.search_info.key} */}
                {/* <div style = {styles.LeftField} > */}
                <div width={window.innerWidth - 50} height={window.innerHeight - 100}>
                    <Typography variant="headline" component="h5">
                        {this.props.data.search_info.key}
                    </Typography>
                    <Legend Path_ConceptIndex={this.state.Path_ConceptIndex}
                        BigCircleIndex={this.state.BigCircleIndex == null ? this.state.Path_ConceptIndex : this.state.BigCircleIndex}
                        ConceptRange={ConceptRange}
                        data={this.props.data.concept_relationship.nodes}
                    />
                    {/* <WordCloud videos_info={this.props.data.videos_info} HoverVideoIndex={this.state.HoverVideoIndex}/> */}
                    <Graph data={this.props.data}
                        HoverConceptIndex={this.state.HoverConceptIndex}
                        SetHoverConceptIndex={this.SetHoverConceptIndex}
                        ClearHoverConcept = {this.ClearHoverConcept} 
                        OpenDrawer={(text) => props.OpenDrawer(text)}
                        width={window.innerWidth - 50} height={window.innerHeight - 100}
                        SentRange={SentRange}
                        ConceptRange={ConceptRange}
                        SetHoverVideoIndex={this.SetHoverVideoIndex}
                        HoverVideoIndex={this.state.HoverVideoIndex}
                        Path_ConceptIndex={this.state.Path_ConceptIndex}
                        SetPath_ConceptIndex={this.SetPath_ConceptIndex}
                        BigCircleIndex={this.state.BigCircleIndex}
                        SetHightlightWord={this.SetHightlightWord}
                    />
                </div>
                
                <div>
                    <div>
                    <Cards newCardContent = {this.state.newCardContent}/>
                    </div>
                    <div style = {styles.Editor}>
                    <Editor content = {this.state.content}
                            SetMapConsult = {this.SetMapConsult}
                            SetNewJson = {this.props.SetNewJson}
                            SetNewCardContent = {this.SetNewCardContent}
                    />
                    {/*<button onClick={()=>this.SetMapConsult("add")}
                            className="btn btn-primary btn-lg m-5">Show New Map</button>*/}
                    </div>  
                </div>

                <ConceptDetailPanel
                    data={this.props.data}
                    Path_ConceptIndex={this.state.Path_ConceptIndex}
                    SetPath_ConceptIndex={this.SetPath_ConceptIndex}
                    SentRange={SentRange}
                    SetHoverVideoIndex={this.SetHoverVideoIndex}
                    SetHightlightWord={this.SetHightlightWord}
                    HoverVideoIndex={this.state.HoverVideoIndex}
                    HighlightConceptTextIndex={HighlightConceptTextIndex}
                    BigCircleIndex={this.state.BigCircleIndex}
                    SetBigCircleIndex={this.SetBigCircleIndex}
                    
                    SetNewCardContent = {this.SetNewCardContent}
                />
                <MapApprovPanel 
                    data={this.props.data}
                    MapConsult={this.state.MapConsult}
                    SetMapConsult={this.SetMapConsult}
                    SetVisJson = {this.props.SetVisJson}
                    SetNewJson = {this.props.SetNewJson}   
                    NewJson = {this.props.NewJson}
                />
                <Notification open={this.state.Path_ConceptIndex == null} />
            </div>

        );
    }
}
export default LearningMapFrame;