import React, { Component } from 'react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import RentContract from '../../../ethereum/rentContract';
import { Form, Button, Message, Checkbox } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';
import Input from '../../../components/Input/Input';
import Spinner from '../../../components/Spinner/Spinner';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const rents = RentContract(props.query.rentalAddress);
    const summary = await rents.methods.getSummary().call();

    return {
      contractAddress: props.query.rentalAddress,
      managerAddress: summary[0],
      security: summary[1],
      availablity: summary[2],
      description: summary[3],
      popularity: summary[4],
      rentPerDay: summary[5],
      name: summary[6]
    };
  }

  state = {
    contractAddress: this.props.contractAddress,
    rentForm: {
        showName: {
          label: 'Enter the vehicle\'s name',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Vehicle\'s name'
          },
          sidelabel: "Short Name",
          value: this.props.name,
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        minimumSecurity: {
          label: 'Minimum security amount',
          elementConfig: {
            type: 'number',
            placeholder: 'Security amount in wei'
          },
          value: this.props.security,
          sidelabel: 'wei',
          validation: {
            required: true,
            isNumber: true
          },
          valid: true,
          touched: true
        },
        description: {
          label: 'Description of your vehicle',
          elementConfig: {
            type: 'text',
            placeholder: 'A brief description of your vehicle'
          },
          value: this.props.description,
          sidelabel: 'CompleteDetails',
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        rentPerDay: {
          label: 'Rent per day',
          elementConfig: {
            type: 'number',
            placeholder: 'Per day Rent in Wei'
          },
          value: this.props.rentPerDay,
          sidelabel: 'wei',
          validation: {
            required: true,
            isNumber: true
          },
          valid: true,
          touched: true
        }
      },
      errorMessage: '',
      loading: false,
      currentAddress:'',
      isFormValid: true
    };

  componentDidMount = async () => {
    await ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    this.setState({currentAddress: accounts[0]});
  }

  componentDidUpdate = async () => {
    await ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    this.setState({currentAddress: accounts[0]});
  }

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

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      await ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const rents = RentContract(this.state.contractAddress);
      await rents.methods
        .editDetails(this.state.rentForm.showName.value,this.state.rentForm.minimumSecurity.value,this.state.rentForm.description.value,this.state.rentForm.rentPerDay.value)
        .send({
          from: accounts[0]
        });
      Router.replaceRoute(`/rents/${this.props.contractAddress}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

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
                value={this.state.rentForm[field.id]['value']}
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
        <Link route={`/rents/${this.props.contractAddress}`}>
          <a>
            <Button secondary>Back</Button>
          </a>
        </Link>  
        <h3>Edit your vehicle details</h3>

        <form onSubmit={this.onSubmit}>
          {contents}
          {this.state.errorMessage ? <Message error header="Oops!" content={this.state.errorMessage} /> : null}
          <Button 
            loading={this.state.loading} 
            disabled={this.props.managerAddress != this.state.currentAddress || !this.state.isFormValid}
            style={{marginLeft:'10px',marginTop:'10px'}}
            primary>
          Edit!
          </Button>
        </form>

      </Layout>
    );
  }
}

export default RequestIndex;
