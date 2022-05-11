const Sprotty = () => {
  return (
    <div>
      <h1>Sprotty Circles Example</h1>
      <p>
        <button id="addNode">Add node</button>
        <button id="scrambleAll">Scramble all</button>
        <button id="scrambleSelection">Scramble selection</button>
      </p>
      <div>
        <div id="sprotty" className="sprotty" />
      </div>
    </div>
  );
};

export default Sprotty;
