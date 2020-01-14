import { css } from 'lit-element';

export const ntStyles = css`
  .table {
    min-width: 350px;
  }

  .table-row {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #bbb;
    user-select: none;
  }

  .table-row:hover:not(.header) {
    background-color: cornflowerblue;
    cursor: grab;
  }

  .table-row:active:not(.header) {
    cursor: grabbing;
  }


  .table-row.header > .row-item {
    font-weight: bold;
  }

  .row-item.key {
    width: 45%;
  }

  .row-item.type, .row-item.value {
    width: 25%;
  }

  .row-item {
    white-space: nowrap;
    overflow-x: auto;
    padding: 3px 0;
    display: inline-block;
  }

  .row-item::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    height: 0px;
    background: transparent;  /* optional: just make scrollbar invisible */
  }

  .level-space {
    display: inline-block;
    width: 15px;
    height: 1px;
  }
`;

export const ntSubtableStyles = css`
  .collapsed > .table-row:not(.subtable-header), .collapsed > nt-subtable {
    display: none;
  }

  .wrapper > .subtable-header .caret [icon] {
    cursor: pointer;
    font-size: 12px;
    display: none;
  }

  .wrapper.expanded > .subtable-header .caret [icon$="caret-down"] {
    display: inline-block;
    width: 17px;
  }

  .wrapper.collapsed > .subtable-header .caret [icon$="caret-right"] {
    display: inline-block;
    width: 17px;
  }

  .row-item.array {
    cursor: pointer;
  }

  input[type=text], input[type=number]  {
    border: none;
    background: transparent;
    padding: 3px 5px;
    line-height: normal;
    height: auto;
  }

  input[type=text]:focus, input[type=number]:focus {
    border: none;
    box-shadow: none;
  }

  .form-control:disabled {
    background-color: white;
  }
`;

