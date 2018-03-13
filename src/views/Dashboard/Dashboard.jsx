import React from 'react';
import {
    withStyles, Grid, Paper, Table, TableHead, TableRow, TableCell, Tooltip, Button, GridList, TableBody
} from 'material-ui';
import {
    ContentCopy, Store, InfoOutline, Warning, DateRange, LocalOffer, Update, ArrowUpward, AccessTime, Accessibility
} from 'material-ui-icons';
import PropTypes from 'prop-types';
// react plugin for creating charts
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import {
    StatsCard, ChartCard, TasksCard, RegularCard, ItemGrid, DashboardDialog
} from 'components';

import {
    dailySalesChart,
    emailsSubscriptionChart,
    completedTasksChart
} from 'variables/charts';
import { dashboardStyle } from 'variables/styles';
import { global, serialize } from 'variables/general'
import openSocket from 'socket.io-client';
const chartOption = {
    axisX: {
        showGrid: false
    },
    low: 0,
    high: 40,
    chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
    },
    axisY:{
        type : Chartist.FixedScaleAxis,
        ticks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
    },
    height: '400px',
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.socket = openSocket(global.postlink)
        this.socket.on('timer', (e) => console.log(e))
        this.socket.emit('subscribeToTimer')
        this.state = {
            student: { 8: { total: [] }, 10: { total: [] }, 13: { total: [] }, 15: { total: [] }, 17: { total: [] } }
        };
    }
    componentWillUnmount() {
        this.socket.emit('discon')
    }
    componentDidMount() {
        this.updateCheckout()
        this.socket.on('updateCheckout', () => { this.updateCheckout() })
    }
    updateCheckout(d) {
        let date = d ? d : new Date()
        // date.setDate(4)
        fetch(global.postlink + '/post/v1/getCheckout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: serialize({ date: date.toString() })
        }).then(data => data.json()).then(data => {
            let empty = true;
            for (let i in data) if (data[i].length > 0) empty = false;
            if (!empty) {
                for (let i in data) {
                    data[i].sort((a,b)=>{
                        if(a.studentID<b.studentID) return -1;
                        if(a.studentID==b.studentID){
                            return 0
                        }else return 1
                    })
                    let temp = {
                        in: data[i].filter((x) => { if (!x.checkout) return true; else return false }),
                        out: data[i].filter((x) => { if (x.checkout && !x.recheck) return true; else return false }),
                        recheck: data[i].filter((x) => { if (x.recheck) return true; else return false }),
                        total: data[i]
                    }
                    data[i] = temp
                }
                this.updateDate = new Date()
                this.setState({ student: data, selectDay: date })
            } else {
                date.setDate(date.getDate() + 1)
                this.updateCheckout(date)
            }
        })
    }
    render() {
        let time = [8, 10, 13, 15, 17]
        let chartColor = ["green", "orange", "red", "purple", "blue"]
        let option = ["In", "Out", "Recheck", "Total"]
        let md = true;
        let xorTime
        if (this.state.student[8].total.length > 0 != this.state.student[10].total.length > 0 != this.state.student[13].total.length > 0 != this.state.student[15].total.length > 0 != this.state.student[17].total.length > 0) {
            md = 4
            for (let i in this.state.student) if (this.state.student[i].total.length > 0) xorTime = i
        }
        return (
            <div>
                <Grid container>
                    {
                        time.map((i, key) => {
                            return this.state.student[i].total.length > 0 ?
                                <ItemGrid md={md} key={key}>
                                    <ChartCard
                                        chart={
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={{
                                                    labels: ["In", "Out", "Recheck"],
                                                    series: [[
                                                        this.state.student[i].in.length,
                                                        this.state.student[i].out.length,
                                                        this.state.student[i].recheck.length,
                                                    ]]
                                                }}
                                                type="Bar"
                                                options={chartOption}
                                                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                            // listener={
                                            //     emailsSubscriptionChart.animation
                                            // }
                                            />
                                        }
                                        chartColor={chartColor[key]}
                                        title={i + ".00 น. " + this.state.selectDay.toString().split(' ').slice(0,3).join(' ')}
                                        text={<div>
                                            <Table>
                                                <TableBody>
                                                    {option.map((j, keyj) => {
                                                        return <TableRow key={key + '' + keyj}>
                                                            <TableCell>
                                                                <DashboardDialog title={j + " : " + i + ".00 น"} content={
                                                                    <Table className={"dashboardInformation"}>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>StudentID</TableCell>
                                                                                <TableCell>Subject</TableCell>
                                                                                <TableCell>Name</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {this.state.student[i][j.toLowerCase()].map((e) => {
                                                                                return <TableRow key={i + '' + j + e.studentID + e.subject}>
                                                                                    <TableCell>{e.studentID}</TableCell>
                                                                                    <TableCell>{e.subject}</TableCell>
                                                                                    <TableCell>{e.firstname + ' (' + e.nickname + ')'}</TableCell>
                                                                                </TableRow>
                                                                            })}
                                                                        </TableBody>
                                                                    </Table>
                                                                }
                                                                    buttonText={j}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                {this.state.student[i][j.toLowerCase()].length}
                                                            </TableCell>
                                                        </TableRow>
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>}
                                        statIcon={AccessTime}
                                        statText={this.updateDate ? this.updateDate.toString() : ""}
                                    />
                                </ItemGrid> : null
                        })
                    }
                    {
                        md == 4 ?
                            <ItemGrid md={8}>
                                <RegularCard
                                    cardTitle="Information"
                                    headerColor="orange"
                                    content={
                                        <div className={"dashboardInformation"}>
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>StudentID</TableCell>
                                                    <TableCell>Subject</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.student[xorTime].total.map((e,key)=>{
                                                    return <TableRow key={key}>
                                                        <TableCell>{e.studentID}</TableCell>
                                                        <TableCell>{e.subject}</TableCell>
                                                        <TableCell>{e.firstname+' ('+e.nickname+')'}</TableCell>
                                                        <TableCell>{e.recheck?"recheck":e.checkout?"out":"in"}</TableCell>
                                                        </TableRow>
                                                })}
                                            </TableBody>
                                        </Table>
                                        </div>
                                    }
                                />
                            </ItemGrid>
                            : null
                    }
                </Grid>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
