import { useState } from "react";

function GroupCard({ group }) {
  const [showMembers, setShowMembers] = useState(false);

  const handleShowMember = () => {
    setShowMembers(!showMembers);
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
      <div className="card-body p-4">
        <div>
          <h5>{group.name}</h5>

          <button
            className="btn btn-sm btn-link p-0 text-primary"
            onClick={handleShowMember}
          >
            {group.membersEmail.length} Members |{" "}
            {showMembers ? "Hide Members" : "Show Members"}
          </button>
        </div>

        <p className="mt-2">{group.description}</p>

        {showMembers && (
          <div className="rounded-3 p-3 mb-3 border">
            <h6>Members in the Group</h6>

            {group.membersEmail.map((email, index) => (
              <div key={index} className="small">
                {email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupCard;
