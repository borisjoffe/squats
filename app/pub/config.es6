var cfg = {
	unitOfWeight: {
		DEFAULT: 'lb',
		kilos: 'kg',
		pounds: 'lb'
	},
	kgPlates: [25, 20, 15, 10, 5, 2.5, 2, 1, 0.5],
	lbPlates: [45, 35, 25, 10, 5, 2.5],

	setsByRepsDelim: 'x',
	weightDelim: ':',
	commentStart: '('
};

// user settings
cfg.plates = cfg.lbPlates;

window.cfg = cfg;
export default cfg;
