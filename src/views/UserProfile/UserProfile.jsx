import React from 'react';
import {
    Grid, InputLabel , FormGroup , FormLabel , FormControl , CircularProgress , FormControlLabel
} from 'material-ui';
import {
    ProfileCard, RegularCard, Button, CustomInput, ItemGrid ,Table
} from 'components';
import queryString from 'query-string';
import avatar from 'assets/img/faces/no-img.gif';
import {global,serialize} from 'variables/general';

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
        for(let i = 1 ; i < global.subject.length ; i++){
            fetch(global.postlink+'/post/v1/getTransactionFHB',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body:serialize({studentID:eachRow[0] , subject:global.subject[i]})
            }).then(data=>data.json()).then(data=>{
                console.log(data)
            })
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            fetch('https://www.monkey-monkey.com/post/v1/allstudentProfilePicture',{method:'post'}).then(data=>{return data.json()}).then(data=>{
                this.allpic = data.arr
                fetch(global.postlink+'/post/v1/getTotalTransactionFHB',{method:'post'}).then(data=>{return data.json()}).then(data=>{
                    this.setState({
                        allstudent:data.transactionArr.map((each)=>{
                            let date = new Date(each.lastUpdate)
                            let day = date.toLocaleDateString().split('/')
                            return [each.studentID,each.subject,(day[1].length>1?day[1]:('0'+day[1]))+'/'+(day[0].length>1?day[0]:('0'+day[0]))+'/'+day[2]+'  '+date.toLocaleTimeString(),each.firstname+' ('+each.nickname+') '+each.lastname,each.total]
                        }),
                        loading :false
                    })
                })
            })
        },200)
    }
    render(){
        return (
            <div ref="user" class="under2500view">
                {this.state.query.id?
                    <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Activity"
                            // cardSubtitle="Complete your profile"
                            content={
                                <div>
                                    
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
