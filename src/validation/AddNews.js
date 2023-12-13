import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  // newsImages: Yup.array()
  //   .min(1, "At least 1 image is required")
  //   .required("At least 1 image is required"),
});

const validateAddNews = async (formValues) => {
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

export default validateAddNews;
