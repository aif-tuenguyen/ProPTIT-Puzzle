import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { Category } from 'src/models/category';
import useNotify from 'src/hooks/useNotify';
import * as Yup from 'yup';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import categoryServices from 'src/services/categoryServices';
import UploadFile from 'src/components/UploadFile';
import { CloseTwoTone } from '@mui/icons-material';

interface IAddNewCategory {
  getCategoryAdded: (category: Category) => void;
  onClose: () => void;
}

const AddNewCategory: React.FC<IAddNewCategory> = ({
  getCategoryAdded,
  onClose
}) => {
  const { notify } = useNotify();

  const { values, handleSubmit, setFieldValue, touched, errors, isSubmitting } =
    useFormik<Category>({
      initialValues: {
        name: '',
        image: undefined,
        description: ''
      },
      onSubmit: async (values) => {
        const res = await categoryServices.createCategory(values);
        if (res.status === 200) {
          const category = res.data;
          getCategoryAdded(category);

          notify('Tạo mới danh mục thành công', {
            variant: 'success'
          });
        }
        onClose();
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Tên danh mục không được để trống'),
        image: Yup.string().required('Hình ảnh danh mục không được để trống')
      })
    });

  return (
    <Box p={5}>
      <Typography variant="h3" component="h3" gutterBottom mb={2}>
        Tạo mới danh mục
      </Typography>
      <FormControl fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Tên danh mục"
              variant="outlined"
              value={values.name}
              onChange={(event) => {
                setFieldValue('name', event.target.value);
              }}
              error={Boolean(touched?.name && errors?.name)}
              helperText={touched?.name && errors?.name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <UploadFile
              label="Hình ảnh của danh mục"
              setData={(data: any) => {
                setFieldValue('image', data);
              }}
              accept={{
                'image/jpeg': [],
                'image/png': []
              }}
              errors={errors}
              name="image"
              isRequired
            />
            {values?.image && (
              <Box mt={2}>
                <ImageListItem sx={{ width: '100%' }}>
                  <img
                    src={
                      typeof values?.image === 'string'
                        ? values?.image
                        : URL.createObjectURL(values?.image)
                    }
                    loading="lazy"
                  />
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                    }}
                    position="top"
                    actionIcon={
                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => setFieldValue('image', undefined)}
                      >
                        <CloseTwoTone />
                      </IconButton>
                    }
                    actionPosition="right"
                  />
                </ImageListItem>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={5}
              name="description"
              label="Miêu tả danh mục"
              variant="outlined"
              value={values.description}
              onChange={(event) => {
                setFieldValue('description', event.target.value);
              }}
              error={Boolean(touched?.description && errors?.description)}
              helperText={touched?.description && errors?.description}
            />
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 },
                mr: 2
              }}
              startIcon={<ArrowBackTwoToneIcon />}
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Thoát
            </Button>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : <CheckIcon />
              }
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
            >
              Tạo
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default AddNewCategory;
