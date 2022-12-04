import { combineReducers } from 'redux';
import configureStore from './configureStore';
import { user, reducer as userReducer } from './slices/user';

const initialState = {
  user
}

const reducers = combineReducers({
  user: userReducer,
})

export default configureStore(reducers, initialState)