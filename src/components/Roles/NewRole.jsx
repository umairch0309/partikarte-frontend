import React, { useEffect, useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { Switch, message } from "antd";
import validateNewRole from "../../validation/NewRole";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useQueryClient } from "@tanstack/react-query";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { ReactSVG } from "react-svg";
import { Permssions } from "../../utilities/Permissions";

const initialState = {
  name: "",
  description: "",
  permissions: Permssions,
};

const NewRoleModal = ({
  setShowNewRoleModal,
  showNewRoleModal,
  setRoleEditStatus,
  selectedRole,
  roleEditStatus,
  roleViewStatus,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const { handleMutation, isLoading: isRoleCreating } = usePostApi();
  const { handleMutation: handleUpdateRole, isLoading: isRoleUpdating } =
    usePutApi();

  useEffect(() => {
    if (selectedRole && (roleEditStatus || roleViewStatus)) {
      setFormValues((prevState) => ({
        ...prevState,
        name: selectedRole?.name,
        description: selectedRole?.description,
        permissions: selectedRole?.permissions || [],
      }));
    }
  }, [roleEditStatus, roleViewStatus]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const [index, subIndex] = name.split("-").map(Number);

      if (name.split("-")[1] === "showSub") {
        setFormValues((prevState) => ({
          ...prevState,
          permissions: formValues.permissions.map((p, i) => {
            if (i === index) {
              return { ...p, showSub: checked };
            } else {
              return p;
            }
          }),
        }));
      }

      if (name.split("-")[1] !== "showSub") {
        if (subIndex === undefined) {
          // Main permission checkbox
          const updatedPermissions = [...formValues.permissions];
          updatedPermissions[index] = {
            ...updatedPermissions[index],
            isGranted: checked,
            showSub: true,
            sub: checked
              ? updatedPermissions[index].sub.map((subPerm) => ({
                  ...subPerm,
                  isGranted: true,
                }))
              : updatedPermissions[index].sub.map((subPerm) => ({
                  ...subPerm,
                  isGranted: false,
                })),
          };
          setFormValues((prevState) => ({
            ...prevState,
            permissions: updatedPermissions,
          }));
        } else {
          // Sub-permission checkbox
          const updatedPermissions = [...formValues.permissions];
          updatedPermissions[index].sub[subIndex] = {
            ...updatedPermissions[index].sub[subIndex],
            isGranted: checked,
          };
          if (checked === true) {
            updatedPermissions[index].isGranted = true;
          }

          setFormValues((prevState) => ({
            ...prevState,
            permissions: updatedPermissions,
          }));
        }
      }
    } else {
      if (name.split("-")[1] !== "showSub") {
        setFormValues((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateNewRole, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateNewRole(formValues);
    console.log(errors, "errors");

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
    }

    if (!(formValues.permissions.length > 0)) {
      message.error("Please provide permissions.");
      return;
    }

    const formData = {
      ...formValues,
      permissions: formValues.permissions.map((permission) => {
        const { showSub, ...rest } = permission;
        return rest;
      }),
    };

    setFormErrors({});

    if (selectedRole?._id && roleEditStatus) {
      console.log("updating");
      handleUpdateRole(
        {
          path: `roles/update-role/${selectedRole?._id}`,
          data: formData,
        },
        (res) => {
          setShowNewRoleModal(false);
          setRoleEditStatus(false);
          setFormValues(initialState);
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: `/roles/create-role`,
          data: formData,
        },
        (res) => {
          setShowNewRoleModal(false);
          setFormValues(initialState);
        },
        (res) => {}
      );
    }
  };

  return (
    <CustomModal
      onCancel={() => {
        setFormValues(initialState);
        setFormErrors({});
        setShowNewRoleModal(false);
        setRoleEditStatus(false);
      }}
      open={showNewRoleModal}
      onOk={() => {
        setShowNewRoleModal(false);
        setRoleEditStatus(false);
      }}
      title={roleViewStatus ? "View Role" : "Add Role and Permissions"}
      subtitle={
        roleViewStatus
          ? "All the information added."
          : "Please enter the information to add role."
      }
      width={!isMobile && 700}
    >
      <form className="add-new-role-form-container" onSubmit={handleSubmit}>
        <div className={`single-form-item ${formErrors.name ? "error" : ""}`}>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={roleViewStatus ? () => {} : handleInputChange}
            disabled={roleViewStatus}
            value={formValues.name}
            onBlur={handleOnBlur}
          />
          {formErrors.name && (
            <p className="error-message">{formErrors.name}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.description ? "error" : ""
          }`}
        >
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            type="text"
            id="description"
            placeholder="Enter description"
            onChange={roleViewStatus ? () => {} : handleInputChange}
            disabled={roleViewStatus}
            value={formValues.description}
            onBlur={handleOnBlur}
          />
          {formErrors.description && (
            <p className="error-message">{formErrors.description}</p>
          )}
        </div>

        <div className="all-checkboxes-container">
          <p className="permission"> Permissions </p>
          <p>
            {roleViewStatus
              ? "All module-wise permissions and sub-permissions"
              : "Allow a permission by checking a box"}
          </p>
          {formValues.permissions?.map((perm, index) => (
            <div className="single-roles-and-permission-form-item">
              <div key={index} className="single-checkbox-container">
                <div className="label">
                  <span>{perm.name}</span>
                  <div className="label-right">
                    <Switch
                      size="small"
                      defaultChecked={perm.isGranted}
                      checked={perm.isGranted}
                      disabled={roleViewStatus}
                      onChange={(v) =>
                        roleViewStatus
                          ? () => {}
                          : handleInputChange({
                              target: {
                                checked: v,
                                name: `${index}`,
                                type: "checkbox",
                              },
                            })
                      }
                    />
                    <ReactSVG
                      className={perm.showSub ? "show-arrow-up" : ""}
                      src={"/icons/tools/dropdown-icon.svg"}
                      onClick={() =>
                        handleInputChange({
                          target: {
                            checked: !perm.showSub,
                            name: `${index}-${"showSub"}`,
                            type: "checkbox",
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              {perm.showSub && perm?.sub && (
                <div className="all-checkboxes-container sub-list">
                  {perm?.sub?.map((subPerm, subIndex) => (
                    <div key={subIndex} className="single-checkbox-container">
                      <label className="sub-label">
                        <input
                          className="checkbox-input"
                          name={`${index}-${subIndex}`}
                          type="checkbox"
                          checked={subPerm.isGranted}
                          onChange={
                            roleViewStatus ? () => {} : handleInputChange
                          }
                          disabled={roleViewStatus}
                        />
                        <span>{subPerm.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {!roleViewStatus && (
          <PrimaryButton
            disabled={isRoleCreating || isRoleUpdating}
            className={"form-submit-button"}
          >
            Confirm
          </PrimaryButton>
        )}
      </form>
    </CustomModal>
  );
};

export default NewRoleModal;
