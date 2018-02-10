import React from 'react';
import {
    Grid
} from 'material-ui';

import {
    RegularCard, Table, ItemGrid
} from 'components';

class Under2500Table extends React.Component{
    constructor(){
        super()
        this.state = {
            sbjArr : [
                {sbj:'Math',num:1,color:'blue'} ,
                {sbj:'Physics',num:2,color:'blue'} ,
                {sbj:'Chemistry',num:3,color:'blue'} ,
                // {sbj:'English',num:4} ,
                // {sbj:'Bio',num:5}
            ]
        }
    }
    render(){
        return (
            <Grid container>
                {
                    this.state.sbjArr.map((obj)=>{
                        return (
                            <ItemGrid xs={12} sm={6} md={4} key={obj.sbj}>
                                <RegularCard
                                    cardTitle={obj.sbj}
                                    headerColor={obj.color}
                                    // cardSubtitle="Here is a subtitle for this table"
                                    content={
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={['Name','Country','City','Salary']}
                                            tableData={[
                                                [ "Dakota Rice" , "Niger" , "Oud-Turnhout" , "$36,738" ] ,
                                                [ "Minerva Hooper" , "Curaçao" , "Sinaai-Waas" , "$23,789" ] ,
                                                [ "Sage Rodriguez" , "Netherlands" , "Baileux" , "$56,142" ] ,
                                                [ "Philip Chaney" , "Korea, South" , "Overland Park" , "$38,735" ] ,
                                                [ "Doris Greene" , "Malawi" , "Feldkirchen in Kärnten" , "$63,542" ] ,
                                                [ "Mason Porter" , "Chile" , "Gloucester" , "$78,615" ]
                                            ]}
                                        />
                                    }
                                />
                            </ItemGrid>
                        )
                    })
                }
                <ItemGrid xs={12} sm={6} md={4}>
                    <RegularCard
                        cardTitle="Under2500"
                        cardSubtitle="Here is a subtitle for this table"
                        content={
                            <Table
                                tableHeaderColor="primary"
                                tableHead={['Name','Country','City','Salary']}
                                tableData={[
                                    [ "Dakota Rice" , "Niger" , "Oud-Turnhout" , "$36,738" ] ,
                                    [ "Minerva Hooper" , "Curaçao" , "Sinaai-Waas" , "$23,789" ] ,
                                    [ "Sage Rodriguez" , "Netherlands" , "Baileux" , "$56,142" ] ,
                                    [ "Philip Chaney" , "Korea, South" , "Overland Park" , "$38,735" ] ,
                                    [ "Doris Greene" , "Malawi" , "Feldkirchen in Kärnten" , "$63,542" ] ,
                                    [ "Mason Porter" , "Chile" , "Gloucester" , "$78,615" ]
                                ]}
                            />
                        }
                    />
                </ItemGrid>
            </Grid>
        );
    }
}

export default Under2500Table;
