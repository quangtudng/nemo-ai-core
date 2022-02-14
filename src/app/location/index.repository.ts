import { ProjectLogger } from "@core/utils/loggers/log-service";
import { EntityRepository, TreeRepository } from "typeorm";
import { Location } from "./index.entity";

@EntityRepository(Location)
export class LocationRepository extends TreeRepository<Location> {
  async findAllDescendants(location: Location): Promise<Location[]> {
    try {
      const fullTree = await this.findTrees();
      if (fullTree.length > 0) {
        // Only support for Vietnam location now
        const locationData = this.searchTreeByLocation(fullTree[0], location);
        return this._flattenTree(locationData, "children");
      }
      return [];
    } catch (exception) {
      ProjectLogger.exception(exception.stack);
      return [];
    }
  }

  async findNodeByName(name: string): Promise<Location> {
    // Always prioritize getting the city type over province
    let location = null;
    if (name) {
      location = await this.createQueryBuilder("location")
        .where("location.name like :name", {
          name: `%${name}%`,
        })
        .orderBy("location.type", "ASC")
        .getOne();
    }
    return location;
  }

  private searchTreeByLocation(
    location: Location,
    targetLocation: Location,
  ): Location {
    if (
      location.name === targetLocation.name &&
      location.type === targetLocation.type
    ) {
      return location;
    } else if (location.children != null) {
      let result = null;
      for (let i = 0; result == null && i < location.children.length; i++) {
        result = this.searchTreeByLocation(
          location.children[i],
          targetLocation,
        );
      }
      return result;
    }
    return null;
  }

  private _flattenTree(root: Location, key: string) {
    /**
     * Flatten a tree into a list
     */
    const flatten = [Object.assign({}, root)];
    delete flatten[0][key];

    if (root[key] && root[key].length > 0) {
      return flatten.concat(
        root[key]
          .map((child: Location) => this._flattenTree(child, key))
          .reduce((a: Location[], b: Location[]) => a.concat(b), []),
      );
    }

    return flatten;
  }
}
