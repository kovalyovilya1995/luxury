import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';

import { ModalActivate } from '../ModalActivate';
import { ProductCard } from '../ProductCard';
import { Pagination } from '../Pagination';
import { SIDEBAR_WIDTH } from '../../constants';
import { COLUMNS } from './constants';

import './styles.scss';

export const Products = () => {
  const [searchText, setSearchText] = useState('');
  const [openModalActivate, setOpenModalActivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any>();
  const [openCard, setOpenCard] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getProducts(0, 10);
  }, []);

  const getProducts = async (page: number, size: number) => {
    try {
      setIsLoading(true);

      const url = `/products${
        searchText ? '/text-search' : ''
      }?page=${page}&size=${size}&text=${searchText}&admin=true`;

      const response = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeActivate = async (value: boolean) => {
    if (value && selected) {
      try {
        const active = !selected.active;
        await axios.put(`/products/${selected.id}`, { ...selected, active });
        selected.active = active;
      } catch (error) {
        console.error(error);
      }
    }
    setOpenModalActivate(false);
    setSelected(null);
  };

  const handleSave = (value: any) => {
    // getProducts(0, 10);

    const product = products?.content?.find(({ id }: any) => id === value.id);
    if (product) {
      product.title = value.title;
      product.imageIds = value.imageIds;
      product.imageId = value.imageId;
      product.categories = value.categories;
      product.number = value.number;
    }

    setSelected(null);
    setOpenCard(false);
  };

  const handleOpenCard = (value: any) => {
    setSelected(value);
    setOpenCard(true);
  };

  const handleCloseCard = () => {
    setSelected(null);
    setOpenCard(false);
  };

  const handleShowModalActivate = (value: any) => {
    setOpenModalActivate(true);
    setSelected(value);
  };

  const getCategoryTitles = (categories: any[]) => {
    if (!categories?.length) return '-';

    return categories.map(({ title }) => title).join(', ');
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getProducts(0, 10);

      event.preventDefault();
    }
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
      <div className="products-controls">
        <Box
          component="form"
          sx={{
            '& > :not(style)': {
              my: 0,
              mr: 2,
              width: '25vw',
            },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Поиск"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>
        <Button variant="contained" onClick={() => getProducts(0, 10)}>
          Найти
        </Button>
      </div>
      <ModalActivate
        isOpen={openModalActivate}
        isActive={selected?.active}
        onChangeDelete={handleChangeActivate}
      />
      <ProductCard
        isOpen={openCard}
        onClose={handleCloseCard}
        onSave={handleSave}
        value={selected}
      />
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {!!products?.totalElements && (
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
                      align={index === 7 ? 'right' : 'left'}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.content.map((row: any) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">{row.number}</TableCell>
                    <TableCell align="left">
                      {row.collectionTitle?.trim()}
                    </TableCell>
                    <TableCell align="left">
                      {getCategoryTitles(row.categories)}
                    </TableCell>
                    <TableCell align="left">{row.brand.title}</TableCell>
                    <TableCell align="center">
                      {row.inStock ? 'Да' : 'Нет'}
                    </TableCell>
                    <TableCell align="center">
                      {row.liked ? 'Да' : 'Нет'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={row.active ? 'Активен' : 'Не активен'}>
                        <IconButton
                          aria-label="active"
                          onClick={() => handleShowModalActivate(row)}
                        >
                          {row.active ? (
                            <TaskAltIcon color="success" />
                          ) : (
                            <BlockIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleOpenCard(row)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination count={products.totalElements} getData={getProducts} />
        </Paper>
      )}

      {!products?.totalElements && <div>Товары не найдены</div>}
    </Box>
  );
};
