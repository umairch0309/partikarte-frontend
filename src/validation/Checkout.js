import * as Yup from "yup";

const checkoutValidationSchema = Yup.object().shape({
  email: Yup.string().email("Something wrong!").required("Something wrong!"),
  name: Yup.string().min(6, "Something wrong!").required("Something wrong!"),
  address: Yup.string().when("activePaymentType", {
    is: "bank",
    then: Yup.string().required("Something wrong!").min(6, "Something wrong!"),
  }),
  city: Yup.string().when("activePaymentType", {
    is: "bank",
    then: Yup.string().required("Something wrong!").min(2, "Something wrong!"),
  }),
  postalCode: Yup.string().when("activePaymentType", {
    is: "bank",
    then: Yup.string().required("Something wrong!").min(0, "Something wrong!"),
  }),
  country: Yup.string().when("activePaymentType", {
    is: "bank",
    then: Yup.string().required("Something wrong!"),
  }),
  expiry: Yup.string().when("activePaymentType", {
    is: "card",
    then: Yup.string().required("Something wrong!"),
  }),
  termsAndConditions: Yup.boolean()
    .oneOf([true], "You must agree to Terms and Conditions")
    .required("You must agree to Terms and Conditions"),
});

const validateCheckoutForm = async (paymentData) => {
  try {
    await checkoutValidationSchema.validate(paymentData, {
      abortEarly: false,
    });
    return {};
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return errors;
  }
};

export default validateCheckoutForm;
