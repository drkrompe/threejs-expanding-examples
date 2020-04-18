class SelectionServiceClass {
    constructor() {
        this.selected = []
    }

    addToSelected = (thing) => {
        if (this.selected.includes(thing)) {
            return;
        }
        this.selected.push(thing);
    }

    removeFromSelected = (thing) => {
        this.selected = this.selected.filter(select => select !== thing);
    }

    filterSelectedOn = (filterFunc) => {
        this.selected = this.selected.filter(select => filterFunc(select));
    }
}

const SelectionService = new SelectionServiceClass();
export default SelectionService;