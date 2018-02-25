import React from 'react';
import {
    TextField, Grid, Paper, Button, IconButton, FormControl, FormControlLabel, FormGroup,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
    Switch
} from 'material-ui'
import { ItemGrid, RegularCard } from 'components'
import { global, serialize } from 'variables/general'
import DeleteIcon from 'material-ui-icons/Delete'
import Slide from 'material-ui/transitions/Slide';

const btnStyle = {
    width: '100%',
    height: '80px',
    boxShadow: '0 2px 2px 0 rgba(153, 153, 153, 0.14), 0 3px 1px -2px rgba(153, 153, 153, 0.2), 0 1px 5px 0 rgba(153, 153, 153, 0.12)',
    border: 'none',
    borderRadius: '3px',
    position: 'relative',
    padding: '8px 30px',
    margin: '5px 1px',
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
        boxShadow: '0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)',
    }
}

class Manage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            open: false,
            multipleSelect: false
        }
        this.handleClose = this.handleClose.bind(this)
    }
    handleClose() {
        this.setState({ open: false })
    }
    addStudent() {
        let barcode = document.getElementById('studentID').value
        document.getElementById('studentID').value = ''
        if (barcode.length === 6) {
            let data = this.state.multipleSelect?this.state.data:[]
            if(!this.state.multipleSelect) this.setState({data:[]})
            let inArray = false;
            for (let i in data) {
                if (data[i].barcode === barcode) inArray = true;
            }
            if (!inArray) {
                Promise.all([
                    fetch(global.postlink + '/post/v1/getTotalTransactionFHB', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: 'studentID=' + barcode.slice(0, 5) + '&subject=' + global.keySubject[barcode[5]]
                    }).then(d => d.json()),
                    fetch(global.postlink + '/post/studentProfile', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: 'studentID=' + barcode.slice(0, 5)
                    }).then(d => d.json())
                ]).then(promiseArr => {
                    if(!promiseArr[1].err){
                        data.push({
                            barcode: barcode,
                            studentID: barcode.slice(0, 5),
                            subject: global.keySubject[barcode[5]],
                            profile: promiseArr[1],
                            transaction: promiseArr[0]
                        })
                    }
                    else{
                        window.alert('ไม่พบ ID ที่ค้นหา')
                    }
                    this.setState({ data: data })
                })
            }
        }
    }
    deleteBarcode(barcode) {
        let data = this.state.data;
        for (let i in data) {
            if (data[i].barcode === barcode) {
                data.splice(i, 1)
            }
        }
        this.setState({ data: data })
    }
    addTransaction(value, reason) {
        this.setState({ loading: true })
        let studentArr = this.state.data.map(data => {
            return { studentID: data.studentID, subject: data.subject, value: value, reason: reason, sender: 99001 }
        })
        let promise = []
        let statedata = this.state.data
        for (let i in studentArr) {
            promise.push(fetch(global.postlink + '/post/v1/addTransactionFHB', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: serialize(studentArr[i])
            }).then(d => d.json()))
        }
        Promise.all(promise).then(data => {
            for (let i in data) {
                statedata[i].transaction.total += value
                statedata[i].lastUpdate = value;
            }
            setTimeout(() => { this.setState({ data: statedata, loading: false }) }, 200)

        })
        console.log(studentArr)
    }

    render() {
        return (
            <div>
                asdsda
                <Grid container justify="center">
                    <TextField id="studentID" autoFocus placeholder={"Scan a barcode"} style={{ width: '50%', fontSize: '120%' }} autoComplete={"false"} onKeyDown={(e) => {
                        if (e.which === 13) this.addStudent()
                    }} />
                </Grid>
                <Grid container style={{ padding: '20px' }} spacing={24} justify={"space-between"}>
                    <Grid item xs={6} md={8} lg={8}>
                        <RegularCard
                            cardTitle={<div>{"Selected ID"}
                                <FormControl style={{ float: 'right' }}>
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={this.state.multipleSelect}
                                        onChange={(e,c)=>{this.setState({multipleSelect:c})}}
                                        value={1}
                                    />
                                    }
                                    label={<label style={{color:'white'}}>{"Multiple Select"}</label>}
                                />
                                </FormControl>
                            </div>}
                            headerColor="orange"
                            content={
                                this.state.multipleSelect?
                                <div>
                                    <ExpansionPanel style={{ width: '100%', background: 'white' }} disabled>
                                        <ExpansionPanelSummary >
                                            <ItemGrid md={3}>
                                                <div align="center"><label style={{ color: "black" }}>ID</label></div>
                                            </ItemGrid>
                                            <ItemGrid md={3}>
                                                <div align="center"><label style={{ color: "black" }}>Subject</label></div>
                                            </ItemGrid>
                                            <ItemGrid md={3}>
                                                <div align="center"><label style={{ color: "black" }}>Name</label></div>
                                            </ItemGrid>
                                            <ItemGrid md={3}>
                                                <div align="center"><label style={{ color: "black" }}>Balance</label></div>
                                            </ItemGrid>
                                        </ExpansionPanelSummary>
                                    </ExpansionPanel>
                                    {
                                        this.state.loading ?
                                            <div align="center"><CircularProgress size={100} style={{ margin: "20px" }} color="primary" /></div>
                                            :
                                            <div>
                                                {this.state.data.map((data, key) =>
                                                    <Slide direction="up" in>
                                                        <ExpansionPanel style={{ width: '100%' }} key={key}>
                                                            <ExpansionPanelSummary>
                                                                <ItemGrid md={3}>
                                                                    <div align="center"><label style={{ color: "black", fontSize: '110%' }}>{data.studentID}</label></div>
                                                                </ItemGrid>
                                                                <ItemGrid md={3}>
                                                                    <div align="center"><label style={{ color: "black", fontSize: '110%' }}>{data.subject}</label></div>
                                                                </ItemGrid>
                                                                <ItemGrid md={3}>
                                                                    <div align="center"><label style={{ color: "black", fontSize: '110%' }}>{data.profile.firstname + '(' + data.profile.nickname + ')'}</label></div>
                                                                </ItemGrid>
                                                                <ItemGrid md={3}>
                                                                    <div align="center"><label style={{ color: "red", fontSize: '130%' }}>{data.transaction.total}{data.lastUpdate ? (' (' + (data.lastUpdate > 0 ? ('+' + data.lastUpdate) : data.lastUpdate) + ')') : ''}</label></div>
                                                                </ItemGrid>
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                                <div style={{ width: '100%', textAlign: 'center' }}><IconButton onClick={() => { this.deleteBarcode(data.barcode) }}><DeleteIcon /></IconButton></div>
                                                            </ExpansionPanelDetails>
                                                        </ExpansionPanel>
                                                    </Slide>
                                                )}
                                            </div>
                                    }
                                </div>
                                :
                                <div>
                                    {this.state.loading?
                                        <div align="center"><CircularProgress size={100} style={{ margin: "20px" }} color="primary" /></div>
                                        :
                                        <div style={{width:'100%'}}>
                                            {this.state.data.map((data,key)=>{
                                                return <Slide direction="up" in>
                                                <Grid container spacing={16} style={{padding:'16px'}}>
                                                    <Grid item md={4} xs={6}>
                                                        <div style={{width:'100%',textAlign:'right'}}>
                                                            StudentID :&nbsp;
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={8} xs={6}>
                                                        <div style={{width:'100%',textAlign:'left'}}>
                                                            {data.studentID}
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={4} xs={6}>
                                                        <div style={{width:'100%',textAlign:'right',fontSize:'150%'}}>
                                                            Name :&nbsp;
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={8} xs={6}>
                                                        <div style={{width:'100%',textAlign:'left',fontSize:'150%'}}>
                                                            {data.profile.firstname+' ('+data.profile.nickname+')'}
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={4} xs={6}>
                                                        <div style={{width:'100%',textAlign:'right'}}>
                                                            Subject :&nbsp;
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={8} xs={6}>
                                                        <div style={{width:'100%',textAlign:'left'}}>
                                                            {data.subject}
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={4} xs={6}>
                                                        <div style={{width:'100%',textAlign:'right',fontSize:'150%'}}>
                                                            Balance :&nbsp;
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={8} xs={6}>
                                                        <div style={{width:'100%',textAlign:'left',fontSize:'150%',color:'red'}}>
                                                            {data.transaction.total+' บาท '}{data.lastUpdate?(' (' + (data.lastUpdate > 0 ? ('+' + data.lastUpdate) : data.lastUpdate) + ')') : ''}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                </Slide>
                                            })}
                                        </div>
                                    }
                                </div>
                            }/>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <RegularCard
                            cardTitle={"Action"}
                            headerColor="green"
                            content={
                                <Grid container justify={"center"}>
                                    <Grid item md={6} sm={12}>
                                        <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.addTransaction(10000, 'Deposit from MonkeyAdmin') }}>Deposit +10000</Button>
                                    </Grid>
                                    <Grid item md={6} sm={12}>
                                    <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.addTransaction(-800, 'Withdraw from MonkeyAdmin') }}>Withdraw -800</Button>
                                    </Grid>
                                    <Grid item md={6} sm={12}>
                                    <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.addTransaction(-100, 'ลืมอุปกรณ์') }}>ลืมอุปกรณ์ -100</Button>
                                    </Grid>
                                    <Grid item md={6} sm={12}>
                                    <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.addTransaction(-800, 'Absent') }}>Absent -800</Button>
                                    </Grid>
                                    <Grid item md={6} sm={12}>
                                    <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.setState({ open: true }) }}>Custom</Button>
                                    </Grid>
                                    <Grid item md={6} sm={12}>
                                    <Button className={"manageBtn"} variant="raised" style={btnStyle} onClick={() => { this.setState({ data: [] }) }}>Clear</Button>
                                    </Grid>
                                    <Dialog
                                        open={this.state.open}
                                        aria-labelledby="form-dialog-title"
                                    >
                                        <DialogTitle id="form-dialog-title">Create new transaction</DialogTitle>
                                        <DialogContent>

                                            <div style={{ display: "inline-flex", padding: "10px" }}>
                                                <TextField
                                                    autoFocus
                                                    id="value"
                                                    label="Value"
                                                />&nbsp;
                                            <TextField
                                                    id="reason"
                                                    label="Reason"
                                                />&nbsp;
                                        </div>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClose} color="primary">
                                                Cancel
                                    </Button>
                                            <Button onClick={() => { if (document.getElementById('value').value && document.getElementById('reason').value) this.addTransaction(parseInt(document.getElementById('value').value), document.getElementById('reason').value); this.setState({ open: false }) }} color="primary">
                                                Confirm
                                    </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>} />

                    </Grid>
                </Grid>
            </div >
        );
    }
}
export default Manage;
