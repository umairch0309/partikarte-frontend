import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  platform: Yup.string().required("Required"),
  link: Yup.string().required("Required"),
});

const validateAddNewSocialMedia = async (formValues) => {
  try {
    await validationSchema.validate(formValues, { abortEarly: false });
    return {};
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return errors;
  }
};

export default validateAddNewSocialMedia;
