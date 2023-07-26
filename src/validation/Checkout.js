import * as Yup from "yup";

const checkoutValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Something wrong!")
    .required("Something wrong!"),
  name: Yup.string()
    .trim()
    .min(6, "Something wrong!")
    .required("Something wrong!"),
  address: Yup.string()
    .trim()
    .when("$activePaymentType", ([activePaymentType], schema) => {
      return activePaymentType === "bank"
        ? schema.required("Something wrong!")
        : schema.notRequired();
    }),
  city: Yup.string()
    .trim()
    .when("$activePaymentType", ([activePaymentType], schema) => {
      return activePaymentType === "bank"
        ? schema.required("!")
        : schema.notRequired();
    }),

  postalCode: Yup.string()
    .trim()
    .when("$activePaymentType", ([activePaymentType], schema) => {
      return activePaymentType === "bank"
        ? schema.required("!").min(0, "!")
        : schema.notRequired();
    }),
  country: Yup.string()
    .trim()
    .when("$activePaymentType", ([activePaymentType], schema) => {
      return activePaymentType === "bank"
        ? schema.required(" ")
        : schema.notRequired();
    }),
  expiry: Yup.string()
    .trim()
    .when("$activePaymentType", ([activePaymentType], schema) => {
      return activePaymentType === "card"
        ? schema.required("")
        : schema.notRequired();
    }),

  termsAndConditions: Yup.boolean()
    .oneOf([true], "You must agree to Terms and Conditions")
    .required("You must agree to Terms and Conditions"),
});

const validateCheckoutForm = async (paymentData, activePaymentType) => {
  try {
    await checkoutValidationSchema.validate(paymentData, {
      abortEarly: false,
      context: { activePaymentType: activePaymentType },
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
