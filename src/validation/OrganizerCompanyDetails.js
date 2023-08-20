import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phoneNumber: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  // profileImage: Yup.string().required("Required"),
  // coverPhoto: Yup.string().required("Required"),
});

const validateOrganizerCompanyDetails = async (formValues) => {
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

export default validateOrganizerCompanyDetails;
