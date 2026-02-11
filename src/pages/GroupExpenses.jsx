import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import CreateExpenseModal from "../components/CreateExpenseModal";
import { usePermission } from "../rbac/userPermissions";

function GroupExpenses() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const permissions = usePermission();

    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({});
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState(null);



    const fetchGroupData = async () => {
        try {
            setLoading(true);


            // For now, I'll proceed assuming I have the endpoint /groups/:groupId
            const groupRes = await axios.get(`${serverEndpoint}/groups/${groupId}`, { withCredentials: true });
            setGroup(groupRes.data);

            const expenseRes = await axios.get(`${serverEndpoint}/expenses/${groupId}`, { withCredentials: true });
            setExpenses(expenseRes.data.expenses);
            setSummary(expenseRes.data.summary);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.message || "Failed to load group data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSettle = async () => {
        if (!window.confirm("Are you sure you want to settle all expenses?")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/${groupId}/settle`, {}, { withCredentials: true });
            fetchGroupData();
        } catch (error) {
            console.error("Error settling group:", error);
        }
    };

    useEffect(() => {
        console.log("GroupExpenses mounted. GroupID:", groupId);
        if (groupId) {
            fetchGroupData();
        }
    }, [groupId]);

    if (loading) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="container p-5">
            {error && <div className="alert alert-danger">{error}</div>}

            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                &larr; Back to Groups
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">{group?.name || 'Group Expenses'}</h2>
                    <p className="text-muted">{group?.description}</p>
                </div>
                <div>
                    {/* Assume permissions handle this */}
                    <button className="btn btn-primary me-2" onClick={() => setShowAddModal(true)}>
                        Add Expense
                    </button>
                    <button className="btn btn-success" onClick={handleSettle}>
                        Settle Up
                    </button>
                </div>
            </div>

            {/* Summary Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title fw-bold mb-3">Balance Summary</h5>
                            <div className="row">
                                {Object.entries(summary).map(([email, balance]) => (
                                    <div key={email} className="col-md-4 mb-2">
                                        <div className={`p-3 rounded ${balance >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                            <h6 className="mb-1">{email}</h6>
                                            <p className="mb-0 fw-bold">
                                                {balance >= 0 ? `gets ${balance.toFixed(2)}` : `owes ${Math.abs(balance).toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(summary).length === 0 && <p className="text-muted">No balances to show.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <h4 className="fw-bold mb-3">Recent Expenses</h4>
            <div className="list-group shadow-sm">
                {expenses.length === 0 && <div className="list-group-item p-4 text-center text-muted">No expenses yet.</div>}

                {expenses.map(exp => (
                    <div key={exp._id} className={`list-group-item p-3 border-0 border-bottom ${exp.isSettled ? 'opacity-50' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1">{exp.description}</h5>
                                <small className="text-muted">
                                    Paid by <strong>{exp.paidBy}</strong> • {new Date(exp.date).toLocaleDateString()}
                                    {exp.isSettled && <span className="badge bg-secondary ms-2">Settled</span>}
                                </small>
                            </div>
                            <div className="text-end">
                                <h5 className={`mb-0 fw-bold ${exp.isSettled ? 'text-muted' : 'text-dark'}`}>
                                    INR {exp.amount.toFixed(2)}
                                </h5>
                                <small className="text-muted">{exp.splitMethod} split</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showAddModal && (
                <CreateExpenseModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    groupId={groupId}
                    members={group?.membersEmail || []}
                    onSuccess={fetchGroupData}
                />
            )}
        </div>
    );
}



export default GroupExpenses;
