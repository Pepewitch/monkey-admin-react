import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class DashboardDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button fullWidth onClick={this.handleClickOpen}>{this.props.buttonText}</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth={false}
        >
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            {this.props.content}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DashboardDialog;