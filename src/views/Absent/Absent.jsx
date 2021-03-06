import React from 'react';
import {
    TextField, Grid, Paper, Button, IconButton, FormControl, FormControlLabel, FormGroup, FormLabel,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
    Switch
} from 'material-ui'
import { ItemGrid, RegularCard } from 'components'
import { global, serialize } from 'variables/general'
import DeleteIcon from 'material-ui-icons/Delete'
import Slide from 'material-ui/transitions/Slide';
import Calendar from 'react-calendar'
import Radio, { RadioGroup } from 'material-ui/Radio';
const btnStyle = {
    height: '100%',
    width: '100%',
    boxShadow: '0 2px 2px 0 rgba(153, 153, 153, 0.14), 0 3px 1px -2px rgba(153, 153, 153, 0.2), 0 1px 5px 0 rgba(153, 153, 153, 0.12)',
    border: 'none',
    borderRadius: '3px',
    position: 'relative',
    padding: '8px 30px',
    margin: '5px 1px',
    fontWeight: '400',
    letterSpacing: '0',
    wordWrap: 'break-word',
    willChange: 'box-shadow, transform',
    transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.42857143',
    textAlign: 'center',
    // whiteSpace: 'nowrap',
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
            multipleSelect: false,
            recheck: true,
            absentDate: new Date(),
            absentReason: "ไม่มา และ ไม่แจ้งลา"
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
            let data = this.state.multipleSelect ? this.state.data : []
            if (!this.state.multipleSelect) this.setState({ data: [] })
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
                    }).then(d => d.json()),
                    fetch(global.postlink + '/post/v1/getStudentQuota', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: 'studentID=' + barcode.slice(0, 5) + '&subj=' + global.keySubject[barcode[5]][0].toUpperCase()
                    }).then(d => d.json()),
                    this.state.recheck ? fetch(global.postlink + '/post/v1/recheck', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: 'studentID=' + barcode.slice(0, 5) + '&subject=' + global.keySubject[barcode[5]]
                    }).then(d => d.json()) : null,
                ]).then(promiseArr => {
                    if (!promiseArr[1].err) {
                        data.push({
                            barcode: barcode,
                            studentID: barcode.slice(0, 5),
                            subject: global.keySubject[barcode[5]],
                            profile: promiseArr[1],
                            transaction: promiseArr[0],
                            quota: promiseArr[2].totalQuota - promiseArr[2].usedQuota
                        })
                    }
                    else {
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

    addQuota(value) {
        this.setState({ loading: true })
        let promise = []
        let statedata = this.state.data
        let studentArr = this.state.data.map(data => {
            return { studentID: data.studentID, subject: data.subject, value: value }
        })
        for (let i in studentArr) {
            promise.push(fetch(global.postlink + '/post/v1/addQuota', {
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
                statedata[i].quota += value
            }
            setTimeout(() => { this.setState({ data: statedata, loading: false }) }, 200)
        })
        console.log(studentArr)
    }
    handleAbsent(){
        let reason = document.getElementById('absentReason').value
        if(this.state.absentTime && reason.length>0){
            fetch(global.postlink + '/post/getConfig',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).then(d=>d.json()).then((config)=>{
                let year = config.defaultQuarter.quarter.year;
                let quarter = config.defaultQuarter.quarter.quarter;
                let pickDate = this.state.absentDate
                let find = false
                let hour = parseInt(this.state.absentTime)
                fetch(global.postlink + '/post/v1/studentTimeTable',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: serialize({ year: year, quarter: quarter, studentID: this.state.data[0].studentID.slice(0,5) })
                }).then(d=>d.json()).then(timetable=>{
                    let hb = timetable.hybrid;
                    pickDate.setHours(hour,0,0,0);
	                for (let i in hb) {
                        let t = new Date(hb[i].day);
                        if (t.getDay() === pickDate.getDay() && t.getHours() === hour && (hb[i].subject == (this.state.data[0].subject[0]))) {
                            fetch(global.postlink + '/post/v1/addStudentAbsent',{
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                },
                                body: serialize({
                                    userID: this.state.data[0].studentID.slice(0,5),
                                    date: pickDate.getTime(),
                                    hybridID: hb[i].hybridID,
                                    reason: this.state.absentReason,
                                    sender: "Admin"
                                })
                            })
                            find = true;
                        }
                    }
                    if(!find){
                        window.alert("ไม่มี FHB ในเวลาที่คุณเลือก")
                    }
                    else{
                        this.addTransaction(-800,this.state.absentReason)
                        window.alert("Success!")
                        this.setState({open:false})
                    }
                })
            })
        }else{
            window.alert("กรุณาเลือกวันเวลา และ ใส่เหตุผลให้เรียบร้อย")
        }
    }
    render() {
        return (
            <div>
                <Grid container justify="center">
                    <TextField id="studentID" autoFocus placeholder={"Scan a barcode"} style={{ width: '50%', fontSize: '120%' }} autoComplete={"false"} onKeyDown={(e) => {
                        if (e.which === 13) this.addStudent()
                    }} />
                </Grid>
                <Grid container style={{ padding: '20px' }} spacing={24} justify={"space-between"}>
                    <Grid item xs={6} md={8} lg={8}>
                        <RegularCard
                            cardTitle={<div>{"Selected ID"}
                                <FormGroup row style={{ float: 'right' }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.recheck}
                                                onChange={(e, c) => { this.setState({ recheck: c }) }}
                                                value={1}
                                                color="secondary"
                                            />
                                        }
                                        label={<label style={{ color: 'white' }}>{"Recheck"}</label>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.multipleSelect}
                                                onChange={(e, c) => { this.setState({ multipleSelect: c, data: [] }) }}
                                                value={1}
                                            />
                                        }
                                        label={<label style={{ color: 'white' }}>{"Multiple Select"}</label>}
                                    />
                                </FormGroup>
                            </div>}
                            headerColor="orange"
                            content={
                                this.state.multipleSelect ?
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
                                                <ItemGrid md={3}>
                                                    <div align="center"><label style={{ color: "black" }}>Quota</label></div>
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
                                                                        <div align="center"><label style={{ color: "red", fontSize: '130%' }}>{data.transaction.total}{data.lastUpdate !== undefined ? (' (' + (data.lastUpdate > 0 ? ('+' + data.lastUpdate) : data.lastUpdate) + ')') : ''}</label></div>
                                                                    </ItemGrid>
                                                                    <ItemGrid md={3}>
                                                                        <div align="center"><label style={{ color: "black", fontSize: '110%' }}>{data.quota}</label></div>
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
                                        {this.state.loading ?
                                            <div align="center"><CircularProgress size={100} style={{ margin: "20px" }} color="primary" /></div>
                                            :
                                            <div style={{ width: '100%' }}>
                                                {this.state.data.map((data, key) => {
                                                    return <Slide direction="up" in>
                                                        <Grid container spacing={16} style={{ padding: '16px' }}>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'right' }}>
                                                                    StudentID :&nbsp;
                                                        </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'left' }}>
                                                                    {data.studentID}
                                                                </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'right' }}>
                                                                    Name :&nbsp;
                                                        </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'left' }}>
                                                                    {data.profile.firstname + ' (' + data.profile.nickname + ')'}
                                                                </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'right' }}>
                                                                    Subject :&nbsp;
                                                        </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'left' }}>
                                                                    {data.subject}
                                                                </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '300%', marginTop: '25px', textAlign: 'right' }}>
                                                                    Balance :&nbsp;
                                                        </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '300%', marginTop: '25px', textAlign: 'left', color: 'red' }}>
                                                                    {data.transaction.total + ' บาท '}{data.lastUpdate !== undefined ? (' (' + (data.lastUpdate > 0 ? ('+' + data.lastUpdate) : data.lastUpdate) + ')') : ''}
                                                                </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'right' }}>
                                                                    Quota :&nbsp;
                                                        </div>
                                                            </Grid>
                                                            <Grid item md={6} xs={6}>
                                                                <div className={"fontTHSarabun"} style={{ width: '100%', fontSize: '250%', marginTop: '25px', textAlign: 'left' }}>
                                                                    {data.quota}
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Slide>
                                                })}
                                            </div>
                                        }
                                    </div>
                            } />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <RegularCard
                            cardTitle={"Action"}
                            headerColor="green"
                            content={
                                <Grid container justify={"center"} className={"melSizeHalf"}>
                                    <Grid item md={12} xs={12}>
                                        <button className={"manageBtn"} style={btnStyle} onClick={() => { this.addTransaction(-800, 'ลาฉุกเฉิน') }}>ลาฉุกเฉิน -800</button>
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <button className={"manageBtn"} style={btnStyle} onClick={() => { if (this.state.multipleSelect) window.alert("คำสั่งนี้ไม่สามารถใช้ multiple select ได้"); else {this.setState({ open: true , absentDate: new Date() , absentReason:"ไม่มา และ ไม่แจ้งลา" })}}}>ไม่มาไม่ลา -800</button>
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <button className={"manageBtn"} style={btnStyle} onClick={() => { this.addTransaction(0, 'แจ้งลาแล้ว') }}>แจ้งลาแล้ว 0</button>
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <button className={"manageBtn"} style={btnStyle} onClick={() => { this.setState({ data: [] }) }}>Clear</button>
                                    </Grid>
                                    <Dialog
                                        open={this.state.open}
                                        aria-labelledby="form-dialog-title"
                                    >
                                        <DialogTitle id="form-dialog-title">ไม่มาไม่ลา</DialogTitle>
                                        <DialogContent>
                                            <Grid container spacing={24}>
                                                <Grid item md={12}>
                                                    <TextField fullWidth label={"Reason"} id={"absentReason"} value={this.state.absentReason} onChange={(e)=>this.setState({absentReason:e.target.value})}/>
                                                </Grid>
                                                <Grid item md={8}>
                                                <Calendar
                                                    onChange={(date) => { this.setState({ absentDate: date }) }}
                                                    value={this.state.absentDate}
                                                />
                                                </Grid>
                                                <Grid item md={4}>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="time"
                                                        value={this.state.absentTime}
                                                        onChange={(e) => { this.setState({ absentTime: e.target.value }) }}
                                                    >
                                                        <FormControlLabel value="8" control={<Radio />} label="8:00-10:00" />
                                                        <FormControlLabel value="10" control={<Radio />} label="10:00-12:00" />
                                                        <FormControlLabel value="13" control={<Radio />} label="13:00-15:00" />
                                                        <FormControlLabel value="15" control={<Radio />} label="15:00-17:00" />
                                                        <FormControlLabel value="17" control={<Radio />} label="17:00-19:00" />
                                                    </RadioGroup>
                                                </FormControl>
                                                </Grid>
                                            </Grid>

                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClose} color="primary">
                                                Cancel
                                    </Button>
                                            <Button onClick={()=>{this.handleAbsent()}} color="primary">
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
