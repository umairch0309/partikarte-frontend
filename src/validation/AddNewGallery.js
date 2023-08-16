import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  galleryTitle: Yup.string().required("Required"),
  event: Yup.string().required("Required"),
  startingDate: Yup.string().required("Required"),
  galleryImages: Yup.array()
    .min(1, "At least 1 image is required")
    .required("At least 1 image is required"),
});

const validateAddNewGallery = async (formValues) => {
  try {
    await validationSchema.validate(formValues, { abortEarly: false });
    return {};
  } catch (error) {
    console.log(error);
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return errors;
  }
};

export default validateAddNewGallery;
