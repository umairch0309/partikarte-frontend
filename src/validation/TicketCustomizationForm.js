import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  logo: Yup.string().required("Required"),
  organizerName: Yup.string().required("Required"),
  organizerAddress: Yup.string().required("Required"),
  organizerPostalCode: Yup.string().required("Required"),
  organizerCountry: Yup.string().required("Required"),
  organizerCity: Yup.string().required("Required"),
  companyName: Yup.string().required("Required"),
  companyVAT: Yup.string().required("Required"),
  companyAddress: Yup.string().required("Required"),
  companyPostalCode: Yup.string().required("Required"),
  companyCountry: Yup.string().required("Required"),
  companyCity: Yup.string().required("Required"),
  ticketName: Yup.string().required("Required"),
  emailContent: Yup.string().required("Required"),
  eventAddress: Yup.string().required("Required"),
  eventPostalCode: Yup.string().required("Required"),
  eventCountry: Yup.string().required("Required"),
  eventCity: Yup.string().required("Required"),
  entryTimeWithTicket: Yup.string().required("!"),
  eventStart: Yup.string().required("!"),
  eventEnd: Yup.string().required("!"),
  showCompanyInfo: Yup.boolean(),
  showOrganizerInfo: Yup.boolean(),
});

const validateTicketCustomizationForm = async (formValues) => {
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

export default validateTicketCustomizationForm;
