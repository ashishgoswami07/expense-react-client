import { Link } from "react-router-dom";
import { useState } from "react"
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import { usePermission } from "../rbac/userPermissions";

function GroupCard({ group, onUpdate }) {
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [errors, setErrors] = useState({});
    const permissions = usePermission();

    const handleShowMember = () => {
        setShowMembers(!showMembers);
    };
    const handleAddMember = async () => {
        if (memberEmail.length === 0) {
            return;
        }
        try {
            const response = await axios.put(`${serverEndpoint}/groups/add-members/${group._id}`,
                {
                    members: [memberEmail]
                },
                { withCredentials: true }
            );
            if (onUpdate) onUpdate(response.data);
            setMemberEmail('');
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to add member' });
        }
    };
    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 postion-relative">
            <div className="card-body p-4">
                <div>
                    <h5 className="">{group.name}</h5>
                    {/* */}
                    <button className="btn btn-sm btn-link p-0" onClick={handleShowMember}>
                        {group.membersEmail.length} Member | {showMembers ? 'Hide' : 'Show'} Members
                    </button>
                </div>
                <p>{group.description}</p>
                {showMembers && (<div className="rounded-3 p-3 mb-3 border">
                    <h6>Members in this Group</h6>
                    {group.membersEmail.map((member, index) => (
                        <div key={index}>{index + 1}. {member}</div>
                    ))}
                </div>
                )}

                {permissions.canUpdateGroups && (
                    <div className="mb-3">
                        <label className="form-label extra-small fw-bold text-secondary">Add Member</label>
                        <div className="input-group input-group-sm">
                            <input type="email" className="form-control border-end-0" value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                            />
                            <button className="btn btn-primary px-3" onClick={handleAddMember}>Add</button>
                        </div>
                    </div>
                )}


                <div className="d-grid mt-3">
                    <Link to={`/groups/${group._id}`} className="btn btn-outline-primary fw-bold">View Expenses</Link>
                </div>
            </div>
        </div>
    );
}
export default GroupCard;
