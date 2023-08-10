/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

// @mui
import {
  Box,
  Card,
  Table,
  Modal,
  Stack,
  Button,
  TableRow,
  TableBody,
  TextField,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  TableSortLabel,
} from '@mui/material';

import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { axiosPrivate } from '../../utils/axios';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import CustomSelect from '../../components/form/CustomSelect';
import Iconify from '../../components/iconify';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'country', label: 'Country' },
  { id: 'action', label: 'Actions' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteCategoryToast = ({ closeToast, deleteCategory }) => (
  <div>
    <p>Delete State?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function States() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [fetchedQueries, setFetchedQueries] = useState([false, false]);

  const initialState = {
    id: '',
    name: '',
    country: '',
  };
  const [state, setState] = useState(initialState);

  const { data: countries } = useQuery({
    queryKey: ['country'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/country');
      setFetchedQueries((prev) => [true, prev[1]]);
      return data?.results || [];
    },
    enabled: !fetchedQueries[0],
  });
  const {
    data: states,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['state'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/state');
      setFetchedQueries((prev) => [prev[0], true]);
      return data?.results || [];
    },
    enabled: !fetchedQueries[1],
  });
  const { mutate: postState, isLoading: isSaving } = useMutation({
    mutationFn: (formData) => axiosPrivate.post('/ads/state', formData),
    onSuccess: () => {
      toast.success('State saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchState, isLoading: isUpdating } = useMutation({
    mutationFn: ({ formData, id }) => {
      axiosPrivate.patch(`/ads/state/${id}`, formData);
    },
    onSuccess: () => {
      toast.success('State updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteState, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/state/${id}`),
    onSuccess: () => {
      toast.success('State deleted!');
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
    setState(initialState);
  };

  const handleChangeForm = (e) => setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleDelete = (idx) => {
    toast(<DeleteCategoryToast deleteCategory={() => deleteState(idx)} />);
  };

  const handleSubmit = () => {
    if (!state.name.trim()) return toast.error('Name is required!');
    if (!state.country) return toast.error('Country is required!');
    const formData = { name: state.name, country: state.country };
    if (state?.id) {
      patchState({ formData, id: state.id });
    } else {
      postState(formData);
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>States | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            States
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New State
          </Button>
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
                  ) : !states || states?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    states?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                      const { id, name, country } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {country}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                handleOpen();
                                setState(row);
                              }}
                            >
                              Edit
                            </Button>
                            <Button variant="contained" onClick={() => handleDelete(id)} disabled={isDeleting}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={states?.length || 0}
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
              <h5>{state.id ? 'Edit' : 'Add'} State</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="State Name*"
                variant="outlined"
                className="w-100"
                value={state.name}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-1">
              <CustomSelect
                id="country"
                label="Country*"
                data={countries?.map((e) => ({ value: e.id, label: e.name })) || []}
                value={state.country}
                handleChange={handleChangeForm}
              />
            </div>
            <hr />
            <div className="mt-2 text-end">
              <Button variant="contained" className="me-2" onClick={handleSubmit} disabled={isSaving || isUpdating}>
                Save
              </Button>
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
