//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		view = new WorkoutsView(data.workouts);

	$('#workouts-section').append(view.render());
});

/**
 * @param {String|HtmlNode} htmlNode - node or an id string
 * @param {React.Component} component
 * @param {JSON} [props=null]
 */
var render = _.curry(function (htmlNode, component, props) {
	if (!props) props = null
	log('rendering', component.name, 'to', htmlNode, 'with props:', props);
	if (typeof htmlNode === 'string')
		htmlNode = document.getElementById(htmlNode);
	React.render(React.createElement(component, props), htmlNode);
});

render('program-editor')(ProgramEditorView)(null);

var renderProgramSection = render('program-section')(ProgramGeneratorView);

renderProgramSection({
	program: programs.omcadv,
	user: user
});
