import * as Yup from "yup";

export const AddNewEventSchema = Yup.object().shape({
  title: Yup.string().trim().required("Required"),
  description: Yup.string().trim().required("Required"),
  category: Yup.string().required("Required"),
  eventType: Yup.string()
    .oneOf(["Venue", "Online"], "Required")
    .required("Required"),
  venueName: Yup.string().required("Required"),
  eventBanner: Yup.string().required("Event banner is required."),
  address: Yup.string().when("eventType", {
    is: "Venue",
    then: () => Yup.string().required("Required"),
  }),
  country: Yup.string().when("eventType", {
    is: "Venue",
    then: () => Yup.string().required("Required"),
  }),
  city: Yup.string().when("eventType", {
    is: "Venue",
    then: () => Yup.string().required("Required"),
  }),
  postalCode: Yup.string().when("eventType", {
    is: "Venue",
    then: () => Yup.string().required("Required"),
  }),
  eventLink: Yup.string().when("eventType", {
    is: "Online",
    then: () => Yup.string().required("Required"),
  }),
  startingDate: Yup.string().required("!"),
  endingDate: Yup.string().required("!"),
  dateDifference: Yup.mixed().test({
    name: "dateDifference",
    message: "Date difference must be at least 15 minutes",
    test: function () {
      const startingDate = new Date(this.parent.startingDate).getTime();
      const endingDate = new Date(this.parent.endingDate).getTime();
      const differenceInMilliseconds = endingDate - startingDate;
      return differenceInMilliseconds > 15 * 1000;
    },
  }),
});
