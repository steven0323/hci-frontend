import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = ({
    title:{
        fontSize:150,
    },
  });
class UserNameDialog extends Component {
    constructor(props) {
        super(props);
        this.onClick=this.onClick.bind(this);
    }
    onClick(){
        const nameElement = document.getElementById("name");
        const name = nameElement.value;
        this.props.SetUserId(name);
        this.props.HandleNameDialogClose();
    }
    
    render() {
        // console.log(this.props.keyword);
        return (
        <div  style={styles.title}>
            <Dialog
            open={this.props.nameDialogOpen}
            onClose={this.props.HandleNameDialogClose}
            aria-labelledby="userName-dialog-title"
            aria-describedby="userName-dialog-description"
            >
            <DialogTitle id="userName-dialog-title">{"WHat's your name?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="userName-dialog-description">
                        {"username: "}
                        <input type='text' name='name' id='name'/>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.onClick} color="primary">
                    OK
            </Button>
            </DialogActions>
            </Dialog>
        </div>
        );
  }
}
export default UserNameDialog;