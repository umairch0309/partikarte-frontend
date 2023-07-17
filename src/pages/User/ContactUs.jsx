import React from "react";
import "./ContactUs.scss";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

import { ReactSVG } from "react-svg";
import PrimaryButton from "../../components/UI/PrimaryButton";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";

const ContactUs = () => {
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
            {Qualities.map((q) => {
              return (
                <div className="contact-single-item">
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
          <form className="contact-us-form-container">
            <div className="side-by-side-inputs">
              <div className="form-item">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className="form-item">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="object">Object</label>
              <input
                type="text"
                name="object"
                id="object"
                placeholder="Enter an Object/Topic "
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Description"
                required
              />
            </div>
            <Upload>
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
    </div>
  );
};

export default ContactUs;
