import { EntityRepository, TreeRepository } from "typeorm";
import { Location } from "./index.entity";

@EntityRepository(Location)
export class LocationRepository extends TreeRepository<Location> {
  async findAllDescendants(location: Location): Promise<Location[]> {
    const fullTree = await this.findTrees();
    if (fullTree.length > 0) {
      // Only support for Vietnam location now
      const locationData = this.searchTree(fullTree[0], location.name);
      return this.flattenTree(locationData, "children");
    }
    return [];
  }
  private searchTree(location: Location, target: string): Location {
    if (location.name === target) {
      return location;
    } else if (location.children != null) {
      let result = null;
      for (let i = 0; result == null && i < location.children.length; i++) {
        result = this.searchTree(location.children[i], target);
      }
      return result;
    }
    return null;
  }
  private flattenTree(root, key) {
    const flatten = [Object.assign({}, root)];
    delete flatten[0][key];

    if (root[key] && root[key].length > 0) {
      return flatten.concat(
        root[key]
          .map((child) => this.flattenTree(child, key))
          .reduce((a, b) => a.concat(b), []),
      );
    }

    return flatten;
  }
}
