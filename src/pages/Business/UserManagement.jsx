import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./UserManagement.scss";
import { ReactSVG } from "react-svg";
import SecondaryButton from "../../components/UI/SecondaryButton";
import MemebersTable from "../../components/Tables/MembersTable";
import AddNewMember from "../../components/UserManagement/AddNewMember";

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [showAddNewMember, setShowAddNewMember] = useState(false);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      const row = {
        key: i,
        name: "John",
        surname: "Smith",
        email: "john.smith@example.com",
        address: " House No. 73, Street No.3, London, United Kingdom (PB76781)",
        datOfBirth: "24 Jan, 2023",
        memberType: "Admin",
      };
      array.push(row);
    }
    setData(array);
  }, []);

  return (
    <>
      <Topbar
        title={"User Management"}
        subtitle={"Manage your users in an easy way."}
      />
      <div className="user-managment-page-container">
        <div className="user-managment-page-bottom-main">
          <div className="user-managment-page-bottom-main-header">
            <div className="header-left">
              <h3>Members</h3>
            </div>
            <div className="header-right">
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input type="text" name="search" placeholder="Search members" />
              </div>
              <select name="guestType">
                <option value={"allMemeberTypes"}>All member types</option>
                <option value={"memeberType1"}>Member type 1</option>
                <option value={"memeberType2"}>Member type 2</option>
                <option value={"memeberType3"}>Member type 3</option>
              </select>
              <SecondaryButton onClick={() => setShowAddNewMember(true)}>
                <ReactSVG src="/icons/tools/plus-person.svg" />
                <span>Add New Member</span>
              </SecondaryButton>
            </div>
          </div>
          <MemebersTable membersData={data} />
        </div>
      </div>
      <AddNewMember
        showAddNewMember={showAddNewMember}
        setShowAddNewMember={setShowAddNewMember}
      />
    </>
  );
};

export default UserManagement;
