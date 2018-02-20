import React from 'react';
import {
    withStyles, Card, CardHeader, CardContent, CardActions, Typography
} from 'material-ui';
import PropTypes from 'prop-types';
import { profileCardStyle } from 'variables/styles';
import Noimg from 'assets/img/faces/no-img.gif';
class ProfileCard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            avatar : Noimg
        }
    }
    componentDidMount(){
        if(this.props.avatar && this.props.avatar!=this.state.avatar) this.setState({avatar:this.props.avatar})
    }
    render(){
        const { classes, subtitle, title, description, footer, avatar ,content} = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader
                    classes={{
                        root: classes.cardHeader,
                        avatar: classes.cardAvatar,
                    }}
                    avatar={
                        <img src={avatar} className={classes.img}/>
                    }
                />
                <CardContent className={classes.textAlign}>
                    {subtitle !== undefined ? (<Typography component="h6" className={classes.cardSubtitle}>
                        {subtitle}
                    </Typography>):null}
                    {title !== undefined ? (<Typography component="h4" className={classes.cardTitle}>
                        {title}
                    </Typography>):null}
                    {description !== undefined ? (<Typography component="p" className={classes.cardDescription}>
                        {description}
                    </Typography>):null}
                    {content}
                </CardContent>
                <CardActions className={classes.textAlign + " " + classes.cardActions}>
                    {footer}
                </CardActions>
            </Card>
        );
    }
}

ProfileCard.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    description: PropTypes.node,
    footer: PropTypes.node,
    avatar: PropTypes.string
};

export default withStyles(profileCardStyle)(ProfileCard);
