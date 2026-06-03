import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import CircularProgress from '@mui/material/CircularProgress';

import { ModalDelete } from '../ModalDelete';
import { ModalHandle } from '../ModalHandle';
import { Pagination } from '../Pagination';
import { SIDEBAR_WIDTH } from '../../constants';
import { COLUMNS } from './constants';

export const Feedback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any>();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openModalActivate, setOpenModalActivate] = useState(false);

  useEffect(() => {
    getFeedback(0, 10);
  }, []);

  const getFeedback = async (page: number, size: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/order?page=${page}&size=${size}`);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeDelete = async (value: boolean) => {
    if (value && selected) {
      try {
        await axios.delete(`/order/${selected.id}`);
        getFeedback(0, 10);
      } catch (error) {
        console.error(error);
      }
    }
    setOpenModalDelete(false);
    setSelected(null);
  };

  const handleChangeActivate = async (value: boolean) => {
    if (value && selected) {
      try {
        const handled = !selected.handled;

        await axios.put(`/order/${selected.id}`, { ...selected, handled });
        selected.handled = handled;
      } catch (error) {
        console.error(error);
      }
    }
    setOpenModalActivate(false);
    setSelected(null);
  };

  const handleShowModalDelete = (value: any) => {
    setOpenModalDelete(true);
    setSelected(value);
  };

  const handleShowModalActivate = (value: any) => {
    setOpenModalActivate(true);
    setSelected(value);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
      }}
    >
      <Toolbar />
      <ModalDelete
        isOpen={openModalDelete}
        onChangeDelete={handleChangeDelete}
      />
      <ModalHandle
        isOpen={openModalActivate}
        isHandled={selected?.handled}
        onChangeDelete={handleChangeActivate}
      />
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {!!orders?.totalElements && (
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            display: isLoading ? 'none' : 'block',
          }}
        >
          <TableContainer sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {COLUMNS.map((column, index) => (
                    <TableCell
                      key={column.id}
                      align={index === 4 ? 'right' : 'left'}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.content.map((row: any) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">
                      {row.product?.title || 'Запрос на шторы'}
                    </TableCell>
                    <TableCell align="left">
                      {row.phone ? '+' + row.phone : '-'}
                    </TableCell>
                    <TableCell align="left">{row.email || '-'}</TableCell>
                    <TableCell align="left">
                      {dayjs(row.created).format('DD.MM.YYYY HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={row.handled ? 'Обработанный' : 'Не обработанный'}
                      >
                        <IconButton
                          aria-label="handled"
                          onClick={() => handleShowModalActivate(row)}
                        >
                          {row.handled ? (
                            <TaskAltIcon color="success" />
                          ) : (
                            <BlockIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleShowModalDelete(row)}
                        >
                          <DeleteIcon sx={{ color: 'var(--red)' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination count={orders.totalElements} getData={getFeedback} />
        </Paper>
      )}
    </Box>
  );
};
