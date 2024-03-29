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
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import CustomSelect from '../../components/form/CustomSelect';
import Iconify from '../../components/iconify';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'state', label: 'State' },
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
    <p>Delete District?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function Cities() {
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [fetchedQueries, setFetchedQueries] = useState([false, false, false]);

  const initialCity = {
    id: '',
    name: '',
    state: '',
    country: '',
  };
  const [district, setCity] = useState(initialCity);

  const { data: countries } = useQuery({
    queryKey: ['country'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/country', { params: { page: 1, page_size: 10000 } });
      setFetchedQueries((prev) => [true, prev[1], prev[2]]);
      return data?.results || [];
    },
    enabled: !fetchedQueries[0],
  });
  const { data: states } = useQuery({
    queryKey: ['state'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/state', { params: { page: 1, page_size: 10000 } });
      setFetchedQueries((prev) => [prev[0], true, prev[2]]);
      return data?.results || [];
    },
    enabled: !fetchedQueries[1],
  });
  const {
    data: cities,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['district'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/district', { params: { page: 1, page_size: 10000 } });
      setFetchedQueries((prev) => [prev[0], prev[1], true]);
      return data?.results || [];
    },
    enabled: !fetchedQueries[2],
  });
  const { mutate: postCity, isLoading: isSaving } = useMutation({
    mutationFn: (formData) => axiosPrivate.post('/ads/district', formData),
    onSuccess: () => {
      toast.success('District saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchCity, isLoading: isUpdating } = useMutation({
    mutationFn: ({ formData, id }) => {
      axiosPrivate.patch(`/ads/district/${id}`, formData);
    },
    onSuccess: () => {
      toast.success('District updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteCity, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/district/${id}`),
    onSuccess: () => {
      toast.success('District deleted!');
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
    setCity(initialCity);
  };

  const handleChangeForm = (e) => setCity((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleDelete = (idx) => {
    toast(<DeleteCategoryToast deleteCategory={() => deleteCity(idx)} />);
  };

  const handleSubmit = () => {
    if (!district.name.trim()) return toast.error('Name is required!');
    if (!district.state) return toast.error('State is required!');
    if (!district.country) return toast.error('Country is required!');
    const formData = { name: district.name, state: district.state, country: district.country };
    if (district?.id) {
      patchCity({ formData, id: district.id });
    } else {
      postCity(formData);
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Districts | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Districts
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New District
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
                      <TableCell align="center" colSpan={4}>
                        <Typography variant="subtitle2" noWrap>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : !cities || cities?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cities?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                      const { id, name, state_name: stateName, country_name: countryName } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {stateName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {countryName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                handleOpen();
                                setCity(row);
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
            count={cities?.length || 0}
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
              <h5>{district.id ? 'Edit' : 'Add'} District</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="City Name*"
                variant="outlined"
                className="w-100"
                value={district.name}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-2">
              <CustomSelect
                id="country"
                label="Country*"
                data={countries?.map((e) => ({ value: e.id, label: e.name })) || []}
                value={district.country}
                handleChange={handleChangeForm}
              />
            </div>
            <div className="w-100 mt-2">
              <CustomSelect
                id="state"
                label="State*"
                data={
                  states?.filter((e) => e?.country === district?.country)?.length > 0
                    ? states
                        ?.filter((e) => e?.country === district?.country)
                        ?.map((e) => ({ value: e.id, label: e.name }))
                    : [{ value: '', label: 'Select Country' }]
                }
                value={district.state}
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
