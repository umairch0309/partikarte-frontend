import React, { useEffect } from "react";
import "./Roles.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import { useState } from "react";
import { useAllRoles } from "../../api/roles";
import RolesTable from "../../components/Tables/RolesTable";
import SecondaryButton from "../../components/UI/SecondaryButton";
import NewRoleModal from "../../components/Roles/NewRole";

const Roles = () => {
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [roleEditStatus, setRoleEditStatus] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const { isLoading: isRolesLoading } = useAllRoles((res) => {
    if (res?.roles) {
      setFilteredData(res?.roles);
    }
  });

  return (
    <>
      <Topbar title={"Roles"} subtitle={"Manage your Roles "} />
      <div className="manage-roles-page-container">
        <div className="table-container">
          <div className="table-container-header">
            <h3>Roles and Permissions</h3>
            <div className="header-right">
              <SecondaryButton onClick={() => setShowNewRoleModal(true)}>
                Add a role
              </SecondaryButton>
            </div>
          </div>
          <RolesTable loading={isRolesLoading} rolesData={filteredData} />
        </div>
      </div>
      <NewRoleModal
        selectedRole={selectedRole}
        setRoleEditStatus={setRoleEditStatus}
        setShowNewRoleModal={setShowNewRoleModal}
        roleEditStatus={roleEditStatus}
        showNewRoleModal={showNewRoleModal}
      />
    </>
  );
};

export default Roles;
