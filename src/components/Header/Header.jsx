import React from 'react';
import PropTypes from 'prop-types';
import {
    Menu
} from 'material-ui-icons';
import {
    withStyles, AppBar, Toolbar, IconButton, Hidden, Button, Typography, GridList
} from 'material-ui';

import { headerStyle } from 'variables/styles';

import HeaderLinks from './HeaderLinks';

class Header extends React.Component {
    makeBrand() {
        var name;
        this.props.routes.map((prop, key) => {
            if (prop.path === this.props.location.pathname) {
                name = prop.navbarName;
            }
            return null;
        })
        return name;
    }
    render() {
        const { classes, color } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="white">
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
                        <Typography variant="title" color="inherit" style={{ fontSize: "20px" }}>
                            {this.props.location.pathname.slice(1).toUpperCase()}
                        </Typography>
                        <Hidden smDown>
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
