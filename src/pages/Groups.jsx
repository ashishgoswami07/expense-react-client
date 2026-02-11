import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import { usePermission } from "../rbac/userPermissions";

function Groups() {
  const [groups, setGroups] = useState([]); // array
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const permissions = usePermission();
// const [currentPage,setCurrentPAGE]=useState(1);
// CONST [totalPages,setTotalPages]=useState(1);
// CONST[limit]=useState(3);
  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/groups/my-groups`,
        { withCredentials: true }
      );

      // extract array correctly
      setGroups(response.data.groups || []);
    } catch (error) {
      console.log("Error fetching groups:", error.response?.data?.message || error.message);
      setGroups([]); // safety
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="container p-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div className="container p-5">
      {/* HEADER */}
      <div className="row align-items-center mb-5">
        <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
          <h2 className="fw-bold text-dark display-6">
            Your <span className="text-primary">Groups</span>
          </h2>
          <p className="text-muted mb-0">
            Manage your shared expenses and split expenses in one click.
          </p>
        </div>
        {permissions.canCreateGroups && (
          <div className="col-md-4 text-center text-md-end">
            <button
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
              onClick={() => setShow(true)}
            >
              <i className="bi bi-plus-lg me-2"></i>
              New Group
            </button>
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {groups.length === 0 && (
        <p className="text-center">
          No groups found, Start by creating one!
        </p>
      )}

      {/* GROUP LIST */}
      {groups.length > 0 && (
        <div className="row g-4">
          {groups.map((group) => (
            <div className="col-md-6 col-lg-4" key={group._id}>
              <GroupCard group={group} onUpdate={fetchGroups} />
            </div>
          ))}
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      <CreateGroupModal
        show={show}
        onHide={(refresh) => {
          setShow(false);
          if (refresh) {
            fetchGroups(); // refresh after create
          }
        }}
      />
    </div>
  );
}

export default Groups;
