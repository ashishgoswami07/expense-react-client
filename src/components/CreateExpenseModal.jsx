import axios from "axios";
import { useState, useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";

function CreateExpenseModal({ show, onHide, groupId, members, onSuccess }) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        paidBy: "", // email
        splitMethod: "equal", // equal or exact
        excludedEmails: [],
        splitDetails: {} // { email: amount } for exact
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show && members.length > 0) {
            // Set default payer to first member if not set
            if (!formData.paidBy) {
                setFormData(prev => ({ ...prev, paidBy: members[0] }));
            }
        }
    }, [show, members]);

    const validate = () => {
        const newErrors = {};
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Amount must be greater than 0";
        if (!formData.paidBy) newErrors.paidBy = "Payer is required";

        if (formData.splitMethod === 'exact') {
            const totalSplit = Object.values(formData.splitDetails).reduce((sum, val) => sum + Number(val || 0), 0);
            if (Math.abs(totalSplit - Number(formData.amount)) > 0.1) {
                newErrors.split = `Total split (${totalSplit}) must match expense amount (${formData.amount})`;
            }
        } else {
            // Equal split validation
            const includedCount = members.length - formData.excludedEmails.length;
            if (includedCount <= 0) {
                newErrors.split = "At least one person must include in the split";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload = {
                description: formData.description,
                amount: Number(formData.amount),
                payerEmail: formData.paidBy,
                splitMethod: formData.splitMethod,
                excludedEmails: formData.excludedEmails
            };

            if (formData.splitMethod === 'exact') {
                payload.splitDetails = Object.entries(formData.splitDetails).map(([email, amount]) => ({
                    email,
                    amount: Number(amount)
                })).filter(item => item.amount > 0);
            }

            await axios.post(`${serverEndpoint}/expenses/${groupId}/add`, payload, { withCredentials: true });

            onHide();
            onSuccess(); // Refresh parent
            setFormData({
                description: "",
                amount: "",
                paidBy: members[0] || "",
                splitMethod: "equal",
                excludedEmails: [],
                splitDetails: {}
            });
        } catch (error) {
            console.error("Add expense error:", error);
            setErrors({ submit: error.response?.data?.message || "Failed to add expense" });
        }
    };

    const toggleExclude = (email) => {
        setFormData(prev => {
            const excluded = prev.excludedEmails.includes(email)
                ? prev.excludedEmails.filter(e => e !== email)
                : [...prev.excludedEmails, email];
            return { ...prev, excludedEmails: excluded };
        });
    };

    const handleSplitAmountChange = (email, value) => {
        setFormData(prev => ({
            ...prev,
            splitDetails: { ...prev.splitDetails, [email]: value }
        }));
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Expense</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <input type="text" className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Amount</label>
                                    <input type="number" className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Paid By</label>
                                    <select className="form-select"
                                        value={formData.paidBy}
                                        onChange={e => setFormData({ ...formData, paidBy: e.target.value })}>
                                        {members.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Split Method</label>
                                <div className="btn-group w-100" role="group">
                                    <input type="radio" className="btn-check" name="splitMethod" id="equal"
                                        checked={formData.splitMethod === 'equal'}
                                        onChange={() => setFormData({ ...formData, splitMethod: 'equal' })} />
                                    <label className="btn btn-outline-primary" htmlFor="equal">Equally</label>

                                    <input type="radio" className="btn-check" name="splitMethod" id="exact"
                                        checked={formData.splitMethod === 'exact'}
                                        onChange={() => setFormData({ ...formData, splitMethod: 'exact' })} />
                                    <label className="btn btn-outline-primary" htmlFor="exact">Exact Amounts</label>
                                </div>
                            </div>

                            {errors.split && <div className="text-danger mb-2">{errors.split}</div>}

                            <div className="card p-3 bg-light">
                                <h6>Split Details</h6>
                                {members.map(member => (
                                    <div key={member} className="d-flex align-items-center mb-2">
                                        <div className="me-3" style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {member}
                                        </div>

                                        {formData.splitMethod === 'equal' && (
                                            <div className="form-check">

                                                <input className="form-check-input" type="checkbox"
                                                    checked={!formData.excludedEmails.includes(member)}
                                                    onChange={() => toggleExclude(member)}
                                                />
                                                <label className="form-check-label">Include</label>
                                            </div>
                                        )}

                                        {formData.splitMethod === 'exact' && (
                                            <input type="number" className="form-control" placeholder="0.00" style={{ width: '120px' }}
                                                value={formData.splitDetails[member] || ''}
                                                onChange={(e) => handleSplitAmountChange(member, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 text-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={onHide}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateExpenseModal;
