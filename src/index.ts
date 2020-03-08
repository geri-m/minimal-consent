import * as _ from 'lodash';

function component(name: string) {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component("Gerald"));