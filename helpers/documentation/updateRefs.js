const fs = require('fs');
const m2s = require('mongoose-to-swagger');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');

const mainConfig = JSON.parse(
    fs.readFileSync(__dirname + '/swagger/swagger.json', 'utf8')
);

const restaurants = JSON.parse(
    fs.readFileSync(__dirname + '/swagger/restaurants.json', 'utf8')
);

const users = JSON.parse(
    fs.readFileSync(__dirname + '/swagger/users.json', 'utf8')
);

mainConfig.paths = {
    ...mainConfig.paths,
    ...restaurants.paths,
    ...users.paths,
};

// Add the converted schema to components
mainConfig.components.schemas = {
    ...mainConfig.components.schemas,
    RestaurantSchema: m2s(Restaurant),
    UserSchema: m2s(User),
};

const updateRefs = (mainConfig, modelName, pathsToUpdate) => {
    pathsToUpdate.forEach((pathConfig) => {
        const [path, method, requestBodyContentType] = pathConfig;
        mainConfig.paths[path][method].requestBody.content[
            requestBodyContentType
            ].schema.$ref = `#/components/schemas/${modelName}`;
    });
};

module.exports = {updateRefs, mainConfig};
