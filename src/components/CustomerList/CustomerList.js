import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { styles } from './CustomerList.css';
import { tableData } from '../../constants/table-constants'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { withRouter } from 'react-router-dom';


export class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowSelection: null,
            rowData: [],

            visibleRows: {
                firstVisible: {},
                lastVisible: {},
            },

            firstRowId: '',
            lastRowId: '',

            sortDetails: {
                sortValue: 'ayanamsha',
                sortType: 'asc'
            },

            searchField: '',
            searchTracker: false,
            ROW_LIMIT: 5,
            LIMIT: 'limit',
            LIMIT_TO_LAST: 'limitToLast',
            PREVIOUS: 'prev',
            NEXT: 'next',
        }
    }

    fetchQuery = (limitLabel, limitValue = 5, from = 'others') => {

        const { searchField, sortDetails, visibleRows, LIMIT_TO_LAST, PREVIOUS, NEXT, LIMIT } = this.state;
        var query = db.collection("customer");
        if (searchField) { 
            query = query.where('keywords', 'array-contains', searchField.toLowerCase())
        }
        query = query.orderBy(sortDetails.sortValue, sortDetails.sortType);

        return limitLabel === LIMIT_TO_LAST && from === PREVIOUS ?
            query.endBefore(visibleRows.firstVisible).limitToLast(limitValue) :
            limitLabel === LIMIT_TO_LAST ?
                query.limitToLast(limitValue) :
                limitLabel === LIMIT && from === NEXT ?
                    query.startAfter(visibleRows.lastVisible).limit(limitValue) :
                    query.limit(limitValue)

    }



    getRowData = () => {

        const { lastRowId, LIMIT } = this.state;

        const rows = [];
        var query = this.fetchQuery(LIMIT);
        query.get().then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
                querySnapshot.docs.map((item, index) => {
                    item.data() && rows.push({ ...item.data(), id: item.id, 'sno': index + 1 });
                })

                this.setState({
                    rowData: rows,
                    visibleRows: {
                        firstVisible: {},
                        lastVisible: lastRowId !== querySnapshot.docs[querySnapshot.docs.length - 1].id ? querySnapshot.docs[querySnapshot.docs.length - 1] : {},
                    }
                });

            }
            else {
                this.setState({
                    rowData: [],
                });
            }
        })
    }



    updateFirstLastRowID = () => {


        const { LIMIT_TO_LAST, LIMIT } = this.state;

        this.setState({
            firstRowId: '',
            lastRowId: ''
        });

        var firstQuery = this.fetchQuery(LIMIT, 1);
        firstQuery.get().then(querySnapshot => {
            querySnapshot.docs[0] && this.setState({
                firstRowId: querySnapshot.docs[0].id
            })

        });

        var lastQuery = this.fetchQuery(LIMIT_TO_LAST, 1);
        lastQuery.get().then(querySnapshot => {
            querySnapshot.docs[0] && this.setState({
                lastRowId: querySnapshot.docs[0].id
            }, () => {
                this.updateLastRowId();
            })
        });


        const rows = [];
        var resultQuery = this.fetchQuery(LIMIT);
        resultQuery.get().then((querySnapshot) => {

            if (querySnapshot.docs.length > 0) {
                querySnapshot.docs.map((item, index) => {
                    rows.push({ ...item.data(), id: item.id, 'sno': index + 1 });
                })
                this.setState({
                    rowData: rows
                })
            }
            else {
                this.setState({
                    rowData: [],
                });
            }

        })
    }


    updateLastRowId = () => {

        const { LIMIT, lastRowId } = this.state;

        var query = this.fetchQuery(LIMIT);
        query.get().then((querySnapshot) => {

            this.setState({
                visibleRows: {
                    firstVisible: {},
                    lastVisible: querySnapshot.docs.length > 0 && lastRowId !== querySnapshot.docs[querySnapshot.docs.length - 1].id ? querySnapshot.docs[querySnapshot.docs.length - 1] : {}
                }
            })

        })
    }



    previousDocumentsHandler = () => {
        const { LIMIT_TO_LAST, PREVIOUS, firstRowId, lastRowId, ROW_LIMIT } = this.state;

        const rows = [];
        var query = this.fetchQuery(LIMIT_TO_LAST, ROW_LIMIT, PREVIOUS)
        query.get().then((querySnapshot) => {
            querySnapshot.docs.map((item, index) => {
                rows.push({ ...item.data(), id: item.id, 'sno': index + 1 });
            })

            this.setState({
                rowData: rows,
                visibleRows: {
                    firstVisible: firstRowId != querySnapshot.docs[0].id ? querySnapshot.docs[0] : {},
                    lastVisible: lastRowId != querySnapshot.docs[querySnapshot.docs.length - 1].id ? querySnapshot.docs[querySnapshot.docs.length - 1] : {}
                }
            });
        })
    }

    nextDocumentsHandler = () => {
        const { LIMIT, ROW_LIMIT, NEXT, lastRowId } = this.state;

        const rows = [];
        var query = this.fetchQuery(LIMIT, ROW_LIMIT, NEXT)
        query.get().then((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
                querySnapshot.docs.map((item, index) => {
                    rows.push({ ...item.data(), id: item.id, 'sno': index + 1 });
                })

                this.setState({
                    rowData: rows,
                    visibleRows: {
                        firstVisible: querySnapshot.docs[0],
                        lastVisible: querySnapshot.docs.length > 0 && lastRowId != querySnapshot.docs[querySnapshot.docs.length - 1].id ? querySnapshot.docs[querySnapshot.docs.length - 1] : {}
                    }
                });
            }
            else {
                this.setState({
                    rowData: [],
                });
            }


        })
    }

    sortData = (type, field) => {
        this.setState({
            sortDetails: {
                sortValue: field,
                sortType: type
            }
        }, () => {
            this.updateFirstLastRowID();
        });
    }

    searchChangeHandler = (event) => {

        this.setState({
            searchField: event.target.value
        }, () => {
            this.updateFirstLastRowID();
 
            if (this.state.searchField && this.state.searchField == '') {
                this.setState({
                    sortDetails: {
                        sortValue: 'ayanamsha',
                   }
                }, () => {
                    this.getRowData();
                    this.updateFirstLastRowID();
                })
                
            }
        });
    }


    searchHandler = (event, from) => {

        if (event.key === "Enter" || from === 'iconClick') {
            if (this.state.searchField != '') {
                this.updateFirstLastRowID();
            }
        }
    }


    componentWillMount() {
        this.getRowData();
        this.updateFirstLastRowID();
    };


    render() {

        const { classes } = this.props;

        return (
            <div>

                

        <Card style={{ width: '90%', margin: '25px auto', padding: '20px' }}>
      <CardContent style={{position: 'relative', marginBottom: '15px', padding: '0px'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>

      <h2 style={{ margin: '0px auto' }}> Customer List</h2>


<OutlinedInput name={'search'} size="small" placeholder='Search' value={this.state.searchField} onKeyDown={(event) => this.searchHandler(event, '')} onChange={this.searchChangeHandler} className={classes.inputField}
    endAdornment={
        <InputAdornment position="end">
            <IconButton
                type='submit' onClick={(event) => this.searchHandler(event, 'iconClick')}
            >
                <SearchIcon style={{ cursor: 'pointer', color: '#22d1dd' }} />
            </IconButton>
        </InputAdornment>
    } />
</div>
      </CardContent>
      <CardActions>
    
                    <>
                        <TableContainer component={Paper} >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>

                                        {
                                            tableData.map((item, index) => (
                                                <TableCell key={index}>
                                                    <div>
                                                        <strong>{item.headerName}</strong>
                                                        {item.headerName !== 'S.No' ?
                                                            <div>
                                                                <ArrowUpwardIcon style={{ cursor: 'pointer', fontSize: 20, color: '#22d1dd' }} onClick={() => this.sortData('asc', item.field)} />
                                                                <ArrowDownwardIcon style={{ cursor: 'pointer', fontSize: 20, color: '#22d1dd' }} onClick={() => this.sortData('desc', item.field)} />
                                                            </div>
                                                            :
                                                            null
                                                        }


                                                    </div>

                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>

                                {
                                    this.state.rowData && this.state.rowData.length > 0 ?
                                        <TableBody>
                                            {
                                                this.state.rowData.map((data, index) => (
                                                    <TableRow key={index}>

                                                        {
                                                            tableData.map((item, keyIndex) => (
                                                                <TableCell >{
                                                                    item.headerName === 'Name' ?
                                                                        <Link to={{
                                                                            pathname: '/',
                                                                            state: { selectedRow: data.id },
                                                                        }}> {data[item.field]} </Link> :
                                                                        data[item.field]}
                                                                </TableCell>
                                                            ))
                                                        }

                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>
                                        :
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <h2 style={{ textAlign: 'center', width: '100%' }}>No rows to show</h2>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                }
                            </Table>

                            {
                                this.state.rowData && this.state.rowData.length > 0 ?

                                    <div className={classes.paginationArrows}>
                                        <IconButton disabled={this.state.visibleRows.firstVisible && Object.entries(this.state.visibleRows.firstVisible).length <= 0} onClick={this.previousDocumentsHandler}>
                                            <ChevronLeftIcon />
                                        </IconButton>
                                        <IconButton disabled={this.state.visibleRows.lastVisible && Object.entries(this.state.visibleRows.lastVisible).length <= 0} onClick={this.nextDocumentsHandler}>
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </div>
                                    :
                                    null
                            }
                        </TableContainer>


                    </>

        </CardActions>
    </Card>

                </div>
           
        )
    }
}

export default withRouter(withStyles(styles)(CustomerList))

