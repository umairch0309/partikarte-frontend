import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  otp: Yup.string().min(6, "Min 6 chars").required("Otp is required"),
});

const validateVerifyOTPForm = async (formValues) => {
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

export default validateVerifyOTPForm;
