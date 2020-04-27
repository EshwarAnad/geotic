import Component from '../Component';
import camelcase from 'camelcase';

export default class ComponentRegistry {
    #definitions = {};
    #ecs = null;

    constructor(ecs) {
        this.#ecs = ecs;
    }

    register(component) {
        this.#definitions[component.name] = component;
    }

    get(typeOrClassOrComponent) {
        const type = this._getType(typeOrClassOrComponent);

        if (!type) {
            console.warn(
                `Cannot get component definition for type or class ${typeOrClassOrComponent} since it is neither a Component class or type (string)`
            );
            return null;
        }

        return this.#definitions[type];
    }

    create(typeOrClass, properties = {}) {
        const definition = this.get(typeOrClass);

        if (definition) {
            return new definition(this.#ecs, properties);
        }

        console.warn(
            `Could not create component definition for ${typeOrClass} since it is not registered`
        );
    }

    _getType(typeOrClassOrComponent) {
        if (typeof typeOrClassOrComponent === 'string') {
            return camelcase(typeOrClassOrComponent, { pascalCase: true });
        }

        if (typeOrClassOrComponent instanceof Component) {
            return typeOrClassOrComponent.type;
        }

        if (typeOrClassOrComponent.prototype instanceof Component) {
            return typeOrClassOrComponent.name;
        }

        return null;
    }
}
