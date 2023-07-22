import React, { useState } from "react";
import "./ContactUs.scss";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import validateContactUsForm from "../../validation/ContactUs";
import { ReactSVG } from "react-svg";
import StatusModal from "../../components/UI/StatusModal";
import PrimaryButton from "../../components/UI/PrimaryButton";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";

const Qualities = [
  {
    title: "Quick Reply",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
  },
  {
    title: "On Call Events",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
  },
  {
    title: "Fast Resolution Center",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
  },
  {
    title: "Reliable Support",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
  },
];

const initalState = {
  firstName: "",
  lastName: "",
  email: "",
  object: "",
  description: "",
  phoneNumber: "",
};

const ContactUs = () => {
  const [formValues, setFormValues] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessStatus, setShowSuccessStatus] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (fileList.length + 1 > 3) return false;
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const contactUsFormSubmitHandler = async (e) => {
    e.preventDefault();
    const errors = await validateContactUsForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("email", formValues.email);
    formData.append("object", formValues.object);
    formData.append("description", formValues.description);
    fileList.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    // make api call here
    console.log(formValues);
    // showing success message
    setShowSuccessStatus(true);

    // resetting state
    setFormValues(initalState);
  };
  return (
    <div className="contact-us-page-container">
      <HeaderPlaceHolder />
      <div className="contact-us-main-container">
        <div className="contact-us-left">
          <div className="contact-us-left-top">
            <h5>Contact Us</h5>
            <h2>Contact with us if you have any type of Queries.</h2>
            <p>
              We will be contact with you within 24 hours and don’t worry we be
              contact with you ASAP and it will be friendly :{")"}
            </p>
          </div>
          <div className="contact-us-left-main">
            {Qualities.map((q, index) => {
              return (
                <div key={index} className="contact-single-item">
                  <div className="contact-single-item-head">
                    <ReactSVG src="/icons/tools/tick-circled.svg" />
                    <h3>{q.title}</h3>
                  </div>
                  <p>{q.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="contact-us-right">
          <form
            className="contact-us-form-container"
            onSubmit={contactUsFormSubmitHandler}
          >
            <div className="side-by-side-inputs">
              <div
                className={`form-item ${formErrors.firstName ? "error" : ""}`}
              >
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={formValues.firstName}
                />
                {formErrors.firstName && (
                  <p className="error-message">{formErrors.firstName}</p>
                )}
              </div>
              <div
                className={`form-item ${formErrors.lastName ? "error" : ""}`}
              >
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={formValues.lastName}
                />
                {formErrors.lastName && (
                  <p className="error-message">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className={`form-item ${formErrors.email ? "error" : ""}`}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                onChange={handleInputChange}
                value={formValues.email}
              />
              {formErrors.email && (
                <p className="error-message">{formErrors.email}</p>
              )}
            </div>
            <div
              className={`form-item ${formErrors.phoneNumber ? "error" : ""}`}
            >
              <label htmlFor="phoneNumber">Email Address</label>
              <PhoneInput
                defaultCountry="ua"
                value={formValues.phoneNumber}
                className={`phone-input-whole ${
                  formErrors.phoneNumber ? "phone-input-whole-error" : ""
                }`}
                inputClassName="phone-input"
                onChange={(e) =>
                  handleInputChange({
                    target: { value: e, name: "phoneNumber" },
                  })
                }
              />
              {formErrors.phoneNumber && (
                <p className="error-message">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div className={`form-item ${formErrors.object ? "error" : ""}`}>
              <label htmlFor="object">Object</label>
              <input
                type="text"
                name="object"
                id="object"
                placeholder="Enter an Object/Topic "
                onChange={handleInputChange}
                value={formValues.object}
              />
              {formErrors.object && (
                <p className="error-message">{formErrors.object}</p>
              )}
            </div>
            <div
              className={`form-item ${formErrors.description ? "error" : ""}`}
            >
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Description"
                onChange={handleInputChange}
                value={formValues.description}
              />
              {formErrors.description && (
                <p className="error-message">{formErrors.description}</p>
              )}
            </div>
            <Upload listType="picture" maxCount={3} {...props}>
              <Button
                className="upload-button"
                type="button"
                icon={<UploadOutlined color="#3d8aff" />}
              >
                Click or drag the file to upload
              </Button>
            </Upload>
            <PrimaryButton type={"submit"}>Submit</PrimaryButton>
          </form>
        </div>
      </div>
      <StatusModal
        open={showSuccessStatus}
        onCancel={setShowSuccessStatus}
        headline="Your queries are successfully sent!"
        description="We will contact with you on your email within 24 hours, don’t worry it will not take much time."
        button={{ text: "Back to Home", link: "/" }}
        link={{ text: "Have another query", url: "./" }}
        icon="/icons/tools/tick-success-status.svg"
      />
    </div>
  );
};

export default ContactUs;
