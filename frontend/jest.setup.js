import '@testing-library/jest-dom';

// window alert isn't availabl to jest or react-testing-library
window.alert = console.log;
