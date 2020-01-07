export const SHOW_RESULT_PANEL = 'SHOW_RESULT_PANEL';
export const HIDE_RESULT_PANEL = 'HIDE_RESULT_PANEL';

export const showResultPanel = (title, content) => ({
    type: SHOW_RESULT_PANEL,
    title,
    content
});

export const hideResultPanel = () => ({
    type: HIDE_RESULT_PANEL
});
