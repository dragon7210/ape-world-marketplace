/** @format */
import './apeworld.css'

const ApeWorld = () => {
  const buildings = [
    "store",
    "ship",
    "jungle",
    "shop",
    "lab",
    "casino",
    "bar",
    "gym",
    "realstate",
  ];
  const decorators = [
    "gull",
    "islandstones",
    "lack",
    "palm",
    "seastones",
    "title",
    "whale",
  ];
  return <div className='main-board'>
    <div className='building-wrapper'>
      {buildings.map((building, index) =>
        <div className={`apeworld-${building} building`} key={index} />
      )}
    </div>
    <div className='decorator-wrapper'>
      {decorators.map((decorator, index) => <div className={`apeworld-${decorator} decorator`} key={index} id={decorator} />
      )}
    </div>
  </div>;
};

export default ApeWorld;
