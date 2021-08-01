import React, { Component } from 'react';
import Card from './Card'

class Cards extends Component {
    constructor(props){
        super(props);
        this.state={
            cards: [
                {id:1, content:"hi"},
                {id:2, content:"how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?how r u?"}
            ]
        };
        this.handleDelete=this.handleDelete.bind(this);
        this.handleEdit=this.handleEdit.bind(this);      
    }
    handleDelete(cardId) {
        console.log("handleDelet",cardId);
    }
    handleEdit(cardId) {
        console.log("handleEdit",cardId);
    }
    handleSave(cardId){
        console.log("handleSave", cardId);
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