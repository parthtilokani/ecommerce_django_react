/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

// @mui
import {
  Box,
  Card,
  Table,
  Modal,
  Stack,
  Button,
  TableRow,
  TextField,
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
import Scrollbar from '../../components/scrollbar/Scrollbar';
import Iconify from '../../components/iconify';
import CustomSelect from '../../components/form/CustomSelect';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'category', label: 'Category' },
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

export default function SubCategories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const initialSubCategory = { name: '', category: '' };
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(initialSubCategory);

  useEffect(() => {
    (() => {
      setSubCategories([
        { id: '1', category: 'Electronics', name: 'Mobile' },
        { id: '2', category: 'Farming', name: 'Equipments' },
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
    setSubCategory(initialSubCategory);
  };

  const handleChangeForm = (e) => {
    setSubCategory((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDelete = (idx) => {
    setSubCategories((prev) => [...prev.filter((e) => e.id !== idx)]);
  };

  const handleSubmit = () => {
    if (!subCategory.name.trim()) return null;
    setSubCategories((prev) => [...prev, { ...subCategory, id: prev.length + 1 }]);
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Sub Categories | Ecom</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Sub Categories
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen}>
            New Sub Category
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
                  {subCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, category } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" noWrap>
                            {category}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button variant="contained" className="me-2">
                            Edit
                          </Button>
                          <Button variant="contained">Delete</Button>
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
            count={subCategories.length}
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
              <h5>Add Sub Category</h5>
              <hr />
            </div>
            <div className="w-100">
              <TextField
                id="name"
                label="Sub Category Name"
                variant="outlined"
                className="w-100"
                value={subCategory.name}
                onChange={handleChangeForm}
              />
            </div>
            <div className="w-100 mt-3">
              <CustomSelect
                id="category"
                label="Category"
                data={['Electronics', 'Farming'].map((e) => ({ value: e, label: e }))}
                value={subCategory.category}
                handleChange={handleChangeForm}
              />
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
