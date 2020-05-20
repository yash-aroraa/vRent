import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Router } from '../routes';
import axios from 'axios';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true,
        loading: false,
        error: null,
        token: null
    }

    componentDidMount() {
        this.setState({token: localStorage.getItem('token')});
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const authData = {
            email: this.state.controls.email.value, 
            password: this.state.controls.password.value, 
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDR1akncqyuq4hakexAi39cOq2anfvDXUs';
        if(!this.state.isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDR1akncqyuq4hakexAi39cOq2anfvDXUs';
        }
        axios.post(url, authData).then(res => {
                //console.log(res);
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('userId', res.data.localId);
                this.setState({loading: false, token: res.data.idToken});
             })
             .catch(err => {
                //console.log(err);
                this.setState({error: err.response.data.error, loading: false})
             })
    }

    switchAuth = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        })
    }

    render () {

        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }

        let form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                valid={formElement.config.valid}
                validation={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )} />
        ) );

        if(this.state.loading) {
            form = <Spinner/>
        }

        let errorMessage = null;

        if (this.state.error) {
            errorMessage = (
                <p style={{color: '#944317'}}>{this.state.error.message}</p>
            );
        }

        if(this.state.token) {
            const urlParams = new URLSearchParams(window.location.search);
            if(urlParams.has('new'))
                Router.pushRoute('/');
            else
                Router.pushRoute('/rents/new');     
        }

        let heading = null;
        let switchBtn = null;

        if(this.state.isSignUp) {
            heading = <h2 style={{color: '#2565AE'}}>Welcome to the signup page.</h2>
            switchBtn = <Button clicked={this.switchAuth} btnType="Danger">
                            Already a user, sign in!
                        </Button>;
        }
        else {
            heading = <h2 style={{color: '#2565AE'}}>Welcome back, user.</h2>
            switchBtn = <Button clicked={this.switchAuth} btnType="Danger">
                            Not a user, sign up!
                        </Button>;
        }

        

        return (
            <div className='Auth'>
                <style jsx>{`
                    .Auth {
                        margin: 20px auto;
                        width: 80%;
                        text-align: center;
                        box-shadow: 0 2px 3px #ccc;
                        border: 1px solid #eee;
                        padding: 10px;
                        box-sizing: border-box;
                    }

                    @media (min-width: 600px) {
                        .Auth {
                            width: 500px;
                        }
                    }
                `}</style>
                {heading}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                {switchBtn}
            </div>
        );
    }
}

export default Auth;