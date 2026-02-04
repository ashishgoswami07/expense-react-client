function GroupCard({ group}) {
    return {
<div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
    <div className="card-body p-4">
        <div>
            <h5 className="">{group.name}</h5>
            <button>
                Show Members
            </button>
        </div>
    </div>
</div>
}}
export default GroupCard;