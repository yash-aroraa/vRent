import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import Input from '../../components/Input/Input';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner';
const firebase_url = 'https://locationsender-majorproj.firebaseio.com/names';


class CampaignNew extends Component {

  state = {
    rentForm: {
        showName: {
          label: 'Enter the vehicle\'s name',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Vehicle\'s name'
          },
          sidelabel: "Short Name",
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        minimumSecurity: {
          label: 'Minimum security amount',
          elementConfig: {
            type: 'number',
            placeholder: 'Security amount in wei'
          },
          value: '',
          sidelabel: 'wei',
          validation: {
            required: true,
            isNumber: true
          },
          valid: false,
          touched: false
        },
        description: {
          label: 'Description of your vehicle',
          elementConfig: {
            type: 'text',
            placeholder: 'A brief description of your vehicle'
          },
          value: '',
          sidelabel: 'CompleteDetails',
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        rentPerDay: {
          label: 'Rent per day',
          elementConfig: {
            type: 'number',
            placeholder: 'Per day Rent in Wei'
          },
          value: '',
          sidelabel: 'wei',
          validation: {
            required: true,
            isNumber: true
          },
          valid: false,
          touched: false
        },
    },
    errorMessage: '',
    loading: false,
    isFormValid: false,
    pageloading: true
  };

  componentWillMount() {
    this.setState({pageloading : true})
  }

  componentDidMount() {
    if(!localStorage.getItem('token')) {
      Router.push('/auth')
    }
    this.setState({pageloading : false})
  }

  onSubmit = async event => {

    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const address = await factory.methods.createRent(this.state.rentForm.minimumSecurity.value,this.state.rentForm.description.value,this.state.rentForm.rentPerDay.value,this.state.rentForm.showName.value).call();

    try {
      await ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createRent(this.state.rentForm.minimumSecurity.value,this.state.rentForm.description.value,this.state.rentForm.rentPerDay.value,this.state.rentForm.showName.value)
        .send({
          from: accounts[0]
        });
      //store it in firebase as well
      const obj = {
        [address]: {
          'name': this.state.rentForm.showName.value
        }
      };
      await axios.patch(firebase_url+'.json', obj);
      //console.log(obj);
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  validateField(value, rules) {
    let isValid = true;
    if(rules.required) {
      isValid = (value.trim()!=='');
    }
    if(rules.minLength && isValid) {
      isValid = (value.length>=rules.minLength)
    }
    if(rules.maxLength && isValid) {
      isValid = (value.length<=rules.maxLength)
    }
    if(rules.isNumber && isValid) {
      isValid = (parseInt(value)>0)
    }
    return isValid;
  }

  inputChangeHandler = (event, inputIdentifier) => {
    const updatedRentForm = {
      ...this.state.rentForm
    }
    const updatedField = {
      ...updatedRentForm[inputIdentifier]
    }
    updatedField['value'] = event.target.value
    updatedField['valid'] = this.validateField(event.target.value, updatedField.validation)
    updatedField['touched'] = true
    updatedRentForm[inputIdentifier] = updatedField
    let isFormValid = true;
    for (let inputIdentifier in updatedRentForm) {
      isFormValid = (updatedRentForm[inputIdentifier].valid && isFormValid);
    }
    this.setState({rentForm : updatedRentForm, isFormValid: isFormValid});
  }

  render() {
    const fields = [];
    for(let i in this.state.rentForm) {
      fields.push( {
        id: i,
        ...this.state.rentForm[i]
      } )
    }
    let contents = (
      fields.map( field => {
              return <Input
                label = {field.label}
                value={this.state.rentForm[field.value]}
                key={field.id}
                elementConfig={field.elementConfig}
                validation={field.validation ? true: false}
                changed={event => this.inputChangeHandler(event, field.id)}
                valid={field.valid}
                touched={field.touched}
              />
            }));
    if(this.state.pageloading) {
      contents=<Spinner/>
    }
    return (
      <Layout>
        <h3>Register your vehicle</h3>
        <form onSubmit={this.onSubmit}>
          {contents}
          {this.state.errorMessage ? <Message error header="Oops!" content={this.state.errorMessage} /> : null}
          <Button disabled={!this.state.isFormValid} loading={this.state.loading} style={{marginLeft:'10px',marginTop:'10px'}} secondary>
            Register!
          </Button>
        </form>
      </Layout>
    );
  }
}

export default CampaignNew;
