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
import Iconify from '../../components/iconify';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'ads', label: 'Number od Ads' },
  { id: 'price', label: 'Price' },
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

const DeleteAdPostToast = ({ closeToast, deleteAdPlan }) => (
  <div>
    <p>Delete Ads Plan?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteAdPlan}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function Categories() {
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [fetchedQueries, setFetchedQueries] = useState(false);

  const initialAdPlan = {
    id: '',
    name: '',
    description: '',
    ads_number_restriction: '',
    price: '',
  };
  const [adPlan, setAdPlan] = useState(initialAdPlan);

  const {
    data: adPlans,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['ad_plans'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads_plan/ads_plan/');
      setFetchedQueries(true);
      return data || [];
    },
    enabled: !fetchedQueries,
  });
  const { mutate: postAdPlan, isLoading: isSaving } = useMutation({
    mutationFn: (body) => axiosPrivate.post('/ads_plan/ads_plan/', body),
    onSuccess: () => {
      toast.success('Ads Plan saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchAdPlan, isLoading: isUpdating } = useMutation({
    mutationFn: ({ body, id }) => {
      axiosPrivate.patch(`/ads_plan/ads_plan/${id}/`, body);
    },
    onSuccess: () => {
      toast.success('Ads Plan updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteAdPlan, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads_plan/ads_plan/${id}/`),
    onSuccess: () => {
      toast.success('Ads Plan deleted!');
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
    setAdPlan(initialAdPlan);
  };

  const handleChangeForm = (e) => setAdPlan((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleDelete = (idx) => {
    toast(<DeleteAdPostToast deleteAdPlan={() => deleteAdPlan(idx)} />);
  };

  const handleSubmit = () => {
    const { id, name, description, ads_number_restriction: adsRestriction, price } = adPlan;
    if (!name?.trim()) return toast.error('Name is required!');
    // update ads plan
    if (id) {
      patchAdPlan({ body: { name, description, ads_number_restriction: adsRestriction, price }, id });
    } else {
      // add ads plan
      postAdPlan({ name, description, ads_number_restriction: adsRestriction, price });
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Ads Plans | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ads Plans
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New Ads Plan
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
                  ) : !adPlans || adPlans?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    adPlans?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, ads_number_restriction: adRestriction, price } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {adRestriction}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {price}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                handleOpen();
                                setAdPlan(row);
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
            count={adPlans?.length || 0}
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
              <h5>{adPlan.id ? 'Edit' : 'Add'} Ads Plan</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="Plan Name*"
                variant="outlined"
                className="w-100"
                value={adPlan.name}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                id="description"
                label="Description*"
                variant="outlined"
                className="w-100"
                value={adPlan.description}
                onChange={handleChangeForm}
                autoComplete="off"
                multiline
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                type="number"
                id="ads_number_restriction"
                label="Ads Number Restriction*"
                variant="outlined"
                className="w-100"
                value={adPlan.ads_number_restriction}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                type="number"
                id="price"
                label="Price*"
                variant="outlined"
                className="w-100"
                value={adPlan.price}
                onChange={handleChangeForm}
                autoComplete="off"
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
