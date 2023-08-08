import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  metaPixel: Yup.string().required("Required"),
  googleAnalytics: Yup.string().required("Required"),
  apiAccessKey: Yup.string().required("Required"),
});

const validateMarketingInformation = async (formValues) => {
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

export default validateMarketingInformation;
