import { fromJS } from 'immutable';

const initialState = fromJS({
});

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

  default:
    return state;
  }
};

export default rootReducer;
