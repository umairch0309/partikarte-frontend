import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  guestType: Yup.string().required("Required"),
  guestInfo: Yup.string().required("Required"),
});

const validateAddMultiplePeopleToGuest = async (formValues) => {
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

export default validateAddMultiplePeopleToGuest;
