import React, { useEffect } from "react";
import "./Roles.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import { useState } from "react";
import { useAllRoles } from "../../api/roles";
import RolesTable from "../../components/Tables/RolesTable";
import SecondaryButton from "../../components/UI/SecondaryButton";
import NewRoleModal from "../../components/Roles/NewRole";
import { useDeleteApi } from "../../hooks/api-hooks/useDeleteApi";
import { useQueryClient } from "@tanstack/react-query";
import usePermissionCheck from "../../hooks/usePermissionCheck";

const Roles = () => {
  const { checkPermission } = usePermissionCheck();
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [roleEditStatus, setRoleEditStatus] = useState(false);
  const [roleViewStatus, setRoleViewStatus] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const queryClient = useQueryClient();

  const { handleMutation, isLoading: isRoleDeleting } = useDeleteApi();

  const { isLoading: isRolesLoading } = useAllRoles((res) => {
    setFilteredData(res?.roles || []);
  });

  const onDeleteRole = () => {
    handleMutation(
      {
        path: `roles/delete-role/${selectedRole?._id}`,
      },
      (res) => {
        queryClient.invalidateQueries(["get-all-roles"]);
      },
      (res) => {}
    );
  };

  return (
    <>
      <Topbar title={"Roles"} subtitle={"Manage your Roles "} />
      <div className="manage-roles-page-container">
        <div className="table-container">
          <div className="table-container-header">
            <h3>Roles and Permissions</h3>
            <div className="header-right">
              {checkPermission("addRole").status && (
                <SecondaryButton onClick={() => setShowNewRoleModal(true)}>
                  Add a role
                </SecondaryButton>
              )}
            </div>
          </div>
          <RolesTable
            loading={isRolesLoading}
            rolesData={filteredData}
            setRoleEditStatus={setRoleEditStatus}
            setSelectedRole={setSelectedRole}
            setShowNewRoleModal={setShowNewRoleModal}
            setRoleViewStatus={setRoleViewStatus}
            onDeleteRole={onDeleteRole}
          />
        </div>
      </div>
      <NewRoleModal
        selectedRole={selectedRole}
        setRoleEditStatus={setRoleEditStatus}
        setShowNewRoleModal={setShowNewRoleModal}
        roleEditStatus={roleEditStatus}
        showNewRoleModal={showNewRoleModal}
        roleViewStatus={roleViewStatus}
      />
    </>
  );
};

export default Roles;
