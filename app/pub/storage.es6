// Use localStorage for now, switch to a library that uses IndexedDB later
// Default should be async calls with sync fallback if no callback provided

var
	toJson = JSON.parse,
	toStr = JSON.stringify;

class Storage {
	init(name='default') {
		this._name = name;
	}

	set(key, value, cb) {
		localStore.setItem(this._name + '_' + key, toStr(value));
	}

	get(key, defaultValue, cb) {
		var val = localStore.getItem(this._name + '_' + key);
		return val !== undefined ? toJson(val) : defaultValue;
	}
}
