import { RenderingContext, ShapeView, SNode } from "sprotty";
import { VNode } from "snabbdom";
import { injectable } from "inversify";

@injectable()
export class CircleNodeView extends ShapeView {
  render(node: SNode, context: RenderingContext): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    const radius = this.getRadius(node);
    // @ts-ignore jsx can't understand svg somehow?
    return (
      <g>
        <circle
          class-sprotty-node={true}
          class-selected={node.selected}
          class-mouseover={node.hoverFeedback}
          r={radius}
          cx={radius}
          cy={radius}
        ></circle>
        <text x={radius} y={radius + 7} class-sprotty-text={true}>
          {node.id.substr(4)}
        </text>
      </g>
    );
  }

  protected getRadius(node: SNode): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 0;
  }
}
