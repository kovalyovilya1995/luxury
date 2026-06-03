import { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export const ModalHandle: FC<any> = ({
  isOpen = false,
  isHandled = true,
  onChangeDelete = () => {},
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => onChangeDelete(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {isHandled && 'Пометить как необработанный?'}
        {!isHandled && 'Пометить как обработанный?'}
      </DialogTitle>

      <DialogActions>
        <Button onClick={() => onChangeDelete(false)}>Нет</Button>
        <Button onClick={() => onChangeDelete(true)} autoFocus>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  );
};
