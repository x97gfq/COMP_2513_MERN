import React from 'react';
import axios from 'axios';

export default class CustomerList extends React.Component {

  state = {
    customers: []
  }

  deleteCustomer(customer) {
    console.log("delete customer");

    axios.delete("http://localhost:8080/api/customers/" + customer['_id'])
    .then((response) => {
        const customers = this.state.customers.filter(item => item._id !== customer['_id']);  
        this.setState({ customers });
    })
  }

  getCustomers() {
    axios.get('http://localhost:8080/api/customers')
      .then(res => {
        const customers = res.data;
        this.setState({ customers });
      })
  }

  componentDidMount() {
    this.getCustomers();
  }

  render() {

    return (
        <div className='container'>
            <br/>
            <h3>Customer List</h3>
            <br/>
            <table className='table table-bordered table-striped'>
                <thead>
                    <tr>
                        <th>Firstname</th><th>Lastname</th><th>Email</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.customers
                    .map(customer =>
                        <tr key={customer._id}>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>
                                <button onClick={ () => this.deleteCustomer(customer) }>
                                    DELETE
                                </button>

                            </td>
                        </tr>
                    )
                }
                </tbody>
                <tfoot></tfoot>
            </table>
        </div>
    )
  }
}