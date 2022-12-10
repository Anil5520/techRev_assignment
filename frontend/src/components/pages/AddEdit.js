import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AddEdit.css';
import { toast } from 'react-toastify';

const initialState = { firstName: '', lastName: '', userName: '', email: '', phone: '', gender: 'male', password: '', confirmPassword: '', image: '', address: '', landmark: '', city: '', state: '', country: '', zipCode: '' }


const AddEdit = () => {
    const [data, setData] = useState(initialState);
    const [form, setForm] = useState(0);

    const completeForm = () => {
        if (form === 0) {
            setForm(cur => cur + 1);
        } else if (form === 1) {
            setForm(cur => cur - 1);
        }
    }

    const navigate = useNavigate();
    const addCustomer = async (data) => {
        try {
            const resp = await axios.post("http://localhost:3001/insertCustomer", data);
            if (resp.status === 201) {
                toast.success(resp.data.message);
                setTimeout(() => navigate("/", { replace: true }), 500);
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
        }
    }

    const updateCustomer = async (data, id) => {
        try {
            const resp = await axios.put(`http://localhost:3001/updateCustomer/${id}`, data);
            if (resp.status === 200) {
                toast.success(resp.data.message);
                setTimeout(() => navigate("/", { replace: true }), 500);
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
        }
    }


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


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id) {
            addCustomer(data);
        } else {
            updateCustomer(data, id)
        }
    }
    const handleInputChange = (e) => {
        let { name, value } = e.target
        setData({ ...data, [name]: value });
    }

    return (
        <div >
            <form style={{ margin: "auto", padding: "15px", maxWidth: "400px", alignContent: "center" }} onSubmit={handleSubmit}>

                {form < 1 && (
                    <section>
                        <label htmlFor='firstName'>firstName</label>
                        <input type='text' id='firstName' name='firstName' value={data.firstName} placeholder='Enter firstName...' required onChange={handleInputChange} />

                        <label htmlFor='lastName'>lastName</label>
                        <input type='text' id='lastName' name='lastName' placeholder='Enter lastName...' required onChange={handleInputChange} value={data.lastName} />

                        <label htmlFor='userName'>userName</label>
                        <input type='text' id='userName' name='userName' placeholder='Enter userName...' required onChange={handleInputChange} value={data.userName} />

                        <label htmlFor='email'>email</label>
                        <input type='email' id='email' name='email' placeholder='Enter email...' required onChange={handleInputChange} value={data.email} />

                        <label htmlFor='phone'>phone</label>
                        <input type='number' id='phone' name='phone' placeholder='Enter phone...' required onChange={handleInputChange} value={data.phone} />

                        <label htmlFor='gender'>gender</label>
                        <input type='text' id='gender' name='gender' placeholder='Enter gender...' required onChange={handleInputChange} value={data.gender} />

                        <label htmlFor='password'>password</label>
                        <input type='password' id='password' name='password' placeholder='Enter password...' required onChange={handleInputChange} value={data.password} />

                        <label htmlFor='confirmPassword'>confirmPassword</label>
                        <input type='password' id='confirmPassword' name='confirmPassword' placeholder='Enter confirmPassword...' required onChange={handleInputChange} value={data.confirmPassword} />
                        <button className='button-style' type='button' onClick={completeForm}>Next</button>
                    </section>
                )}

                {form > 0 && (
                    <section>
                        <label htmlFor='address'>address</label>
                        <input type='text' id='address' name='address' value={data.address} placeholder='Enter address...' onChange={handleInputChange} />

                        <label htmlFor='landmark'>landmark</label>
                        <input type='text' id='landmark' name='landmark' value={data.landmark} placeholder='Enter landmark...' onChange={handleInputChange} />

                        <label htmlFor='city'>city</label>
                        <input type='text' id='city' name='city' value={data.city} placeholder='Enter city...' onChange={handleInputChange} />

                        <label htmlFor='state'>state</label>
                        <input type='text' id='state' name='state' value={data.state} placeholder='Enter state...' onChange={handleInputChange} />

                        <label htmlFor='country'>country</label>
                        <input type='text' id='country' name='country' value={data.country} placeholder='Enter country...' onChange={handleInputChange} />

                        <label htmlFor='zipCode'>zipCode</label>
                        <input type='text' id='zipCode' name='zipCode' value={data.zipCode} placeholder='Enter zipCode...' onChange={handleInputChange} />
                        <button className='button-style' type='button' onClick={completeForm}>Previous</button>
                        <input type='submit' value={id ? 'Update' : 'Add Customer'} style={{ fontSize: "15.5px" }} />
                    </section>
                )}
            </form>
        </div>
    )
}

export default AddEdit