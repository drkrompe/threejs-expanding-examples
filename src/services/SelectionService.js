class SelectionServiceClass {
    constructor() {
        this.selected = [];
        this.onSelectedChangeFuncs = [];
    }

    addToSelected = (thing) => {
        if (this.selected.includes(thing)) {
            return;
        }
        this.selected.push(thing);
        this._updateSubscribers();
    }

    removeFromSelected = (thing) => {
        this.selected = this.selected.filter(select => select !== thing);
        this._updateSubscribers();
    }

    filterSelectedOn = (filterFunc) => {
        this.selected = this.selected.filter(select => filterFunc(select));
        this._updateSubscribers();
    }

    subscribeToSelected = (onSelectedChangeFunc) => {
        this.onSelectedChangeFuncs.push(onSelectedChangeFunc)
    }

    unsubscribeFromSelected = (onSelectedChangeFunc) => {
        this.onSelectedChangeFuncs = this.onSelectedChangeFuncs.filter(func => func !== onSelectedChangeFunc);
    }

    _updateSubscribers = () => {
        this.onSelectedChangeFuncs.forEach(func => {
            func(this.selected);
        });
    }
}

const SelectionService = new SelectionServiceClass();
export default SelectionService;