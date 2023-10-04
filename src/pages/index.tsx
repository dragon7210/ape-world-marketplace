/** @format */
import { buildings, decorators } from "constant";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useCustomQuery } from "hooks";
import { getCollections } from "utils/query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCollectionOptions } from "actions/collections";

import "./apeworld.css";

const ApeWorld = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: {},
  });

  useEffect(() => {
    dispatch(setCollectionOptions(collectionOptions));
  }, [dispatch, collectionOptions]);

  return (
    <div className='bg-[#00c4ee] min-h-[100vh] flex items-center justify-center'>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={1}
        limitToBounds={true}
        pinch={{ step: 1 }}>
        <TransformComponent>
          <div className='main-board'>
            {buildings.map((building, index) => (
              <div
                className={`apeworld-${building} building`}
                key={index}
                onClick={() => navigate(building)}
              />
            ))}
            {decorators.map((decorator, index) => (
              <div className={`apeworld-${decorator} decorator`} key={index} />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ApeWorld;
