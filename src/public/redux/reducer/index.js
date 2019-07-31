import { combineReducers } from 'redux';

// import all reducers
import login 		from './Login';

// combine thems 
const appReducer = combineReducers({
	login : login, //shorthand from notes:notes	 	
})

export default appReducer; 