import React from 'react';
import axios from 'axios';

export default class CustomerList extends React.Component {

  state = {
    show_add_new_form: false,
    editing_record: "",
    customers: [],
    customer: {
        "first_name" : "",
        "last_name" : "",
        "email" : ""
    }
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

  handleShowAddNewForm() {
    const show_add_new_form = !this.state.show_add_new_form;
    this.setState({ show_add_new_form });   
  }

  editCustomer(customer) {
    const editing_record = customer._id;
    this.setState({ editing_record })
  }

  cancelEditCustomer(customer) {
    const editing_record = "";
    this.setState({ editing_record })
  }

  saveEditCustomer(customer) {

    console.log("saving customer " + customer._id);

    let cust = this.state.customers.filter(c => c._id == customer._id);

    let data = { customer: cust[0] };

    var url = "http://localhost:8080/api/customers/";

    this.please_wait = true;

    axios.put(url, data)
    .then((response) => {
      //alert("saved!");
      this.please_wait = false;
      console.log(response);

      this.cancelEditCustomer();

    }, (error) => {
      this.please_wait = false;
      console.log(error);
      alert("Error updating customer.");
    });


  }

  handleEditChange(event) {
    const editing_record = this.state.editing_record;
    const customer = this.state.customers.filter(item => item._id === editing_record);  

    const customers = [...this.state.customers];

    const index = customers.findIndex(cust => cust._id === editing_record);

    if (event.target.name === 'first_name') {
        customers[index].first_name = event.target.value;
    } else if (event.target.name === 'last_name') {
        customers[index].last_name = event.target.value;
    } else if (event.target.name === 'email') {
        customers[index].email = event.target.value;
    }
    
    //customers[index] = customer;
    this.setState({ customers });    
}

  handleChange(event) {
    const customer = this.state.customer;

    if (event.target.name === 'first_name') {
        customer.first_name = event.target.value;
    } else if (event.target.name === 'last_name') {
        customer.last_name = event.target.value;
    } else if (event.target.name === 'email') {
        customer.email = event.target.value;
    }

    this.setState({ customer })
  }

  cancelAddNewCustomer() {
    const customer = this.state.customer;

    customer.first_name = '';
    customer.last_name = '';
    customer.email = '';
    
    this.setState({ customer });

    this.handleShowAddNewForm();
  }

  handleSaveCustomer() {
    const customer = this.state.customer;

    return axios.post('http://localhost:8080/api/customers', customer)
    .then((response) => {
        const customers = this.state.customers;

        customers.push(response.data);

        this.setState({ customers });

        this.cancelAddNewCustomer();
    })
  }

  componentDidMount() {
    this.getCustomers();
  }

  render() {

    let show_add_new_form = this.state.show_add_new_form;
    let editing_record = this.state.editing_record;

    const addFormButton = (!show_add_new_form ?
        <button type="button" onClick={ () => this.handleShowAddNewForm() }>
            Add New Customer
        </button>
    : '');

    const addForm = (show_add_new_form ? 
        <div>

            Firstname:
            <input type="text" name="first_name" value={this.state.customer.first_name}
                onChange={ (event) => this.handleChange(event) }/>
        
            Lastname:
            <input type="text" name="last_name" value={this.state.customer.last_name} 
                onChange={ (event) => this.handleChange(event) }/>
        
            Email:
            <input type="text" name="email" value={this.state.customer.email} 
                onChange={ (event) => this.handleChange(event) }/>

            <button type="button" onClick={ () => this.handleSaveCustomer() }>
                Save
            </button>
            <button type="button" onClick={ () => this.cancelAddNewCustomer() }>
                Cancel
            </button>

        </div>
    : '');


    return (
        <div className='container'>
            <br/>
            <h3>Customer List</h3>
            <br/>
            {addForm}
            {addFormButton}
            <br/>
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
                        editing_record === customer._id ? 
                        <tr key={customer._id}>
                            <td>
                                <input type="text" name="first_name" value={customer.first_name}
                                    onChange={ (event) => this.handleEditChange(event) }/>
                            </td>
                            <td>
                                <input type="text" name="last_name" value={customer.last_name}
                                    onChange={ (event) => this.handleEditChange(event) }/>
                            </td>
                            <td>
                                <input type="text" name="email" value={customer.email}
                                    onChange={ (event) => this.handleEditChange(event) }/>
                            </td>
                            <td>
                                <button onClick={ () => this.cancelEditCustomer(customer) }>
                                    CANCEL
                                </button>
                                <button onClick={ () => this.saveEditCustomer(customer) }>
                                    SAVE
                                </button>
                            </td>
                        </tr>
                        :
                        <tr key={customer._id}>
                            <td>
                                {customer.first_name}
                            </td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>
                                <button onClick={ () => this.deleteCustomer(customer) }>
                                    DELETE
                                </button>
                                <button onClick={ () => this.editCustomer(customer) }>
                                    EDIT
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