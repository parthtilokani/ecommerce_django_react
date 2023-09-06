/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

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
  Button,
  Modal,
  Box,
} from '@mui/material';

import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Scrollbar from '../components/scrollbar/Scrollbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'action', label: 'Action' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteCategoryToast = ({ closeToast, deleteCategory }) => (
  <div>
    <p>Delete Contact Request?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function ContactRequests() {
  const axiosPrivate = useAxiosPrivate();

  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagesCount, setPagesCount] = useState(0);
  const [fetchedQueries, setFetchedQueries] = useState(false);

  const {
    data: planOrders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['contact_requests', page, rowsPerPage],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/user/contact_us', {
        params: { page: page + 1, page_size: rowsPerPage },
      });
      setFetchedQueries(true);
      setPagesCount(data?.count || 0);
      return data || [];
    },
    enabled: !fetchedQueries[1],
  });
  const { mutate: deleteCategory, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/user/contact_us/${id}`),
    onSuccess: () => {
      toast.success('Contact Request deleted!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRequest({});
  };

  useEffect(() => {
    (() => refetch())();
  }, [page, rowsPerPage]);

  const handleDelete = (idx) => {
    toast(<DeleteCategoryToast deleteCategory={() => deleteCategory(idx)} />);
  };

  return (
    <>
      <Helmet>
        <title>Contact Requests | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Contact Requests
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
                      <TableCell align="center" colSpan={6}>
                        <Typography variant="subtitle2" noWrap>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : !planOrders?.results || planOrders?.results?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    planOrders?.results?.map((row) => (
                      <TableRow hover key={row.id} tabIndex={-1}>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {row?.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            className="me-2"
                            onClick={() => {
                              handleOpen();
                              setRequest(row);
                            }}
                          >
                            View
                          </Button>
                          <Button variant="contained" onClick={() => handleDelete(row.id)} disabled={isDeleting}>
                            Delete
                          </Button>
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

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <h5>Contact Request</h5>
            </div>
            <hr />

            <div>
              <div className="fw-bold d-flex">
                <div style={{ width: '80px' }}>Name</div> : {request?.name}
              </div>
              <div className="fw-bold d-flex">
                <div style={{ width: '80px' }}>Email</div> : {request?.email}
              </div>
              <div className="fw-bold d-flex">
                <div style={{ width: '80px' }}>Subject</div> : {request?.subject}
              </div>
              <div className="fw-bold d-flex">
                <div style={{ width: '80px' }}>Message</div> : {request?.message}
              </div>
            </div>

            <hr />
            <div className="mt-2 text-end">
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
