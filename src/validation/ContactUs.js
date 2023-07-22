import * as Yup from "yup";

const contactUsValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Something wrong!"),
  lastName: Yup.string().required("Something wrong!"),
  email: Yup.string().email("Something wrong!").required("Something wrong!"),
  phoneNumber: Yup.string()
    .min(9, "Something wrong!")
    .required("Something wrong!"),
  object: Yup.string().required("Something wrong!"),
  description: Yup.string().required("Something wrong!"),
});

const validateContactUsForm = async (formValues) => {
  try {
    await contactUsValidationSchema.validate(formValues, { abortEarly: false });
    return {};
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return errors;
  }
};

export default validateContactUsForm;
