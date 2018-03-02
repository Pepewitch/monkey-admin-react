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

function stateReducer(state, changes) {
    // this prevents the menu from being closed when the user
    // selects an item with a keyboard or mouse
    switch (changes.type) {
      case Downshift.stateChangeTypes.mouseUp:
        return {
          ...changes,
          isOpen:false,
          inputValue:state.inputValue,
        }
      default:
        return changes
    }
  }

class HeaderLinks extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open: false,
            searchData: []
        };
    }
    enter = true;
    handleClick = () => {
        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    getSuggestions(inputValue) {
        let sugg = this.state.searchData.filter(suggestion => {
            if(!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) return true;
            else return false
        }).sort((a,b)=>{
            if(a.label.toLowerCase().indexOf(inputValue.toLowerCase())<b.label.indexOf(inputValue.toLowerCase())) return -1;
            else if(a.label.toLowerCase().indexOf(inputValue.toLowerCase())>b.label.indexOf(inputValue.toLowerCase())) return 1;
            else if(a.studentID<b.studentID) return -1
            else if(a.studentID>b.studentID) return 1
            else return 0
        }).slice(0,5);
        return sugg
    }
    renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;
        return (
          <TextField
            {...other}
            style={{width:'330px'}}
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
    handleSearch(){
        this.props.handleSearch()
    }
    render() {
        const { classes } = this.props;
        const { open } = this.state;
        return (
            <div className="headerSearch">
                <FormControl>
                    <Downshift stateReducer={stateReducer} onSelect={(e)=>{this.enter = false;this.props.handleSearch()}}>
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
                <SearchButton color="white" aria-label="edit" customClass={classes.top + " " + classes.searchButton} onClick={()=>{this.handleSearch()}}>
                    <Search className={classes.searchIcon} />
                </SearchButton>
            </div>
        );
    }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
