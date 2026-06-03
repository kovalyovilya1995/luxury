import { FC, useState, ChangeEvent } from 'react';

import TablePagination from '@mui/material/TablePagination';

export const Pagination: FC<any> = ({ count, getData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    getData(0, +event.target.value);
  };

  const labelDisplayedRows = ({ from, to, count }: any) => {
    return `${from}–${to} из ${count !== -1 ? count : `больше чем ${to}`}`;
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      labelRowsPerPage="Количество элементов"
      labelDisplayedRows={labelDisplayedRows}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};
