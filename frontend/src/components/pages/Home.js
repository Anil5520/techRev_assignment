import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MDBBtn, MDBContainer, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';

const Home = () => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    const [sort, setSort] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageLimit, setPageLimit] = useState(4);

    const sortOption = ["firstName"];

    useEffect(() => {
        getCustomers(0, 4, 0);
    }, [])

    const getCustomers = async (start, end, increase) => {
        try {
            const response = await axios.get(`http://localhost:3001/selectCustomers?start=${start}&end=${end}`);
            if (response.status === 200) {
                setData(response.data.data);
                setCurrentPage(currentPage + increase);
            }
        }
        catch (err) {
            console.log(err.response.data.message);
        }
    }

    const onDelete = async (id) => {
        try {
            if (window.confirm('Do you really want to delete this customer ?')) {
                const resp = await axios.delete(`http://localhost:3001/deleteCustomer/${id}`);
                if (resp.status === 200) {
                    toast.success(resp.data.message);
                    getCustomers();
                }
            }
        }
        catch (err) {
            console.log(err.response.data.message);
        }
    }

    const handleReset = () => {
        getCustomers(0, 4, 0);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        return await axios.get(`http://localhost:3001/selectCustomers?firstName=${value}`)
            .then((response) => {
                setData(response.data.data);
                setValue('');
            })
            .catch((err) => toast.error(err.response.data.message));
    }
    const handleSort = async (e) => {
        let value = e.target.value;
        setSort(value);
        return await axios.get(`http://localhost:3001/selectCustomers?sort=${value}`)
            .then((response) => {
                setData(response.data.data);
            })
            .catch((err) => toast.error(err.response.data.message));
    }

    const renderPagination = () => {
        if (currentPage === 0) {
            return (
                <MDBPagination className='mb-0'>
                    <MDBPaginationItem>
                        <MDBPaginationLink>1</MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBBtn onClick={() => getCustomers(4, 8, 1)}>
                            Next
                        </MDBBtn>
                    </MDBPaginationItem>
                </MDBPagination>
            )
        } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
            return (
                <MDBPagination className='mb-0'>
                    <MDBPaginationItem>
                        <MDBBtn onClick={() => getCustomers((currentPage - 1) * 4, currentPage * 4, -1)}>
                            Prev
                        </MDBBtn>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
                    </MDBPaginationItem>

                    <MDBPaginationItem>
                        <MDBBtn onClick={() => getCustomers((currentPage + 1) * 4, (currentPage + 2) * 4, 1)}>
                            Next
                        </MDBBtn>
                    </MDBPaginationItem>
                </MDBPagination>
            )
        } else {
            return (
                <MDBPagination className='mb-0'>
                    <MDBPaginationItem>
                        <MDBBtn onClick={() => getCustomers((currentPage - 1) * 4, currentPage * 4, -1)}>
                            Prev
                        </MDBBtn>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
                    </MDBPaginationItem>
                </MDBPagination>
            )
        }
    }

    return (
        <MDBContainer>
            <form style={{ margin: 'auto', padding: "15px", maxWidth: "400px", alignContent: "center" }} className='d-flex input-group w-auto' onSubmit={handleSearch}>
                <input type='text' className='form-control' placeholder='Seach Here...' value={value} onChange={(e) => setValue(e.target.value)} />

                <MDBBtn type='submit' color='dark'>
                    Search
                </MDBBtn>
                <MDBBtn className='mx-2' color='info' onClick={() => handleReset()} >
                    Reset
                </MDBBtn>

                <div size='8' style={{ alignContent: "center" }} >
                    <h5>Sort By: </h5>
                    <select style={{ width: "100%", borderRadius: "2px", height: "55%" }}
                        onChange={handleSort}
                        value={sort}
                    >
                        <option>Please Select Value</option>
                        {sortOption.map((item, index) => (
                            <option value={item} key={index}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
            <div style={{ marginTop: '40px' }}>
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>No.</th>
                            <th style={{ textAlign: "center" }}>firstName</th>
                            <th style={{ textAlign: "center" }}>lastName</th>
                            <th style={{ textAlign: "center" }}>userName</th>
                            <th style={{ textAlign: "center" }}>Email</th>
                            <th style={{ textAlign: "center" }}>Phone</th>
                            <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data && data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope='row'>{index + 1}</th>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        <Link to={`/update/${item._id}`}>
                                            <button className='btn btn-edit' style={{ backgroundColor: 'green', color: 'white' }}>Edit</button>
                                        </Link>
                                        <button className='btn btn-delete' style={{ backgroundColor: ' #d82b1f', color: 'white' }} onClick={() => onDelete(item._id)} >Delete</button>
                                        <Link to={`/view/${item._id}`}>
                                            <button className='btn btn-view' style={{ backgroundColor: '#5a2572', color: 'white' }}>View</button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <br />
            <br />
            <div style={{ margin: 'auto', padding: "15px", maxWidth: "240px", alignContent: "center" }}>{renderPagination()}</div>
        </MDBContainer>
    )
}

export default Home