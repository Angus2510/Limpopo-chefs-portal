import { useEffect, useState, useRef } from 'react';
import { useToggleStudentStatusMutation } from '@/lib/features/students/studentsApiSlice';

function useOutsideAlerter(ref, setX) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

const DisableStudentDropdown = ({ button, studentId, isDisabled }) => {
  const wrapperRef = useRef(null);
  const [openWrapper, setOpenWrapper] = useState(false);
  const [reason, setReason] = useState('');
  const [toggleStudentStatus] = useToggleStudentStatusMutation();

  useOutsideAlerter(wrapperRef, setOpenWrapper);

  const handleDisableClick = async () => {
    try {
      await toggleStudentStatus({ id: studentId, reason: isDisabled ? '' : reason }).unwrap();
      setOpenWrapper(false);
    } catch (error) {
      console.error('Failed to toggle student status:', error);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-start">
      <div onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button}
      </div>
      <div
        className={`absolute z-10 mt-2 left-0 transition-all duration-300 ease-in-out ${
          openWrapper ? 'scale-100' : 'scale-0'
        }`}
      >
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl mb-4">{isDisabled ? 'Activate Student' : 'Disable Student'}</h2>
          {!isDisabled && (
            <label className="block mb-2">
              Reason:
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="block w-full mt-1"
              >
                <option value="">Select a reason</option>
                <option value="Duplicate entry">Duplicate entry</option>
                <option value="Maternity leave">Maternity leave</option>
                <option value="Arrears Account">Arrears Account</option>
                <option value="Medical Reasons">Medical Reasons</option>
                <option value="Dropped Out">Dropped Out</option>
                <option value="De-Registered due to study agreement expired">De-Registered due to study agreement expired</option>
                <option value="other">Other</option>
              </select>
            </label>
          )}
          <button
            onClick={handleDisableClick}
            className={`mt-4 px-4 py-2 ${isDisabled ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}
          >
            {isDisabled ? 'Activate' : 'Disable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableStudentDropdown;
