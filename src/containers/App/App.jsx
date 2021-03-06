import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
} from 'material-ui';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {global} from 'variables/general';
import {
    Header, Footer, Sidebar
} from 'components';

import appRoutes from 'routes/app.jsx';
import { appStyle } from 'variables/styles';

import image from 'assets/img/Books.jpg';
import logo from 'assets/img/favicon.ico';

const switchRoutes = (<Switch>
{
    appRoutes.map((prop,key) => {
        if(prop.redirect)
            return (
                <Redirect from={prop.path} to={prop.to} key={key}/>
            );
        return (
            <Route path={prop.path} component={prop.component} key={key}/>
        );
    })
}
</Switch>);

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mobileOpen: false,
        };
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleSearch(){
        let search = document.getElementById("searchField").value
        if(search.length === 6){
            this.props.history.push('/user?id='+search.slice(0,5)+'&subject='+global.keySubject[parseInt(search[5])])
        }else if(search.length === 5){
            this.props.history.push({pathname:'/user',search:'?id='+search.slice(0,5)+'&subject=Math'})
            // this.forceUpdate()
        }
    }
    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };
    getRoute(){
        return this.props.location.pathname !== "/maps";
    }
    componentDidMount(){
        if(window.innerWidth > 991)
        {
            // eslint-disable-next-line
            const ps = new PerfectScrollbar(this.refs.mainPanel);
        }
    }
    componentDidUpdate(){
        this.refs.mainPanel.scrollTop = 0;
    }
    render(){
        const { classes, ...rest } = this.props;
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    routes={appRoutes}
                    logoText={"MonkeyAdmin"}
                    logo={logo}
                    image={image}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color="blue"
                    {...rest}
                />
                <div className={classes.mainPanel} ref="mainPanel">
                    <Header
                        routes={appRoutes}
                        handleDrawerToggle={this.handleDrawerToggle}
                        {...rest}
                        handleSearch={this.handleSearch}
                    />
                    {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
                    {
                        this.getRoute() ?(
                                <div className={classes.content}>
                                    <div className={classes.container}>
                                        {/* {this.state.search?<Redirect to={{pathname:'/user',search:this.state.search}}/>:null} */}
                                        {switchRoutes}
                                    </div>
                                </div>
                            ):(
                                <div className={classes.map}>
                                    {switchRoutes}
                                </div>
                            )
                    }
                    {/* {this.getRoute() ? (<Footer />):(null)} */}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(appStyle, { withTheme: true })(App);
