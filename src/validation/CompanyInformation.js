import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Required"),
  companyVAT: Yup.string().required("Required"),
  companyRegistryNumber: Yup.string().required("Required"),
  addressDescription: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postalCode: Yup.string().required("Required"),
});

const validateCompanyInformation = async (formValues) => {
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

export default validateCompanyInformation;
