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
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Scrollbar from '../components/scrollbar/Scrollbar';
import CustomSelect from '../components/form/CustomSelect';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'country', label: 'Email' },
  { id: 'username', label: 'Username' },
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
    <p>Delete User?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function Users() {
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [fetchedQueries, setFetchedQueries] = useState([false, false]);

  const initialUser = {
    id: '',
    name: '',
    username: '',
    email: '',
    phone_no: '',
    plan_id: '',
  };
  const [user, setUser] = useState(initialUser);

  const { data: adsPlans } = useQuery({
    queryKey: ['ads_plan'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads_plan/ads_plan/');
      setFetchedQueries((prev) => [true, prev[1]]);
      return data || [];
    },
    enabled: !fetchedQueries[0],
  });
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/user/user');
      setFetchedQueries((prev) => [prev[0], true]);
      return data || [];
    },
    enabled: !fetchedQueries[1],
  });
  const { mutate: postUser, isLoading: isSaving } = useMutation({
    mutationFn: (formData) => axiosPrivate.post('/user/user', formData),
    onSuccess: () => {
      toast.success('User saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchUser, isLoading: isUpdating } = useMutation({
    mutationFn: ({ formData, id }) => {
      axiosPrivate.patch(`/user/user/${id}`, formData);
    },
    onSuccess: () => {
      toast.success('User updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteUser, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/user/user/${id}`),
    onSuccess: () => {
      toast.success('User deleted!');
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
    setUser(initialUser);
  };

  const handleChangeForm = (e) => setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleDelete = (idx) => {
    toast(<DeleteCategoryToast deleteCategory={() => deleteUser(idx)} />);
  };

  const handleSubmit = () => {
    if (!user.name.trim()) return toast.error('Name is required!');
    if (!user.email.trim()) return toast.error('Email is required!');
    if (!user.username.trim()) return toast.error('Username is required!');
    if (!user.phone_no.trim()) return toast.error('Phone no is required!');
    if (!user.plan_id) return toast.error('Ad Plan is required!');
    const formData = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone_no: user.phone_no,
      plan_id: user.plan_id,
    };
    if (user?.id) {
      patchUser({ formData, id: user.id });
    } else {
      postUser(formData);
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Users | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New User
          </Button> */}
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
                  ) : !users || users?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                      const { id, name, email, username } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {email}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                handleOpen();
                                setUser({ ...row, plan_id: row.plan_id.id });
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
            count={users?.length || 0}
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
              <h5>{user.id ? 'Edit' : 'Add'} User</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="Name*"
                variant="outlined"
                className="w-100"
                value={user.name}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                id="email"
                label="Email*"
                variant="outlined"
                className="w-100"
                value={user.email}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                id="username"
                label="Username*"
                variant="outlined"
                className="w-100"
                value={user.username}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <TextField
                id="phone_no"
                label="Phone Number*"
                variant="outlined"
                className="w-100"
                value={user.phone_no}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mt-3">
              <CustomSelect
                id="plan_id"
                label="Ad Plan*"
                data={adsPlans?.map((e) => ({ value: e.id, label: e.name })) || []}
                value={user.plan_id}
                handleChange={handleChangeForm}
              />
            </div>
            <hr />
            <div className="mt-3 text-end">
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
