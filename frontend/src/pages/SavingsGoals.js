import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target } from 'lucide-react';
import './SavingsGoals.css';

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: ''
    });

    const storedUserId = localStorage.getItem('userId');
    const parsedUserId = parseInt(storedUserId);
    const userId = !isNaN(parsedUserId) ? parsedUserId : 1;

    const fetchGoals = async () => {
        try {
            const res = await fetch(`http://localhost:8081/api/savings?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setGoals(data);
            }
        } catch (error) {
            console.error("Error fetching savings goals:", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            id: editingGoal ? editingGoal.id : null,
            userId,
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount) || 0,
            targetDate: formData.targetDate || null
        };

        try {
            const res = await fetch(`http://localhost:8081/api/savings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowModal(false);
                fetchGoals();
            } else {
                alert("Failed to save savings goal");
            }
        } catch (error) {
            console.error("Error saving goal", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this savings goal?")) return;
        try {
            const res = await fetch(`http://localhost:8081/api/savings/${id}`, { method: 'DELETE' });
            if (res.ok) fetchGoals();
        } catch (error) {
            console.error("Error deleting goal", error);
        }
    };

    const openModal = (goal) => {
        if (goal) {
            setEditingGoal(goal);
            setFormData({
                name: goal.name,
                targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount,
                targetDate: goal.targetDate || ''
            });
        } else {
            setEditingGoal(null);
            setFormData({ name: '', targetAmount: '', currentAmount: '0', targetDate: '' });
        }
        setShowModal(true);
    };

    return (
        <div className="savings-page">
            <header className="page-header">
                <div>
                    <h1>Savings Goals</h1>
                    <p>Track your cash reserves and big purchases</p>
                </div>
                <button className="btn-primary" onClick={() => openModal(null)}>
                    <Target size={20} />
                    Add Goal
                </button>
            </header>

            <div className="goals-grid">
                {goals.length === 0 ? (
                    <div className="empty-state card">No savings goals set yet.</div>
                ) : (
                    goals.map(g => {
                        const progress = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
                        const isComplete = g.currentAmount >= g.targetAmount;

                        return (
                            <div className="card goal-card" key={g.id}>
                                <div className="goal-header">
                                    <div className="goal-icon"><Target size={24} /></div>
                                    <div className="goal-actions">
                                        <button className="action-btn edit" onClick={() => openModal(g)}><Edit2 size={16} /></button>
                                        <button className="action-btn delete" onClick={() => handleDelete(g.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h3 className="goal-name">{g.name}</h3>
                                <div className="goal-amounts">
                                    <span className="current">${g.currentAmount.toFixed(2)}</span>
                                    <span className="target">/ ${g.targetAmount.toFixed(2)}</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div
                                        className={`progress-bar ${isComplete ? 'complete' : 'in-progress'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="goal-footer">
                                    <span className="percent">{progress.toFixed(0)}% reached</span>
                                    {g.targetDate && (
                                        <span className="target-date">By {new Date(g.targetDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingGoal ? 'Edit Savings Goal' : 'New Savings Goal'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Goal Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. New Car, Emergency Fund"
                                />
                            </div>
                            <div className="form-group row">
                                <div className="form-group-half">
                                    <label>Target Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.targetAmount}
                                        onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group-half">
                                    <label>Current Saved</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.currentAmount}
                                        onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Target Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.targetDate}
                                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavingsGoals;
