import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(-1)} // Goes back in history
      className="bg-gray-200 px-4 py-2 rounded"
    >
      ← Back
    </button>
  );
}