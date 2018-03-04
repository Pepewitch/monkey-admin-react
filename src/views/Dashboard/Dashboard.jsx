import React from 'react';
import {
    withStyles, Grid , Paper
} from 'material-ui';
import {
    ContentCopy, Store, InfoOutline, Warning, DateRange, LocalOffer, Update, ArrowUpward, AccessTime, Accessibility
} from 'material-ui-icons';
import PropTypes from 'prop-types';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';

import {
    StatsCard, ChartCard, TasksCard, RegularCard, Table, ItemGrid
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
    high: 50,
    chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
    },
    height:'400px'
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.socket = openSocket(global.postlink)
        this.socket.on('timer', (e) => console.log(e))
        this.socket.emit('subscribeToTimer')
        this.state = {
            student: { 8: [], 10: [], 13: [], 15: [], 17: [] }
        };
    }
    componentWillUnmount() {
        this.socket.emit('discon')
    }
    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };
    componentDidMount() {
        this.updateCheckout()
        this.socket.on('updateCheckout', () => { this.updateCheckout() })
    }
    updateCheckout() {
        fetch(global.postlink + '/post/v1/getCheckout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            // body:serialize({studentID:eachRow[0] , subject:remark})
        }).then(data => data.json()).then(data => {
            this.setState({ student: data })
        })
    }
    render() {
        return (
            <div>
                <Grid container>
                    {this.state.student[8].length > 0 ?
                        <ItemGrid md>
                        <ChartCard
                            chart={
                                <ChartistGraph
                                    className="ct-chart"
                                    data={{
                                        labels:["In","Out","Recheck"],
                                        series:[[
                                            this.state.student[8].filter((x)=>{if(!x.checkout) return true; else return false}).length,
                                            this.state.student[8].filter((x)=>{if(x.checkout && !x.recheck) return true; else return false}).length,
                                            this.state.student[8].filter((x)=>{if(x.recheck) return true; else return false}).length,
                                        ]]
                                    }}
                                    type="Bar"
                                    options={chartOption}
                                    responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                    listener={
                                        emailsSubscriptionChart.animation
                                    }
                                />
                            }
                            chartColor="green"
                            title="8.00 น."
                            text="Last Campaign Performance"
                            statIcon={AccessTime}
                            statText="campaign sent 2 days ago"
                        />
                        </ItemGrid> : null}
                    {this.state.student[10].length > 0 ?
                        <ItemGrid md>
                            <ChartCard
                                chart={
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={{
                                            labels:["In","Out","Recheck"],
                                            series:[[
                                                this.state.student[10].filter((x)=>{if(!x.checkout) return true; else return false}).length,
                                                this.state.student[10].filter((x)=>{if(x.checkout && !x.recheck) return true; else return false}).length,
                                                this.state.student[10].filter((x)=>{if(x.recheck) return true; else return false}).length,
                                            ]]
                                        }}
                                        type="Bar"
                                        options={chartOption}
                                        responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                        listener={
                                            emailsSubscriptionChart.animation
                                        }
                                    />
                                }
                                chartColor="orange"
                                title="10.00 น."
                                text="Last Campaign Performance"
                                statIcon={AccessTime}
                                statText="campaign sent 2 days ago"
                            />
                        </ItemGrid> : null}
                    {this.state.student[13].length > 0 ?
                        <ItemGrid md>
                            <ChartCard
                                chart={
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={{
                                            labels:["In","Out","Recheck"],
                                            series:[[
                                                this.state.student[13].filter((x)=>{if(!x.checkout) return true; else return false}).length,
                                                this.state.student[13].filter((x)=>{if(x.checkout && !x.recheck) return true; else return false}).length,
                                                this.state.student[13].filter((x)=>{if(x.recheck) return true; else return false}).length,
                                            ]]
                                        }}
                                        type="Bar"
                                        options={chartOption}
                                        responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                        listener={
                                            emailsSubscriptionChart.animation
                                        }
                                    />
                                }
                                chartColor="red"
                                title="13.00 น."
                                text="Last Campaign Performance"
                                statIcon={AccessTime}
                                statText="campaign sent 2 days ago"
                            />
                        </ItemGrid> : null}
                    {this.state.student[15].length > 0 ?
                        <ItemGrid md>
                            <ChartCard
                                chart={
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={{
                                            labels:["In","Out","Recheck"],
                                            series:[[
                                                this.state.student[15].filter((x)=>{if(!x.checkout) return true; else return false}).length,
                                                this.state.student[15].filter((x)=>{if(x.checkout && !x.recheck) return true; else return false}).length,
                                                this.state.student[15].filter((x)=>{if(x.recheck) return true; else return false}).length,
                                            ]]
                                        }}
                                        type="Bar"
                                        options={chartOption}
                                        responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                        listener={
                                            emailsSubscriptionChart.animation
                                        }
                                    />
                                }
                                chartColor="blue"
                                title="15.00 น."
                                text="Last Campaign Performance"
                                statIcon={AccessTime}
                                statText="campaign sent 2 days ago"
                            />
                        </ItemGrid> : null}
                    {this.state.student[17].length > 0 ?
                        <ItemGrid md>
                            <ChartCard
                                chart={
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={{
                                            labels:["In","Out","Recheck"],
                                            series:[[
                                                this.state.student[17].filter((x)=>{if(!x.checkout) return true; else return false}).length,
                                                this.state.student[17].filter((x)=>{if(x.checkout && !x.recheck) return true; else return false}).length,
                                                this.state.student[17].filter((x)=>{if(x.recheck) return true; else return false}).length,
                                            ]]
                                        }}
                                        type="Bar"
                                        options={chartOption}
                                        responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                        listener={
                                            emailsSubscriptionChart.animation
                                        }
                                    />
                                }
                                chartColor="purple"
                                title="17.00 น."
                                text="Last Campaign Performance"
                                statIcon={AccessTime}
                                statText="campaign sent 2 days ago"
                            />
                        </ItemGrid> : null}
                </Grid>
                {/* <Grid container>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ChartCard
                            chart={
                                <ChartistGraph
                                    className="ct-chart"
                                    data={dailySalesChart.data}
                                    type="Line"
                                    options={dailySalesChart.options}
                                    listener={
                                        dailySalesChart.animation
                                    }
                                />
                            }
                            chartColor="green"
                            title="Daily Sales"
                            text={
                                <span>
                                    <span className={this.props.classes.successText}><ArrowUpward className={this.props.classes.upArrowCardCategory}/> 55%</span> increase in today sales.
                                </span>
                            }
                            statIcon={AccessTime}
                            statText="updated 4 minutes ago"
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ChartCard
                            chart={
                                <ChartistGraph
                                    className="ct-chart"
                                    data={emailsSubscriptionChart.data}
                                    type="Bar"
                                    options={emailsSubscriptionChart.options}
                                    responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                    listener={
                                        emailsSubscriptionChart.animation
                                    }
                                />
                            }
                            chartColor="orange"
                            title="Email Subscriptions"
                            text="Last Campaign Performance"
                            statIcon={AccessTime}
                            statText="campaign sent 2 days ago"
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ChartCard
                            chart={
                                <ChartistGraph
                                    className="ct-chart"
                                    data={completedTasksChart.data}
                                    type="Line"
                                    options={completedTasksChart.options}
                                    listener={
                                        completedTasksChart.animation
                                    }
                                />
                            }
                            chartColor="red"
                            title="Completed Tasks"
                            text="Last Campaign Performance"
                            statIcon={AccessTime}
                            statText="campaign sent 2 days ago"
                        />
                    </ItemGrid>
                </Grid>
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={6}>
                        <TasksCard />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                        <RegularCard
                            headerColor="orange"
                            cardTitle="Employees Stats"
                            cardSubtitle="New employees on 15th September, 2016"
                            content={
                                <Table
                                    tableHeaderColor="warning"
                                    tableHead={['ID','Name','Salary','Country']}
                                    tableData={[
                                        [ '1' , "Dakota Rice" , "$36,738" , "Niger"] ,
                                        [ '2' , "Minerva Hooper" , "$23,789" , "Curaçao" ] ,
                                        [ '3' , "Sage Rodriguez" , "$56,142" , "Netherlands" ] ,
                                        [ '4' , "Philip Chaney" , "$38,735" , "Korea, South" ] ,
                                    ]}
                                />
                            }
                        />
                    </ItemGrid>
                </Grid> */}
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
