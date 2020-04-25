import TeamService from "../services/TeamService";
import DistanceHelper from "./DistanceHelper";

const findNearestOtherMatching = (faction, predicateFunc = (thing) => false) => {

    const matchingThings = TeamService.teams[faction].things().filter(thing => predicateFunc(thing));
    if (matchingThings.length === 0) {
        return;
    }

    const closestMatching = matchingThings
        .map(thing => {
            const distance = DistanceHelper.distanceBetweenDils(this.dilsprite, thing.dilsprite);
            return {
                distance,
                thing
            }
        })
        .reduce((prev, cur) => {
            if (prev.distance < cur.distance) {
                return prev;
            } else {
                return cur;
            }
        });

    return closestMatching.thing;
}

export default {
    findNearestOtherMatching
};