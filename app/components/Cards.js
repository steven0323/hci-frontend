import React, { Component } from 'react';
import Card from './Card'

class Cards extends Component {
    constructor(props){
        super(props);
        this.state={
            cards: [
                {id:1, content:"hi"},
                {id:2, content:"how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?"},
                {id:3, content:"I'm fine tku and u?"},
            ]
        };
        this.handleDelete=this.handleDelete.bind(this);
        this.handleEdit=this.handleEdit.bind(this);      
        this.addCard=this.addCard.bind(this);      
    }
    addCard(content){
        let cards = this.state.cards;
        cards.push({id:cards.length+1, content: content});
        this.setState({cards});
    }
    handleDelete(cardId) {
        const cards = this.state.cards.filter(c=>c.id!==cardId);
        console.log(cards);
        console.log(cardId);
        this.setState({cards});
    }
    handleEdit(cardId) {
        console.log("handleEdit",cardId);
    }
    handleSave(cardId){
        console.log("handleSave", cardId);
    }
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
        return (
            <div>
                {this.state.cards.map(card =>
                    (<Card content={card.content}
                            id = {card.id}
                            onDelete={this.handleDelete}
                            onEdit={this.handleEdit} 
                            onSave={this.handleSave}/>
                        ))}
            </div>
        );
    }
}
 
export default Cards;