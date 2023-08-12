import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Required"),
  description: Yup.string().trim().required("Required"),
  category: Yup.string().required("Required"),
  eventType: Yup.string().required("Required"),
  venueName: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  eventBanner: Yup.string().required("Event banner is required."),
  country: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postalCode: Yup.string().required("Required"),
  startingDate: Yup.string().required("!"),
  endingDate: Yup.string().required("!"),
  dateDifference: Yup.mixed().test({
    name: "dateDifference",
    message: "Date difference must be at least 15 minutes",
    test: function () {
      const startingDate = new Date(this.parent.startingDate).getTime();
      const endingDate = new Date(this.parent.endingDate).getTime();
      console.log(this.parent.startingDate, this.parent.endingDate);
      console.log(startingDate, endingDate);
      const differenceInMilliseconds = endingDate - startingDate;
      console.log(differenceInMilliseconds > 15 * 1000);
      return differenceInMilliseconds > 15 * 1000;
    },
  }),
});

const validateAddNewEvent = async (formValues) => {
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

export default validateAddNewEvent;
