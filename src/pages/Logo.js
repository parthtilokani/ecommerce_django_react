/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

// @mui
import { Box, Card, Modal, Stack, Button, TextField, Container, Typography } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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

const px = 'px';

const DeleteCategoryToast = ({ closeToast, deleteCategory }) => (
  <div>
    <p>Delete Logo?</p>
    <button className="btn btn-danger btn-sm mx-1" onClick={deleteCategory}>
      Sure
    </button>
    <button onClick={closeToast} className="btn btn-info btn-sm">
      Close
    </button>
  </div>
);

export default function Logo() {
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [logos, setLogos] = useState([]);
  const [fetchedQueries, setFetchedQueries] = useState(false);

  const initialLogo = {
    id: '',
    width: '',
    height: '',
    imgUrl: '',
    imgFile: '',
    icon: '/assets/images/avatars/avatar_1.jpg',
  };
  const limit = { width: 180, height: 50 };
  const [logo, setLogo] = useState(initialLogo);

  const { refetch } = useQuery({
    queryKey: ['icons'],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/user/app_icon');
      setFetchedQueries(true);
      setLogos(data || []);
      return data || [];
    },
    enabled: !fetchedQueries,
  });
  const { mutate: postCategory, isLoading: isSaving } = useMutation({
    mutationFn: (formData) =>
      axiosPrivate.post('/user/app_icon', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success('Logo saved!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: patchCategory, isLoading: isUpdating } = useMutation({
    mutationFn: ({ formData, id }) => {
      axiosPrivate.patch(`/user/app_icon/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      toast.success('Logo updated!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });
  const { mutate: deleteCategory, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/user/app_icon/${id}`),
    onSuccess: () => {
      toast.success('Logo deleted!');
      refetch();
    },
    onError: () => toast.error('Something went wrong! Retry'),
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setLogo(initialLogo);
  };

  const handleChangeForm = (e) => {
    if (e.target.id !== 'image') return setLogo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (
      e.target.files[0]?.type === 'image/jpeg' ||
      e.target.files[0]?.type === 'image/png' ||
      e.target.files[0]?.type === 'image/jpg'
    ) {
      setLogo((prev) => ({
        ...prev,
        imgUrl: URL.createObjectURL(e.target.files[0]),
        imgFile: e.target.files[0],
      }));
    } else {
      toast.error('Upload jpg, jpeg, png only.');
      setLogo((prev) => ({
        ...prev,
        imgUrl: '',
        imgFile: '',
      }));
      e.target.value = null;
    }
  };

  const handleDelete = () => {
    const idx = logos[0]?.id;
    if (!idx) return;
    toast(<DeleteCategoryToast deleteCategory={() => deleteCategory(idx)} />);
  };

  const handleSubmit = () => {
    if (!logo.width || !logo.height || !logo.imgFile) return toast.error('Fill required fields!');
    if (logo.width > limit.width) return toast.error('Invalid width');
    if (logo.height > limit.height) return toast.error('Invalid height');
    const formData = new FormData();
    formData.append('width', logo.width);
    formData.append('height', logo.height);
    formData.append('icon_image', logo.imgFile);
    // update category
    if (logos[0]?.id) {
      patchCategory({ formData, id: logos[0].id });
    } else {
      // add category
      postCategory(formData);
    }
    handleClose();
  };

  return (
    <>
      <Helmet>
        <title>Logo | Classified Ads</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Logo
          </Typography>
        </Stack>

        <Card>
          <div className="p-5">
            <div className="d-flex justify-content-evenly align-items-center">
              <div>
                <img
                  src={logos[0]?.icon_image || '/assets/placeholder.svg'}
                  alt="Logo"
                  style={{
                    objectFit: 'contain',
                    width: logos[0]?.width ? logos[0]?.width?.toString() + px : '200px',
                    height: logos[0]?.height ? logos[0]?.height?.toString() + px : '60px',
                  }}
                />
              </div>
              <div>
                <div className="mb-2">
                  <Button variant="contained" onClick={() => handleOpen()} disabled={isDeleting}>
                    Change Logo
                  </Button>
                </div>
                <div>
                  <Button variant="contained" onClick={() => handleDelete()} disabled={isDeleting} fullWidth>
                    Delete Logo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <h5>Change Logo</h5>
              <hr />
            </div>
            <div className="w-100 mb-2">
              <TextField
                id="width"
                label={`Width* (max ${limit.width}px)`}
                variant="outlined"
                className="w-100"
                type="number"
                value={logo.width}
                onChange={handleChangeForm}
                InputProps={{ inputProps: { max: limit.width } }}
                autoComplete="off"
              />
            </div>
            <div className="w-100 mb-2">
              <TextField
                id="height"
                label={`Height* (max ${limit.height}px)`}
                variant="outlined"
                className="w-100"
                type="number"
                value={logo.height}
                onChange={handleChangeForm}
                InputProps={{ inputProps: { max: limit.height } }}
                autoComplete="off"
              />
            </div>
            <div className="">
              <div className="mb-2" style={{ minHeight: '60px' }}>
                <img
                  alt={'placeholder'}
                  src={logo.imgUrl ? logo.imgUrl : '/assets/placeholder.svg'}
                  style={{
                    objectFit: 'contain',
                    width: logo?.width ? logo?.width?.toString() + px : '200px',
                    height: logo?.height ? logo?.height?.toString() + px : '60px',
                    margin: 'auto',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <div className="flex-fill d-flex justify-content-center">
                <div className="position-relative">
                  <Button variant="contained">Choose logo*</Button>
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
