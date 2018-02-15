import { global } from 'variables/general';
import React from 'react';
import {
    Grid
} from 'material-ui';
import {
    RegularCard, Table, ItemGrid, Under2500SnackBar as Snack
} from 'components';

function serialize (obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

class Under2500Table extends React.Component {
    constructor() {
        super()
        this.state = {
            sbjArr: [
                { sbj: 'Math', num: 1, color: 'blue' },
                { sbj: 'Physics', num: 2, color: 'blue' },
                { sbj: 'Chemistry', num: 3, color: 'blue' },
                { sbj: 'English', num: 4, color: 'blue' },
                // {sbj:'Bio',num:5}
            ],
            open: false,
            cardTitle: "",
            cardData: []
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e, eachRow, remark) {
        if (!this.state.open) {
            let cardTitle = eachRow[0] + ' : ' + eachRow[1] + ' ' + remark
            fetch(global.postlink + '/post/v1/getTransactionFHB', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body:serialize({studentID:eachRow[0] , subject:remark})
            }).then(data=>data.json()).then(data=>{
                let cardData = []
                for(let i in data.transactionArr){
                    let eachRow = []
                    let dateObj = new Date(data.transactionArr[i].timestamp)
                    let date = dateObj.toLocaleDateString().split('/')
                    eachRow.push((date[1].length>1?date[1]:('0'+date[1]))+'/'+(date[0].length>1?date[0]:('0'+date[0]))+'/'+date[2])
                    eachRow.push(dateObj.toTimeString().split(' ')[0])
                    cardData.push(eachRow)
                }
                for(let i = data.transactionArr.length-1 ; i > -1 ; i--){
                    let eachRow = cardData[i]
                    eachRow.push(data.transactionArr[i].value)
                    eachRow.push(cardData[i+1]?(cardData[i+1][3]+data.transactionArr[i].value):data.transactionArr[i].value)
                    eachRow.push(data.transactionArr[i].reason)
                    eachRow.push(data.transactionArr[i].sender)
                }
                this.setState({open:true,cardTitle:cardTitle,cardData:cardData})
            })
        }
    }
    componentDidMount() {
        fetch(global.postlink + '/post/v1/getUnder2500', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(data => { return data.json() }).then(data => {
            var tmp = this.state;
            tmp.data = data;
            this.setState(tmp);
        })
    }
    render() {
        return (
            <div className={"under2500view"}>
                <Grid container onClick={() => { if (this.state.open) { this.setState({ open: false }) } }}>
                    {
                        this.state.sbjArr.map((obj) => {
                            return (
                                <ItemGrid xs={12} sm={6} md={6} key={obj.sbj}>
                                    <RegularCard
                                        cardTitle={obj.sbj}
                                        headerColor={obj.color}
                                        // cardSubtitle="Here is a subtitle for this table"
                                        content={
                                            <Table
                                                remark={obj.sbj}
                                                handleClick={this.handleClick}
                                                classes={{
                                                    tableCell: "under2500cell",
                                                    tableRow: "under2500row"
                                                }}
                                                tableHeaderColor="primary"
                                                tableHead={['ID', 'Name', 'Balance']}
                                                tableData={this.state.data ? this.state.data.arr.filter(e => { return e.subject === obj.sbj[0] }).map(e => {
                                                    return ['' + e.studentID, e.firstname + '(' + e.nickname + ')', '' + e.total];
                                                }) : []}
                                            />
                                        }
                                    />
                                </ItemGrid>
                            )
                        })
                    }
                </Grid>
                <Grid container justify='center'>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <Snack
                            place="br"
                            message={
                                <RegularCard
                                    cardTitle={this.state.cardTitle}
                                    headerColor={"orange"}
                                    content={
                                        <Table
                                            classes={{table:"under2500info"}}
                                            tableHeaderColor="primary"
                                            tableHead={['Date', 'Time', 'Value', 'Balance', 'Reason','Sender']}
                                            tableData={this.state.cardData}
                                        />
                                    }
                                />
                            }
                            open={this.state.open}
                            closeNotification={() => this.setState({ 'open': false })}
                        />
                    </ItemGrid>
                </Grid>

            </div>
        );
    }
}

export default Under2500Table;
