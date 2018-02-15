import React from 'react';
import {
    withStyles, Table, TableHead, TableRow, TableBody, TableCell
} from 'material-ui';
import PropTypes from 'prop-types';

import { tableStyle } from 'variables/styles';

class CustomTable extends React.Component {
    render(){
        const { classes, tableHead, tableData, tableHeaderColor , handleClick , remark , bodyStyle} = this.props;
        return (
            <div className={classes.table}>
                <Table>
                    {
                        tableHead !== undefined ? (
                            <TableHead className={classes[tableHeaderColor+"TableHeader"]}>
                                <TableRow>
                                    {
                                        tableHead.map((prop,key) => {
                                            return (
                                                <TableCell
                                                    className={classes.tableHeadCell}
                                                    key={key}>
                                                    {prop}
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                        ):null
                    }
                    <TableBody>
                        {
                            tableData.map((prop,key) => {
                                let eachRow = prop
                                return (
                                    <TableRow key={key} className={classes.tableRow} onClick={(e)=>{if(handleClick){handleClick(e,eachRow,remark)}}} >
                                        {
                                            prop.map((prop,key) => {
                                                return (
                                                    <TableCell
                                                        className={classes.tableCell}
                                                        key={key}>
                                                        {prop}
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

CustomTable.defaultProps = {
    tableHeaderColor: 'gray'
}

CustomTable.propTypes = {
    classes: PropTypes.object.isRequired,
    tableHeaderColor: PropTypes.oneOf(['warning','primary','danger','success','info','rose','gray']),
    tableHead: PropTypes.arrayOf(PropTypes.string),
    tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(tableStyle)(CustomTable);
