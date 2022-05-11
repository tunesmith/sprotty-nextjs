import { Container, ContainerModule } from "inversify";
import "reflect-metadata";
import {
  CircularNode,
  configureModelElement,
  configureViewerOptions,
  ConsoleLogger,
  loadDefaultModules,
  LocalModelSource,
  LogLevel,
  PolylineEdgeView,
  SEdge,
  selectFeature,
  SGraph,
  SGraphView,
  TYPES,
} from "sprotty";
import { CircleNodeView } from "./views";

export default () => {
  const circlegraphModule = new ContainerModule(
    (bind, unbind, isBound, rebind) => {
      bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
      rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
      rebind(TYPES.LogLevel).toConstantValue(LogLevel.log);

      const context = { bind, unbind, isBound, rebind };
      configureModelElement(context, "graph", SGraph, SGraphView);
      configureModelElement(
        context,
        "node:circle",
        CircularNode,
        CircleNodeView
      );
      configureModelElement(context, "edge:straight", SEdge, PolylineEdgeView, {
        disable: [selectFeature],
      });
      configureViewerOptions(context, {
        needsClientLayout: false,
      });
    }
  );

  const container = new Container();
  loadDefaultModules(container);
  container.load(circlegraphModule);
  return container;
};
