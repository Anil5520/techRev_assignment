import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './View.css';
import { toast } from 'react-toastify';


const View = () => {

    const [data, setData] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getSingleUser(id);
        }
    }, [id]);

    const getSingleUser = async (id) => {
        try {
            const resp = await axios.get(`http://localhost:3001/selectCustomerById/${id}`);
            if (resp.status === 200) {
                let customer = resp.data.customerDetail;
                let add = resp.data.addressDetail;
                setData({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    userName: customer.userName,
                    email: customer.email,
                    phone: customer.phone,
                    gender: customer.gender,
                    password: customer.password,
                    confirmPassword: customer.password,

                    address: add.address,
                    landmark: add.landmark,
                    city: add.city,
                    state: add.state,
                    country: add.country,
                    zipCode: add.zipCode
                })
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return (
        <div style={{ marginTop: "85px" }}>
            <table className='styled-table' style={{ width:"50%" }}>
                <thead style={{ fontSize: "25px", fontFamily: 'inherit' }}>
                    <tr>
                        <th style={{ textAlign: 'center' }}>Profile</th>
                        <th style={{ textAlign: "center" }}>Address</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'left', fontFamily:'revert', fontSize: '18px', color:"black" }}>
                    <td >
                        <strong>Name: </strong>
                        <span>{data && data.firstName + ' ' + data.lastName}</span>
                        <br />
                        <br />
                        <strong>userName: </strong>
                        <span>{data && data.userName}</span>
                        <br />
                        <br />
                        <strong>email: </strong>
                        <span>{data && data.email}</span>
                        <br />
                        <br />
                        <strong>Mob: </strong>
                        <span>{data && data.phone}</span>
                        <br />
                        <br />
                        <strong>Gender: </strong>
                        <span>{data && data.gender}</span>
                        <br />
                        <br />
                    </td>
                    <td>
                        <strong>Address: </strong>
                        <span>{data && data.address}</span>
                        <br />
                        <br />
                        <strong>landmark: </strong>
                        <span>{data && data.landmark}</span>
                        <br />
                        <br />
                        <strong>City: </strong>
                        <span>{data && data.city}</span>
                        <br />
                        <br />
                        <strong>State: </strong>
                        <span>{data && data.state}</span>
                        <br />
                        <br />
                        <strong>country: </strong>
                        <span>{data && data.country}</span>
                        <br />
                        <br />
                        <strong>zipCode: </strong>
                        <span>{data && data.zipCode}</span>
                        <br />
                        <br />
                    </td>
                </tbody>
            </table>
            <Link to='/'>
                <br />
                <br />
                <button className='btn btn-edit' style={{ backgroundColor: '#2e1e75', color: 'white' }}>Go Back</button>
            </Link>
        </div>
    )
}

export default View
