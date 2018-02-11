import {global} from 'variables/general';
import React from 'react';
import {
    Grid
} from 'material-ui';

import {
    RegularCard, Table, ItemGrid
} from 'components';
import 'whatwg-fetch';

class Under2500Table extends React.Component{
    constructor(){
        super()
        this.state = { 
            sbjArr : [
                {sbj:'Math',num:1,color:'blue'} ,
                {sbj:'Physics',num:2,color:'blue'} ,
                {sbj:'Chemistry',num:3,color:'blue'} ,
                {sbj:'English',num:4 , color : 'blue'} ,
                // {sbj:'Bio',num:5}
            ]
        }
    }
    componentDidMount(){
        fetch(global.postlink+'/post/v1/getUnder2500', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            //   'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'Hubot',
              login: 'hubot',
            })
        }).then(data=>{return data.json()}).then(data=>{
            var tmp = this.state;
            tmp.data = data;
            this.setState(tmp);
        })
    }
    render(){
        return (
            <Grid container>
                {
                    this.state.sbjArr.map((obj)=>{
                        return (
                            <ItemGrid xs={12} sm={6} md={6} key={obj.sbj}>
                                <RegularCard
                                    cardTitle={obj.sbj}
                                    headerColor={obj.color}
                                    // cardSubtitle="Here is a subtitle for this table"
                                    content={
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={['ID','Name','Balance']}
                                            tableData={this.state.data?this.state.data.arr.filter(e=>{return e.subject === obj.sbj[0]}).map(e=>{
                                                return [''+e.studentID,e.firstname+'('+e.nickname+')',''+e.total];
                                            }) : []}
                                        />
                                    }
                                />
                            </ItemGrid>
                        )
                    })
                }
            </Grid>
        );
    }
}

export default Under2500Table;
