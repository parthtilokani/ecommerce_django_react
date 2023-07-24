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
  Avatar,
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
import Iconify from '../../components/iconify';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'icon', label: 'Icon' },
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
    <p>Delete Category?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function Categories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const initialCategory = {
    id: '',
    name: '',
    imgUrl: '',
    imgFile: '',
    icon: '/assets/images/avatars/avatar_1.jpg',
  };
  const [category, setCategory] = useState(initialCategory);

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/category');
      return data || [];
    },
  });
  const { mutate: postCategory, isLoading: isSaving } = useMutation({
    mutationFn: (formData) =>
      axiosPrivate.post('/ads/category', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success('Category saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchCategory, isLoading: isUpdating } = useMutation({
    mutationFn: ({ formData, id }) => {
      axiosPrivate.patch(`/ads/category/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      toast.success('Category updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteCategory, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/category/${id}`),
    onSuccess: () => {
      toast.success('Category deleted!');
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
    setCategory(initialCategory);
  };

  const handleChangeForm = (e) => {
    if (e.target.id !== 'image') return setCategory((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (
      e.target.files[0]?.type === 'image/jpeg' ||
      e.target.files[0]?.type === 'image/png' ||
      e.target.files[0]?.type === 'image/jpg'
    ) {
      setCategory((prev) => ({
        ...prev,
        imgUrl: URL.createObjectURL(e.target.files[0]),
        imgFile: e.target.files[0],
      }));
    } else {
      toast.error('Upload jpg, jpeg, png only.');
      setCategory((prev) => ({
        ...prev,
        imgUrl: '',
        imgFile: '',
      }));
      e.target.value = null;
    }
  };

  const handleDelete = (idx) => {
    toast(<DeleteCategoryToast deleteCategory={() => deleteCategory(idx)} />);
  };

  const handleSubmit = () => {
    if (!category.name.trim()) return toast.error('Name is required!');
    const formData = new FormData();
    formData.append('name', category.name);
    // update category
    if (category?.id) {
      if (category.imgFile) formData.append('icon', category.imgFile);
      patchCategory({ formData, id: category.id });
    } else {
      // add category
      if (!category?.imgFile) return toast.error('Icon is required!');
      formData.append('icon', category.imgFile);
      postCategory(formData);
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Categories | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New Category
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
                  ) : !categories || categories?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, icon } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Avatar alt={name} src={icon} style={{ margin: 'auto' }} />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                handleOpen();
                                setCategory(row);
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
            count={categories?.length || 0}
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
              <h5>{category.id ? 'Edit' : 'Add'} Category</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="Category Name*"
                variant="outlined"
                className="w-100"
                value={category.name}
                onChange={handleChangeForm}
                autoComplete="off"
              />
            </div>
            <div className="d-flex mt-2 align-items-center">
              <div>
                <img
                  alt={'placeholder'}
                  src={category.imgUrl ? category.imgUrl : '/assets/placeholder.svg'}
                  style={{ margin: 'auto', height: '70px', width: '70px', borderRadius: '5px' }}
                />
              </div>
              <div className="flex-fill d-flex justify-content-center">
                <div className="position-relative">
                  <Button variant="contained">Choose Icon*</Button>
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    style={{ opacity: 0, width: '112px', height: '36px', cursor: 'pointer' }}
                    className="position-absolute top-0 start-0"
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
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
