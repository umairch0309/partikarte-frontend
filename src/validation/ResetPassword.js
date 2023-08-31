import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  password: Yup.string().min(6, "At least 6 chars").required("Required"),
  confirmPassword: Yup.string().min(6, "At least 6 chars").required("Required"),
});

const validateConfirmPasswordForm = async (formValues) => {
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

export default validateConfirmPasswordForm;
