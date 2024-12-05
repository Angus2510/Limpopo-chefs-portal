import React from "react";

const DisabledBanner = ({ reason }) => {
  return (
    <div className="w-full mt-6 p-4 bg-red-500 rounded-xl text-white text-center">
      <p>This student is disabled.</p>
      {reason && <p>Reason: {reason}</p>}
    </div>
  );
};

export default DisabledBanner;
