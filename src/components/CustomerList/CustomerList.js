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
import { FormControl, FormControlLabel, Grid, MenuItem, RadioGroup, TextField } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import { db } from '../../firebase/firebaseConfig'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
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

            searchValue: {
                date: '',
                time: '',
                day: null,
                month: null,
                year: null,
                hour: null,
                min: null,
                seconds: null,
                lat: null,
                lon: null,
                tzone: null,
                ayanamsha: '',
                place: '',
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

        const { searchField, searchValue, sortDetails, visibleRows, LIMIT_TO_LAST, PREVIOUS, NEXT, LIMIT } = this.state;
        var query = db.collection("customer");
        if (searchField && searchValue[searchField]) {
            query = query.where(searchField, '==', `${searchValue[searchField]}`)
        }

        console.log(searchField, searchValue, searchValue[searchField]);
        query = query.orderBy(sortDetails.sortValue, sortDetails.sortType)

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
        console.log(LIMIT);
        var query = this.fetchQuery(LIMIT);
        console.log(query);
        query.get().then(querySnapshot => {
            console.log(querySnapshot.docs.length);
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

        console.log("Inside")

        const { LIMIT_TO_LAST, LIMIT } = this.state;

        this.setState({
            firstRowId: '',
            lastRowId: ''
        });

        var firstQuery = this.fetchQuery(LIMIT, 1);
        console.log(firstQuery);
        firstQuery.get().then(querySnapshot => {
            console.log(querySnapshot);

            querySnapshot.docs[0] && this.setState({
                firstRowId: querySnapshot.docs[0].id
            }, () =>{
                console.log("Inside firstrow id call back");
            })

        });

        var lastQuery = this.fetchQuery(LIMIT_TO_LAST, 1);
        lastQuery.get().then(querySnapshot => {
            console.log(querySnapshot.docs.length);

            querySnapshot.docs[0] && this.setState({
                lastRowId: querySnapshot.docs[0].id
            }, () => {
                this.updateLastRowId();
            })
        });


        const rows = [];
        var resultQuery = this.fetchQuery(LIMIT);
        resultQuery.get().then((querySnapshot) => {
            console.log(querySnapshot.docs.length);

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

    // }, [searchTracker, sortDetails])

    updateLastRowId = () => {

        const { LIMIT_TO_LAST, LIMIT, lastRowId } = this.state;

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
    // }, [lastRowId])


    updateSearchValue = () => {

        const { searchValue, searchTracker } = this.state;


        if (Object.values(searchValue).includes('')) {
            this.setState({
                searchTracker: !searchTracker,
            }, () => {
                this.updateFirstLastRowID();
            })
        }
    }

    // }, [searchValue])


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
        }, () =>{
            this.updateFirstLastRowID();
        });
    }

    searchChangeHandler = (event) => {
        this.setState({
            searchValue: {
                [event.target.name]: event.target.value
            }
        });
    }


    searchHandler = (event, from, field) => {
        const { searchValue, searchTracker } = this.state;

        console.log("Inside search ", !Object.values(searchValue).includes('') )

        if (event.key === "Enter" || from === 'iconClick') {
            console.log("Inside search if")
            if (!Object.values(searchValue).includes('')) {
                console.log("Inside search if includes")
                this.setState({
                    searchField: field,
                    searchTracker: !searchTracker
                }, () => {
                    console.log("Inside search callback", this.state.searchValue, this.state.searchField);
                    this.updateFirstLastRowID();
                });
            }
        }
    }


    componentWillMount() {

        this.getRowData();
        this.updateFirstLastRowID();


       
        // db.collection('customer').onSnapshot(querySnapshot =>{

        //     if(querySnapshot.docs.length>0){
        //         const rows = [];
        //         querySnapshot.docs.map((item, index) =>{
        //             item.data() && rows.push({ ...item.data(), id: item.id, 'sno': index + 1 });
        //         })
        //         this.setState({
        //             ...this.state,
        //             rowData: rows
        //         });
        //     }
        // })
    };

    viewHandler = () => {
        console.log(this.state.rowSelection);
        this.props.history.push({
            pathname: '/',
            state: { selectedRow: this.state.rowSelection },
        });
    }


    render() {

        console.log("rowData=>", this.state.rowData)
        const changeHandler = (event, rowData) => {
            this.setState({
                ...this.state,
                rowSelection: rowData.id,
            })
        }

        const { classes } = this.props;

        console.log("First and lst row id", this.state.firstRowId, this.state.lastRowId)



        return (
            <div>
                <div style={{ width: '90%', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center' }}> Customer List</h2>

                    <button className="pt_button w100p" onClick={this.viewHandler}>View</button>
                    <>
                        <TableContainer component={Paper} >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>

                                        {
                                            tableData.map((item, index) => (
                                                <TableCell key={index}>
                                                    <div>
                                                        <strong>{item.headerName}</strong>
                                                        {/* {item.headerName !== 'S.No' ?
                                                            <div>
                                                                <ArrowUpwardIcon style={{ cursor: 'pointer', fontSize: 20, color: '#22d1dd' }} onClick={() => this.sortData('asc', item.field)} />
                                                                <ArrowDownwardIcon style={{ cursor: 'pointer', fontSize: 20, color: '#22d1dd' }} onClick={() => this.sortData('desc', item.field)} />
                                                            </div>
                                                            :
                                                            null
                                                        } */}


                                                    </div>

                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                    {/* <TableRow>
                                    <TableCell></TableCell>
                                        {
                                            tableData.map((item, index) => (
                                                <TableCell>{
                                                    item.headerName !== 'S.No' ?
                                                        <div>

                                                            <Input name={item.field} value={this.state.searchValue[item.field]} onKeyDown={(event) => this.searchHandler(event, '', item.field)} onChange={this.searchChangeHandler} className={classes.inputField}
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            type='submit' onClick={(event) => this.searchHandler(event, 'iconClick', item.field)}
                                                                        >
                                                                            <SearchIcon style={{ cursor: 'pointer', color: '#22d1dd' }} />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                } />
                                                        </div>
                                                        :
                                                        null
                                                }
                                                </TableCell>
                                            ))
                                        }

                                    </TableRow> */}
                                </TableHead>

                                {
                                    this.state.rowData && this.state.rowData.length > 0 ?
                                        <TableBody>
                                            {
                                                this.state.rowData.map((data, index) => (
                                                    <TableRow key={index}>

                                                        <TableCell >
                                                            <FormControl component="fieldset">
                                                                <RadioGroup aria-label="selection" className={[classes.textInputs, classes.radioGroupStyles].join(' ')} row={true} value={this.state.rowSelection} onChange={(event) => changeHandler(event, data)}>
                                                                    <FormControlLabel
                                                                        control={<Radio checked={this.state.rowSelection === data.id} value={this.state.rowSelection} name="rowSelection" color="primary" />}

                                                                        labelPlacement="end"
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </TableCell>


                                                        {
                                                            tableData.map((item, keyIndex) => (
                                                                <TableCell >{item.headerName === 'Actions' ?
                                                                    <div className={classes.actionIcons}>
                                                                        {/* <EditIcon style={{ cursor: 'pointer', marginRight: '10px', color: '#22d1dd' }} onClick={() => editHandler(data)} />
                                                                <DeleteIcon style={{ cursor: 'pointer', marginLeft: '10px', color: '#22d1dd' }} onClick={() => deleteHandler(data)} /> */}
                                                                    </div> :
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

                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(CustomerList))




{/* <Grid item className={classes.employeeDetail}>
<strong className={classes.formLabel}>Gender: </strong>
<FormControl component="fieldset">
  <RadioGroup aria-label="gender" className={[classes.textInputs, classes.radioGroupStyles].join(' ')} row={true} value={formValues.gender} onChange={changeHandler}>
    <FormControlLabel
      control={<Radio checked={formValues.gender === 'M'} value="M" name="gender" color="primary" />}
      label="Male"
      labelPlacement="end"
    />
    <FormControlLabel
      control={<Radio checked={formValues.gender === 'F'} value="F" name="gender" color="primary" />}
      label="Female"
      labelPlacement="end"
    />
  </RadioGroup>
</FormControl>
</Grid> */}