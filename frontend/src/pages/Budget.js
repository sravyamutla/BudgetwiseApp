import React, { useState, useEffect } from 'react';
import { Plus, Utensils, Car, Ticket, ShoppingBag, Plane, Shield, Home, Heart, Coffee, Wallet, Target, Edit2, Trash2 } from 'lucide-react';
import './Budget.css';

const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
        case 'food': case 'food & dining': return <Utensils size={20} />;
        case 'transport': case 'transportation': return <Car size={20} />;
        case 'entertainment': return <Ticket size={20} />;
        case 'shopping': return <ShoppingBag size={20} />;
        case 'housing': case 'home': return <Home size={20} />;
        case 'health': return <Heart size={20} />;
        case 'utilities': return <Coffee size={20} />;
        default: return <Wallet size={20} />;
    }
};

const getGoalIcon = (name) => {
    const lName = name.toLowerCase();
    if (lName.includes('vacation') || lName.includes('travel')) return <Plane size={20} />;
    if (lName.includes('emergency')) return <Shield size={20} />;
    return <Target size={20} />;
};

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    // For editing
    const [editingBudget, setEditingBudget] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);

    const [budgetFormData, setBudgetFormData] = useState({ category: '', amountLimit: '' });
    const [goalFormData, setGoalFormData] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });

    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const storedUserId = localStorage.getItem('userId');
    const parsedUserId = parseInt(storedUserId);
    const userId = !isNaN(parsedUserId) ? parsedUserId : 1;

    const fetchData = async () => {
        try {
            const [bRes, sRes] = await Promise.all([
                fetch(`http://localhost:8081/api/budgets?userId=${userId}&monthYear=${currentMonth}`),
                fetch(`http://localhost:8081/api/savings?userId=${userId}`)
            ]);

            if (bRes.ok) setBudgets(await bRes.json());
            if (sRes.ok) setSavingsGoals(await sRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentMonth]);

    // Handlers for Budget
    const handleSaveBudget = async (e) => {
        e.preventDefault();
        const payload = {
            userId,
            category: budgetFormData.category,
            amountLimit: parseFloat(budgetFormData.amountLimit),
            monthYear: currentMonth
        };

        try {
            const res = await fetch(`http://localhost:8081/api/budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowBudgetModal(false);
                fetchData();
            } else {
                alert("Failed to save budget");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteBudget = async (id) => {
        if (!window.confirm("Delete this budget?")) return;
        try {
            const res = await fetch(`http://localhost:8081/api/budgets/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // Handlers for Savings Goals
    const handleSaveGoal = async (e) => {
        e.preventDefault();
        const payload = {
            id: editingGoal ? editingGoal.id : null,
            userId,
            name: goalFormData.name,
            targetAmount: parseFloat(goalFormData.targetAmount),
            currentAmount: parseFloat(goalFormData.currentAmount) || 0,
            targetDate: goalFormData.targetDate || null
        };

        try {
            const res = await fetch(`http://localhost:8081/api/savings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowGoalModal(false);
                fetchData();
            } else {
                alert("Failed to save goal");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteGoal = async (id) => {
        if (!window.confirm("Delete this goal?")) return;
        try {
            const res = await fetch(`http://localhost:8081/api/savings/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // Modal Openers
    const openBudgetModal = (budget) => {
        if (budget) {
            setEditingBudget(budget);
            setBudgetFormData({ category: budget.category, amountLimit: budget.amountLimit });
        } else {
            setEditingBudget(null);
            setBudgetFormData({ category: '', amountLimit: '' });
        }
        setShowBudgetModal(true);
    };

    const openGoalModal = (goal) => {
        if (goal) {
            setEditingGoal(goal);
            setGoalFormData({
                name: goal.name, targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount, targetDate: goal.targetDate || ''
            });
        } else {
            setEditingGoal(null);
            setGoalFormData({ name: '', targetAmount: '', currentAmount: '0', targetDate: '' });
        }
        setShowGoalModal(true);
    };

    return (
        <div className="budget-page-wrapper">
            {/* Decorative background blobs for glassmorphism effect */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="budget-dashboard">
                <header className="page-header simple-header">
                    <div className="header-left">
                        <h1>Budget & Goals</h1>
                    </div>
                    <div className="header-actions">
                        <input
                            type="month"
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(e.target.value)}
                            className="month-picker"
                        />
                    </div>
                </header>

                <div className="content-container">
                    {/* Monthly Budget Section */}
                    <div className="section-block">
                        <div className="section-header">
                            <h2>Monthly Budget</h2>
                            <button className="add-icon-btn" onClick={() => openBudgetModal(null)}><Plus size={20} /></button>
                        </div>

                        <div className="list-container">
                            {budgets.length === 0 ? (
                                <p className="empty-text">No budgets set.</p>
                            ) : (
                                budgets.map(b => {
                                    const remaining = b.amountLimit - b.spentAmount;
                                    const isOver = remaining < 0;
                                    return (
                                        <div className="list-item" key={b.id}>
                                            <div className="item-icon-wrapper">
                                                {getCategoryIcon(b.category)}
                                            </div>
                                            <div className="item-details">
                                                <p className="item-title">{b.category}</p>
                                                <p className={`item-subtitle ${isOver ? 'over' : ''}`}>
                                                    {isOver ? `Over budget by $${Math.abs(remaining).toFixed(0)}` : `$${remaining.toFixed(0)} remaining`}
                                                </p>
                                            </div>
                                            <div className="item-actions">
                                                <button className="icon-btn edit" onClick={() => openBudgetModal(b)}><Edit2 size={16} /></button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteBudget(b.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Savings Goals Section */}
                    <div className="section-block">
                        <div className="section-header">
                            <h2>Savings Goals</h2>
                            <button className="add-icon-btn" onClick={() => openGoalModal(null)}><Plus size={20} /></button>
                        </div>

                        <div className="list-container">
                            {savingsGoals.length === 0 ? (
                                <p className="empty-text">No savings goals set.</p>
                            ) : (
                                savingsGoals.map(g => {
                                    const remaining = g.targetAmount - g.currentAmount;
                                    const isGoalMet = remaining <= 0;
                                    return (
                                        <div className="list-item" key={g.id}>
                                            <div className="item-icon-wrapper">
                                                {getGoalIcon(g.name)}
                                            </div>
                                            <div className="item-details">
                                                <p className="item-title">{g.name}</p>
                                                <p className={`item-subtitle ${isGoalMet ? 'success' : ''}`}>
                                                    {isGoalMet ? 'Goal met!' : `$${remaining.toFixed(0)} remaining`}
                                                </p>
                                            </div>
                                            <div className="item-actions">
                                                <button className="icon-btn edit" onClick={() => openGoalModal(g)}><Edit2 size={16} /></button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteGoal(g.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Budget Modal */}
                {showBudgetModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{editingBudget ? 'Edit Budget' : 'Set Budget'}</h2>
                            <form onSubmit={handleSaveBudget}>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={budgetFormData.category}
                                        onChange={e => setBudgetFormData({ ...budgetFormData, category: e.target.value })}
                                        required
                                        disabled={!!editingBudget}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Food & Dining">Food & Dining</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Health">Health</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Amount Limit</label>
                                    <input
                                        type="number" step="0.01" required
                                        value={budgetFormData.amountLimit}
                                        onChange={e => setBudgetFormData({ ...budgetFormData, amountLimit: e.target.value })}
                                        placeholder="e.g. 500.00"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-outline" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Save Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Goal Modal */}
                {showGoalModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
                            <form onSubmit={handleSaveGoal}>
                                <div className="form-group">
                                    <label>Goal Name</label>
                                    <input
                                        type="text" required
                                        value={goalFormData.name}
                                        onChange={e => setGoalFormData({ ...goalFormData, name: e.target.value })}
                                        placeholder="e.g. Vacation Fund"
                                    />
                                </div>
                                <div className="form-group row">
                                    <div className="form-group-half">
                                        <label>Target Amount</label>
                                        <input
                                            type="number" step="0.01" required
                                            value={goalFormData.targetAmount}
                                            onChange={e => setGoalFormData({ ...goalFormData, targetAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group-half">
                                        <label>Current Saved</label>
                                        <input
                                            type="number" step="0.01" required
                                            value={goalFormData.currentAmount}
                                            onChange={e => setGoalFormData({ ...goalFormData, currentAmount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Target Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={goalFormData.targetDate}
                                        onChange={e => setGoalFormData({ ...goalFormData, targetDate: e.target.value })}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-outline" onClick={() => setShowGoalModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Save Goal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budget;
