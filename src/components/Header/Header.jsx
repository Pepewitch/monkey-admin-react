import React from 'react';
import PropTypes from 'prop-types';
import {
    Menu
} from 'material-ui-icons';
import {
    withStyles, AppBar, Toolbar, IconButton, Hidden, Button, Typography, GridList, Tooltip
} from 'material-ui';

import { headerStyle } from 'variables/styles';

import HeaderLinks from './HeaderLinks';
const btnStyle = {
    height: '100%',
    width: '100%',
    boxShadow: '0 2px 2px 0 rgba(153, 153, 153, 0.14), 0 3px 1px -2px rgba(153, 153, 153, 0.2), 0 1px 5px 0 rgba(153, 153, 153, 0.12)',
    border: 'none',
    borderRadius: '3px',
    position: 'relative',
    padding: '8px 30px',
    margin: '5px 1px',
    fontWeight: '400',
    letterSpacing: '0',
    wordWrap: 'break-word',
    willChange: 'box-shadow, transform',
    transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.42857143',
    textAlign: 'center',
    // whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    MsTouchAction: 'manipulation',
    touchAction: 'manipulation',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)',
    }
}
class Header extends React.Component {
    // makeBrand() {
    //     var name;
    //     this.props.routes.map((prop, key) => {
    //         if (prop.path === this.props.location.pathname) {
    //             name = prop.navbarName;
    //         }
    //         return null;
    //     })
    //     return name;
    // }
    render() {
        console.log(this.props.history)
        const { classes, color } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="inherit">
                    <Toolbar>
                        <Hidden mdUp>
                            <IconButton
                                className={classes.appResponsive}
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.props.handleDrawerToggle}>
                                <Menu />
                            </IconButton>
                        </Hidden>
                        <Tooltip id="tooltip-fab" className={classes.fab} title={"Back"}>
                            <Button style={btnStyle} onClick={() => { if (this.props.history.length > 0) this.props.history.goBack() }}>
                                <i class="material-icons">&#xE314;</i>
                            </Button>
                        </Tooltip>
                        <Tooltip id="tooltip-fab" className={classes.fab} title={"Forward"}>
                            <Button style={btnStyle} onClick={() => { if (this.props.history.length > 0) this.props.history.goForward() }}>
                                <i class="material-icons">&#xE5CC;</i>
                            </Button>
                        </Tooltip>
                        <Hidden xsDown>
                            <HeaderLinks handleSearch={this.props.handleSearch} />
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(headerStyle, { withTheme: true })(Header);
