import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "At least 6 characters").required("Required"),
  username: Yup.string()
    .required("Required")
    .matches(/^\S*$/, "Contains spaces"),
  companyName: Yup.string().required("Required"),
  companyVAT: Yup.string()
    .min(8, "At least 8 characters")
    .max(15, "Can't exceed 15 characters")
    .required("Required"),
  companyRegistryNumber: Yup.string()
    .min(6, "At least 6 characters")
    .max(15, "Can't exceed 15 characters")
    .required("Required"),
  addressDescription: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postalCode: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
});

const validateSignUpForm = async (formValues) => {
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

export default validateSignUpForm;
