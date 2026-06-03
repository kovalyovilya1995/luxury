import { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export const ModalActivate: FC<any> = ({
  isOpen = false,
  isActive = true,
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
        {isActive &&
          'Деактивированный элемент не отображается клиенту на сайте.'}
        {!isActive &&
          'Активированный элемент будет отображаться клиенту на сайте.'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {isActive && 'Вы уверены, что хотите деактивировать?'}
          {!isActive && 'Вы уверены, что хотите активировать?'}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onChangeDelete(false)}>Нет</Button>
        <Button onClick={() => onChangeDelete(true)} autoFocus>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  );
};
