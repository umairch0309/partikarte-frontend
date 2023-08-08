import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  iban: Yup.string().required("Required"),
  accountName: Yup.string().required("Required"),
  invoiceEmail: Yup.string().required("Required"),
});

const validateFinanceInformation = async (formValues) => {
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

export default validateFinanceInformation;
