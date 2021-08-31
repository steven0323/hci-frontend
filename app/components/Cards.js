import { BottomNavigationAction, Hidden } from '@material-ui/core';
import React, { Component } from 'react';
import SunEditor from 'suneditor-react';
import Card from './Card'
import RelatedVideosPanel from './RelatedVideosPanel';


//Start Connect to database----------
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyD5ro8Oj_EHuFweJR3bywJCO49egETQp7g",
        authDomain: "test-7916a.firebaseapp.com",
        databaseURL: "https://test-7916a-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "test-7916a",
        storageBucket: "test-7916a.appspot.com",
        messagingSenderId: "931195594829",
        appId: "1:931195594829:web:65c637f9dc54e245d4d404",
        measurementId: "G-T5RH81V2MG"
    })
    }else {
    firebase.app(); // if already initialized, use that one
    }
  
const db = firebase.database();

  
class Cards extends Component {
    constructor(props){
        super(props);
        this.state={
            cards: [
            ],
            concept:this.props.searchInfo,
            windowWidth:window.innerWidth,
            windowHeight:window.innerHeight,
        };
        this.handleDelete=this.handleDelete.bind(this);
        this.handleEdit=this.handleEdit.bind(this);      
        this.addCard=this.addCard.bind(this);   
        this.handleThumbsCnt=this.handleThumbsCnt.bind(this);
        this.handleResize = this.handleResize.bind(this);
        var concept = this.state.concept;
        var path = "/"+concept;
        var tmp = this;
        db.ref(path).on('value', function(snapshot){
            tmp.state.cards = JSON.parse(JSON.stringify(snapshot.val()));
            //console.log("tmp.state.cards", tmp.state.cards);
            //console.log("keys = ", Object.keys(tmp.state.cards));
            
            if((tmp.state.cards!=null)||(tmp.state.cards!=undefined)){
                var keys = Object.keys(tmp.state.cards);
                var cards = [];
                var i =0;
                while(i<keys.length){
                    var cardId = keys[i];
                    var cardContent = tmp.state.cards[cardId].cardContent;
                    var likes = tmp.state.cards[cardId].likes;
                    var userId = tmp.state.cards[cardId].userId;
                    var card = {cardId:cardId, cardContent:cardContent, userId: userId, likes:likes };
                    cards.push(card);
                    i = i+1;
                }
                console.log("cards = ", cards);
                cards.sort(function(a, b){
                    return b.likes-a.likes;
                });
            }
            tmp.state.cards = cards;
            tmp.forceUpdate();
            //console.log("tmp.state.cards", tmp.state.cards);
        });
        const styles = ({
            ul: {
                //overflowX: "scroll",
                overflowY: "scroll",
                width:this.state.windowWidth/2,
                height:this.state.windowHeight/2
            }
        });
    }
    
    componentDidMount(){
        window.addEventListener("resize", this.handleResize);
    }
    handleResize(e){
        this.setState({windowWidth : window.innerWidth,
                        windowHeight : window.innerHeight});
    }
    addCard(content){
        let cards = this.state.cards;
        cards.push({id:cards.length+1, content: content, thumbsCnt: 0});
        this.setState({cards});
    }
    handleDelete(cardId) {
        var sendBackEnd='https://conceptmap-backend.herokuapp.com/DeleteCard/'+this.state.concept+"&"+cardId;
        console.log("handleDelete = ",sendBackEnd);
        fetch(sendBackEnd);
    }
    handleEdit(cardId) {
        console.log("handleEdit",cardId);

    }
    handleSave(cardId){
        console.log("handleSave", cardId);
    }
    handleThumbsCnt(cardId,method){
        var card = this.state.cards.filter(c=>c.id==cardId);
        if(method=="add"){
            card[0].thumbsCnt=card[0].thumbsCnt+1;
        }
        else{
            card[0].thumbsCnt=card[0].thumbsCnt-1;
        }
        //console.log("card = ", card);
        //console.log("this.state.cards.filter = ",this.state.cards.filter(c=>c.id!==cardId));
        var cards =card.concat( this.state.cards.filter(c=>c.id!==cardId));
        //console.log("cards = ", cards);
        cards.sort(function(a, b){
            return b.thumbsCnt-a.thumbsCnt;
        });
        this.setState({cards});
    }
    /*componentDidMount(){
        var concept = this.state.concept;
        var path = "/"+concept;
        var tmp = this;
        db.ref(path).once('value', function(snapshot){
            tmp.setState({cards:snapshot.val()});
            console.log(snapshot.val());
            console.log(typeof(tmp.state.cards));
            });
        var properties = Object.getOwnPropertyNames(this.state.cards);
        console.log("properties", properties);
        db.ref(path).on('value', function(snapshot){
            tmp.setState({cards:snapshot.val()});
            });
        //console.log(typeof(this.state.cards));
    }*/
    componentDidUpdate(prevProps,prevState) {
        // 常見用法（別忘了比較 prop）：
        if (this.props.newCardContent !== prevProps.newCardContent) {
              this.addCard(this.props.newCardContent);
        };
        if (this.state!== prevState) {
            console.log("this.state = ", this.state);
        }
      }
    render() { 
        var tmp = this;
        var styles={};
        if (this.props.progress=="4"){
            styles = ({
                ul: {
                    //overflowX: "scroll",
                    overflowY: "scroll",
                    width:tmp.props.graphWidth,
                    height:(tmp.state.windowHeight/2-100)
                }
            });
        }else{
            styles = ({
                ul: {
                    //overflowX: "scroll",
                    overflowY: "scroll",
                    width:tmp.state.windowWidth/3,
                    height:(tmp.state.windowHeight/3)+(tmp.state.windowHeight/3)
                }
            });
        };
        if(this.state.cards!=null){
            return (
                <div className="relative" style={styles.ul}> 
                    {this.state.cards.map(card =>
                        (<Card content={card.cardContent}
                                key = {card.cardId}
                                cardId = {card.cardId}
                                userId = {card.userId}
                                onDelete={this.handleDelete}
                                onEdit={this.handleEdit} 
                                onSave={this.handleSave}
                                handleThumbsCnt={this.handleThumbsCnt}
                                thumbsCnt={card.likes}
                                SetCardEdit={this.props.SetCardEdit}
                                concept = {this.state.concept}
                                SetEditorContent = {this.props.SetEditorContent}
                                cardEditing = {this.props.cardEditing}
                                editingCardId = {this.props.editingCardId}
                                style = {styles}/>
                        ))}
                </div>
            );
        }else{
            return null;
        }
    }
}

export default Cards;