import * as Action from '../actions';

const RESULT_PANEL_INITIAL_DATA =  {
        visible: false,
        title: '',
        content: ''
}

export const resultPanel = (state=RESULT_PANEL_INITIAL_DATA, action) => {
    switch (action.type){
        case Action.SHOW_RESULT_PANEL:
            return { ...state, visible: true, title: action.title, content: action.content };

        case Action.HIDE_RESULT_PANEL:
            return { ...state, ...RESULT_PANEL_INITIAL_DATA };

        default:
            return state
    }
}

