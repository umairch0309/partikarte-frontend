import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  ticketName: Yup.string().required("Required"),
  ticketType: Yup.string().required("Required"),
  paidTicket: Yup.boolean(),
  limitedTickets: Yup.boolean(),
  //   ticketPrice: Yup.string().when("paidTicket", {
  //     is: (paidTicket) => paidTicket === true,
  //     then: Yup.string().required("Required"),
  //   }),
  //   vatPercentage: Yup.string().when("paidTicket", {
  //     is: (paidTicket) => paidTicket === true,
  //     then: Yup.string().required("Required"),
  //   }),
  //   numberOfTickets: Yup.string().when("limitedTickets", {
  //     is: (limitedTickets) => limitedTickets === true,
  //     then: Yup.string().required("Required"),
  //   }),
  descriptionOnWeb: Yup.string().required("Required"),
  descriptionOnTicket: Yup.string().required("Required"),
  startingDate: Yup.string().required("!"),
  endingDate: Yup.string().required("!"),
});

const validateNewTicket = async (formValues) => {
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

export default validateNewTicket;
