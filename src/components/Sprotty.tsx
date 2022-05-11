import {
  Bounds,
  getBasicType,
  Point,
  SEdge,
  SelectAction,
  SGraph,
  SModelElement,
  SNode,
} from "sprotty-protocol";
import createContainer from "./di.config";
import {
  ElementMove,
  IActionDispatcher,
  LocalModelSource,
  MoveAction,
  TYPES,
} from "sprotty";
import { useEffect } from "react";

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

  // Initialize model
  const node0 = {
    id: "node0",
    type: "node:circle",
    position: { x: 100, y: 100 },
    size: { width: NODE_SIZE, height: NODE_SIZE },
  };
  const graph: SGraph = { id: "graph", type: "graph", children: [node0] };

  useEffect(() => {
    const load = async () => {
      const initialViewport = await modelSource.getViewport();
      for (let i = 0; i < 20; ++i) {
        const newElements = addNode(getVisibleBounds(initialViewport));
        graph.children.push(...newElements);
      }

      // Run
      await modelSource.setModel(graph);
    };
    load().then();
  }, []);

  const addNodeHandler = async () => {
    let viewport = await modelSource.getViewport();
    let newElements = addNode(getVisibleBounds(viewport));
    await modelSource.addElements(newElements);
    await dispatcher.dispatch(
      SelectAction.create({ selectedElementsIDs: newElements.map((e) => e.id) })
    );
    focusGraph();
  };

  const scrambleAllHandler = async () => {
    const viewport = await modelSource.getViewport();
    const bounds = getVisibleBounds(viewport);
    const nodeMoves: ElementMove[] = [];
    graph.children.forEach((shape) => {
      if (getBasicType(shape) === "node") {
        nodeMoves.push({
          elementId: shape.id,
          toPosition: {
            x: bounds.x + Math.random() * (bounds.width - NODE_SIZE),
            y: bounds.y + Math.random() * (bounds.height - NODE_SIZE),
          },
        });
      }
    });
    await dispatcher.dispatch(MoveAction.create(nodeMoves, { animate: true }));
    focusGraph();
  };

  const scrambleSelectionHandler = async () => {
    const selection = await modelSource.getSelection();
    const viewport = await modelSource.getViewport();
    const bounds = getVisibleBounds(viewport);
    const nodeMoves: ElementMove[] = [];
    selection.forEach((shape) => {
      if (getBasicType(shape) === "node") {
        nodeMoves.push({
          elementId: shape.id,
          toPosition: {
            x: bounds.x + Math.random() * (bounds.width - NODE_SIZE),
            y: bounds.y + Math.random() * (bounds.height - NODE_SIZE),
          },
        });
      }
    });
    await dispatcher.dispatch(MoveAction.create(nodeMoves, { animate: true }));
    focusGraph();
  };

  return (
    <div>
      <h1>Sprotty Circles Example</h1>
      <p>
        <button id="addNode" onClick={addNodeHandler}>
          Add node
        </button>
        <button id="scrambleAll" onClick={scrambleAllHandler}>
          Scramble all
        </button>
        <button id="scrambleSelection" onClick={scrambleSelectionHandler}>
          Scramble selection
        </button>
      </p>
      <div>
        <div id="sprotty" className="sprotty" />
      </div>
    </div>
  );
};

export default Sprotty;
