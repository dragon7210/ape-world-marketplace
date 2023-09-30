/** @format */
import { buildings, decorators } from "constant";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import "./apeworld.css";

const ApeWorld = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-[#00c4ee]'>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={2}
          limitToBounds={true}
          pinch={{ step: 1 }}>
          <TransformComponent
            wrapperStyle={{ height: "100vh", width: "100vw" }}>
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
                  <div
                    className={`apeworld-${decorator} decorator`}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
};

export default ApeWorld;
