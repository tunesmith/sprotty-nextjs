import { Bounds, Point, SEdge, SModelElement, SNode } from "sprotty-protocol";
import createContainer from "./di.config";
import { IActionDispatcher, LocalModelSource, TYPES } from "sprotty";

const NODE_SIZE = 60;

const Sprotty = () => {
  let count = 2;
  function addNode(bounds: Bounds): SModelElement[] {
    const newNode: SNode = {
      id: "node" + count,
      type: "node:circle",
      position: {
        x: bounds.x + Math.random() * (bounds.width - NODE_SIZE),
        y: bounds.y + Math.random() * (bounds.height - NODE_SIZE),
      },
      size: {
        width: NODE_SIZE,
        height: NODE_SIZE,
      },
    };
    const newEdge: SEdge = {
      id: "edge" + count,
      type: "edge:straight",
      sourceId: "node0",
      targetId: "node" + count,
    };
    count++;
    return [newNode, newEdge];
  }

  function focusGraph(): void {
    const graphElement = document.getElementById("graph");
    if (graphElement !== null && typeof graphElement.focus === "function")
      graphElement.focus();
  }

  function getVisibleBounds({
    canvasBounds,
    scroll,
    zoom,
  }: {
    canvasBounds: Bounds;
    scroll: Point;
    zoom: number;
  }): Bounds {
    return {
      ...scroll,
      width: canvasBounds.width / zoom,
      height: canvasBounds.height / zoom,
    };
  }

  const container = createContainer();
  const dispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

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
