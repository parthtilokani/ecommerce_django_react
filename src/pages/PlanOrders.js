/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// @mui
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  TableSortLabel,
} from '@mui/material';

import { Helmet } from 'react-helmet-async';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Scrollbar from '../components/scrollbar/Scrollbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Plan Name' },
  { id: 'email', label: 'Email' },
  { id: 'order_id', label: 'Order ID' },
  { id: 'amount', label: 'Amount' },
  { id: 'date', label: 'Created On' },
  { id: 'status', label: 'Status' },
];

export default function Users() {
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagesCount, setPagesCount] = useState(0);
  const [fetchedQueries, setFetchedQueries] = useState([false]);

  const {
    data: planOrders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['plan_orders', page, rowsPerPage],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads_plan/ads_plan_order/', {
        params: { page: page + 1, page_size: rowsPerPage },
      });
      setFetchedQueries((prev) => [prev[0], true]);
      setPagesCount(data?.count || 0);
      return data?.results || [];
    },
    enabled: !fetchedQueries[1],
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    (() => refetch())();
  }, [page, rowsPerPage]);

  return (
    <>
      <Helmet>
        <title>Plan Orders | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Plan Orders
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell, id) => (
                      <TableCell key={id} align={'center'}>
                        <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : !planOrders || planOrders?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    planOrders?.map((row) => (
                      <TableRow hover key={row.id} tabIndex={-1}>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.ads_plan_id?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.user_id?.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.order_payment_id}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.order_amount}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.order_date}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row.isPaid ? 'Paid' : 'Failed'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={pagesCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
