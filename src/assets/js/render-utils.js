import { html } from 'lit-element';

export const includeStyles = () => {
  return html`
    <link type="text/css" rel="stylesheet" href="${getStylesheetPath('vendor/bootstrap.min.css')}">
    <link type="text/css" rel="stylesheet" href="${getStylesheetPath('vendor/select2.min.css')}">
    <link type="text/css" rel="stylesheet" href="${getStylesheetPath('vendor/select2-bootstrap4.min.css')}">
    <link type="text/css" rel="stylesheet" href="${getStylesheetPath('node_modules/open-iconic/font/css/open-iconic-bootstrap.css')}">
  `;
};
