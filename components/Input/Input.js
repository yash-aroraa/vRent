import React from 'react';

const input = (props) => {
	let inputClasses = ['InputElement'];
	if(props.validation && props.touched && !props.valid) {
		inputClasses.push('Invalid')
	}
	return (
		<div className={'Input'}>
			<style jsx>{`
				.Input {
				    width: 100%;
				    padding: 10px;
				    box-sizing: border-box;
				}

				.Label {
				    font-weight: bold;
				    display: block;
				    margin-bottom: 8px;
				}

				.InputElement {
				    outline: none;
				    border: 1px solid #ccc;
				    background-color: white;
				    font: inherit;
				    padding: 6px 10px;
				    display: block;
				    width: 100%;
				    box-sizing: border-box;
				}

				.InputElement:focus {
				    outline: none;
				    background-color: #ccc;
				}

				.Invalid {
				    border: 1px solid red;
				    background-color: #FDA49A;
				}`}
			</style>
			<label className={'Label'}>{props.label}</label>
			<input 
				className={inputClasses.join(' ')}
				type={props.elementConfig.type}
				placeholder={props.elementConfig.placeholder}
				value={props.value} 
				onChange={props.changed}
			/>
		</div>
	)
}

export default input;