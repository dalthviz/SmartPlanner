//Codigo del paquete react-global-object, que por alguna razon al hacerle npm install e intentar correrlo no compilaba

import React from 'react';

class state {
	constructor() {
		this.state = {};
		this.subscriptions = [];
	}

	subscribe(cb) {
		this.subscriptions.push(cb);
		return this.subscriptions.lastIndexOf(cb);
	}

	unsubscribe(handle) {
		delete this.subscriptions[handle];
	}

	setState(obj) {
		this.state =  Object.assign({}, this.state, obj);
		this.subscriptions.forEach((cb) => {
			if(cb) {
				cb();
			}
		})
	}
}

const globState = new state();

const gs = (Component) => {
	  return class GlobalState extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				state: {}
			}
		}

		componentDidMount() {
			this.subsHandle = globState.subscribe(this.handleChange.bind(this));
		}

		componentWillUnmount() {
			globState.unsubscribe(this.subsHandle);
		}

		handleChange() {
			this.setState({ state: globState.state });
		}

		render() {
      		return <Component {...this.props} state={this.state.state} setState={globState.setState.bind(globState)} />
    	}
  }
}

export {gs};