class SelectionServiceClass {
    constructor() {
        this.selected = []
    }

    addToSelected = (thing) => {
        console.log("Add to selected", thing)
        if (this.selected.includes(thing)) {
            console.log("contains")
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