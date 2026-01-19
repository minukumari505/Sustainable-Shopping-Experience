import React from 'react';
import '../Css/GroupCard.css';
import axios from 'axios';

const GroupCard = ({ group, currentUser, onLeave }) => {
  const user = currentUser || localStorage.getItem("email");

  const daysLeft = (() => {
    const today = new Date();
    const deadlineDate = new Date(group.deadline);
    const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} day(s) left` : 'Closed';
  })();

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      await axios.post(`http://localhost:8080/group/leave/${group._id}`, {
        user
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
      });

      onLeave(group._id);
    } catch (err) {
      alert('Error leaving group');
      console.error(err);
    }
  };

  return (
    <div className="group-card">
      <div className="group-card-header">
        <h2>{group.name}</h2>
        <span className="deadline">{daysLeft}</span>
      </div>

      <div className="group-card-body">
        {group.locationName && (
          <p><strong>📍 Location:</strong> {group.locationName}</p>
        )}
        <p><strong>Members:</strong> {group.members.length}</p>
        <p><strong>Deadline:</strong> {new Date(group.deadline).toLocaleDateString()}</p>
        <p><strong>Shared Link:</strong> <a href={group.link} target="_blank" rel="noreferrer">{group.link}</a></p>
      </div>

      <div className="group-card-footer">
        {group.members.includes(user) && (
          <button className="leave-btn" onClick={handleLeave}>❌ Leave Group</button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;