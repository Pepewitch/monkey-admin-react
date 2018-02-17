import React from 'react';
import {
    Grid, InputLabel ,
} from 'material-ui';

import {
    ProfileCard, RegularCard, Button, CustomInput, ItemGrid ,Table
} from 'components';
import queryString from 'query-string';
import avatar from 'assets/img/faces/no-img.gif';
import {global} from 'variables/general';
class UserProfile extends React.Component{
    constructor(props){
        super(props)
        console.log(this.props)
        this.state = {query : queryString.parse(this.props.location.search)}
    }
    componentDidMount(){
        fetch(global.postlink+'/post/v1/getTotalTransactionFHB',{method:'post'}).then(data=>{return data.json()}).then(data=>{
            console.log(data)
            this.setState({allstudent:data.transactionArr.map((each)=>{
                let date = new Date(each.lastUpdate)
                let day = date.toLocaleDateString().split('/')
                return [each.studentID,(day[1].length>1?day[1]:('0'+day[1]))+'/'+(day[0].length>1?day[0]:('0'+day[0]))+'/'+day[2]+'  '+date.toLocaleTimeString(),each.subject,each.firstname+' ('+each.nickname+') '+each.lastname,each.total]
            })})
        })
    }
    render(){
        return (
            <div>
                {this.state.query.id?
                    <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Edit Profile"
                            cardSubtitle="Complete your profile"
                            content={
                                <div>
                                    <Grid container>
                                        <ItemGrid xs={12} sm={12} md={5}>
                                            <CustomInput
                                                labelText="Company (disabled)"
                                                id="company-disabled"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true
                                                }}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText="Username"
                                                id="username"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Email address"
                                                id="email-address"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                    </Grid>
                                    <Grid container>
                                        <ItemGrid xs={12} sm={12} md={6}>
                                            <CustomInput
                                                labelText="First Name"
                                                id="first-name"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={6}>
                                            <CustomInput
                                                labelText="Last Name"
                                                id="last-name"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                    </Grid>
                                    <Grid container>
                                        <ItemGrid xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="City"
                                                id="city"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Country"
                                                id="country"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Postal Code"
                                                id="postal-code"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                            />
                                        </ItemGrid>
                                    </Grid>
                                    <Grid container>
                                        <ItemGrid xs={12} sm={12} md={12}>
                                            <InputLabel style={{color: '#AAAAAA'}}>About me</InputLabel>
                                            <CustomInput
                                                labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                                                id="about-me"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    multiline: true,
                                                    rows: 5
                                                }}
                                            />
                                        </ItemGrid>
                                    </Grid>
                                </div>
                            }
                            footer={
                                <Button color="primary">Update Profile</Button>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ProfileCard
                            avatar={avatar}
                            title={this.state.profile?this.state.profile.name:"asdf"}
                            description={this.state.profile?"":""}
                            footer={
                                <Button color="primary" round>View history</Button>
                            }
                        />
                    </ItemGrid>
                </Grid>
                :
                <ItemGrid xs={12} sm={12} md={12}>
                    <RegularCard
                        cardTitle={<div>All student</div>}
                        // headerColor={obj.color}
                        // cardSubtitle="Here is a subtitle for this table"
                        content={
                            <Table
                                // remark={obj.sbj}
                                // handleClick={this.handleClick}
                                classes={{
                                    tableCell: "under2500cell",
                                    tableRow: "under2500row"
                                }}
                                tableHeaderColor="primary"
                                tableHead={['ID','last update','Subject','Name','Balance']}
                                tableData={this.state.allstudent?this.state.allstudent:[]}
                            />
                        }
                    />
                </ItemGrid>
                }
                
            </div>
        );
    }
}

export default UserProfile;
