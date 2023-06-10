/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

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

export default function Categories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const initialCategory = {
    name: '',
    imgUrl: '',
    imgFile: '',
  };
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    (() => {
      setCategories([
        { id: '1', name: 'Electronics', imgUrl: '/assets/images/avatars/avatar_1.jpg' },
        { id: '2', name: 'Farming', imgUrl: '/assets/images/avatars/avatar_2.jpg' },
      ]);
    })();
  }, []);

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
      //  swal({
      //    title: 'Warning',
      //    text: 'Upload jpg, jpeg, png only.',
      //    icon: 'error',
      //    button: 'Close',
      //    dangerMode: true,
      //  });
      setCategory((prev) => ({
        ...prev,
        imgUrl: '',
        imgFile: '',
      }));
      e.target.value = null;
    }
  };

  const handleDelete = (idx) => {
    setCategories((prev) => [...prev.filter((e) => e.id !== idx)]);
  };

  const handleSubmit = () => {
    if (!category.name.trim()) return null;
    setCategories((prev) => [...prev, { ...category, id: prev.length + 1 }]);
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Categories | Ecom</title>
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
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align={'center'}>
                        <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, imgUrl } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Avatar alt={name} src={imgUrl} style={{ margin: 'auto' }} />
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
                          <Button variant="contained" onClick={() => handleDelete(id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categories.length}
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
              <h5>Add Category</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="Category Name"
                variant="outlined"
                className="w-100"
                value={category.name}
                onChange={handleChangeForm}
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
                  <Button variant="contained">Choose Icon</Button>
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
              <Button variant="contained" className="me-2" onClick={handleSubmit}>
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
