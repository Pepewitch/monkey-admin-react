import React from 'react';
import {Redirect,Switch} from 'react-router-dom';
import {
    Person, Notifications, Dashboard, Search,
} from 'material-ui-icons';
import classNames from 'classnames';
import {
    withStyles, IconButton, MenuItem, MenuList, Grow, Paper, ClickAwayListener, Hidden, TextField, FormControl
} from 'material-ui';
import { Manager, Target, Popper } from 'react-popper';
import { CustomInput, IconButton as SearchButton, IntegrationDownshift } from 'components';
import Downshift from 'downshift';
import { headerLinksStyle } from 'variables/styles';
import { global, serialize } from 'variables/general';
const searchStyle = {
    borderRadius: '3px',
    border: '0',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
    top: '100%',
    zIndex: '1000',
    minWidth: '160px',
    padding: '5px 0',
    margin: '2px 0 0',
    fontSize: '14px',
    textAlign: 'left',
    listStyle: 'none',
    backgroundColor: '#fff',
    WebkitBackgroundClip: 'padding-box',
    backgroundClip: 'padding-box',
}

class HeaderLinks extends React.Component {
    state = {
        open: false,
        searchData: []
    };
    enter = true;
    handleClick = () => {
        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    getSuggestions(inputValue) {
        let count = 0;
        return this.state.searchData.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) &&
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }
    renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;
        return (
          <TextField
            {...other}
            style={{width:'450px'}}
            inputRef={ref}
            onKeyUp = {(e)=>{
                if(e.which === 13){
                    if(this.enter) this.props.handleSearch()
                    this.enter = true
                } 
            }}
            InputProps={{
              ...InputProps,
            }}
          />
        );
      }
    renderSuggestion(params) {
        const { suggestion, index, itemProps, highlightedIndex, selectedItem } = params;
        const isHighlighted = highlightedIndex === index;
        const isSelected = selectedItem === suggestion.label;
        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.label}
            </MenuItem>
        );
    }
    componentDidMount() {
        if(this.state.searchData.length===0)
            fetch(global.postlink + '/post/allStudent', { method: "POST" }).then(data => data.json()).then(data => {
                console.log(data)
                for (let i = 0; i < data.student.length; i++) data.student[i].label = data.student[i].studentID + ' : ' + data.student[i].firstname + '(' + data.student[i].nickname + ')'
                this.setState({ searchData: data.student })
            })
    }

    render() {
        const { classes } = this.props;
        const { open } = this.state;
        return (
            <div className="headerSearch">
                <FormControl>
                    <Downshift onSelect={(e)=>{this.enter = false;this.props.handleSearch()}}>
                        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
                            return (
                                <div>
                                    {this.renderInput({
                                        InputProps: getInputProps({
                                        placeholder: 'Search a user',
                                        id: 'searchField',
                                        }),
                                    })}
                                    {(isOpen && inputValue.length > 0) ? (
                                        <Paper square className={"searchPaper"}>
                                            {this.getSuggestions(inputValue).map((suggestion, index) =>
                                                this.renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({ item: suggestion.studentID }),
                                                    highlightedIndex,
                                                    selectedItem,
                                                }),
                                            )}
                                        </Paper>
                                    ) : null}
                                </div>
                            )
                        }
                        }
                    </Downshift>
                </FormControl>
                <SearchButton color="white" aria-label="edit" customClass={classes.top + " " + classes.searchButton} onClick={()=>{this.props.handleSearch()}}>
                    <Search className={classes.searchIcon} />
                </SearchButton>
            </div>
        );
    }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
