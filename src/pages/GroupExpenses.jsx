
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { Modal, Button, Form, Card, ListGroup, Badge, Row, Col, Alert } from "react-bootstrap";

function GroupExpenses() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [splitType, setSplitType] = useState("EQUAL"); // EQUAL or UNEQUAL
    const [selectedMembers, setSelectedMembers] = useState([]); // For EQUAL split (to exclude)
    const [splitAmounts, setSplitAmounts] = useState({}); // For UNEQUAL split: { email: amount }

    const fetchData = async () => {
        try {
            const groupRes = await axios.get(`${serverEndpoint}/groups/${groupId}`, { withCredentials: true });
            setGroup(groupRes.data);
            setPayer(groupRes.data.membersEmail[0]);

            // Initialize selected members for form
            setSelectedMembers(groupRes.data.membersEmail);

            // Initialize split amounts
            const initialSplits = {};
            groupRes.data.membersEmail.forEach(m => initialSplits[m] = 0);
            setSplitAmounts(initialSplits);

            const expensesRes = await axios.get(`${serverEndpoint}/expenses/${groupId}`, { withCredentials: true });
            setExpenses(expensesRes.data);

            const balancesRes = await axios.get(`${serverEndpoint}/expenses/${groupId}/balances`, { withCredentials: true });
            setBalances(balancesRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title,
                amount: parseFloat(amount),
                payer,
                participants: splitType === 'EQUAL' ? selectedMembers : Object.keys(splitAmounts),
                splitType,
                splits: splitType === 'UNEQUAL'
                    ? Object.entries(splitAmounts).map(([userId, amt]) => ({ userId, amount: parseFloat(amt) }))
                    : [], // Backend handles EQUAL calculation
                groupId,
                date: new Date()
            };

            await axios.post(`${serverEndpoint}/expenses/add`, payload, { withCredentials: true });

            setShowAddModal(false);
            setTitle("");
            setAmount("");
            fetchData();
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add expense: " + (error.response?.data?.message || error.message));
        }
    };

    const handleSettleUp = async () => {
        if (!window.confirm("Are you sure you want to settle all expenses? This will clear all debts.")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/${groupId}/settle`, {}, { withCredentials: true });
            fetchData();
            alert("Group settled successfully!");
        } catch (error) {
            console.error("Error settling group:", error);
            alert("Failed to settle group");
        }
    };

    // Form handlers
    const toggleMemberSelection = (email) => {
        if (selectedMembers.includes(email)) {
            setSelectedMembers(selectedMembers.filter(m => m !== email));
        } else {
            setSelectedMembers([...selectedMembers, email]);
        }
    };

    const handleSplitAmountChange = (email, value) => {
        setSplitAmounts({
            ...splitAmounts,
            [email]: value
        });
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!group) return <div className="text-center py-5">Group not found</div>;

    return (
        <div className="container py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Groups</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{group.name}</li>
                </ol>
            </nav>

            {/* Header Area */}
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h1 className="fw-bold mb-1">{group.name}</h1>
                    <p className="text-muted mb-2">{group.description}</p>
                    <div>
                        {group.membersEmail.map((email) => (
                            <Badge key={email} bg="light" text="dark" className="me-2 border">{email}</Badge>
                        ))}
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <Button variant="outline-success" className="me-2" onClick={handleSettleUp}>
                        <i className="bi bi-check-circle me-2"></i>Settle Up
                    </Button>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Add Expense
                    </Button>
                </div>
            </div>

            {/* Balances Summary */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0 bg-light">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Net Balances</h5>
                            <Row>
                                {Object.entries(balances).map(([email, balance]) => {
                                    if (Math.abs(balance) < 0.01) return null; // Hide zero balances
                                    const isOwed = balance > 0;
                                    return (
                                        <Col md={4} key={email} className="mb-2">
                                            <div className={`p-2 rounded border ${isOwed ? 'border-success bg-success-subtle' : 'border-danger bg-danger-subtle'}`}>
                                                <div className="fw-bold text-truncate" title={email}>{email}</div>
                                                <div className={isOwed ? 'text-success' : 'text-danger'}>
                                                    {isOwed ? 'gets back' : 'owes'} {group.paymentStatus.currency} {Math.abs(balance).toFixed(2)}
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                                {Object.values(balances).every(b => Math.abs(b) < 0.01) && (
                                    <Col><div className="text-muted">All settled up!</div></Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Expenses List */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold">Recent Expenses</h5>
                </Card.Header>
                <ListGroup variant="flush">
                    {expenses.length === 0 ? (
                        <ListGroup.Item className="text-center py-5 text-muted">
                            No expenses yet. Add one to get started!
                        </ListGroup.Item>
                    ) : (
                        expenses.map((expense) => (
                            <ListGroup.Item key={expense._id} className="py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1 fw-bold">{expense.title}</h6>
                                        <small className="text-muted">
                                            <span className="fw-bold text-dark">{expense.payer}</span> paid
                                            <span className="fw-bold"> {group.paymentStatus.currency} {expense.amount.toFixed(2)}</span>
                                        </small>
                                        <div className="mt-1" style={{ fontSize: '0.85rem' }}>
                                            <Badge bg="secondary" className="me-1">{expense.splitType}</Badge>
                                            <span className="text-muted">
                                                for {expense.splits?.length || 0} people
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-end text-muted">
                                        <small>{new Date(expense.date).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>

            {/* Add Expense Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddExpense}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Dinner, Taxi"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        min="0.01" step="0.01"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Paid By</Form.Label>
                            <Form.Select value={payer} onChange={(e) => setPayer(e.target.value)}>
                                {group.membersEmail.map(m => <option key={m} value={m}>{m}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <hr />

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold d-block mb-3">Split Options</Form.Label>
                            <div className="mb-3">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Split Equally"
                                    name="splitType"
                                    checked={splitType === 'EQUAL'}
                                    onChange={() => setSplitType('EQUAL')}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Split Unequally"
                                    name="splitType"
                                    checked={splitType === 'UNEQUAL'}
                                    onChange={() => setSplitType('UNEQUAL')}
                                />
                            </div>

                            {splitType === 'EQUAL' && (
                                <div>
                                    <p className="text-muted small mb-2">Select people to split with:</p>
                                    {group.membersEmail.map(member => (
                                        <Form.Check
                                            key={member}
                                            type="checkbox"
                                            label={member}
                                            checked={selectedMembers.includes(member)}
                                            onChange={() => toggleMemberSelection(member)}
                                            className="mb-1"
                                        />
                                    ))}
                                </div>
                            )}

                            {splitType === 'UNEQUAL' && (
                                <div>
                                    <p className="text-muted small mb-2">Enter amount for each person:</p>
                                    {group.membersEmail.map(member => (
                                        <Form.Group key={member} as={Row} className="mb-2 align-items-center">
                                            <Form.Label column sm="8" className="text-truncate">{member}</Form.Label>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    value={splitAmounts[member] || ''}
                                                    onChange={(e) => handleSplitAmountChange(member, e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </Col>
                                        </Form.Group>
                                    ))}
                                    <div className="text-end mt-2">
                                        <small className={
                                            Math.abs(Object.values(splitAmounts).reduce((a, b) => a + Number(b), 0) - amount) < 0.01
                                                ? "text-success" : "text-danger"
                                        }>
                                            Total: {Object.values(splitAmounts).reduce((a, b) => a + Number(b), 0).toFixed(2)} / {amount}
                                        </small>
                                    </div>
                                </div>
                            )}
                        </Form.Group>

                        <div className="d-grid mt-4">
                            <Button variant="primary" type="submit">Save Expense</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default GroupExpenses;
