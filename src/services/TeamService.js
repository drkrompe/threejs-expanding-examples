class Team {
    constructor() {
        this.thingsArray = null;
        this._things = new Map()
        this._updateThingsArray();
    }

    add = (thing) => {
        this._things.set(thing, thing);
        this._updateThingsArray();
    }

    remove = (thing) => {
        if (this._things.delete(thing)) {
            this._updateThingsArray()
        }
    }

    things = () => {
        return this.thingsArray;
    }

    _updateThingsArray = () => {
        this.thingsArray = Array.from(this._things.values());
    }
}

class Teams {
    constructor(numberOfTeams = 2) {
        this.teams = [];
        for (let i = 0; i < numberOfTeams; i++) {
            this.teams.push(new Team())
        }
    }
}

const TeamService = new Teams();
export default TeamService;