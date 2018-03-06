import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import AddIcon from 'material-ui-icons/Add'
import {Tooltip} from 'material-ui'
import {DatePickers,TimePickers} from 'components'
import {global,serialize} from 'variables/general'

const btnStyle = {
  boxShadow: '0 2px 2px 0 rgba(153, 153, 153, 0.14), 0 3px 1px -2px rgba(153, 153, 153, 0.2), 0 1px 5px 0 rgba(153, 153, 153, 0.12)',
  border: 'none',
  borderRadius: '3px',
  position: 'relative',
  padding: '12px 30px',
  margin: '10px 1px',
  fontSize: '12px',
  fontWeight: '400',
  textTransform: 'uppercase',
  letterSpacing: '0',
  willChange: 'box-shadow, transform',
  transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  lineHeight: '1.42857143',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  MsTouchAction: 'manipulation',
  touchAction: 'manipulation',
  cursor: 'pointer',
  '&:hover': {
      boxShadow: '0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)'
  }
}

export default class AddTransaction extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  confirmAddTransaction(onSuccess){
    let date = document.getElementById('newDate')
    let time = document.getElementById('newTime')
    let timestamp = new Date(date.value+' '+time.value)
    let sender = document.getElementById('sender').value
    let reason = document.getElementById('reason').value
    let value = document.getElementById('value').value
    let remark = document.getElementById('remark').value
    if(timestamp!==undefined && sender.length>0 && reason.length>0 && value.length>0 && this.props.studentID !== undefined && this.props.subject !== undefined){
      if(!parseInt(value)){
        window.alert("Value จะต้องเป็นตัวเลขเท่านั้น")
      }else if(sender.length!==5 && !parseInt(sender)){
        window.alert("Sender จะต้องเป็น ID เท่านั้น")
      }else{
        let body = {
          studentID : this.props.studentID,
          subject : this.props.subject,
          timestamp : timestamp.getTime(),
          sender : sender,
          reason : reason,
          value : value
        }
        if(remark) body.remark = remark
        fetch(global.postlink+'/post/v1/addTransactionFHB',{
            method:'POST',
            headers: {
                'Accept' : 'applicaiton/json',
                'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:serialize(body)
        }).then(data=>data.json()).then(data=>{
          this.setState({ open: false });
          if(onSuccess)onSuccess()
        })
      }
    }else{
      window.alert("กรุณากรอกข้อมูลให้เรียบร้อย")
    }
  }
  render() {
    const {studentID,subject,fetchTransaction} = this.props
    return (
      <div>
        <Tooltip title="เพิ่มประวัตินักเรียน">
            <Button variant="raised" style={btnStyle} color="primary" onClick={()=>{this.setState({open:true})}}>
            <AddIcon />&nbsp;ADD
            </Button>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a new transaction</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send
              updates occationally.
            </DialogContentText> */}
            <div style={{display:"inline-flex"}}>
            <DatePickers/>&nbsp;<TimePickers/>&nbsp;
            <TextField
              id="remark"
              label="Remark(Optional)"
            />
            </div>
            <div style={{display:"inline-flex",padding:"10px"}}>
            <TextField
              autoFocus
              id="value"
              label="Value"
            />&nbsp;
            <TextField
              id="reason"
              label="Reason"
            />&nbsp;
            <TextField
              id="sender"
              label="Sender(ID)"
              value={studentID}
            />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={()=>{this.confirmAddTransaction(()=>{fetchTransaction(studentID,subject)})}} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}