import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectSkills } from '../api/apiCalls';

const options = [
  "Plumbing",
  "Electrical Work",
    "Carpentry",
    "Painting",
    "Landscaping",
    "Cleaning",
    "Moving",
    "General Handyman"
];

export default function SelectSkills() {
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOption = (option) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert("Please select at least one skill.");
      return;
    }
    try{
        await selectSkills(selected);
        navigate("/");
    } catch (error) {
        console.error("Failed to save skills:", error);
    }
  };

  return (
    <div className={skillsPrompt}>
      <div className={skillsHeader}>
        <p>What skills do you have?</p>
        <button onClick={() => setIsOpen(prev => !prev)}>
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {isOpen && (
        <div className={skillOptions}>
          {options.map(option => (
            <button
              key={option}
              type="button"
              className={selected.includes(option) ? "chip active" : "chip"}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleSubmit} disabled={selected.length === 0}>Done</button>
    </div>
  );
}

