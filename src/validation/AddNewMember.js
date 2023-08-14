import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  surname: Yup.string().required("Required"),
  guestType: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  memberType: Yup.string().required("Required"),
  country: Yup.string().required("!"),
  city: Yup.string().required("Required"),
  postalCode: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  frontSideImage: Yup.string().required("Required"),
  backSideImage: Yup.string().required("Required"),
  dateOfBirth: Yup.string().required("Required"),
});

const validateAddNewMember = async (formValues) => {
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

export default validateAddNewMember;
