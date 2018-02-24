import React from 'react';
import {
    Grid, InputLabel , FormGroup , FormLabel , FormControl , CircularProgress , TextField , Button , 
    FormControlLabel , ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails , Typography , IconButton ,
    Icon, Tooltip ,
    GridList
} from 'material-ui';
import {
    ProfileCard, RegularCard, CustomInput, ItemGrid ,Table,AddTransaction,RaisedButton
} from 'components';
import queryString from 'query-string';
import avatar from 'assets/img/faces/no-img.gif';
import {global,serialize} from 'variables/general';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import DeleteIcon from 'material-ui-icons/Delete';
const formLabelStyle = {
    margin : '5px',
    color: 'black'
}

class UserProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {query : queryString.parse(this.props.location.search) , loading:true , editloading:false}
        this.selectRow = this.selectRow.bind(this)
        this.handleEditActivity = this.handleEditActivity.bind(this)
        this.fetchTransaction = this.fetchTransaction.bind(this)
    }
    selectRow(e,eachRow,remark){
        // this.fetchQueryData(eachRow[0],eachRow[1])
        // this.fetchTransaction(eachRow[0],eachRow[1])
        this.props.history.push('/user?id='+eachRow[0]+'&subject='+eachRow[1])
    }
    fetchQueryData(studentID,subject,checkpic){
        if(!checkpic){
            for(let i in this.allpic){
                if((studentID+'')===this.allpic[i].split('.')[0]){
                    this.setState({loading:true,profilepic:this.allpic[i]})
                    break
                }
            }
        }
        let fetchComplete = false
        fetch(global.postlink+'/post/studentProfile',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:serialize({studentID:studentID})
        }).then(data=>data.json()).then(data=>{
            if(!fetchComplete){
                fetchComplete = true
                data.subject = subject
                this.setState({profile:data , query:{id:studentID,subject:subject}})
            }
        })
        setTimeout(()=>{
            if(!fetchComplete){
                fetchComplete = true
                this.fetchQueryData(studentID,subject,true)
            }
        },2000)
    }
    fetchTransaction(studentID , subject){
        let fetchComplete = false;
        fetch(global.postlink+'/post/v1/getTransactionFHB',{
            method:'POST',
            headers: {
                'Accept' : 'applicaiton/json',
                'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:serialize({studentID:studentID,subject:subject})
        }).then(data=>data.json()).then(data=>{
            if(!fetchComplete){
                fetchComplete = true;
                for(let i = data.transactionArr.length-1 ; i > -1 ; i-- ){
                    data.transactionArr[i].total = data.transactionArr[i+1]?(data.transactionArr[i+1].total+data.transactionArr[i].value):data.transactionArr[i].value
                }
                this.setState({activity : data.transactionArr , loading:false , editloading:false})
            }
        })
        setTimeout(()=>{
            if(!fetchComplete){
                fetchComplete = true;
                this.fetchTransaction(studentID,subject)
            }
        },3000)
    }

    fetchInitialData(callback){
        let fetchComplete = false;
        fetch('https://www.monkey-monkey.com/post/v1/allstudentProfilePicture',{method:'post'}).then(data=>{return data.json()}).then(data=>{
            if(!fetchComplete){
                fetchComplete = true
                this.allpic = data.arr
                if(callback)callback()
            }
        })
        setTimeout(()=>{
            if(!fetchComplete) {
                fetchComplete = true;
                this.fetchInitialData(callback)
            }
        },2000)
    }
    componentDidMount(){
        setTimeout(()=>{
            let query = queryString.parse(this.props.location.search)
            this.fetchInitialData(this.props.location.search?()=>{this.fetchQueryData(query.id,query.subject)}:null)
            this.fetchAllStudent()
            if(this.props.location.search){
                this.fetchTransaction(query.id,query.subject)
            }
        },200)
    }
    fetchAllStudent(){
        let fetchComplete = false
        fetch(global.postlink+'/post/v1/getTotalTransactionFHB',{method:'post'}).then(data=>{return data.json()}).then(data=>{
            if(!fetchComplete){
                fetchComplete = true
                this.setState({
                    allstudent:data.transactionArr.map((each)=>{
                        let date = new Date(each.lastUpdate)
                        let day = date.toLocaleDateString().split('/')
                        let dateStr = (date.getDate()>8?(date.getDate()+1):('0'+(date.getDate()+1)))+'/'+(date.getMonth()>8?(date.getMonth()+1):('0'+(date.getMonth()+1)))+'/'+date.getFullYear()
                        return [each.studentID,each.subject,dateStr+'  '+date.toLocaleTimeString(),each.firstname+' ('+each.nickname+') '+each.lastname,each.total]
                    }),
                    loading :false
                })
            }
        })
        setTimeout(()=>{
            if(!fetchComplete) {
                fetchComplete = true;
                this.fetchAllStudent()
            }
        },2000)
    }
    handleEditActivity(id){
        let value = document.getElementById(id+'value').value
        let reason = document.getElementById(id+'reason').value
        if( value.length>0 || reason.length>0 ){
            this.setState({editloading:true})
            document.getElementById(id+'value').value=''
            document.getElementById(id+'reason').value=''
            let body = {_id:id}
            if(value.length>0) body.value = value;
            if(reason.length>0) body.reason = reason;
            fetch(global.postlink+'/post/v1/editTransactionFHB',{
                method:'POST',
                headers: {
                    'Accept' : 'applicaiton/json',
                    'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body:serialize(body)
            }).then(data=>{
                this.fetchTransaction(this.state.query.id , this.state.query.subject)
            })
        }
    }

    handleDeleteActivity(id){
        this.setState({loading:true})
        fetch(global.postlink+'/post/v1/deleteTransactionFHB',{
            method:'POST',
            headers: {
                'Accept' : 'applicaiton/json',
                'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:serialize({_id:id})
        }).then(data=>{
            this.fetchTransaction(this.state.query.id , this.state.query.subject)
        })
    }

    componentWillReceiveProps(nextProps){
        this.props = nextProps
        this.state = {query : queryString.parse(this.props.location.search) , loading:true , editloading:false}
        this.componentDidMount()   
    }

    render(){
        return (
            <div className={"userview"}>
                {this.state.query.id?
                    <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle={
                                <div style={{verticalAlign:"middle"}}>
                                    <label style={{color:"white",verticalAlign:"middle"}}>Activity</label>
                                    <Button style={{float:"right",color:'white',verticalAlign:"middle"}} onClick={()=>{this.props.history.push('/user')}}>to AllStudent</Button>
                                </div>
                            }
                            headerColor="blue"
                            // cardSubtitle="Complete your profile"
                            content={
                                <div>
                                    {!this.state.activity?
                                    <div align="center"><CircularProgress size={80} style={{margin:"20px"}} color="secondary"/></div>
                                    :
                                    <div className={"under2500info"}>
                                        <ExpansionPanel style={{width:'100%'}}>
                                            <ExpansionPanelSummary>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"grey"}}>Date</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"grey"}}>Time</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"grey"}}>Value</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"grey"}}>Balance</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={4}>
                                                <div align="center"><label style={{color:"grey"}}>Reason</label></div>
                                                </ItemGrid>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <AddTransaction studentID={this.state.query.id} subject={this.state.query.subject} fetchTransaction={this.fetchTransaction}/>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                        {
                                            this.state.activity.map((eachRow,key) => {
                                                let date = new Date(eachRow.timestamp)
                                                let dateStr = (date.getDate()>8?(date.getDate()+1):('0'+(date.getDate()+1)))+'/'+(date.getMonth()>8?(date.getMonth()+1):('0'+(date.getMonth()+1)))+'/'+date.getFullYear()
                                                return <ExpansionPanel key={key}>
                                                    <ExpansionPanelSummary>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{dateStr}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{date.toLocaleTimeString()}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.value}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.total}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={4}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.reason}</label></div>
                                                        </ItemGrid>
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        {
                                                            this.state.editloading?
                                                            <div align="center" style={{width:"100%"}}><CircularProgress size={50} color="primary"/></div>
                                                            :
                                                            <div style={{display:"inline-flex"}}>
                                                                <TextField label={"edit Value"} margin="none" id={eachRow._id+"value"}/>&nbsp;
                                                                <TextField label={"edit Reason"} margin="none" id={eachRow._id+"reason"}/>&nbsp;
                                                                <div style={{float:"right"}}><div>
                                                                <IconButton color="primary" onClick={()=>this.handleEditActivity(eachRow._id)}><Icon>send</Icon></IconButton>&nbsp;
                                                                <IconButton color="secondary" onClick={()=>{if(window.confirm("ต้องการลบประวัตินี้?"))this.handleDeleteActivity(eachRow._id)}}><DeleteIcon/></IconButton>
                                                                </div></div>
                                                            </div>
                                                        }
                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                            })
                                        }
                                    </div>
                                    }
                                </div>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ProfileCard
                            avatar={this.state.profilepic?"https://www.monkey-monkey.com/profile/"+this.state.profilepic:""}
                            // title={}
                            content={
                                this.state.profile?
                                <FormControl>
                                    <FormGroup>
                                        <FormControlLabel disabled control={<label style={{color:"black"}}>{"StudentID :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.query.id}</label>}/>
                                        <FormControlLabel disabled control={<label style={{color:"black"}}>{"Name :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.profile.firstname+' ('+this.state.profile.nickname+') '+this.state.profile.lastname}</label>}/>
                                        <FormControlLabel disabled control={<label style={{color:"black"}}>{"Level :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.profile.level}</label>}/>
                                        <FormControlLabel disabled control={<label style={{color:"black"}}>{"Subject :"}&nbsp;</label>} label={<label style={{color:"black"}}>{global.subject[this.state.profile.subject[0]]}</label>}/>
                                    </FormGroup>
                                </FormControl>
                                :
                                <div align="center"><CircularProgress size={100} style={{margin:"20px"}} color="primary"/></div>
                            }
                                // (this.state.profile?(this.state.profile.firstname+' ('+this.state.profile.nickname+') '+this.state.profile.lastname):"")}
                            // footer={
                            //     <Button color="primary" round>View history</Button>
                            // }
                        />
                    </ItemGrid>
                </Grid>
                :
                <div>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle={<div>All student</div>}
                            // headerColor={obj.color}
                            // cardSubtitle="Here is a subtitle for this table"
                            content={
                                this.state.loading?
                                <div align="center"><CircularProgress size={100} style={{margin:"20px"}} color="secondary"/></div>
                                :
                                <Table
                                    // remark={obj.sbj}
                                    handleClick={this.selectRow}
                                    classes={{
                                        table: "allstudenttable",
                                        tableCell: "under2500cell",
                                        tableRow: "under2500row"
                                    }}
                                    tableHeaderColor="primary"
                                    tableHead={['ID','Subject','last updated','Name','Balance']}
                                    tableData={this.state.allstudent?this.state.allstudent:[]}
                                />
                            }
                        />
                    </ItemGrid>
                </div>
                }
                
            </div>
        );
    }
}

export default UserProfile;
