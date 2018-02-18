import React from 'react';
import {
    Grid, InputLabel , FormGroup , FormLabel , FormControl , CircularProgress , TextField , 
    FormControlLabel , ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails , Typography
} from 'material-ui';
import {
    ProfileCard, RegularCard, CustomInput, ItemGrid ,Table, Button
} from 'components';
import queryString from 'query-string';
import avatar from 'assets/img/faces/no-img.gif';
import {global,serialize} from 'variables/general';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
const formLabelStyle = {
    margin : '5px',
    color: 'black'
}

class UserProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {query : queryString.parse(this.props.location.search) , loading:true}
        this.selectRow = this.selectRow.bind(this)
    }
    selectRow(e,eachRow,remark){
        this.setState({loading:true})
        for(let i in this.allpic){
            if((eachRow[0]+'')===this.allpic[i].split('.')[0]){
                this.setState({profilepic:this.allpic[i]})
                break
            }
        }
        fetch(global.postlink+'/post/studentProfile',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:serialize({studentID:eachRow[0]})
        }).then(data=>data.json()).then(data=>{
            data.subject = eachRow[1]
            this.setState({query:{id:eachRow[0]} , profile:data})
        })
        this.fetchTransaction(eachRow[0],eachRow[1])
        
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
                console.log(data.transactionArr)
                this.setState({activity : data.transactionArr , loading:false})
            }
        })
        setTimeout(()=>{
            if(!fetchComplete){
                fetchComplete = true;
                this.fetchTransaction(studentID,subject)
            }
        },3000)
    }

    fetchInitialData(){
        let fetchComplete = false;
        fetch('https://www.monkey-monkey.com/post/v1/allstudentProfilePicture',{method:'post'}).then(data=>{return data.json()}).then(data=>{
            if(!fetchComplete){
                this.allpic = data.arr
                fetch(global.postlink+'/post/v1/getTotalTransactionFHB',{method:'post'}).then(data=>{return data.json()}).then(data=>{
                    if(!fetchComplete){
                        fetchComplete = true
                        this.setState({
                            allstudent:data.transactionArr.map((each)=>{
                                let date = new Date(each.lastUpdate)
                                let day = date.toLocaleDateString().split('/')
                                return [each.studentID,each.subject,(day[1].length>1?day[1]:('0'+day[1]))+'/'+(day[0].length>1?day[0]:('0'+day[0]))+'/'+day[2]+'  '+date.toLocaleTimeString(),each.firstname+' ('+each.nickname+') '+each.lastname,each.total]
                            }),
                            loading :false
                        })
                    }
                })
            }
        })
        setTimeout(()=>{
            if(!fetchComplete) {
                fetchComplete = true;
                this.fetchInitialData()
            }
        },2000)
    }
    componentDidMount(){
        setTimeout(()=>{
            this.fetchInitialData()
        },200)
    }

    handleEditActivity(){

    }
    render(){
        return (
            <div ref="user" className={"under2500view"}>
                {this.state.query.id?
                    <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Activity"
                            // cardSubtitle="Complete your profile"
                            content={
                                <div>
                                    {this.state.loading?
                                    <div align="center"><CircularProgress size={80} style={{margin:"20px"}} color="secondary"/></div>
                                    :
                                    <div className={"under2500info"}>
                                        <ExpansionPanel disabled style={{background:'white' , width:'100%'}}>
                                            <ExpansionPanelSummary>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Date</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Time</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Value</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Balance</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Reason</label></div>
                                                </ItemGrid>
                                                <ItemGrid md={2}>
                                                <div align="center"><label style={{color:"black"}}>Sender</label></div>
                                                </ItemGrid>
                                            </ExpansionPanelSummary>
                                        </ExpansionPanel>
                                        {
                                            this.state.activity.map(eachRow => {
                                                let dateObj = new Date(eachRow.timestamp)
                                                let date = dateObj.toLocaleDateString().split('/')
                                                return <ExpansionPanel>
                                                    <ExpansionPanelSummary>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{(date[1].length>1?date[1]:('0'+date[1]))+'/'+(date[0].length>1?date[0]:('0'+date[0]))+'/'+date[2]}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{dateObj.toLocaleTimeString()}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.value}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.total}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.reason}</label></div>
                                                        </ItemGrid>
                                                        <ItemGrid md={2}>
                                                        <div align="center"><label style={{color:"black"}}>{eachRow.sender}</label></div>
                                                        </ItemGrid>
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        <TextField variant="raised" label={"edit Value"} margin="normal" ref={eachRow._id+"value"}/>&nbsp;
                                                        <TextField label={"edit Sender"} margin="normal" ref={eachRow._id+"sender"}/>&nbsp;
                                                        <TextField label={"edit Reason"} margin="normal" ref={eachRow._id+"reason"}/>&nbsp;
                                                        <Button color="success" size="small" onClick={()=>{this.handleEditActivity()}}>Submit</Button>&nbsp;
                                                        <Button color="rose" size="small" onClick={()=>{this.handleDeleteActivity()}}>Delete</Button>
                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                            })
                                        }
                                        <ExpansionPanel>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Expansion Panel 2</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                            <Typography>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                                sit amet blandit leo lobortis eget.
                                            </Typography>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    </div>
                                    }
                                </div>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ProfileCard
                            avatar={"https://www.monkey-monkey.com/profile/"+this.state.profilepic}
                            // title={}
                            content={
                                <FormControl>
                                    <FormGroup>
                                        <FormControlLabel control={<label style={{color:"black"}}>{"StudentID :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.query.id}</label>}/>
                                        <FormControlLabel control={<label style={{color:"black"}}>{"Name :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.profile.firstname+' ('+this.state.profile.nickname+') '+this.state.profile.lastname}</label>}/>
                                        <FormControlLabel control={<label style={{color:"black"}}>{"Level :"}&nbsp;</label>} label={<label style={{color:"black"}}>{this.state.profile.level}</label>}/>
                                        <FormControlLabel control={<label style={{color:"black"}}>{"Subject :"}&nbsp;</label>} label={<label style={{color:"black"}}>{global.subject[this.state.profile.subject[0]]}</label>}/>
                                    </FormGroup>
                                </FormControl>
                            }
                                // (this.state.profile?(this.state.profile.firstname+' ('+this.state.profile.nickname+') '+this.state.profile.lastname):"")}
                            // footer={
                            //     <Button color="primary" round>View history</Button>
                            // }
                        />
                    </ItemGrid>
                </Grid>
                :
                <div ref="allstudent">
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
