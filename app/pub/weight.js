var Qty = [Number, 'BW', null];
var Unit = ['POUNDS', 'KILOS'];

function validWeightQty(qty) {
	return isFinite(qty) || (qty.toLowerCase() === 'BW') || qty === null ? qty : false;
}

var Weight = {
	// Constants. TODO: use in config
	POUNDS: 'lb',
	KILOS: 'kg',

	create: function (qty, unit) {
		return {
			_qty: qty,
			_unit: unit,
			prototype: Weight.prototype
		};
	},

	qty: function (weight, value) {
		if (value)
			weight._qty = validWeightQty(value);
		else
			return weight.qty;
	},

	unit: function (weight, value) {
		if (value)
			weight._unit = value;
		else
			return weight._unit;
	}
};

// use wrapped methodify
Weight.prototype = {};

export default Weight;
