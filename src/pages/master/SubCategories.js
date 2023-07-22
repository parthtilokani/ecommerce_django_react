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
import { toast } from 'react-toastify';
import { axiosPrivate } from '../../utils/axios';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import Iconify from '../../components/iconify';
import CustomSelect from '../../components/form/CustomSelect';
import { dynamicFields } from '../../data/DynamicFields';

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
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteSubCategoryToast = ({ closeToast, deleteSubCategory }) => (
  <div>
    <p>Delete SubCategory?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteSubCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function SubCategories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const initialSubCategory = { name: '', category: '' };
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [newFields, setNewFields] = useState([]);

  const initialDF = {
    field_name: '',
    field_type: '',
  };
  const [newField, setNewField] = useState(initialDF);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/category/');
      return data || [];
    },
  });
  const {
    data: subCategories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/ads/subcategory/');
      return data || [];
    },
  });
  const { mutate: postSubCategory, isLoading: isSaving } = useMutation({
    mutationFn: (body) => axiosPrivate.post('/ads/subcategory/', { ...body }),
    onSuccess: () => {
      toast.success('Subcategory saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchSubCategory, isLoading: isUpdating } = useMutation({
    mutationFn: ({ body, id }) => axiosPrivate.patch(`/ads/subcategory/${id}/`, { ...body }),
    onSuccess: () => {
      toast.success('Subcategory updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteSubCategory, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/subcategory/${id}/`),
    onSuccess: () => {
      toast.success('Subcategory deleted!');
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
    setSubCategory(initialSubCategory);
    setNewFields([]);
  };
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    setOpen2(false);
    setNewField(initialDF);
  };

  const handleChangeForm = (e) => setSubCategory((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleChangeField = (e) => setNewField((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleAddNewField = () => {
    if (!newField?.field_name?.trim() || !newField?.field_type) return;
    if (newField.field_type === 'Select' && !newField?.options?.trim()) return;
    if (newField?.options) newField.options = newField.options.split(',').map((e) => e.trim());
    if (newField?.idx) {
      const clone = newFields;
      clone[newField.idx - 1] = newField;
      setNewFields([...clone]);
    } else setNewFields((prev) => [...prev, newField]);
    setNewField(initialDF);
    setOpen2(false);
  };

  const handleDelete = (idx) => {
    toast(<DeleteSubCategoryToast deleteSubCategory={() => deleteSubCategory(idx)} />);
  };

  const handleSubmit = () => {
    if (!subCategory.name.trim()) return toast.error('Name is required!');
    if (!subCategory.category) return toast.error('Category is required!');
    const body = { name: subCategory.name, category: subCategory.category, dynamic_field: newFields || [] };
    if (subCategory?.id) patchSubCategory({ body, id: subCategory.id });
    else postSubCategory(body);
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Sub Categories | Classified Ads</title>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : !subCategories || subCategories?.length <= 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Typography variant="subtitle2" noWrap>
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    subCategories?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                      const { id, name, category_name: categoryName, dynamic_field: dynamicField } = row;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {categoryName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              className="me-2"
                              onClick={() => {
                                setOpen(true);
                                setSubCategory(row);
                                setNewFields([...(dynamicField || [])]);
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
            count={subCategories?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <div>
              <h5>{!subCategory?.id ? 'Add' : 'Edit'} Sub Category</h5>
              <hr />
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="w-100 mt-1">
                  <TextField
                    id="name"
                    label="Sub Category Name*"
                    variant="outlined"
                    className="w-100"
                    value={subCategory.name}
                    onChange={handleChangeForm}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="w-100 mt-1">
                  <CustomSelect
                    id="category"
                    label="Category*"
                    data={categories?.map((e) => ({ value: e.id, label: e.name }))}
                    value={subCategory.category}
                    handleChange={handleChangeForm}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="h6 fw-bold">Dynamic Fields :</div>
              <div className="mt-1">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th> </th>
                      <th>Field Name</th>
                      <th>Field Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newFields.map((f, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{f?.field_name}</td>
                        <td>{f?.field_type}</td>
                        <td>
                          <Iconify
                            icon="material-symbols:edit"
                            onClick={() => {
                              handleOpen2();
                              if (f?.options?.length > 0) f.options = f.options.join(',');
                              setNewField({ ...f, idx: i + 1 });
                            }}
                          />
                          <Iconify
                            icon="material-symbols:delete"
                            onClick={() => setNewFields((prev) => prev.filter((_, x) => x !== i))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center">
                <Button variant="contained" onClick={handleOpen2}>
                  Add New Field
                </Button>
              </div>
            </div>
            <hr />
            <div className="mt-2 text-end">
              <Button variant="contained" className="me-2" onClick={handleSubmit} disabled={isSaving || isUpdating}>
                Save
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal open={open2} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={{ ...style, width: '400px' }}>
            <div>
              <h5>Add Field</h5>
              <hr />
            </div>
            <div>
              <div className="w-100 mt-1">
                <TextField
                  id="field_name"
                  label="Field Name"
                  variant="outlined"
                  className="w-100"
                  value={newField?.field_name}
                  onChange={handleChangeField}
                  autoComplete="off"
                />
              </div>
              <div className="w-100 mt-2">
                <CustomSelect
                  id="field_type"
                  label="Field Type"
                  data={dynamicFields?.map((e) => ({ value: e.name, label: e.name }))}
                  value={newField?.field_type}
                  handleChange={handleChangeField}
                />
              </div>
              {newField?.field_type === 'Select' && (
                <div className="w-100 mt-2">
                  <p style={{ fontSize: 12 }} className="p-0 m-0 mb-1">
                    Enter select options seperated by comma
                  </p>
                  <TextField
                    id="options"
                    label="Options"
                    variant="outlined"
                    className="w-100"
                    value={newField?.options}
                    onChange={handleChangeField}
                    autoComplete="off"
                  />
                  <p style={{ fontSize: 14 }} className="p-0 m-0">
                    Options:{' '}
                    {newField?.options?.split(',')?.map((e, i) => (
                      <span className="badge me-1" style={{ backgroundColor: '#2065D1' }} key={i}>
                        {e?.trim()}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
            <hr />
            <div className="mt-2 text-end">
              <Button variant="contained" className="me-2" onClick={handleAddNewField}>
                Save
              </Button>
              <Button variant="contained" onClick={handleClose2}>
                Close
              </Button>
            </div>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
