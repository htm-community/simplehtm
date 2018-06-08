// Packages up the entire thing in namespaces.
window.simplehtm = {

    encoders: {
        ScalarEncoder: require('./encoders/scalar'),
        CyclicEncoder: require('./encoders/cyclicScalar'),
        DayOfWeekCategoryEncoder: require('./encoders/dayOfWeekCategory'),
    }

}
