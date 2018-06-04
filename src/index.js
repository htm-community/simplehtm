let scalars = require('./encoders/scalar')

// Packages up the entire thing in namespaces.
window.simplehtm = {

    encoders: {
        ScalarEncoder: scalars.ScalarEncoder,
        PeriodicScalarEncoder: scalars.PeriodicScalarEncoder,
        RelativeScalarEncoder: require('./encoders/relativeScalar'),
        RDSE: require('./encoders/rdse'),
    }

}
