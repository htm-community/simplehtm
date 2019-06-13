module.exports = {
  encoders: {
    ScalarEncoder: require('./src/encoders/scalar'),
    BoundedScalarEncoder: require('./src/encoders/boundedScalar'),
    CyclicEncoder: require('./src/encoders/cyclicScalar'),
    CategoryEncoder: require('./src/encoders/category'),
    WeekendEncoder: require('./src/encoders/weekend'),
    DayOfWeekCategoryEncoder: require('./src/encoders/dayOfWeekCategory'),
	},
	
	algorithms: {
		SpatialPooler: require('./src/algorithms/spatialPooler'),
	}
}
