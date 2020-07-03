import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

// this jus to not be reapeting the same code in the filse every thing
// I put insede then i will full this spaces so the children is
// the component
export default function MyButton({ placement, children, onClick, tip, btnClassName, tipClassName }) {
  return (
    <Tooltip title={tip} className={tipClassName} placement={placement}>
      <IconButton onClick={onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  )
}
