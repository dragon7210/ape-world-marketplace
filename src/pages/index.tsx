/** @format */
import { buildings, decorators } from "constant";
import { useNavigate } from "react-router-dom";

import "./apeworld.css";

const ApeWorld = () => {
  const navigate = useNavigate();

  return (
    <div className='main-board'>
      <div className='building-wrapper'>
        {buildings.map((building, index) => (
          <div
            className={`apeworld-${building} building`}
            key={index}
            onClick={() => navigate(building)}
          />
        ))}
      </div>
      <div className='decorator-wrapper'>
        {decorators.map((decorator, index) => (
          <div className={`apeworld-${decorator} decorator`} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ApeWorld;
